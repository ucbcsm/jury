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
