import api from "../fetcher";

export async function getDeliberationMinutes(id: number) {
    const query = new URLSearchParams();
    const res = await api.get(
      `/jury/deliberation-minutes/?${query.toString()}`
    );
    return res.data
}