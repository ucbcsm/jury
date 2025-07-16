import { checkInstitutionExistence } from "@/lib/api";
import { LoginForm } from "./form";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/api/auth";
import { Suspense } from "react";
import { DataFetchErrorResult } from "@/components/errorResult";

export default async function Page() {
  const exists = await checkInstitutionExistence();
  const auth = await getServerSession();

  if (!exists) {
    <Suspense>
      <DataFetchErrorResult />
    </Suspense>;
  }

  if (auth?.user) {
    redirect("/jury");
  }

  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
