import { Role, RolesType } from "@/types";
import api from "../fetcher";

export async function getRoles() {
  const res = await api.get(`/account/roles/`);
  return res.data as Role[];
}

export function getRoleName(role: RolesType | string): string {
  switch (role) {
    case "is_apparitor":
      return "Appariteur";
    case "is_apparitorat_personal":
      return "Personnel de l'apparitorat";
    case "is_faculty_coordinator":
      return "Coordinateur de faculté";
    case "is_faculty_secretary":
      return "Secrétaire de faculté";
    case "is_faculty_personal":
      return "Personnel de faculté";
    case "is_finance_budget_administrator":
      return "Administrateur du budget";
    case "is_finance_accountant":
      return "Comptable financier";
    case "is_finance_personal":
      return "Personnel financier";
    case "is_jury_president":
      return "Président du jury";
    case "is_jury_secretary":
      return "Secrétaire du jury";
    case "is_jury_member":
      return "Membre du jury";
    case "is_jury_personal":
      return "Personnel du jury";
    case "is_rector":
      return "Recteur";
    case "is_rectorship_cabin_manager":
      return "Gestionnaire de cabine de la rectorat";
    case "is_rectorship_secretary":
      return "Secrétaire de la rectorat";
    case "is_rectorship_personal":
      return "Personnel de la rectorat";
    case "is_academic_general_secretary":
      return "Secrétaire général académique";
    case "is_sgad_cabin_manager":
      return "Gestionnaire de cabine SGAD";
    case "is_sgad_secretary":
      return "Secrétaire SGAD";
    case "is_sgad_personal":
      return "Personnel SGAD";
    case "is_administrative_secretary_general":
      return "Secrétaire général administratif";
    case "is_sga_personal_manager":
      return "Gestionnaire du personnel SGA";
    case "is_sga_secretary":
      return "Secrétaire SGA";
    case "is_sga_personal":
      return "Personnel SGA";
    case "is_reseach_general_secretary":
      return "Secrétaire général à la recherche";
    case "is_sgr_cabin_manager":
      return "Gestionnaire de cabine SGR";
    case "is_sgr_secretary":
      return "Secrétaire SGR";
    case "is_sgr_personal":
      return "Personnel SGR";
    default:
      return role;
  }
}

export function getRolesAsOptions(roles?: Role[]) {
  return roles?.map((r) => ({
    value: r.id,
    label: getRoleName(r.name),
  }));
}
