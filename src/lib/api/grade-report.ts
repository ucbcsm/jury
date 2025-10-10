import api from "../fetcher";

export async function getGradeReport(searchParams: {
  mode?: "PERIOD-GRADE" | "YEAR-GRADE";
  period_grade__id?: number;
  year_grade__id?: number;
}) {
  const { mode, period_grade__id, year_grade__id } = searchParams;
  const query = new URLSearchParams();
  if (mode !== undefined) {
    query.append("mode", mode.toString());
  }
  if (period_grade__id !== undefined) {
    query.append("period_grade__id", period_grade__id.toString());
  }
  if (year_grade__id !== undefined) {
    query.append("year_grade__id", year_grade__id.toString());
  }
  const res = await api.get(`/jury/grade-report/?${query.toString()}`);
  return res.data;
}
