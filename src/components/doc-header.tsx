"use client";

import { useInstitution } from "@/hooks/use-institution";
import { Image, Typography } from "antd";
// import Image from "next/image";
import { FC } from "react";

export const DocHeader: FC = () => {
  const {data} = useInstitution();
  return (
    <div className="flex gap-20 justify-between items-center pb-8 border-b-4 border-[#008367] mb-8 ">
      <div className="flex flex-1 gap-7 items-center">
        <Image
          src={data?.logo || "/ucbc-logo.png"}
          alt="logo"
          height={128}
          width="auto"
        />
        <div className="flex-1">
          <Typography.Title
            level={3}
            style={{ color: "#ED6851", textTransform: "uppercase", marginTop:0 }}
          >
            {data?.name || "Nom de l'institution"}
          </Typography.Title>
          <p className=" uppercase text-[#008367]">
            {data?.motto || ""}
          </p>
        </div>
      </div>
      <div className="flex flex-col border-l-4 border-[#008367] pl-6">
        <Typography.Text>{data?.phone_number_1 || "Téléphone"}</Typography.Text>
        <Typography.Text>{data?.email_address || "Email"}</Typography.Text>
        <Typography.Text>{data?.web_site || "Site web"}</Typography.Text>
        <Typography.Text>{data?.address || "Adresse"}</Typography.Text>
      </div>
    </div>
  );
};

{/* <div className="w-5 h-1 bg-[#008367]" />
      <div className="w-5 h-1 bg-[#ED6851]" />
      <div className="w-5 h-1 bg-[#FCB34C]" /> */}
