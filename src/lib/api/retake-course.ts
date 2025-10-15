import { RetakeCourse } from "@/types";
import api from "../fetcher";

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

export async function validateRetakeCourse(data: {
  userRetakeId: number; // ID des retake pour user
  userId: number;
  facultyId: number;
  departmentId: number;
  retake_CourseId_done_list: number[]; // IDs des cours à valider (available course)
}) {
  const res = await api.put(`/jury/retake-course/${data.userRetakeId}/`, {
    retake_CourseId_done_list: data.retake_CourseId_done_list,
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
  retake_CourseId_not_done_list: number[]; // IDs des cours à valider (available course)
}) {
  const res = await api.put(`/jury/retake-course/${data.userRetakeId}/`, {
    retake_CourseId_not_done_list: data.retake_CourseId_not_done_list,
    user: data.userId,
    faculty: data.facultyId,
    departement: data.departmentId,
  });
  return res.data;
}

export async function addRetakeReason(data: {
  userId: number;
  courseId: number;
  reason: "low_attendance" | "missing_course" | "failed_course";
}) {
  const res = await api.post(`/jury/retake-course/`, data);
  return res.data as RetakeCourse;
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
