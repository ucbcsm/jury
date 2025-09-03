import { Announcement } from "@/types";
import api from "../fetcher";

export async function getAnnoucements(searchParams: {
  yearId: number;
  facultyId: number;
  departmentId: number;
  classId: number;
}) {
  const { yearId, facultyId, departmentId, classId } = searchParams;

  const queryParams = new URLSearchParams();

  queryParams.append("academic_year__id", yearId.toString());
  queryParams.append("faculty__id", facultyId.toString());
  queryParams.append("departement__id", departmentId.toString());
  queryParams.append("class_year__id", classId.toString());

  const res = await api.get(`/jury/announcement?${queryParams.toString()}`);

  return res.data.results as Announcement[];
}

export async function getAnnoucement(id: number | string) {
  const res = await api.get(`/jury/announcement/${id}/`);
  return res.data as Announcement;
}

export async function deleteAnnoucement(id: number | string) {
  const res = await api.delete(`/jury/announcement/${id}/`);
  return res.data;
}

export async function createAnnoucement(data: {
  year_id: number;
  field_id: number;
  period_id: number;
  faculty_id: number;
  department_id: number;
  class_id: number;
  session: "main_session" | "retake_session";
  moment: "before_appeal" | "after_appeal";
  status: "locked" | "unlocked";
}) {
  const res = await api.post(`/jury/announcement/`, {
    academic_year: data.year_id,
    field: data.field_id,
    period_id: data.period_id,
    faculty_id: data.faculty_id,
    departement_id: data.department_id,
    class_year_id: data.class_id,
    session: data.session,
    moment: data.moment,
    status: data.status,
  });
  return res.data;
}
