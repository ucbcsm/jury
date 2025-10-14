import { RetakeCourse } from "@/types";
import api from "../fetcher";

export async function getRetakeCourses(queryParams?: {
  facultyId?: number;
  departmentId?: number;
  page?: number;
  pageSize?: number;
}) {
  const { facultyId, departmentId, page, pageSize } = queryParams || {};
  const query = new URLSearchParams();

  if (facultyId !== undefined) {
    query.append("faculty__id", facultyId.toString());
  }
  if (departmentId !== undefined) {
    query.append("departement__id", departmentId.toString());
  }
  if (page !== undefined) {
    query.append("page", page.toString());
  }
  if (pageSize !== undefined) {
    query.append("page_size", pageSize.toString());
  }

  const res = await api.get(`/jury/retake-course/?${query.toString()}`);
  return res.data as {
    count: number;
    next: number | null;
    previous: number | null;
    results: RetakeCourse[];
  };
}

export function getRetakeReasonText(
    reason: "low_attendance" | "missing_course" | "failed_course"
) {
    switch (reason) {
        case "failed_course":
            return "Échec au cours";
        case "low_attendance":
            return "Faible assiduité";
        case "missing_course":
            return "Cours manquant";
        default:
            return "Inconnue";
    }
}
