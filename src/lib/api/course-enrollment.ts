import { CourseEnrollment } from "@/types";
import api from "../fetcher";
import dayjs from "dayjs";

export async function getCourseEnrollments(courseId: number) {
  const res = await api.get(
    `/faculty/course-enrollment-from-faculty/?course__id=${courseId}`
  );
  return res.data as CourseEnrollment[];
}

export async function createCourseEnrollment(data: {
  payload: {
    student: number;
    courses: number[];
    status: "pending" | "validated" | "rejected";
  }[];
}) {
  const res = await api.post(`/faculty/course-enrollment-from-faculty/`, data);
  return res.data 
}

export async function updateSingleCourseEnrollment(data: {
  id: number;
  student_id: number;
  course_id: number;
  status: "pending" | "validated" | "rejected";
}) {
  const res = await api.put(
    `/faculty/course-enrollment-from-student/${data.id}/`,
    {
      pk: data.id,
      student: data.student_id,
      course: data.course_id,
      status: data.status,
      mode: "SINGLE-UPDATE",
    }
  );
  return res.data;
}

export async function updateCourseEnrollment(
  enrollmentId: number,
  data: Omit<CourseEnrollment, "id" | "course" | "student"> & {
    course_id: number;
    student_id: number;
  }
) {
  const res = await api.patch(
    `/faculty/course-enrollment-from-student/${enrollmentId}/`,
    {
      course: data.course_id,
      student: data.student_id,
      date: dayjs(data.date).format("YYYY-MM-DD"),
      status: data.status,
    }
  );
  return res.data as CourseEnrollment;
}

export async function deleteCourseEnrollment(enrollmentId: number) {
  const res = await api.delete(
    `/faculty/course-enrollment-from-student/${enrollmentId}/`
  );
  return res.data;
}

export const getCourseEnrollmentsByStatus = (
  enrollments?: CourseEnrollment[],
  status?: "pending" | "validated" | "rejected"
) => {
  return enrollments?.filter((enrollment) => enrollment.status === status);
};

export const getCourseEnrollmentsCountByStatus = (
  enrollments?: CourseEnrollment[],
  status?: "pending" | "validated" | "rejected"
) => {
  return getCourseEnrollmentsByStatus(enrollments, status)?.length || 0;
};
