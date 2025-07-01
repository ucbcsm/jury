import { HourTracking } from "@/types";
import api from "../fetcher";
import dayjs from "dayjs";

export async function getHoursTrackings(courseId: number) {
  const res = await api.get(
    `/faculty/course-hours-record/?course__id=${courseId}`
  );
  return res.data.results as HourTracking[];
}

export async function createHourTracking(
  data: Omit<HourTracking, "id" | "course"> & {
    course_id: number;
  }
) {
  const res = await api.post(`/faculty/course-hours-record/`, {
    course: data.course_id,
    date: dayjs(data.date).format("YYYY-MM-DD"),
    activity_type: data.activity_type,
    lesson: data.lesson,
    hours_completed: data.hours_completed,
    start_time: (data.start_time as any).format("HH:mm"),
    end_time: (data.end_time as any).format("HH:mm"),
    cp_validation: data.cp_validation,
    teacher_validation: data.teacher_validation,
  });
  return res.data as HourTracking;
}

export async function updateHourTracking({
  id,
  data,
}: {
  id: number;
  data: Omit<HourTracking, "id" | "course"> & {
    course_id: number;
  };
}) {
  const res = await api.put(`/faculty/course-hours-record/${id}/`, {
    course: data.course_id,
    date: dayjs(data.date).format("YYYY-MM-DD"),
    activity_type: data.activity_type,
    lesson: data.lesson,
    hours_completed: data.hours_completed,
    start_time: (data.start_time as any).format("HH:mm:ss"),
    end_time: (data.end_time as any).format("HH:mm:ss"),
    cp_validation: data.cp_validation,
    teacher_validation: data.teacher_validation,
  });
  return res.data as HourTracking;
}

export async function deleteHourTracking(id: number) {
  const res = await api.delete(`/faculty/course-hours-record/${id}/`);
  return res.data;
}


export function getHourTrackingActivityTypeName(
  activityType: "lecture" | "tutorial" | "practical" | "practical_tutorial"
): string {
  switch (activityType) {
    case "lecture":
      return "Cours magistral (CM)";
    case "tutorial":
      return "Travaux dirigés (TD)";
    case "practical":
      return "Travaux pratiques (TP)";
    case "practical_tutorial":
      return "Travaux pratiques et dirigés";
    default:
      return "Inconnu";
  }
}

export function getHourTrackingActivityTypeOptions() {
  return [
    { value: "lecture", label: "Cours magistral (CM)" },
    { value: "tutorial", label: "Travaux dirigés (TD)" },
    { value: "practical", label: "Travaux pratiques (TP)" },
    {
      value: "practical_tutorial",
      label: "Travaux pratiques et dirigés",
    },
  ];
}

export function getCumulativeHours(
  hoursTrackings?: HourTracking[]
): number {
  if (!Array.isArray(hoursTrackings) || hoursTrackings.length === 0) {
    return 0;
  }
  return hoursTrackings.reduce((total, tracking) => {
    // On s'assure que tracking.hours_completed est bien un nombre
    const value = Number(tracking.hours_completed);
    return total + (isNaN(value) ? 0 : value);
  }, 0);
}
