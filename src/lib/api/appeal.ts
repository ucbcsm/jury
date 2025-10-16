import { Appeal } from "@/types";
import api from "../fetcher"

export async function getAppeals(searchParams: {
  yearId: number | string;
  juryId: number | string;
  facultyId: number | string;
  departmentId?: number;
  classId?: number;
  status?: string;
}) {
  const {yearId, juryId, facultyId, departmentId, classId, status } = searchParams;

  const queryParams = new URLSearchParams();
  queryParams.append("academic_year__id", yearId.toString());
  queryParams.append("jury__id", juryId.toString());
  queryParams.append("faculty__id", facultyId.toString());

  if (status !== undefined) {
    queryParams.append("status", status.toString());
  }
  if (departmentId !== undefined) {
    queryParams.append("departement__id", departmentId.toString());
  }
  if (classId !== undefined) {
    queryParams.append("class_year__id", classId.toString());
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

export async function updateAppeal(id:number, data:Partial<Appeal>){ 
    const res = await api.put(`/jury/appeals/${id}/`, data);
    return res.data
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
      return "Traité";
    case "rejected":
      return "Rejeté";
    case "archived":
      return "Archivé";
    default:
      return status;
  }
}
