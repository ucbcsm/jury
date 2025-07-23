import { GradeClass, NewGradeClass } from "@/types";
import api from "../fetcher";

export async function createBulkGradeClasses(data: NewGradeClass[]) {
  const res = await api.post(`/jury/grades-class/`, data);
  return res.data;
}

export async function getGradeByTaughtCourse(
  id: number,
  session: "main_session" | "retake_session",
  moment: "before_appeal" | "after_appeal"
) {
  const res = await api.get(
    `/jury/grades-class?course__id=${id}&session=${session}&moment=${moment}`
  );
  return res.data.results as GradeClass[];
}


export async function multiUpdateGradeClasses(data: GradeClass[]) {
  const formatedData = data.map((item) => ({
    ...item,
    student: item.student.id,
    course: item.course.id,
    jury:item.jury.id
  }));
  const res = await api.post(`/jury/grades-class/multi-update/`, formatedData);
  return res.data;
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
