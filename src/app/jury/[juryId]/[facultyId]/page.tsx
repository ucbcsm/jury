import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ juryId: string; facultyId: string }>;
}) {
  const { juryId, facultyId } = await params;
  redirect(`/jury/${juryId}/${facultyId}/grade-entry`);
}
