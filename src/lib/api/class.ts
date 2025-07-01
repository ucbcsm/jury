import api from "@/lib/fetcher";
import { Class } from "@/types";

export async function getClasses() {
  const res = await api.get(`/main_config/class-year/`);
  return res.data.results as Class[];
}

export async function createClass(
  params: Omit<Class, "id" | "cycle"> & { cycle_id: number }
) {
  const res = await api.post(`/main_config/class-year/`, {
    cycle: params.cycle_id,
    name: params.name,
    acronym: params.acronym,
    order_number: params.order_number,
    description: params.description,
  });
  return res.data;
}

export async function updateClass({
  id,
  params,
}: {
  id: number;
  params: Omit<Class, "id" | "cycle"> & { cycle_id: number };
}) {
  const res = await api.put(`/main_config/class-year/${id}/`, {
    cycle: params.cycle_id,
    name: params.name,
    acronym: params.acronym,
    order_number: params.order_number,
    description: params.description,
  });
  return res.data;
}

export async function deleteClass(id: number) {
  const res = await api.delete(`/main_config/class-year/${id}/`);
  return res.data;
}

export function getCurrentClassesAsOptions(classes?: Class[]) {
  return classes?.map((classe) => {
    return { value: classe.id, label: `${classe.acronym} (${classe.name})` };
  });
}
