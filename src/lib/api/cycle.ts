import api from "@/lib/fetcher";
import { Cycle } from "@/types";

export async function getCycles() {
  const res = await api.get(`/main_config/cycle/`);
  return res.data.results as Cycle[];
}

export async function getCycleById(id: number) {
  const res = await api.get(`/main_config/cycle/${id}/`);
  return res.data;
}

/**
 * Creates a new cycle by sending a POST request to the API.
 *
 * @param params - An object containing the parameters for the cycle creation.
 * @returns A promise that resolves to the data returned by the API.
 *
 * The `params` object should include the following properties:
 * - `name` (string): The name of the cycle. This is a required field.
 * - `symbol` (string, optional): The symbol representing the cycle. Defaults to the first uppercase letter of the name if not provided.
 * - `planned_credits` (number, optional): The planned number of credits for the cycle. Defaults to `null` if not provided.
 * - `planned_years` (number, optional): The planned number of years for the cycle. Defaults to `null` if not provided.
 * - `planned_semester` (number, optional): The planned semester for the cycle. Defaults to `null` if not provided.
 * - `purpose` (string, optional): The purpose of the cycle. Defaults to `null` if not provided.
 *
 * @throws Will throw an error if the API request fails.
 */
export async function createCycle(params: Omit<Cycle, "id">) {
  const res = await api.post(`/main_config/cycle/`, {
    name: params.name,
    symbol: params.symbol || params.name.trim()[0].toUpperCase(),
    planned_credits: params.planned_credits || null,
    planned_years: params.planned_years || null,
    planned_semester: params.planned_semester || null,
    purpose: params.purpose || null,
    order_number: params.order_number
  });
  return res.data;
}

export async function updateCycle({ id, params }: { id: number; params: Partial<Cycle> }) {
  const res = await api.put(`/main_config/cycle/${id}/`, {
    ...params,
  });
  return res.data;
}

export async function deleteCycle(id: number) {
  const res = await api.delete(`/main_config/cycle/${id}/`);
  return res.data;
}


export function getCurrentCyclesAsOptions(cycles?: Cycle[]) {
  return cycles?.map((cycle) => {
    return { value: cycle.id, label: cycle.name };
  });
}