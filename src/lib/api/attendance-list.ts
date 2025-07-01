import { AttendanceList, AttendanceListItem, CourseEnrollment } from "@/types";
import api from "../fetcher";
import dayjs from "dayjs";

export async function getAttendancesListByCourse(courseId: number) {
  const res = await api.get(
    `/faculty/physical-attendance-check/?course__id=${courseId}`
  );
  return res.data.results as AttendanceList[];
}

export async function createAttendanceList(
  data: Omit<AttendanceList, "id" | "course" | "verified_by"> & {
    course_id: number;
    verified_by_user_id: number;
  }
) {
  const res = await api.post(`/faculty/physical-attendance-check/`, {
    course: data.course_id,
    date: dayjs(data.date).format("YYYY-MM-DD"),
    time: (data.time as any).format("HH:mm:ss"),
    verified_by: data.verified_by_user_id,
    student_attendance_status: data.student_attendance_status,
  });
  return res.data as AttendanceList;
}

export async function deleteAttendanceList(id: number) {
  const res = await api.delete(`/faculty/physical-attendance-check/${id}/`);
  return res.data;
}
export async function updateAttendanceList({
  id,
  data,
}: {
  id: number;
  data: Omit<AttendanceList, "id" | "course" | "verified_by"> & {
    course_id: number;
    verified_by_user_id: number;
  };
}) {
  const res = await api.put(`/faculty/physical-attendance-check/${id}/`, {
    course: data.course_id,
    date: dayjs(data.date).format("YYYY-MM-DD"),
    time: (data.time as any).format("HH:mm:ss"),
    verified_by: data.verified_by_user_id,
    student_attendance_status: data.student_attendance_status,
  });
  return res.data as AttendanceList;
}

export const getAttendancePresentCount = (
  items?: Omit<AttendanceListItem, "id" & { id?: number }>[]
) => {
  return items?.filter((item) => item.status === "present").length;
};
export const getAttendanceAbsentCount = (
  items?: Omit<AttendanceListItem, "id" & { id?: number }>[]
) => {
  return items?.filter((item) => item.status === "absent").length;
};
export const getAttendanceJustifiedCount = (
  items?: Omit<AttendanceListItem, "id" & { id?: number }>[]
) => {
  return items?.filter((item) => item.status === "justified").length;
};

export const getAttendancePresentPercentage = (
  items?: Omit<AttendanceListItem, "id" & { id?: number }>[]
) => {
  const presentCount = getAttendancePresentCount(items);
  const totalCount = items?.length || 0;
  return totalCount > 0 ? (presentCount! / totalCount) * 100 : 0;
};

export const getAttendanceAbsentPercentage = (
  items?: Omit<AttendanceListItem, "id" & { id?: number }>[]
) => {
  const absentCount = getAttendanceAbsentCount(items);
  const totalCount = items?.length || 0;
  return totalCount > 0 ? (absentCount! / totalCount) * 100 : 0;
};

export const getAttendanceJustifiedPercentage = (
  items?: Omit<AttendanceListItem, "id" & { id?: number }>[]
) => {
  const justifiedCount = getAttendanceJustifiedCount(items);
  const totalCount = items?.length || 0;
  return totalCount > 0 ? (justifiedCount! / totalCount) * 100 : 0;
};

export const getAttendanceItemsFromCourseEnrollments = (
  enrollments?: CourseEnrollment[]
): Omit<AttendanceListItem, "id" & { id?: number }>[] => {
  return (
    enrollments?.map((enrollment) => ({
      student: enrollment.student,
      status: "present",
      note: null,
    })) || []
  );
};
