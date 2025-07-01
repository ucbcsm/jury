import api from "@/lib/fetcher";
import { RequiredDocument } from "@/types";

export async function getRequiredDocuments() {
  const res = await api.get(`/apparitorat/required-document/?get_all=true`);
  return res.data as RequiredDocument[];
}

export async function getEnabledRequiredDocuments() {
  const res = await api.get(`/apparitorat/required-document/?enabled=true`);
  return res.data.results as RequiredDocument[];
}

export async function createRequiredDocument(
  params: Omit<RequiredDocument, "id">
) {
  const res = await api.post(`/apparitorat/required-document/`, {
    title: params.title,
    enabled: params.enabled || false,
    required: params.enabled || false,
  });
  return res.data;
}

export async function updateRequiredDocument({
  id,
  params,
}: {
  id: number;
  params: Omit<RequiredDocument, "id">;
}) {
  const res = await api.put(`/apparitorat/required-document/${id}/`, {
    title: params.title,
    enabled: params.enabled,
    required: params.required,
  });
  return res.data;
}

export async function deleteRequiredDocument(id: number) {
  const res = await api.delete(`/apparitorat/required-document/${id}/`);
  return res.data;
}
