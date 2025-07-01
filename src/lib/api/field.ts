import api from "@/lib/fetcher";
import { Field } from "@/types";

export async function getFields() {
  const res = await api.get(`/main_config/field/`);
  return res.data.results as Field[];
}

export async function createField(
  params: Omit<Field, "id" | "cycle"> & { cycle_id: number }
) {
  const res = await api.post(`/main_config/field/`, {
    cycle: params.cycle_id,
    name: params.name,
    acronym: params.acronym,
  });
  return res.data;
}

export async function updateField({
  id,
  params,
}: {
  id: number;
  params: Omit<Field, "id" | "cycle"> & { cycle_id: number };
}) {
  const res = await api.put(`/main_config/field/${id}/`, {
    cycle: params.cycle_id,
    name: params.name,
    acronym: params.acronym,
  });
  return res.data;
}

export async function deleteField(id: number) {
  const res = await api.delete(`/main_config/field/${id}/`);
  return res.data;
}

export function getCurrentFieldsAsOptions(fields?: Field[]) {
  return fields?.map((field) => {
    return { value: field.id, label: field.name };
  });
}
