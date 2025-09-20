import { getYearById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useYid = () => {
  const [yid, setYidValue] = useState<number | undefined>();

  const setYid = (value: number) => {
    setYidValue(value);
    localStorage.setItem("yid", `${value}`);
  };

   const {
     data: year,
     isPending,
     isError,
     error
   } = useQuery({
     queryKey: ["year"],
     queryFn: ({ queryKey }) => getYearById(Number(yid)),
     enabled: !!yid,
   });
  

  const removeYid = () => {
    setYidValue(undefined);
    localStorage.removeItem("yid");
  };

  useEffect(() => {
    const storedYid = localStorage.getItem("yid");

    if (storedYid) {
      setYid(parseInt(storedYid));
    }
  }, []);

  return { yid, setYid, removeYid, year, isLoading: isPending, isError, error };
};
