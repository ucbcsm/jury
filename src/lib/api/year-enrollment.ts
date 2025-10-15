import api from "@/lib/fetcher";
import { Enrollment } from "@/types";

// export async function getYearEnrollments(yearId: number) {
//   const res = await api.get(
//     `/apparitorat/year-enrollment/?academic_year__id=${yearId}`
//   );
//   return res.data.results as Enrollment[];
// }

export async function getYearEnrollments(searchParams: {
  yearId?: number;
  facultyId?: number;
  departmentId?: number;
  classId?: number;
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  const { yearId, facultyId, departmentId, classId, page, pageSize, search } =
    searchParams;
  const query = new URLSearchParams();
  if (yearId !== undefined) {
    query.append("academic_year__id", yearId.toString());
  }
  if(facultyId!==undefined) {
    query.append("faculty__id", facultyId.toString());
  }
  if(departmentId!==undefined) {
    query.append("departement__id", departmentId.toString());
  }
  if(classId!==undefined) {
    query.append("class_year__id", classId.toString());
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

  const res = await api.get(`/apparitorat/year-enrollment?${query.toString()}`);
  return res.data as {
    results: Enrollment[];
    count: number;
    next: string | null;
    previous: string | null;
  };
}

export async function getYearEnrollmentsByFacultyId(
  yearId: number,
  facultyId: number
) {
  const res = await api.get(
    `/apparitorat/year-enrollment/?academic_year__id=${yearId}&faculty__id=${facultyId}`
  );

  return res.data.results as Enrollment[];
}

export async function getAllYearEnrollmentsByFaculty(
  yearId: number,
  facultyId: number
) {
  const res = await api.get(
    `/apparitorat/year-enrollment/?academic_year__id=${yearId}&faculty__id=${facultyId}&get_all=true`
  );

  return res.data as Enrollment[];
}

export async function getYearEnrollmentsByDepatmentId(
  yearId: number,
  depatmentId: number
) {
  const res = await api.get(
    `/apparitorat/year-enrollment/?academic_year__id=${yearId}&departement__id=${depatmentId}`
  );
  return res.data.results as Enrollment[];
}

export async function getYearEnrollment(id: number) {
  const res = await api.get(`/apparitorat/year-enrollment/${id}`);
  return res.data as Enrollment;
}

export async function getStudentDashboard(
  yearId: number,
  yearEnrollmentId: number
) {
  const res = await api.get(
    `/student/student-dashboard/?academic_year__id=${yearId}&year_enrollment__id=${yearEnrollmentId}`
  );
  return res.data as {
    student_infos: Enrollment;
  };
}

export function getYearEnrollementsAsOptions(data?: Enrollment[]) {
  const options = data?.map((enrollment) => ({
    value: enrollment.id,
    label: `${enrollment.user.first_name} ${enrollment.user.last_name} ${enrollment.user.surname}`,
  }));

  return options
}
