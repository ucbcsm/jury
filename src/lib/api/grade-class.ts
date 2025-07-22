import { GradeClass, NewGradeClass } from "@/types";
import api from "../fetcher";

export async function createBulkGradeClasses(data: NewGradeClass[]) {
  const res = await api.post(`/jury/grades-class/`, data);
  return res.data;
}

export async function getGradeByTaughtCourse(id:number) {
    const res = await api.get(`/jury/grades-class?course__id=${id}`)
    return res.data.results as GradeClass[]
}


export function getGradeValidationColor(
  validation: "validated" | "no_validated"
): string {
  switch (validation) {
    case "validated":
      return "success";
    case "no_validated":
      return "error";
    default:
      return "default";
  }
}

export function getGradeValidationText(
  validation: "validated" | "no_validated"
): string {
  switch (validation) {
    case "validated":
      return "Validé";
    case "no_validated":
      return "Non validé";
    default:
      return "Inconnu";
  }
}