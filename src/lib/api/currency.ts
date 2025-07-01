import api from "@/lib/fetcher";
import { Currency } from "@/types";

export async function getCurrencies() {
  const res = await api.get(`/main_config/currency/`);
  return res.data as Currency[];
}

export async function createCurrency(params: Omit<Currency, "id">) {
  const res = await api.post(`/main_config/currency/`, {
    name: params.name,
    iso_code: params.iso_code,
    symbol: params.symbol,
    enabled: params.enabled || false,
  });
  return res.data;
}

export async function updateCurrency({
  id,
  params,
}: {
  id: number;
  params: Partial<Currency>;
}) {
  const res = await api.put(`/main_config/currency/${id}/`, {
    name: params?.name,
    iso_code: params?.iso_code,
    symbol: params?.symbol,
    enabled: params?.enabled,
  });
  return res.data;
}

export async function deleteCurrency(id: number) {
  const res = await api.delete(`/main_config/currency/${id}/`);
  return res.data;
}
