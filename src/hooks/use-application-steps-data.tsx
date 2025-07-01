import {
  Step1ApplicationFormDataType,
  Step2ApplicationFormDataType,
  Step3ApplicationFormDataType,
  Step4ApplicationFormDataType,
  Step5ApplicationFormDataType,
  Step6ApplicationFormDataType,
  Step7ApplicationFormDataType,
  Step8ApplicationFormDataType,
  Step9ApplicationFormDataType,
} from "@/types";
import { decompressFromEncodedURIComponent } from "lz-string";
import { useEffect, useState } from "react";

export const useApplicationStepsData = () => {
  const [sdata, setSData] = useState<
    Step1ApplicationFormDataType &
      Step2ApplicationFormDataType &
      Step3ApplicationFormDataType &
      Step4ApplicationFormDataType &
      Step5ApplicationFormDataType &
      Step6ApplicationFormDataType &
      Step7ApplicationFormDataType &
      Step8ApplicationFormDataType &
      Step9ApplicationFormDataType
  >();

  const removeData = () => {
    localStorage.removeItem("d1");
    localStorage.removeItem("d2");
    localStorage.removeItem("d3");
    localStorage.removeItem("d4");
    localStorage.removeItem("d5");
    localStorage.removeItem("d6");
    localStorage.removeItem("d7");
    localStorage.removeItem("d8");
    localStorage.removeItem("d9");
  };

  useEffect(() => {
    const savedData1 = localStorage.getItem("d1");
    const savedData2 = localStorage.getItem("d2");
    const savedData3 = localStorage.getItem("d3");
    const savedData4 = localStorage.getItem("d4");
    const savedData5 = localStorage.getItem("d5");
    const savedData6 = localStorage.getItem("d6");
    const savedData7 = localStorage.getItem("d7");
    const savedData8 = localStorage.getItem("d8");
    const savedData9 = localStorage.getItem("d9");
    if (
      typeof savedData1 === "string" &&
      typeof savedData2 === "string" &&
      typeof savedData3 === "string" &&
      typeof savedData4 === "string" &&
      typeof savedData5 === "string" &&
      typeof savedData6 === "string" &&
      typeof savedData7 === "string" &&
      typeof savedData8 === "string" &&
      typeof savedData9 === "string"
    ) {
      const raw1 = decompressFromEncodedURIComponent(savedData1);
      const raw2 = decompressFromEncodedURIComponent(savedData2);
      const raw3 = decompressFromEncodedURIComponent(savedData3);
      const raw4 = decompressFromEncodedURIComponent(savedData4);
      const raw5 = decompressFromEncodedURIComponent(savedData5);
      const raw6 = decompressFromEncodedURIComponent(savedData6);
      const raw7 = decompressFromEncodedURIComponent(savedData7);
      const raw8 = decompressFromEncodedURIComponent(savedData8);
      const raw9 = decompressFromEncodedURIComponent(savedData9);

      const data1 = JSON.parse(raw1) as Step1ApplicationFormDataType;
      const data2 = JSON.parse(raw2) as Step2ApplicationFormDataType;
      const data3 = JSON.parse(raw3) as Step3ApplicationFormDataType;
      const data4 = JSON.parse(raw4) as Step4ApplicationFormDataType;
      const data5 = JSON.parse(raw5) as Step5ApplicationFormDataType;
      const data6 = JSON.parse(raw6) as Step6ApplicationFormDataType;
      const data7 = JSON.parse(raw7) as Step7ApplicationFormDataType;
      const data8 = JSON.parse(raw8) as Step8ApplicationFormDataType;
      const data9 = JSON.parse(raw9) as Step9ApplicationFormDataType;

      setSData({
        ...data1,
        ...data2,
        ...data3,
        ...data4,
        ...data5,
        ...data6,
        ...data7,
        ...data8,
        ...data9,
      });
    }
  }, []);

  return { data: sdata!, removeData };
};
