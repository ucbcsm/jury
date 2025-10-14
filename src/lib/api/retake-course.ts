import { RetakeCourse } from "@/types";
import api from "../fetcher";

export async function getRetakeCourses(queryParams?: {
  facultyId?: number;
  departementId?: number;
  page?: number;
  page_size?: number;
}) {
  const { facultyId, departementId, page, page_size } = queryParams || {};
  const query = new URLSearchParams();

  if (facultyId !== undefined) {
    query.append("faculty__id", facultyId.toString());
  }
  if (departementId !== undefined) {
    query.append("departement__id", departementId.toString());
  }
  if (page !== undefined) {
    query.append("page", page.toString());
  }
  if (page_size !== undefined) {
    query.append("page_size", page_size.toString());
  }

  const res = await api.get(`/jury/retake-course/?${query.toString()}`);
  return res.data as {
    count: number;
    next: number | null;
    previous: number | null;
    results: RetakeCourse[];
  };
}
