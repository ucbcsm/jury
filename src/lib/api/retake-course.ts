import { RetakeCourse, RetakeCourseReason } from "@/types";
import api from "../fetcher";

export async function createStudentWithRetake(data: {
  userId: number;
  facultyId: number;
    departmentId: number;
    retakeCourseAndReason: (Omit<
        RetakeCourseReason,
        "id" | "available_course" | "academic_year" | "class_year"
      > & {
        id?: number;
        available_course: number;
        academic_year: number;
        class_year: number;
        })[];
}) {
  const res = await api.post(`/jury/retake-course/`, {
    user: data.userId,
    faculty: data.facultyId,
    departement: data.departmentId,
    retakeCourseAndReason: data.retakeCourseAndReason,
  });
  return res.data;
}

export async function getRetakeCourses(queryParams?: {
  facultyId?: number;
  departmentId?: number;
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  const { facultyId, departmentId, page, pageSize, search } = queryParams || {};
  const query = new URLSearchParams();

  if (facultyId !== undefined) {
    query.append("faculty__id", facultyId.toString());
  }
  if (departmentId !== undefined) {
    query.append("departement__id", departmentId.toString());
  }

  if (page !== undefined) {
    query.append("page", page.toString());
  }
  if (pageSize !== undefined) {
    query.append("page_size", pageSize.toString());
  }

  if (search !== undefined && search.trim() !== "") {
    query.append("search", search.trim());
  }

  const res = await api.get(`/jury/retake-course/?${query.toString()}`);
  return res.data as {
    count: number;
    next: number | null;
    previous: number | null;
    results: RetakeCourse[];
  };
}

export async function deleteStudentFromRetake(userRetakeId: number) {
    const res = await api.delete(`/jury/retake-course/${userRetakeId}/`)
    return res.data;
}

export async function validateRetakeCourse(data: {
  userRetakeId: number; // ID des retake pour user
  userId: number;
  facultyId: number;
  departmentId: number;
  retake_courseId_done_list: number[]; // IDs des cours à valider (available course)
}) {
  const res = await api.put(`/jury/retake-course/${data.userRetakeId}/`, {
    retake_courseId_done_list: data.retake_courseId_done_list,
    user: data.userId,
    faculty: data.facultyId,
    departement: data.departmentId,
  });
  return res.data;
}

export async function invalidateRetakeCourse(data: {
  userRetakeId: number; // ID des retake pour user
  userId: number;
  facultyId: number;
  departmentId: number;
  retake_courseId_not_done_list: number[]; // IDs des cours à valider (available course)
}) {
  const res = await api.put(`/jury/retake-course/${data.userRetakeId}/`, {
    retake_courseId_not_done_list: data.retake_courseId_not_done_list,
    user: data.userId,
    faculty: data.facultyId,
    departement: data.departmentId,
  });
  return res.data;
}

export async function addRetakeReason(data: {
  userRetakeId: number;
  userId: number;
  facultyId: number;
  departmentId: number;
  retakeCourseAndReason: (Omit<
    RetakeCourseReason,
    "id" | "available_course" | "academic_year" | "class_year"
  > & {
    id?: number;
    available_course: number;
    academic_year: number;
    class_year: number;
  })[];
}) {
  const res = await api.put(`/jury/retake-course/${data.userRetakeId}/`, {
    user: data.userId,
    retakeCourseAndReason: data.retakeCourseAndReason,
    faculty: data.facultyId,
    departement: data.departmentId,
  });
  return res.data;
}

export async function addDoneRetakeReason(data: {
  userRetakeId: number;
  userId: number;
  facultyId: number;
  departmentId: number;
  retakeCourseAndReasonDone: (Omit<
    RetakeCourseReason,
    "id" | "available_course" | "academic_year" | "class_year"
  > & {
    id?: number;
    available_course: number;
    academic_year: number;
    class_year: number;
  })[];
}) {
  const res = await api.put(`/jury/retake-course/${data.userRetakeId}/`, {
    user: data.userId,
    retakeCourseAndReasonDone: data.retakeCourseAndReasonDone,
    faculty: data.facultyId,
    departement: data.departmentId,
  });
  return res.data;
}

export async function updateRetakeReason(data: {
  id: number;
  reason: "low_attendance" | "missing_course" | "failed_course";
  courseId: number;
  yearId: number;
  classId: number;
}) {
  const res = await api.put(`/jury/retake-course-reason/${data.id}/`, {
    reason: data.reason,
    available_course: data.courseId,
    academic_year: data.yearId,
    class_year: data.classId,
  });
  return res.data;
}

export async function deleteRetakeReason(retakeReasonId: number) {
  const res = await api.delete(`/jury/retake-course-reason/${retakeReasonId}/`);
  return res.data;
}

export function fomartedRetakeCourseReason(data: RetakeCourseReason[]) {
  const formatedData = data.map((item) => ({
    id: item.id,
    reason: item.reason,
    available_course: item.available_course.id,
    academic_year: item.academic_year.id,
    class_year: item.class_year.id,
  }));

  return formatedData;
}

export function getRetakeReasonText(
  reason: "low_attendance" | "missing_course" | "failed_course"
) {
  switch (reason) {
    case "failed_course":
      return "Échec au cours";
    case "low_attendance":
      return "Faible assiduité";
    case "missing_course":
      return "Cours manquant";
    default:
      return "Inconnue";
  }
}
