"use client";

import { DocHeader } from "@/components/doc-header";
import {
  getDecisionText,
  getMomentText,
  getSessionText,
} from "@/lib/api";
import {
  Class,
  Department,
  YearResultPresentationItem,
  Year,
} from "@/types";
import { Card, Descriptions, Table, Tag } from "antd";
import React, { FC, RefObject } from "react";

type PrintableYearResultPresentationProps = {
  ref: RefObject<HTMLDivElement | null>;
  data?: YearResultPresentationItem[];
  forYearResult?: {
    year?: Year;
    department?: Department;
    classYear?: Class;
    session: "main_session" | "retake_session";
    moment: "before_appeal" | "after_appeal";
  };
};
export const PrintableYearResultPresentation: FC<PrintableYearResultPresentationProps> = ({
  ref,
  data,
  forYearResult,
}) => {
    const getPeriodHeader=()=>{
    if (data && data?.length > 0) {
      const sampleItem = data[0];
      return {
        period_0: sampleItem.period_0_acronym,
        period_1: sampleItem.period_1_acronym,
        period_2: sampleItem.period_2_acronym,
      };
    }
  }
  return (
    <div className="hidden">
      <div ref={ref} className=" ">
        <DocHeader />
        {forYearResult && (
          <Card style={{ marginBottom: 28 }}>
            <Descriptions
              title="Présentation des résultats annuels"
              column={2}
              bordered
              items={[
                {
                  key: "year",
                  label: "Année académique",
                  children: `${forYearResult?.year?.name || ""}`,
                },
                {
                  key: "faculty",
                  label: "Filière",
                  children: forYearResult.department?.faculty.name || "",
                },
                {
                  key: "department",
                  label: "Mention",
                  children: forYearResult?.department?.name || "",
                },
                {
                  key: "class",
                  label: "Promotion",
                  children: `${forYearResult.classYear?.acronym} (${forYearResult?.classYear?.name})`,
                },
                {
                  key: "session",
                  label: "Session",
                  children: getSessionText(forYearResult.session),
                },
                {
                  key: "moment",
                  label: "Moment",
                  children: getMomentText(forYearResult.moment),
                },
              ]}
            />
          </Card>
        )}

        <Table
                style={{
                  display: data && data?.length > 0 ? "block" : "none",
                }}
                rowKey={"id"}
                size="small"
                bordered
                dataSource={data || []}
                columns={[
                  {
                    key: "matricule",
                    title: "Matricule",
                    dataIndex: "matricule",
                    width: 80,
                    align: "right",
                  },
                  {
                    key: "gender",
                    title: "Genre",
                    dataIndex: "gender",
                    align: "center",
                    width: 60,
                  },
                  {
                    key: "full_name",
                    title: "Noms",
                    dataIndex: "name",
                    render: (_, record) =>
                      `${record.surname} ${record.last_name} ${record.first_name} `,
                  },
                  {
                    key: "credits",
                    title: "Crédits",
                    children: [
                      {
                        key: "period_0_total_credit",
                        title: getPeriodHeader()?.period_0 || "",
                        dataIndex: "period_0_total_credit",
                        width: 64,
                        hidden: getPeriodHeader()?.period_0 ? false : true,
                      },
                      {
                        key: "period_1_total_credit",
                        title: getPeriodHeader()?.period_1 || "",
                        dataIndex: "period_1_total_credit",
                        width: 64,
                        hidden: getPeriodHeader()?.period_1 ? false : true,
                      },
                      {
                        key: "period_2_total_credit",
                        title: getPeriodHeader()?.period_2 || "",
                        dataIndex: "period_2_total_credit",
                        width: 64,
                        hidden: getPeriodHeader()?.period_2 ? false : true,
                      },
                    ],
                  },
                  {
                    key: "expected_total_credit",
                    title: "Total crédits",
                    dataIndex: "expected_total_credit",
                  },
                  {
                    key: "validated_credits",
                    title: "Crédits validés",
                    children: [
                      {
                        key: "period_0_validated_credit_sum",
                        title: getPeriodHeader()?.period_0 || "",
                        dataIndex: "period_0_validated_credit_sum",
                        width: 64,
                        hidden: getPeriodHeader()?.period_0 ? false : true,
                      },
                      {
                        key: "period_1_validated_credit_sum",
                        title: getPeriodHeader()?.period_1 || "",
                        dataIndex: "period_1_validated_credit_sum",
                        width: 64,
                        hidden: getPeriodHeader()?.period_1 ? false : true,
                      },
                      {
                        key: "period_2_validated_credit_sum",
                        title: getPeriodHeader()?.period_2 || "",
                        dataIndex: "period_2_validated_credit_sum",
                        width: 64,
                        hidden: getPeriodHeader()?.period_2 ? false : true,
                      },
                    ],
                  },
                  {
                    key: "validated_credit_total",
                    title: "Total crédits validés",
                    dataIndex: "validated_credit_total",
                  },
                  {
                    key: "weighted_averages",
                    title: "Moyennes",
                    children: [
                      {
                        key: "period_0_weighted_average",
                        title: getPeriodHeader()?.period_0 || "",
                        dataIndex: "period_0_weighted_average",
                        width: 64,
                        hidden: getPeriodHeader()?.period_0 ? false : true,
                      },
                      {
                        key: "period_1_weighted_average",
                        title: getPeriodHeader()?.period_1 || "",
                        dataIndex: "period_1_weighted_average",
                        width: 64,
                        hidden: getPeriodHeader()?.period_1 ? false : true,
                      },
                      {
                        key: "period_2_weighted_average",
                        title: getPeriodHeader()?.period_2 || "",
                        dataIndex: "period_2_weighted_average",
                        width: 64,
                        hidden: getPeriodHeader()?.period_2 ? false : true,
                      },
                    ],
                  },
                  {
                    key: "weighted_average",
                    title: "Totale moyenne",
                    dataIndex: "weighted_average",
                    width: 80,
                    // align: "right",
                  },
                  {
                    key: "percentage",
                    title: "Pourcentage",
                    dataIndex: "percentage",
                    width: 100,
                  },
                  {
                    key: "grade",
                    title: "Note",
                    dataIndex: "grade",
                    width: 56,
                    align: "center",
                  },
                  {
                    key: "decision",
                    title: "Décision",
                    dataIndex: "decision",
                    width: 88,
                    align: "center",
                    render: (_, record) => (
                      <Tag
                        color={record.decision === "passed" ? "success" : "error"}
                        bordered={false}
                        style={{ marginRight: 0, width: "100%", textAlign: "center" }}
                      >
                        {getDecisionText(record.decision)}
                      </Tag>
                    ),
                  },
                ]}
                pagination={false}
              />
      </div>
    </div>
  );
};
