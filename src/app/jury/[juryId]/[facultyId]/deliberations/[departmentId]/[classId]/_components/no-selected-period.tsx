"use client";

import { getCurrentPeriodsAsOptions } from "@/lib/api";
import { Period } from "@/types";
import { CalendarOutlined } from "@ant-design/icons";
import { Form, Result, Select, Skeleton } from "antd";
import { Options } from "nuqs";
import { FC } from "react";

type NoSelectedPeriodToviewProps = {
  periods?: Period[];
  period: string | null;
  setPeriod: (
    value: string | ((old: string | null) => string | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const NoSelectedPeriodToview: FC<NoSelectedPeriodToviewProps> = ({
  period,
  setPeriod,
  periods,
}) => {
  return (
    <div
      className="flex flex-col justify-center"
      style={{ height: `calc(100vh - 269px)` }}
    >
      <Result
        status="info"
        title="Aucune période sélectionnée"
        subTitle="Veuillez choisir une période (année, semestre ou session) pour accéder aux outils de délibération."
        icon={<CalendarOutlined style={{ color: "GrayText" }} />}
        extra={
          periods ? (
            <Select
              variant="filled"
              placeholder="Sélectionner une période"
              value={period}
              options={[
                ...(getCurrentPeriodsAsOptions(periods) || []),
                {
                  value: "year",
                  label: "Toute l'année",
                },
              ]}
              style={{ width: 180 }}
              onSelect={(value) => {
                setPeriod(value);
              }}
            />
          ) : (
            <Form>
              <Skeleton.Input active />
            </Form>
          )
        }
      />
    </div>
  );
};
