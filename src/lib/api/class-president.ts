import { ClassPresident } from "@/types";
import api from "../fetcher";

export async function getClassPresidents() {
  const res = await api.get(`/faculty/class-president/`);
  return res.data.results as ClassPresident[];
}

export async function getClassPresidentsByFaculty(id: number) {
  const res = await api.get(`/faculty/class-president/?faculty__id=${id}`);
  return res.data.results as ClassPresident[];
}

export async function getClassPresidentsByDepartment(id: number) {
  const res = await api.get(`/faculty/class-president/?departement__id=${id}`);
  return res.data.results as ClassPresident[];
}

export async function createClassPresident(
  data: Omit<
    ClassPresident,
    "id" | "departement" | "class_year" | "student"
  > & { department_id: number; class_year_id: number; student_id: number }
) {
  const res = await api.post(`/faculty/class-president/`, {
    departement: data.department_id,
    class_year: data.class_year_id,
    student: data.student_id,
  });

  return res.data;
}

export async function updateClassPresident({
  id,
  data,
}: {
  id: number;
  data: Omit<
    ClassPresident,
    "id" | "departement" | "class_year" | "student"
  > & { department_id: number; class_year_id: number; student_id: number };
}) {
  const res = await api.put(`/faculty/class-president/${id}`, {
    departement: data.department_id,
    class_year: data.class_year_id,
    student: data.student_id,
  });

  return res.data;
}


