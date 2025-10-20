"use client";

import { DocHeader } from "@/components/doc-header";
import { CourseEnrollment, TaughtCourse } from "@/types";
import { Card, Descriptions, Table, Typography, Watermark } from "antd";
import { FC, RefObject } from "react";

type EmptyListGradesToPrintProps = {
  courseEnrollments?: CourseEnrollment[];
  course?: TaughtCourse;
  ref: RefObject<HTMLDivElement | null>;
};
export const EmptyListGradesToPrint: FC<EmptyListGradesToPrintProps> = ({
  courseEnrollments,
  course,
  ref,
}) => {
  return (
    <div className="hidden">
      <div ref={ref}>
        {/* <Watermark content="UCBC"> */}
        <div>
          <DocHeader />
          <Typography.Title level={3} style={{}}>
            Fiche de notes
          </Typography.Title>
          {/* <Card> */}
          <Descriptions
            size="small"
            column={2}
            bordered
            items={[
              {
                key: "course_code",
                label: "Code du cours",
                children: course?.available_course.code || "",
              },
              {
                key: "course_title",
                label: "Intitulé du cours",
                children: course?.available_course.name || "",
              },
              {
                key: "teacher",
                label: "Enseignant",
                children: course?.teacher?.user
                  ? `${course.teacher.user.first_name} ${course.teacher.user.last_name} ${course.teacher.user.surname}`
                  : "",
              },
              {
                key: "semester",
                label: "Semestre",
                children: course?.period?.name || "",
              },
              {
                key: "year",
                label: "Année académique",
                children: course?.academic_year?.name || "",
              },
              {
                key: "departments",
                label: "Mention (s)",
                children: course?.departements.map((dep) => dep.name).join(","),
              },
            ]}
          />
          {/* </Card> */}
          <div className="pt-7">
            <Table
              dataSource={courseEnrollments || []}
              rowKey="id"
              size="small"
              bordered
              pagination={false}
              columns={[
                {
                  key: "matricule",
                  dataIndex: "matricule",
                  title: "Matricule",
                  render: (_, record) =>
                    `${record.student?.year_enrollment.user.matricule.padStart(
                      6,
                      "0"
                    )}`,
                  width: 96,
                  align: "center",
                },
                {
                  key: "class",
                  dataIndex: "class",
                  title: "Promotion",
                  render: (_, record) =>
                    `${record.student.year_enrollment.class_year.acronym} - ${record.student.year_enrollment.departement.acronym}`,
                  width: 84,
                },
                {
                  key: "student",
                  dataIndex: "student",
                  title: "Noms",
                  render: (_, record) =>
                    `${record.student?.year_enrollment.user.surname} ${record.student?.year_enrollment.user.last_name} ${record.student?.year_enrollment.user.first_name}`,
                },
                {
                  key: "continuous_assessment",
                  dataIndex: "continuous_assessment",
                  title: "CC (/10)",
                  render: () => "",
                  width: 120,
                  align: "center",
                },
                {
                  key: "exam",
                  dataIndex: "exam",
                  title: "Examen (/10)",
                  render: () => "",
                  width: 120,
                  align: "center",
                },
              ]}
            />
          </div>
        </div>
        {/* </Watermark> */}
      </div>
    </div>
  );
};
