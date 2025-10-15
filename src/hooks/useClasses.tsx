import { getClasses } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useClasses=()=>{
    return useQuery({
      queryKey: ["classes"],
      queryFn: getClasses,
    });
}