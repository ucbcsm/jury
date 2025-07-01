import { Course, CourseProgram, DepartmentProgram } from "@/types";
import api from "../fetcher";

export async function getDepartmentPrograms(departmentId: number) {
  const res = await api.get(
    `/faculty/departement-program/?departement__id=${departmentId}`
  );
  return res.data.results as DepartmentProgram[];
}

export async function createDepartmentProgram(
  data: Omit<DepartmentProgram, "id" | "departement"> & {
    department_id: number;
  }
) {
  const res = await api.post(`/faculty/departement-program/`, {
    departement: data.department_id,
    courses_of_program: data.courses_of_program,
    name: data.name,
    credit_count: data.credit_count || null,
    duration: data.duration || null,
    description: data.description || null,
  });

  return res.data;
}

export async function updateDepartmentProgram({
  id,
  data,
}: {
  id: number;
  data: Omit<DepartmentProgram, "id" | "departement"> & {
    department_id: number;
  };
}) {
  console.log("Check:", data.courses_of_program);
  const res = await api.put(`/faculty/departement-program/${id}/`, {
    departement: data.department_id,
    courses_of_program: data.courses_of_program,
    name: data.name,
    credit_count: data.credit_count || null,
    duration: data.duration || null,
    description: data.description || null,
  });

  return res.data;
}

export async function deleteDepartmentProgram(id: number) {
  const res = await api.delete(`/faculty/departement-program/${id}/`);
  return res.data;
}

export function getCoursesAsOptionsWithDisabled(
  courses?: Course[],
  coursesOfProgram?: Omit<CourseProgram, "id" & { id?: number }>[]
) {
  return courses?.map((course) => {
    const isDisabled = coursesOfProgram?.some(
      (cp) => cp.available_course?.id === course.id
    );
    return { value: course.id, label: course.name, disabled: isDisabled };
  });
}
