import api from "@/lib/fetcher";
import { Year } from "@/types";
import dayjs from "dayjs";

export async function getYears() {
  const res = await api.get(`/main_config/academic-year/`);
  return res.data.results as Year[];
}

export async function getYearById(id: number) {
  const res = await api.get(`/main_config/academic-year/${id}`);
  return res.data as Year;
}

export async function createYear(params: Omit<Year, "id">) {
  const res = await api.post(`/main_config/academic-year/`, {
    name: params.name,
    start_date: dayjs(params.start_date).format("YYYY-MM-DD"),
    end_date: dayjs(params.end_date).format("YYYY-MM-DD"),
    status: params.status,
    university: null,
  });
  return res.data;
}

export async function updateYear({ id, params }: { id: number; params: Partial<Year> }) {
  const res = await api.put(`/main_config/academic-year/${id}/`, {
    name: params.name,
    start_date: dayjs(params.start_date).format("YYYY-MM-DD"),
    end_date: dayjs(params.end_date).format("YYYY-MM-DD"),
    status: params.status,
    university: null,
  });
  return res.data;
}

export async function deleteYear(id: number) {
  const res = await api.delete(`/main_config/academic-year/${id}/`);
  return res.data;
}

    
export function getYearStatusName(
  status: "pending" | "progress" | "finished" | "suspended" | string
) {
  switch (status) {
    case "pending":
      return "En attente";
      break;
    case "progress":
      return "En cours";
      break;
    case "finished":
      return "Terminé";
      break;
    case "suspended":
      return "Suspendu";
      break;
    default:
      return "Inconnu";
  }
}

export function getYearStatusColor(
  status: "pending" | "progress" | "finished" | "suspended" | string
) {
  switch (status) {
    case "pending":
      return "orange";

      break;
    case "progress":
      return "blue";

      break;
    case "finished":
      return "green";

      break;
    case "suspended":
      return "red";

      break;
    default:
      return "default";
  }
}


export function getYearsAsOptions(years?: Year[]) {
  return years?.map((year) => {
    return { value: year.id, label: year.name };
  });
}

export async function getYearDashboard(yearId: number) {
  const res = await api.get(
    `/apparitorat/apparitorat-dashboard/?academic_year__id=${yearId}`
  );
  return res.data as {
    year: Year;
    student_counter: number;
    male_count: number;
    female_count: number;
    actif_count: number;
    inactif_count: number;
    faculty_count: number;
    departement_count: number;
    class_room_count: number;
    pending_application_count: number;
  };
}

function dateDiffInDays(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  // Calcul de la différence en millisecondes
  const diffTime = end.getTime() - start.getTime()
  // Conversion en jours (arrondi vers le bas)
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

export function getYearProgressPercent(startDate: string, endDate: string): number {
 const today = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (today <= start) return 0
  if (today >= end) return 100

  const totalDays = dateDiffInDays(startDate, endDate)
  const daysPassed = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const percent = (daysPassed / totalDays) * 100
  return Math.round(percent) // Arrondi à l'entier le plus proche
}
