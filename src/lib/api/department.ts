import api from "@/lib/fetcher";
import { Department } from "@/types";

export async function getDepartments() {
  const res = await api.get(`/main_config/departement/`);
  return res.data.results as Department[];
}

export async function getDepartmentsByFacultyId(facultyId: number) {
  const res = await api.get(
    `/main_config/departement/?faculty__id=${facultyId}`
  );
  return res.data.results as Department[];
}

export async function getDepartment(id: number) {
  const res = await api.get(`/main_config/departement/${id}/`);
  return res.data as Department;
}

export async function createDepartment(
  params: Omit<Department, "id" | "faculty" | "director" | "other_members"> & {
    faculty_id: number;
    director_id?: number;
    other_members_ids?: number[];
  }
) {
  const res = await api.post(`/main_config/departement/`, {
    start_class_year: null,
    end_class_year: null, // To remove next time
    faculty: params.faculty_id,
    name: params?.name,
    acronym: params.acronym,
    director: params.director_id|| null,
    other_members: params.other_members_ids || [],
  });
  return res.data;
}

export async function updateDepartment({
  id,
  params,
}: {
  id: number;
  params: Omit<Department, "id" | "faculty" | "director" | "other_members"> & {
    faculty_id: number;
    director_id?: number;
    other_members_ids?: number[];
  };
}) {
  const res = await api.put(`/main_config/departement/${id}/`, {
    start_class_year: null,
    end_class_year: null, // To remove next time
    faculty: params.faculty_id,
    name: params.name,
    acronym: params.acronym,
    director: params.director_id|| null,
    other_members: params.other_members_ids || [],
  });
  return res.data;
}

export async function deleteDepartment(id: number) {
  const res = await api.delete(`/main_config/departement/${id}/`);
  return res.data;
}

export function getCurrentDepartmentsAsOptions(departments?: Department[]) {
  return departments?.map((department) => {
    return { value: department.id, label: department.name };
  });
}

export async function getDepartmentDashboard(
  yearId: number,
  departmentId: number
) {
  const res = await api.get(
    `/faculty/departement-dashboard/?academic_year__id=${yearId}&departement__id=${departmentId}`
  );
  return res.data as {
    student_counter: number;
    male_count: number;
    female_count: number;
    actif_count: number;
    inactif_count: number;
  };
}
