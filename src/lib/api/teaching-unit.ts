import { TeachingUnit } from "@/types";
import api from "../fetcher";
import { Coda } from "next/font/google";

export async function getTeachingUnits() {
  const res = await api.get(`/faculty/teaching-unit/`);
  return res.data.results as TeachingUnit[];
}

export async function getTeachingUnitsByfaculty(facultyId: number) {
  const res = await api.get(`/faculty/teaching-unit/?faculty__id=${facultyId}`);
  return res.data.results as TeachingUnit[];
}

export async function createTeachingUnit(
  data: Omit<TeachingUnit, "id" | "departement" | "cycle"> & {
    department_id: number;
    cycle_id: number;
  }
) {
  const res = await api.post(`/faculty/teaching-unit/`, {
    name: data.name,
    code: data.code,
    category: data.category,
    departement: data.department_id,
    cycle: data.cycle_id,
  });
  return res.data;
}

export async function updateTeachingUnit(
  id: number,
  data: Omit<TeachingUnit, "id" | "departement" | "cycle"> & {
    department_id: number;
    cycle_id: number;
  }
) {
  const res = await api.put(`/faculty/teaching-unit/${id}/`, {
    name: data.name,
    code: data.code,
    category: data.category,
    departement: data.department_id,
    cycle: data.cycle_id,
    credit_count: data.credit_count,
  });
  return res.data;
}

export async function deleteTeachingUnit(id: number) {
  const res = await api.delete(`/faculty/teaching-unit/${id}/`);
  return res.data;
}

export function getTeachingUnitCategoryName(
  category: "required" | "optional" | "free" | "transversal" | string
): string {
  switch (category) {
    case "required":
      return "Obligatoire";
    case "optional":
      return "Optionnelle";
    case "free":
      return "Libre";
    case "transversal":
      return "Transversale";
    default:
      return "Inconnu";
  }
}

export function getTeachingUnitsAsOptions(teaching_units?: TeachingUnit[]) {
  return teaching_units?.map((unit) => {
    return {
      value: unit.id,
      label: `${unit.name} (${unit.code})`,
    };
  });
}
