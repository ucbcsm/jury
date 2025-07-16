import { Jury } from "@/types";
import api from "../fetcher";

export async function getJurys(yearId: number) {
  const res = await api.get(`/jury/jury/?academic_year__id=${yearId}`);
  return res.data.results as Jury[];
}

export async function createJury(
  data: Omit<
    Jury,
    | "id"
    | "faculties"
    | "academic_year"
    | "chairperson"
    | "secretary"
    | "members"
  > & {
    academic_year_id: number;
    faculties_ids: number[];
    chairperson_id: number;
    secretary_id: number;
    members_ids: number[];
  }
) {
  const res = await api.post("/jury/jury/", {
    academic_year: data.academic_year_id,
    faculties: data.faculties_ids || [],
    chairperson: data.chairperson_id,
    secretary: data.secretary_id,
    members: data.members_ids || [],
    name: data.name,
  });
  return res.data;
}

export async function updateJury({
  id,
  data,
}: {
  id: number;
  data: Omit<
    Jury,
    | "id"
    | "faculties"
    | "academic_year"
    | "chairperson"
    | "secretary"
    | "members"
  > & {
    academic_year_id: number;
    faculties_ids: number[];
    chairperson_id: number;
    secretary_id: number;
    members_ids: number[];
  };
}) {
  const res = await api.put(`/jury/jury/${id}/`, {
    academic_year: data.academic_year_id,
    faculties: data.faculties_ids || [],
    chairperson: data.chairperson_id,
    secretary: data.secretary_id,
    members: data.members_ids || [],
    name: data.name,
  });
  return res.data;
}

export async function deleteJury(id: number) {
  const res = await api.delete(`/jury/jury/${id}/`);
  return res.data;
}

export async function getJury(juryId: number) {
  const res = await api.get(`/jury/jury/${juryId}/`);
  return res.data as Jury;
}

export async function getUserIsJury(yearId: number) {
  const res = await api.get(
    `/account/jury-from-user?academic_year__id=${yearId}`
  );
  return res.data as Jury;
}
