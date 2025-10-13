"use client";

import { DocHeader } from "@/components/doc-header";
import {
  getDecisionText,
  getMomentText,
  getSessionText,
} from "@/lib/api";
import {
  Announcement,
  Class,
  DeliberationMinutesData,
  Department,
  Jury,
  Year,
} from "@/types";
import { Card, Descriptions, Divider, Empty, Space, Table, Tag, Typography } from "antd";
import React, { FC, RefObject } from "react";

type PrintableDeliberationMinutesProps = {
  ref: RefObject<HTMLDivElement | null>;
  annoucement?: Announcement;
  data?: DeliberationMinutesData;
  forYearResult?: {
    year?: Year;
    department?: Department;
    classYear?: Class;
    session: "main_session" | "retake_session";
    moment: "before_appeal" | "after_appeal";
  };
  jury?: Jury;
};
export const PrintableDeliberationMinutes: FC<PrintableDeliberationMinutesProps> = ({
  ref,
  annoucement,
  data,
  forYearResult,
  jury,
}) => {
  return (
    <div className="hidden">
      <div ref={ref} className=" ">
        <DocHeader />
        {annoucement && (
          <Card style={{ marginBottom: 28 }}>
            <Descriptions
              title="Procès-verbal de délibération"
              size="small"
              bordered
              column={2}
              items={[
                {
                  key: "year",
                  label: "Année académique",
                  children: `${annoucement.academic_year.name}`,
                },
                {
                  key: "period",
                  label: "Période",
                  children: `${annoucement.period.acronym} (${annoucement.period.name})`,
                },
                {
                  key: "faculty",
                  label: "Filière",
                  children: annoucement?.faculty.name || "",
                },
                {
                  key: "department",
                  label: "Mention",
                  children: annoucement.departement?.name || "",
                },
                {
                  key: "class",
                  label: "Promotion",
                  children: `${annoucement.class_year?.acronym} (${annoucement.class_year.name})`,
                },

                {
                  key: "session",
                  label: "Session",
                  children: getSessionText(annoucement.session),
                },
                {
                  key: "moment",
                  label: "Moment",
                  children: getMomentText(annoucement.moment),
                },
              ]}
            />
          </Card>
        )}
        {forYearResult && (
                  <Card style={{ marginBottom: 28 }}>
                    <Descriptions
                      title="Procès-verbal de délibération annuel"
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
        <Divider />
        {data && (
          <div className=" max-w-3xl mx-auto">
            <Descriptions
              title="Statistiques générales"
              column={3}
              bordered
              size="small"
              items={[
                {
                  key: "total_class_announced",
                  label: "Ont participé aux épreuves",
                  children: data?.general_statistics.total_class_announced || 0,
                },
                {
                  key: "male_count",
                  label: data?.general_statistics.male_count || 0,
                  children: "Hommes",
                },
                {
                  key: "female_count",
                  label: data?.general_statistics.female_count || 0,
                  children: "Femmes",
                },
              ]}
            />

            <Descriptions
              style={{ marginTop: 16 }}
              column={1}
              bordered
              size="small"
              items={[
                {
                  key: "passed_count",
                  label: "Ont été admis",
                  children: data?.general_statistics.passed_count || 0,
                },
                {
                  key: "postponed_count",
                  label: "Ont été ajournés",
                  children: data?.general_statistics.postponed_count || 0,
                },
              ]}
            />

            {Object.keys(data?.body).map((key) => {
              const keyTyped = key as
                | keyof typeof data.body
                | keyof typeof data.grade_statistics;

              return (
                <Table
                  key={key}
                  title={() => (
                    <header className="flex justify-between">
                      <Space>
                        <Typography.Title level={5} style={{ marginBottom: 0 }}>
                          {data.body[keyTyped].title}
                        </Typography.Title>
                      </Space>
                      <Space>
                        <Typography.Title
                          type="secondary"
                          level={5}
                          style={{ marginBottom: 0 }}
                        >
                          {data.grade_statistics[keyTyped].count}
                        </Typography.Title>
                      </Space>
                    </header>
                  )}
                  dataSource={data.body[keyTyped].student_list}
                  bordered
                  size="small"
                  pagination={false}
                  style={{ marginTop: 28 }}
                  rowKey="id"
                  columns={[
                    {
                      key: "number",
                      render: (_, __, index) => index + 1,
                      width: 36,
                      align: "right",
                    },
                    {
                      key: "matricule",
                      dataIndex: "matricule",
                      title: "Matricule",
                      width: 80,
                    },
                    {
                      key: "gender",
                      dataIndex: "gender",
                      title: "Genre",
                      width: 60,
                      align: "center",
                    },
                    {
                      key: "names",
                      title: `Noms`,
                      render: (_, record) =>
                        `${record.surname} ${record.first_name} ${record.last_name}`,
                    },
                    {
                      key: "percentage",
                      dataIndex: "percentage",
                      title: "Pourcentage",
                      width: 100,
                    },
                    {
                      key: "grade",
                      dataIndex: "grade",
                      title: "Grade",
                      width: 60,
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
                          color={
                            record.decision === "passed" ? "success" : "error"
                          }
                          bordered={false}
                          style={{
                            marginRight: 0,
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          {getDecisionText(record.decision)}
                        </Tag>
                      ),
                    },
                  ]}
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={`Aucun étudiant`}
                      />
                    ),
                  }}
                />
              );
            })}

            <Descriptions
              title="Conclusion"
              style={{ marginTop: 28 }}
              column={1}
              bordered
              size="small"
              items={[
                {
                  key: "passed_count",
                  label: "Ainsi, ont été admis",
                  children: data?.general_statistics.passed_count || 0,
                },
                {
                  key: "postponed_count",
                  label: "Ont été ajournés",
                  children: data?.general_statistics.postponed_count || 0,
                },
              ]}
            />
            <Divider />
            <Typography.Title level={5} style={{ marginBottom: 16 }}>
              Membres du jury
            </Typography.Title>
            <Table
              dataSource={jury?.members}
              size="small"
              bordered
              columns={[
                {
                  key: "number",
                  render: (_, __, index) => index + 1,
                  width: 36,
                },
                {
                  key: "name",
                  title: "Noms",
                  render: (_, record) =>
                    `${record?.user.surname} ${record?.user?.first_name} ${record?.user?.last_name}`,
                },
              ]}
              pagination={false}
              rowKey="id"
            />
            <Descriptions
              title="Secrétaire du jury"
              column={2}
              bordered
              style={{ marginTop: 16 }}
              size="small"
              items={[
                {
                  key: "chairperson",
                  label: "Noms",
                  children: `${jury?.secretary.user.surname} ${jury?.secretary.user.first_name} ${jury?.secretary.user.last_name}`,
                },
                {
                  key: "signature",
                  label: "Signature",
                  children: "                             ",
                },
              ]}
            />
            <Descriptions
              title="Président du jury"
              style={{ marginTop: 16 }}
              column={2}
              bordered
              size="small"
              items={[
                {
                  key: "chairperson",
                  label: "Noms",
                  children: `${jury?.chairperson.user.surname} ${jury?.chairperson.user.first_name} ${jury?.chairperson.user.last_name}`,
                },
                {
                  key: "signature",
                  label: "Signature",
                  children: "                             ",
                },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
};
