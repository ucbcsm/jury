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
  return (
    <div className="hidden">
      <div ref={ref} className=" ">
        <DocHeader />
        {forYearResult && (
          <Card style={{ marginBottom: 28 }}>
            <Descriptions
              title="Présentation des résultats annuels"
              column={2}
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
              ellipsis:true
            },
            {
              key: "gender",
              title: "Genre",
              dataIndex: "gender",
              align: "center",
            },
            {
              key: "full_name",
              title: "Noms",
              dataIndex: "name",
              render: (_, record) =>
                `${record.surname} ${record.last_name} ${record.first_name} `,
            },
            {
              key: "weighted_average",
              title: "Moyenne",
              dataIndex: "weighted_average",
              ellipsis:true,
            //   width: 80,
              align: "right",
            },
            {
              key: "percentage",
              title: "Pourcentage",
              dataIndex: "percentage",
              ellipsis:true,
            //   width: 100,
            },
            {
              key: "grade",
              title: "Note",
              dataIndex: "grade",
            //   width: 56,
              align: "center",
            },
            {
              key: "validated_credit_sum",
              title: "Crédits validés",
              dataIndex: "validated_credit_sum",
              ellipsis:true,
            //   width: 120,
              align: "center",
            },
            {
              key: "unvalidated_credit_sum",
              title: "Crédits non validés",
              dataIndex: "unvalidated_credit_sum",
              ellipsis:true,
            //   width: 140,
              align: "center",
            },
            {
              key: "decision",
              title: "Décision",
              dataIndex: "decision",
            //   width: 88,
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
