import { Announcement, Jury } from "@/types";
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
  jury_id: number;
  class_id: number;
  session: "main_session" | "retake_session";
  moment: "before_appeal" | "after_appeal";
  status: "locked" | "unlocked";
}) {
  const res = await api.post(`/jury/announcement/`, {
    academic_year: data.year_id,
    jury: data.jury_id,
    period: data.period_id,
    faculty: data.faculty_id,
    departement: data.department_id,
    class_year: data.class_id,
    session: data.session,
    moment: data.moment,
    status: data.status,
    mode: "ALL-STUDENTS",
  });
  return res.data;
}

export async function createAnnoucementWithSome(data: {
  jury: number;
  period: number;
  academic_year: number;
  faculty: number;
  departement: number;
  class_year: number;
  session: "main_session" | "retake_session";
  moment: "before_appeal" | "after_appeal";
  selectedPeriodEnrollmentIds: number[];
}) {
  const res = await api.post(`/jury/announcement/`, {
    mode: "SOME-STUDENTS",
    selectedPeriodEnrollmentIds: data.selectedPeriodEnrollmentIds,
    jury: data.jury,
    faculty: data.faculty,
    departement: data.departement,
    class_year: data.class_year,
    session: data.session,
    moment: data.moment,
    period: data.period,
    academic_year: data.academic_year,
  });
  return res.data;
}

export async function updateAnnouncement(
  data: Omit<
    Announcement,
    "academic_year" | "period" | "faculty" | "departement" | "class_year" | "date_updated" | "jury"
  > & {
    yearId: number;
    periodId: number;
    facultyId: number;
    departmentId: number;
    classId: number;
    juryId:number;
  }
) {
  const res = await api.put(`/jury/announcement/${data.id}/`, {
    academic_year: data.yearId,
    period: data.periodId,
    status: data.status,
    faculty: data.facultyId,
    departement: data.departmentId,
    class_year: data.classId,
    total_students: data.total_students,
    graduated_students: data.graduated_students,
    non_graduated_students: data.non_graduated_students,
    moment: data.moment,
    session: data.session,
    date_created: data.date_created,
    mode: "ALL-STUDENTS",
    jury:data.juryId
  });
  return res.data;
}

export async function switchAnnouncementStatus(data: {
  id: number;
  status: "locked" | "unlocked";
}) {
  const res = await api.post(`/jury/announcement/status-update/`, {
    announcement__id: data.id,
    status: data.status,
  });
  return res.data;
}
