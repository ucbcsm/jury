import { DeliberationMinutesData } from "@/types";
import api from "../fetcher";

export async function getDeliberationMinutes(searchParams: {
  yearId: number;
  facultyId: number;
  departmentId: number;
  classId: number;
  periodId?: number;
  moment: "before_appeal" | "after_appeal";
  session: "main_session" | "retake_session";
  mode: "PERIOD-GRADE" | "YEAR-GRADE";
}) {
  const {
    yearId,
    facultyId,
    departmentId,
    classId,
    periodId,
    moment,
    session,
    mode,
  } = searchParams;
  const query = new URLSearchParams();
   query.append("academic_year__id", yearId.toString());

  query.append("faculty__id", facultyId.toString());
  query.append("departement__id", departmentId.toString());
  query.append("class_year__id", classId.toString());
  if (periodId !== undefined) {
    query.append("period__id", periodId.toString());
  }
  query.append("session", session.toString());
  query.append("moment", moment.toString());
  query.append("mode", mode.toString());
  const res = await api.get(`/jury/deliberation-minutes/?${query.toString()}`);
  return res.data as DeliberationMinutesData;
}