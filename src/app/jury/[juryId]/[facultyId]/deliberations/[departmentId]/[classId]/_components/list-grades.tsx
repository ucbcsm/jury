"use client";

import { getGradeByPeriod, getResultGrid } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Layout, Table } from "antd";
import { useParams } from "next/navigation";
import { FC } from "react";

type ListGradesProps = {
  moment: "before_appeal" | "after_appeal";
  session: "main_session" | "retake_session";
  period: string;
  yearId: number;
};

export const ListGrades: FC<ListGradesProps> = ({
  session,
  moment,
  period,
  yearId,
}) => {
  const { facultyId, departmentId, classId } = useParams();

  const { data, isPending, isError } = useQuery({
    queryKey: ["grades", facultyId, departmentId, classId, session, moment],
    queryFn: () =>
      getResultGrid({
        yearId: Number(yearId),
        facultyId: Number(facultyId),
        departmentId: Number(departmentId),
        classId: Number(classId),
        periodId: Number(period),
        session,
        moment,
      }),
    enabled: !!yearId && !!facultyId && !!departmentId && !!classId && !!period,
  });

  return (
    <Layout>
      <Layout.Content
        style={{ height: `calc(100vh - 213px)`, padding: 28, overflow: "auto" }}
      >
        {/* <Table
          loading={isPending}
          dataSource={data}
          columns={[
            {
              key: "matricule",
              dataIndex: "matricule",
              title: "Matricule",
              render: (_, record) =>
                record.student.year_enrollment.user.matricule,
            },
            {
              key: "names",
              dataIndex: "names",
              title: "Noms",
              render: (_, record) =>
                `${record.student?.year_enrollment.user.first_name} ${record.student?.year_enrollment.user.last_name} ${record.student?.year_enrollment.user.surname}`,
              ellipsis: true,
            },
            {
              key: "period",
              dataIndex: "percentage",
              title: "Pourcentage",
              render: (_, record) => record.percentage,
            },
            {
              key: "letter",
              dataIndex: "percentage",
              title: "Grade",
              render: (_, record) => record.grade_letter.grade_letter,
            },
            {
              key: "session",
              dataIndex: "session",
              title: "Session",
              render: (_, record) => record.session,
            },
            {
              key: "moment",
              dataIndex: "moment",
              title: "Moment",
              render: (_, record) => record.moment,
            },
            {
              key: "tec",
              title: "TEC",
              render: (_, record) =>
                record.teaching_unit_grades_list.map((t) => (
                  <Table
                    columns={[
                      {
                        key: "CC",
                        title: "CC",
                        render: (_, record) => record.continuous_assessment,
                      },
                    ]}
                    dataSource={t.course_grades_list}
                  />
                )),
            },
          ]}
        /> */}
      </Layout.Content>
    </Layout>
  );
};
