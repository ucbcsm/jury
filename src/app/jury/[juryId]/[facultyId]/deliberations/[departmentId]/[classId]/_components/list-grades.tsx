"use client";

import { getGradeByPeriod, getResultGrid } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Layout, Table } from "antd";
import { useParams } from "next/navigation";
import { title } from "node:process";
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
        <Table
          bordered
          size="small"
          loading={isPending}
          dataSource={data?.BodyDataList}
          columns={[
            ...(data?.HeaderData.no_retaken.period_list.map((period) => ({
              key: "period",
              dataIndex: "period",
              title: period.period.name,
              children: [
                ...(data?.HeaderData.no_retaken.teaching_unit_list
                  .slice(0, period.teaching_unit_counter)
                  .map((TU) => ({
                    key: TU.teaching_unit.id,
                    title: TU.teaching_unit.name,
                    children: [
                      ...data.HeaderData.no_retaken.course_list
                        .filter(
                          (course) =>
                            course.teaching_unit?.id === TU.teaching_unit.id
                        )
                        .map((course) => ({
                          key: course.id,
                          title: course.available_course.name,
                          onHeaderCell: () => ({
                            style: {
                              writingMode: "sideways-lr",
                              textOrientation: "mixed",
                            },
                          }),
                        })),
                    ],
                  })) || []),
              ],
            })) || []),
            // {
            //   key: "period",
            //   dataIndex: "period",
            //   title: `${}`,
            //   // width: 51,
            //   // align:"left",
            //   // render: (_, record) => 19.58,
            //   // onHeaderCell: () => ({
            //   //   style: { writingMode: "sideways-lr", textOrientation:"unset" },
            //   // }),
            // },
            {
              key: "names",
              dataIndex: "names",
              title: "Noms",
              render: (_, record) =>
                `${record.first_name} ${record.last_name} ${record.surname}`,
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
              render: (_, record) => record.grade_letter,
            },
          ]}
        />
      </Layout.Content>
    </Layout>
  );
};
