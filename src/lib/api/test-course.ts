import api from "@/lib/fetcher";
import { TestCourse } from "@/types";

export async function getTestCourses() {
  const res = await api.get(`/apparitorat/admission-test-course/?get_all=true`);
  return res.data as TestCourse[];
}

export async function getEnabledTestCourses() {
   const res = await api.get(`/apparitorat/admission-test-course/?enabled=true`);
  return res.data.results as TestCourse[];
}

export async function createTestCourse(
  params: Omit<TestCourse, "id" | "faculty"> & { faculty_id: number }
) {
  const res = await api.post(`/apparitorat/admission-test-course/`, {
    faculty: params.faculty_id,
    name: params?.name,
    max_value: params.max_value,
    description: params.description || "",
    enabled: params.enabled||false,
  });
  return res.data;
}

export async function updateTestCourse({
  id,
  params,
}: {
  id: number;
  params: Omit<TestCourse, "id" | "faculty"> & { faculty_id: number };
}) {
  const res = await api.put(`/apparitorat/admission-test-course/${id}/`, {
    faculty: params.faculty_id,
    name: params?.name,
    max_value: params.max_value,
    description: params.description || "",
    enabled: params.enabled,
  });
  return res.data;
}

export async function deleteTestCourse(id: number) {
  const res = await api.delete(`/apparitorat/admission-test-course/${id}/`);
  return res.data;
}

export const getTestCoursesAsOptions = (coures?:TestCourse[]) => { 
return coures?.map((course) => {
    return { value: course.id, label: course.name };
  });
}

export const getTestCoursesByFacAsOptions = (faculty_id: number, courses?: TestCourse[]) => { 
  return courses
    ?.filter((course) => course.faculty.id === faculty_id)
    .map((course) => {
      return { value: course.id, label: course.name };
    });
}


