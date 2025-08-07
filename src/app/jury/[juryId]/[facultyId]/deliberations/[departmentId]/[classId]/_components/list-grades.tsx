"use client";

import { getGradeByPeriod } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Layout, Table } from "antd";
import { useParams } from "next/navigation";
import { FC } from "react";
import { record } from "zod";

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
      getGradeByPeriod({
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
        <Table
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
                key:"period",
                dataIndex:"percentage",
                title:"Pourcentage",
                render:(_, record)=>record.percentage
            },
            {
                key:"letter",
                dataIndex:"percentage",
                title:"Grade",
                render:(_, record)=>record.grade_letter.grade_letter
            }
          ]}
        />
      </Layout.Content>
    </Layout>
  );
};
