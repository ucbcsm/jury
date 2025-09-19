import { PeriodEnrollment } from "@/types";
import api from "../fetcher";

export async function getPeriodEnrollments(searchParams: {
  yearId: number;
  facultyId: number;
  periodId: number;
  departmentId?: number;
  classId?: number;
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "pending" | "validated" | "rejected";
  get_all?: boolean;
}) {
  const {
    yearId,
    facultyId,
    periodId,
    departmentId,
    classId,
    page,
    pageSize,
    search,
    status,
    get_all
  } = searchParams;
  const query = new URLSearchParams();
  query.append("academic_year__id", yearId.toString());
  query.append("faculty__id", facultyId.toString());
  query.append("period__id", periodId.toString());
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
  if (status !== undefined) {
    query.append("status", status);
  }
  const res = await api.get(
    `/apparitorat/period-enrollment?${query.toString()}`
  );
  if(get_all){
    return res.data as PeriodEnrollment[];
  }
  return res.data as {
    results: PeriodEnrollment[];
    count: number;
    next: string | null;
    previous: string | null;
  };
}

export async function getPeriodEnrollmentsWithAll(searchParams: {
  yearId: number;
  facultyId: number;
  periodId: number;
  departmentId?: number;
  classId?: number;
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "pending" | "validated" | "rejected";
}) {
  const {
    yearId,
    facultyId,
    periodId,
    departmentId,
    classId,
    page,
    pageSize,
    search,
    status,
  } = searchParams;
  const query = new URLSearchParams();
  query.append("academic_year__id", yearId.toString());
  query.append("faculty__id", facultyId.toString());
  query.append("period__id", periodId.toString());
  if (departmentId !== undefined) {
    query.append("departement__id", departmentId.toString());
  }
  if (classId !== undefined) {
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
  if (status !== undefined) {
    query.append("status", status);
  }
  query.append("get_all", "true");
  
  const res = await api.get(
    `/apparitorat/period-enrollment?${query.toString()}`
  );

  return res.data as PeriodEnrollment[];
}

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


