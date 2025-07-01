import { PeriodEnrollment } from "@/types";
import api from "../fetcher";

export async function getPeriodEnrollmentsbyFaculty(
  yearId: number,
  facultyId: number,
  periodId: number
) {
  const res = await api.get(
    `/apparitorat/period-enrollment/?academic_year__id=${yearId}&faculty__id=${facultyId}&period__id=${periodId}` //Original
  );
  return res.data.results as PeriodEnrollment[];
}

export async function createPeriodEnrollment(data: {
  year_enrollments_ids: number[];
  period_id: number;
  status: "pending" | "validated" | "rejected";
}) {
  const res = await api.post(`/apparitorat/period-enrollment/`, {
    year_enrollments: data.year_enrollments_ids,
    period: data.period_id,
    status: data.status,
  });
  return res.data;
}

export async function updateSinglePeriodEnrollment(data: {
  id: number;
  year_enrollment_id: number;
  period_id: number;
  status: "pending" | "validated" | "rejected";
}) {
  const res = await api.put(`/apparitorat/period-enrollment/${data.id}/`, {
    pk: data.id,
    year_enrollment: data.year_enrollment_id,
    period: data.period_id,
    status: data.status,
  });
  return res.data;
}


export const getPeriodEnrollmentsByStatus = (
  enrollments?: PeriodEnrollment[],
  status?: "pending" | "validated" | "rejected"
) => {
  return enrollments?.filter((enrollment) => enrollment.status === status);
};

export const getPeriodEnrollmentsCountByStatus = (
  enrollments?: PeriodEnrollment[],
  status?: "pending" | "validated" | "rejected"
) => {
  return getPeriodEnrollmentsByStatus(enrollments, status)?.length || 0;
};
