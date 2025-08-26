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

  // console.log(data?.HeaderData?.no_retaken?.period_list);
  if (!data?.HeaderData?.no_retaken?.period_list) {
    return "No to view";
  }

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
            ...(data?.HeaderData?.no_retaken?.period_list?.map((period,indexPeriod) => ({
              key: "period",
              dataIndex: "period",
              title: period.period.name,

              children: [
                {
                  key: "t-u",
                  title: "Unites d'Enseignement",
                  children: [
                    {
                      key: "el-m",
                      title: "Elements Constitutifs",
                      children: [
                        {
                          key: "number",
                          children: [
                            {
                              key: "credit",
                              title: "Crédits",
                              children: [
                                {
                                  key: "maxCC",
                                  title: "CC",
                                  children: [
                                    {
                                      key: "maxExam",
                                      title: "Examen",
                                      children: [
                                        {
                                          key: "maxTotal",
                                          title: "TOTAL",
                                          children: [
                                            {
                                              key: "names",
                                              // dataIndex: "names",
                                              // title: "Noms",
                                              render: (_: any, record: any) =>
                                                `${record.first_name} ${record.last_name} ${record.surname}`,
                                            },
                                            {
                                              key: "matricule",
                                              // dataIndex: "names",
                                              // title: "Noms",
                                              render: (_: any, record: any) =>
                                                `${record.matricule}`,
                                            },
                                            {
                                              key: "matricule",
                                              // dataIndex: "names",
                                              // title: "Noms",
                                              render: (_: any, record: any) =>
                                                `${record.gender}`,
                                              width: 32,
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                ...(data?.HeaderData?.no_retaken?.teaching_unit_list
                  .slice(0, period.teaching_unit_counter)
                  .map((TU,indexTU) => ({
                    key: TU.teaching_unit.id,
                    title: TU.teaching_unit.code,
                    onHeaderCell: () => ({
                      style: { textAlign: "left", textTransform: "uppercase" },
                    }),
                    children: [
                      ...data.HeaderData.no_retaken.course_list
                        .filter(
                          (course) =>
                            course.teaching_unit?.id === TU.teaching_unit.id
                        )
                        .map((course, indexCourse) => ({
                          key: course.id,
                          title: course.available_course.name,
                          ellipsis: true,
                          onHeaderCell: () => ({
                            style: {
                              writingMode: "sideways-lr",
                              textOrientation: "mixed",
                            },
                          }),
                          children: [
                            {
                              key: "indexCourse",
                              title: `${indexCourse + 1+indexTU+indexPeriod}`,
                              children: [
                                {
                                  key: "courseCredit",
                                  title: `${course.credit_count}`,
                                  children: [
                                    {
                                      key: "ccMax",
                                      title: "10",
                                      children: [
                                        {
                                          key: "examMax",
                                          title: "10",
                                          children: [
                                            {
                                              key: "totalMax",
                                              title: "20",
                                              children: [{key:"ccValue", width: 36, render: (_: any, record: any) =>
                                        record.no_retaken
                                          .continuous_assessments[indexCourse],}],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },

                            // {
                            //   key: "exam",
                            //   title: "Exam",
                            //   width: 52,
                            //   render: (_: any, record: any) =>
                            //     record.no_retaken.exams[indexCourse],
                            // },
                            // {
                            //   key: "credits",
                            //   title: "Credits",
                            //   render: (_: any, record: any) =>
                            //     record.no_retaken.earned_credits[indexCourse],
                            //   width: 32,
                            // },
                            // {
                            //   key: "total",
                            //   title: "Total",
                            //   width: 52,
                            //   render: (_: any, record: any) =>
                            //     record.no_retaken.totals[indexCourse],
                            // },
                          ],
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
              key: "totalCredit",
              title: "TOTAL CREDITS",
              render: (_, record) => record.no_retaken.earned_credits,
              onHeaderCell: () => ({
                style: {
                  writingMode: "sideways-lr",
                  textOrientation: "mixed",
                },
              }),
              width: 44,
            },
            {
              key: "letter",
              dataIndex: "percentage",
              title: "Grade",
              render: (_, record) => record.grade_letter,
              onHeaderCell: () => ({
                style: {
                  writingMode: "sideways-lr",
                  textOrientation: "mixed",
                  textAlign: "left",
                },
              }),
              width: 40,
              align: "center",
            },
          ]}
        />
        <div className="bg-white p-8">
          <table className="">
            <th>
              <td>jsdk</td>
            </th>
            <tr>hsdg</tr>
          </table>
        </div>
      </Layout.Content>
    </Layout>
  );
};






