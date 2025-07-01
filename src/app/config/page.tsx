import { checkInstitutionExistence } from "@/lib/api";
import { ConfigForm } from "./form";
import { redirect } from "next/navigation";

export default async function Page() {
  const exists = await checkInstitutionExistence();
  if (exists) {
    redirect("/auth/login");
  }
  return <ConfigForm />;
}
