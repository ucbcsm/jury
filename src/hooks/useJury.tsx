import { getJury } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useJury = (juryId?: number | string | undefined) => {
  return useQuery({
    queryKey: ["jury", juryId],
    queryFn: ({ queryKey }) => getJury(Number(queryKey[1])),
    enabled: !!juryId,
  });
};