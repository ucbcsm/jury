import { getInstitution } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useInstitution = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["institution"],
    queryFn: getInstitution,
  });

  return { data, isLoading: isPending, isError, error };
};
