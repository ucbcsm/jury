import { useEffect, useState } from "react";

export const useYid = () => {
  const [yid, setYidValue] = useState<number | undefined>();

  const setYid = (value: number) => {
    setYidValue(value);
    localStorage.setItem("yid", `${value}`);
  };

  const removeYid = () => {
    setYidValue(undefined);
    localStorage.removeItem("yid");
  };

  useEffect(() => {
    const storedYid = localStorage.getItem("yid");

    if (storedYid) {setYid(parseInt(storedYid));}
  }, []);

  return { yid, setYid, removeYid };
};
