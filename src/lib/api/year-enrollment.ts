import api from "@/lib/fetcher";
import { Enrollment } from "@/types";

export async function getYearEnrollments(yearId: number) {
  const res = await api.get(
    `/apparitorat/year-enrollment/?academic_year__id=${yearId}`
  );
  return res.data.results as Enrollment[];
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
