import { LetterGrading } from "@/types";
import api from "../fetcher";

export async function getLetterGradings() {
  const res = await api.get(`/jury/letter-grading/`);
  return res.data.results as LetterGrading[];
}

export async function createLetterGrading(data: Omit<LetterGrading, "id">) {
  const res = await api.post(`/jury/letter-grading/`, {
    grade_letter: data.grade_letter,
    lower_bound: data.lower_bound,
    upper_bound: data.upper_bound,
    appreciation: data.appreciation,
    description: data.description,
  });
  return res.data;
}

export async function updateLetterGrading({
  id,
  data,
}: {
  id: number;
  data: Omit<LetterGrading, "id">;
}) {
  const res = await api.put(`/jury/letter-grading/${id}/`, {
    grade_letter: data.grade_letter,
    lower_bound: data.lower_bound,
    upper_bound: data.upper_bound,
    appreciation: data.appreciation,
    description: data.description,
  });
  return res.data;
}

export async function deleteLetterGrading(id: number) {
  const res = await api.delete(`/jury/letter-grading/${id}/`);
  return res.data;
}
