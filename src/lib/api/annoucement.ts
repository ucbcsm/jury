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

export async function createAnnoucementWithAll(data: {
  year_id: number;
  period_id: number;
  faculty_id: number;
  department_id: number;
  jury_id:number;
  class_id: number;
  session: "main_session" | "retake_session";
  moment: "before_appeal" | "after_appeal";
  status: "locked" | "unlocked";
  mode: "ALL-STUDENTS" | "SOME-STUDENTS";
}) {
  const res = await api.post(`/jury/announcement/`, {
    academic_year: data.year_id,
    jury:data.jury_id,
    period: data.period_id,
    faculty: data.faculty_id,
    departement: data.department_id,
    class_year: data.class_id,
    session: data.session,
    moment: data.moment,
    status: data.status,
    mode: data.mode,
  });
  return res.data;
}



export async function createAnnoucementWithSome(data: {
  mode: "ALL-STUDENTS" | "SOME-STUDENTS";
  selectedRegisteredStudentsList?: number[];
}) {
  const res = await api.post(`/jury/announcement/`, {
    mode: data.mode,
    selectedRegisteredStudentsList: data.selectedRegisteredStudentsList,
  });
  return res.data;
}

