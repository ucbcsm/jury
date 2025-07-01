import { Permission } from "@/types";
import api from "../fetcher";

export async function getPermissions() {
  const res = await api.get(`/account/permission/`);
  return res.data as Permission[];
}

export function getPermissionsAsOptions(permissions?: Permission[]) {
  return permissions?.map((p) => ({ value: p.id, label: p.name }));
}
