"use client";

import { getJury } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function Page() {
  const { juryId } = useParams();

  const {
    data: jury,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["jury", juryId],
    queryFn: ({ queryKey }) => getJury(Number(queryKey[1])),
    enabled: !!juryId,
  });
  
  return <div>Jury home</div>;
}
