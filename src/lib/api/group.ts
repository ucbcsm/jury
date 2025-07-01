import { Group } from "@/types";
import api from "../fetcher";

export async function getGroups() {
  const res = await api.get(`/account/group/`);
  return res.data as Group[];
}

export async function createGroup(data: {
  name: string;
  permissions: number[];
}) {
  const res = await api.post("/account/group/", {
    name: data.name,
    permissions: data.permissions,
  });
  return res.data;
}

export async function updateGroup({
  id,
  data,
}: {
  id: number;
  data: { name: string; permissions: number[] };
}) {
  const res = await api.put(`/account/group/${id}/`, {
    name: data.name,
    permissions: data.permissions,
  });
  return res.data;
}

export async function deleteGroup(id: number) {
  const res = await api.delete(`/account/group/${id}/`);
  return res.data;
}

export function getGroupsAsOptions(groups?: Group[]) {
  return groups?.map((g) => ({ value: g.id, label: g.name }));
}
