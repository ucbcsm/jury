import { Step1TeacherFormDataType, Step2TeacherFormDataType } from "@/types";
import { decompressFromEncodedURIComponent } from "lz-string";
import { useEffect, useState } from "react";

export const useTeacherStepsData = () => {
  const [sdata, setSData] = useState<
    Step1TeacherFormDataType & Step2TeacherFormDataType
  >();

  const removeData = () => {
    localStorage.removeItem("dt1");
    localStorage.removeItem("dt2");
  };

  useEffect(() => {
    const savedData1 = localStorage.getItem("dt1");
    const savedData2 = localStorage.getItem("dt2");

    if (typeof savedData1 === "string" && typeof savedData2 === "string") {
      const raw1 = decompressFromEncodedURIComponent(savedData1);
      const raw2 = decompressFromEncodedURIComponent(savedData2);

      const data1 = JSON.parse(raw1) as Step1TeacherFormDataType;
      const data2 = JSON.parse(raw2) as Step2TeacherFormDataType;

      setSData({
        ...data1,
        ...data2,
      });
    }
  }, []);

  return { data: sdata!, removeData };
};
