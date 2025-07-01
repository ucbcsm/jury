import api from "@/lib/fetcher";
import { Period } from "@/types";
import dayjs from "dayjs";

export async function getPeriods() {
  const res = await api.get(`/main_config/period/`);
  return res.data.results as Period[];
}

export async function getPeriodsByYear(yeardId:number) {
  const res= await api.get(`/main_config/period/?academic_year__id=${yeardId}`)
  return res.data.results as Period[]
}

export async function createPeriod(
  params: Omit<Period, "id" | "academic_year" | "cycle"> & { year_id: number, cycle_id:number }
) {
  const res = await api.post(`/main_config/period/`, {
    cycle: params.cycle_id,
    academic_year: params.year_id,
    name: params.name,
    acronym: params.acronym,
    type_of_period: params.type_of_period,
    order_number: params.order_number,
    start_date: dayjs(params.start_date).format("YYYY-MM-DD"),
    end_date: dayjs(params.end_date).format("YYYY-MM-DD"),
    max_value: null, //not important
    status: params.status,
  });
  return res.data;
}

export async function updatePeriod({
  id,
  params,
}: {
  id: number;
  params: Omit<Period, "id" | "academic_year" | "cycle"> & {
    year_id: number;
    cycle_id: number;
  };
}) {
  const res = await api.put(`/main_config/period/${id}/`, {
    cycle: params.cycle_id,
    academic_year: params.year_id,
    name: params.name,
    acronym: params.acronym,
    type_of_period: params.type_of_period,
    order_number: params.order_number,
    start_date: dayjs(params.start_date).format("YYYY-MM-DD"),
    end_date: dayjs(params.end_date).format("YYYY-MM-DD"),
    // max_value: null, //not important
    status: params.status,
  });
  return res.data;
}

export async function deletePeriod(id: number) {
  const res = await api.delete(`/main_config/period/${id}/`);
  return res.data;
}

export const getPeriodTypesAsOptions = [
  {
    value: "semester",
    label: "Semestre",
  },
  {
    value: "block_semester",
    label: "Bloc de semestre",
  },
  {
    value: "quarter",
    label: "Trimestre",
  },
  {
    value: "term",
    label: "Période",
  },
];

export function getPeriodTypeName(
  type: "semester" | "block_semester" | "quarter" | "term" | string
) {
  switch (type) {
    case "semester":
      return "Semestre";
    case "block_semester":
      return "Bloc de semestre";
    case "quarter":
      return "Trimestre";
    case "term":
      return "Période";
    default:
      return "Inconnu";
  }
}

export function getCurrentPeriodsAsOptions(periods?: Period[]) {
  return periods?.map((period) => {
    return { value: period.id, label: `${period.acronym} (${period.name})` };
  });
}


