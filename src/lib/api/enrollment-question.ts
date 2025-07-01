import api from "@/lib/fetcher";
import { EnrollmentQuestion } from "@/types";

export async function getEnrollmentQuestions() {
  const res = await api.get(`/apparitorat/registered-enrollment-question/?get_all=true`);
  return res.data as EnrollmentQuestion[];
}

export async function createEnrollmentQuestion(
  params: Omit<EnrollmentQuestion, "id">
) {
  const res = await api.post(`/apparitorat/registered-enrollment-question/`, {
    question: params.question,
    enabled: params.enabled || false,
  });
  return res.data;
}

export async function updateEnrollmentQuestion({
  id,
  params,
}: {
  id: number;
  params: Omit<EnrollmentQuestion, "id">;
}) {
  const res = await api.put(
    `/apparitorat/registered-enrollment-question/${id}/`,
    {
      question: params.question,
      enabled: params.enabled,
    }
  );
  return res.data;
}

export async function deleteEnrollmentQuestion(id: number) {
  const res = await api.delete(
    `/apparitorat/registered-enrollment-question/${id}/`
  );
  return res.data;
}
