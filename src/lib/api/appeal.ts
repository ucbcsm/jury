import { Appeal } from "@/types";
import api from "../fetcher"

export async function getAppeals(searchParams: {
  yearId: number | string;
  juryId: number | string;
  facultyId: number | string;
  departmentId?: number;
  classId?: number;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const { yearId, juryId, facultyId, departmentId, classId, status, search, page, pageSize } =
    searchParams;

  const queryParams = new URLSearchParams();
  queryParams.append("academic_year__id", yearId.toString());
  queryParams.append("jury__id", juryId.toString());
  queryParams.append("faculty__id", facultyId.toString());

  if (departmentId !== undefined) {
    queryParams.append("departement__id", departmentId.toString());
  }
  if (classId !== undefined) {
    queryParams.append("class_year__id", classId.toString());
  }
  if (status !== undefined) {
    queryParams.append("status", status.toString());
  }
  if (search !== undefined) {
    queryParams.append("search", search);
  }
  if (page !== undefined) {
    queryParams.append("page", page.toString());
  }
  if (pageSize !== undefined) {
    queryParams.append("page_size", pageSize.toString());
  }


  const res = await api.get(`/jury/appeals?${queryParams.toString()}`);
  return res.data as {
    results: Appeal[];
    count: number;
    next: string | null;
    previous: string | null;
  };
}

export async function getAppeal(id: number | string) {
  const res = await api.get(`/jury/appeals/${id}/`);
  return res.data as Appeal;
}

export async function updateAppeal(
  data: Omit<Appeal, "student" | "jury"|"courses"> & { studentId: number; juryId: number, coursesIds: number[] }
) {
  const res = await api.put(`/jury/appeals/${data.id}/`, {
    student: data.studentId,
    jury: data.juryId,
    subject: data.subject,
    description: data.description,
    submission_date: data.submission_date,
    courses: data.coursesIds,
    status: data.status,
    response: data.response,
    file: data.file,
    session: data.session,
  });
  return res.data;
}

export function getAppealStatusText(
  status: "submitted" | "in_progress" | "processed" | "rejected" | "archived"
) {
  switch (status) {
    case "submitted":
      return "Soumis";
    case "in_progress":
      return "En cours de traitement";
    case "processed":
      return "Fondé";
    case "rejected":
      return "Non fondé";
    case "archived":
      return "Archivé";
    default:
      return status;
  }
}

export function getAppealStatusColor(
  status: "submitted" | "in_progress" | "processed" | "rejected" | "archived"
) {
  switch (status) {
    case "submitted":
      return "warning";
    case "in_progress":
      return "processing";
    case "processed":
      return "success";
    case "rejected":
      return "error";
    case "archived":
      return "default";
    default:
      return undefined;
  }
}

