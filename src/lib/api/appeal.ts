import { Appeal } from "@/types";
import api from "../fetcher"

export async function getAppeals(searchParams: {
  juryId: number | string;
  facultyId: number | string;
  status?: string;
}) {
  const { juryId, facultyId, status } = searchParams;

  const queryParams = new URLSearchParams();
  queryParams.append("jury__id", juryId.toString());
  queryParams.append("faculty__id", facultyId.toString());

  if (status !== undefined) {
    queryParams.append("status", status.toString());
  }

  const res = await api.get(`/jury/appeals?${queryParams.toString()}`);
  return res.data as Appeal[];
}

export async function getAppeal(id: number | string) {
  const res = await api.get(`/jury/appeals/${id}/`);
  return res.data as Appeal;
}

export async function updateAppeal(id:number) {
    const res = await api.put(`/jury/appeals/${id}/`)
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
