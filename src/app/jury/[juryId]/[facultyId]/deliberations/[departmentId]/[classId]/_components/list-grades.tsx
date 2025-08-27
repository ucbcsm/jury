"use client";

import { getDecisionText, getResultGrid, getShortGradeValidationText } from "@/lib/api";
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
            ...(data?.HeaderData?.no_retaken?.period_list?.map(
              (period, indexPeriod) => ({
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
                    .map((TU, indexTU) => ({
                      key: TU.teaching_unit.id,
                      title: TU.teaching_unit.code,
                      onHeaderCell: () => ({
                        style: {
                          textAlign: "left",
                          textTransform: "uppercase",
                        },
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
                                title: `${
                                  indexCourse + 1 + indexTU + indexPeriod
                                }`,
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
                                                children: [
                                                  {
                                                    key: "ccValue",
                                                    width: 36,
                                                    render: (
                                                      _: any,
                                                      record: any
                                                    ) =>
                                                      record.no_retaken
                                                        .continuous_assessments[
                                                        indexCourse
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
              })
            ) || []),
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
            <thead>
              {data?.HeaderData?.no_retaken?.period_list?.map(
                (period, periodIndex) => (
                  <>
                    <tr>
                      <th colSpan={4} className="text-left">
                        {period.period.name}
                      </th>
                    </tr>
                    <tr>
                      <th colSpan={4}>Unites d'Enseignement </th>
                      {data?.HeaderData?.no_retaken?.teaching_unit_list
                        .slice(0, period.teaching_unit_counter)
                        .map((TU, indexTU) => (
                          <th
                            key={TU.teaching_unit.code}
                            colSpan={period.teaching_unit_counter}
                            className="  uppercase"
                          >
                            {TU.teaching_unit.code}
                          </th>
                        ))}
                      <th
                        style={{
                          writingMode: "sideways-lr",
                          textOrientation: "mixed",
                        }}
                        className=" text-left uppercase"
                        rowSpan={2}
                      >
                        Total Crédits
                      </th>
                      <th
                        style={{
                          writingMode: "sideways-lr",
                          textOrientation: "mixed",
                        }}
                        className=" text-left"
                        rowSpan={2}
                      >
                        Pourcentage
                      </th>
                      <th
                        style={{
                          writingMode: "sideways-lr",
                          textOrientation: "mixed",
                        }}
                        className=" text-left"
                        rowSpan={2}
                      >
                        Grade
                      </th>
                      <th
                        style={{
                          writingMode: "sideways-lr",
                          textOrientation: "mixed",
                        }}
                        className=" text-left"
                        colSpan={2}
                        rowSpan={6}
                      >
                        Total des EC et Crédits Validés et Non Validés
                      </th>
                      <th
                        style={{
                          writingMode: "sideways-lr",
                          textOrientation: "mixed",
                        }}
                        rowSpan={6}
                        className="text-left"
                      >
                        Décision
                      </th>
                    </tr>
                    <tr>
                      <th colSpan={4}>Elements Constitutifs</th>
                      {data?.HeaderData?.no_retaken?.teaching_unit_list
                        .slice(0, period.teaching_unit_counter)
                        .map((TU, indexTU) => (
                          <>
                            {data.HeaderData.no_retaken.course_list
                              .filter(
                                (course) =>
                                  course.teaching_unit?.id ===
                                  TU.teaching_unit.id
                              )
                              .map((course, indexCourse) => (
                                <th
                                  style={{
                                    writingMode: "sideways-lr",
                                    textOrientation: "mixed",
                                  }}
                                  className=" text-left"
                                >
                                  {course.available_course.name}
                                </th>
                              ))}
                          </>
                        ))}
                    </tr>
                    <tr>
                      <th colSpan={4}></th>
                      {data.HeaderData.no_retaken.course_list.map(
                        (_, index) => (
                          <th>{index + 1}</th>
                        )
                      )}
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                    <tr>
                      <th colSpan={4}>Crédits</th>

                      {data.HeaderData.no_retaken.credits.map((credit) => (
                        <th>{credit}</th>
                      ))}
                      <th>
                        {data.HeaderData.no_retaken.credits.reduce(
                          (prevValue, currenValue) => currenValue + prevValue
                        )}
                      </th>
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                    <tr>
                      <th colSpan={4}>CC</th>
                      {data.HeaderData.no_retaken.course_list.map(() => (
                        <th>10</th>
                      ))}
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                    <tr>
                      <th colSpan={4}>Examen</th>
                      {data.HeaderData.no_retaken.course_list.map(() => (
                        <th>10</th>
                      ))}
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                    <tr>
                      <th colSpan={4}>TOTAL</th>
                      {data.HeaderData.no_retaken.course_list.map(() => (
                        <th>20</th>
                      ))}
                      <th>20</th>
                      <th></th>
                      <th></th>
                      <th>V</th>
                      <th>NV</th>
                    </tr>
                  </>
                )
              )}
            </thead>
            <tbody>
              {data?.BodyDataList.map((record, indexRecord) => (
                <>
                  <tr>
                    <td colSpan={4}></td>
                    {record.no_retaken.continuous_assessments.map((cc) => (
                      <td>{cc}</td>
                    ))}
                  </tr>
                  <tr>
                    <td colSpan={4}></td>
                    {record.no_retaken.exams.map((exam) => (
                      <td>{exam}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>{indexRecord + 1}</td>
                    <td>{`${record.first_name} ${record.last_name} ${record.surname}`}</td>
                    <td>{record.matricule}</td>
                    <td>{record.gender}</td>
                    {record.no_retaken.totals.map((total) => (
                      <td>{total}</td>
                    ))}
                    <td>{record.weighted_average}</td>
                    <td>{record.percentage}</td>
                    <td>{record.grade_letter}</td>
                  </tr>

                  <tr>
                    <td colSpan={4}>Grade</td>
                    {record.no_retaken.grade_letters.map((letter) => (
                      <td>{letter}</td>
                    ))}
                  </tr>
                  <tr>
                    <td colSpan={4}>Validation EC</td>
                    {record.no_retaken.course_decisions.map((decision) => (
                      <td>{getShortGradeValidationText(decision)}</td>
                    ))}
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      {
                        record.no_retaken.course_decisions.filter(
                          (dec) => dec === "validated"
                        ).length
                      }
                    </td>
                    <td>
                      {
                        record.no_retaken.course_decisions.filter(
                          (dec) => dec === "no_validated"
                        ).length
                      }
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4}>Crédits validés </td>
                    {record.no_retaken.earned_credits.map((credits) => (
                      <td>{credits}</td>
                    ))}
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{record.validated_credit_sum}</td>
                    <td>{record.unvalidated_credit_sum}</td>
                    <td>{getDecisionText(record.decision)}</td>
                  </tr>
                  <tr>
                    <td colSpan={4}>Validation UE </td>
                    {record.no_retaken.teaching_unit_decisions.map(
                      (TUcredits) => (
                        <td colSpan={TUcredits.cols_counter}>
                          {getShortGradeValidationText(TUcredits.value)}
                        </td>
                      )
                    )}
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{record.validated_TU_sum}</td>
                    <td>{record.unvalidated_TU_sum}</td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>


<div className="bg-gray-50 p-4 md:p-8 min-h-screen">
  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-xs md:text-sm">
        <thead className="bg-gray-100">
          {data?.HeaderData?.no_retaken?.period_list?.map(
            (period, periodIndex) => (
              <>
                {/* En-tête de période */}
                <tr className="border-b-2 border-blue-200">
                  <th colSpan={4} className="text-left p-3 font-bold text-blue-800 bg-blue-50 text-base">
                    {period.period.name}
                  </th>
                  {/* Colonnes supplémentaires */}
                  <th className="bg-blue-100 text-blue-800 p-1" rowSpan={2}>
                    <div className="vertical-text font-semibold">Total Crédits</div>
                  </th>
                  <th className="bg-blue-100 text-blue-800 p-1" rowSpan={2}>
                    <div className="vertical-text">Pourcentage</div>
                  </th>
                  <th className="bg-blue-100 text-blue-800 p-1" rowSpan={2}>
                    <div className="vertical-text">Grade</div>
                  </th>
                  <th className="bg-blue-100 text-blue-800 p-1" colSpan={2} rowSpan={6}>
                    <div className="vertical-text font-semibold">Total des EC et Crédits Validés et Non Validés</div>
                  </th>
                  <th className="bg-blue-100 text-blue-800 p-1" rowSpan={6}>
                    <div className="vertical-text font-semibold">Décision</div>
                  </th>
                </tr>
                
                {/* Unités d'enseignement */}
                <tr className="border-b border-gray-200">
                  <th colSpan={4} className="text-left p-2 font-semibold text-gray-700 bg-gray-50">
                    Unités d'Enseignement
                  </th>
                  {data?.HeaderData?.no_retaken?.teaching_unit_list
                    .slice(0, period.teaching_unit_counter)
                    .map((TU, indexTU) => (
                      <th
                        key={TU.teaching_unit.code}
                        colSpan={period.teaching_unit_counter}
                        className="p-2 uppercase font-semibold text-gray-700 bg-gray-50 text-center"
                      >
                        {TU.teaching_unit.code}
                      </th>
                    ))}
                </tr>
                
                {/* Éléments constitutifs */}
                <tr className="border-b border-gray-200">
                  <th colSpan={4} className="text-left p-2 font-semibold text-gray-700 bg-gray-50">
                    Éléments Constitutifs
                  </th>
                  {data?.HeaderData?.no_retaken?.teaching_unit_list
                    .slice(0, period.teaching_unit_counter)
                    .map((TU, indexTU) => (
                      <>
                        {data.HeaderData.no_retaken.course_list
                          .filter(
                            (course) =>
                              course.teaching_unit?.id ===
                              TU.teaching_unit.id
                          )
                          .map((course, indexCourse) => (
                            <th className="p-1 font-medium text-gray-600 bg-gray-50 text-center whitespace-nowrap vertical-header">
                              {course.available_course.name}
                            </th>
                          ))}
                      </>
                    ))}
                </tr>
                
                {/* Numérotation */}
                <tr className="border-b border-gray-200">
                  <th colSpan={4} className="bg-gray-50"></th>
                  {data.HeaderData.no_retaken.course_list.map(
                    (_, index) => (
                      <th className="p-1 text-xs text-gray-500 bg-gray-50">{index + 1}</th>
                    )
                  )}
                  <th className="bg-gray-100"></th>
                  <th className="bg-gray-100"></th>
                  <th className="bg-gray-100"></th>
                </tr>
                
                {/* Crédits */}
                <tr className="border-b border-gray-200">
                  <th colSpan={4} className="text-left p-2 font-semibold text-gray-700 bg-gray-50">
                    Crédits
                  </th>
                  {data.HeaderData.no_retaken.credits.map((credit) => (
                    <th className="p-1 font-medium text-gray-700 bg-gray-50">{credit}</th>
                  ))}
                  <th className="p-1 font-semibold text-blue-700 bg-blue-50">
                    {data.HeaderData.no_retaken.credits.reduce(
                      (prevValue, currenValue) => currenValue + prevValue
                    )}
                  </th>
                  <th className="bg-gray-100"></th>
                  <th className="bg-gray-100"></th>
                  <th className="bg-gray-100"></th>
                </tr>
                
                {/* CC */}
                <tr className="border-b border-gray-200">
                  <th colSpan={4} className="text-left p-2 font-semibold text-gray-700 bg-gray-50">
                    CC
                  </th>
                  {data.HeaderData.no_retaken.course_list.map(() => (
                    <th className="p-1 font-medium text-gray-700 bg-gray-50">10</th>
                  ))}
                  <th className="bg-gray-100"></th>
                  <th className="bg-gray-100"></th>
                  <th className="bg-gray-100"></th>
                </tr>
                
                {/* Examen */}
                <tr className="border-b border-gray-200">
                  <th colSpan={4} className="text-left p-2 font-semibold text-gray-700 bg-gray-50">
                    Examen
                  </th>
                  {data.HeaderData.no_retaken.course_list.map(() => (
                    <th className="p-1 font-medium text-gray-700 bg-gray-50">10</th>
                  ))}
                  <th className="bg-gray-100"></th>
                  <th className="bg-gray-100"></th>
                  <th className="bg-gray-100"></th>
                </tr>
                
                {/* TOTAL */}
                <tr className="border-b-2 border-gray-300">
                  <th colSpan={4} className="text-left p-2 font-semibold text-gray-700 bg-gray-50">
                    TOTAL
                  </th>
                  {data.HeaderData.no_retaken.course_list.map(() => (
                    <th className="p-1 font-medium text-gray-700 bg-gray-50">20</th>
                  ))}
                  <th className="p-1 font-semibold text-blue-700 bg-blue-50">20</th>
                  <th className="bg-gray-100"></th>
                  <th className="bg-gray-100"></th>
                  <th className="p-1 font-semibold text-gray-700 bg-gray-100">V</th>
                  <th className="p-1 font-semibold text-gray-700 bg-gray-100">NV</th>
                </tr>
              </>
            )
          )}
        </thead>
        
        <tbody>
          {data?.BodyDataList.map((record, indexRecord) => (
            <>
              {/* Notes CC */}
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td colSpan={4} className="p-2 text-xs text-gray-500 italic bg-gray-50">Notes CC</td>
                {record.no_retaken.continuous_assessments.map((cc) => (
                  <td className="p-2 text-center">{cc}</td>
                ))}
                <td className="bg-gray-100" rowSpan={2}></td>
                <td className="bg-gray-100" rowSpan={2}></td>
                <td className="bg-gray-100" rowSpan={2}></td>
                <td className="bg-gray-100" rowSpan={7}></td>
                <td className="bg-gray-100" rowSpan={7}></td>
                <td className="bg-gray-100" rowSpan={7}></td>
              </tr>
              
              {/* Notes Examen */}
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td colSpan={4} className="p-2 text-xs text-gray-500 italic bg-gray-50">Notes Examen</td>
                {record.no_retaken.exams.map((exam) => (
                  <td className="p-2 text-center">{exam}</td>
                ))}
              </tr>
              
              {/* Informations étudiant et notes totales */}
              <tr className="border-b border-gray-200 hover:bg-blue-50">
                <td className="p-2 font-medium text-center bg-blue-50">{indexRecord + 1}</td>
                <td className="p-2 font-medium">{`${record.first_name} ${record.last_name} ${record.surname}`}</td>
                <td className="p-2 text-gray-600">{record.matricule}</td>
                <td className="p-2 text-center">{record.gender}</td>
                {record.no_retaken.totals.map((total) => (
                  <td className="p-2 font-medium text-center">{total}</td>
                ))}
                <td className="p-2 font-semibold text-center bg-blue-50">{record.weighted_average}</td>
                <td className="p-2 text-center bg-blue-50">{record.percentage}</td>
                <td className="p-2 font-semibold text-center bg-blue-50">{record.grade_letter}</td>
              </tr>

              {/* Grades */}
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td colSpan={4} className="p-2 font-semibold text-gray-700 bg-gray-50">Grade</td>
                {record.no_retaken.grade_letters.map((letter) => (
                  <td className="p-2 text-center">{letter}</td>
                ))}
                <td className="bg-gray-100"></td>
                <td className="bg-gray-100"></td>
                <td className="bg-gray-100"></td>
              </tr>
              
              {/* Validation EC */}
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td colSpan={4} className="p-2 font-semibold text-gray-700 bg-gray-50">Validation EC</td>
                {record.no_retaken.course_decisions.map((decision) => (
                  <td className="p-2 text-center">{getShortGradeValidationText(decision)}</td>
                ))}
                <td className="bg-gray-100"></td>
                <td className="bg-gray-100"></td>
                <td className="bg-gray-100"></td>
                <td className="p-2 font-semibold text-center bg-green-50">
                  {
                    record.no_retaken.course_decisions.filter(
                      (dec) => dec === "validated"
                    ).length
                  }
                </td>
                <td className="p-2 font-semibold text-center bg-red-50">
                  {
                    record.no_retaken.course_decisions.filter(
                      (dec) => dec === "no_validated"
                    ).length
                  }
                </td>
              </tr>
              
              {/* Crédits validés */}
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td colSpan={4} className="p-2 font-semibold text-gray-700 bg-gray-50">Crédits validés</td>
                {record.no_retaken.earned_credits.map((credits) => (
                  <td className="p-2 text-center">{credits}</td>
                ))}
                <td className="bg-gray-100"></td>
                <td className="bg-gray-100"></td>
                <td className="bg-gray-100"></td>
                <td className="p-2 font-semibold text-center bg-green-50">{record.validated_credit_sum}</td>
                <td className="p-2 font-semibold text-center bg-red-50">{record.unvalidated_credit_sum}</td>
                <td className="p-2 font-semibold text-center bg-blue-50">{getDecisionText(record.decision)}</td>
              </tr>
              
              {/* Validation UE */}
              <tr className="border-b-2 border-gray-300 hover:bg-gray-50">
                <td colSpan={4} className="p-2 font-semibold text-gray-700 bg-gray-50">Validation UE</td>
                {record.no_retaken.teaching_unit_decisions.map(
                  (TUcredits) => (
                    <td colSpan={TUcredits.cols_counter} className="p-2 text-center">
                      {getShortGradeValidationText(TUcredits.value)}
                    </td>
                  )
                )}
                <td className="bg-gray-100"></td>
                <td className="bg-gray-100"></td>
                <td className="bg-gray-100"></td>
                <td className="p-2 font-semibold text-center bg-green-50">{record.validated_TU_sum}</td>
                <td className="p-2 font-semibold text-center bg-red-50">{record.unvalidated_TU_sum}</td>
              </tr>
              
              {/* Espacement entre les étudiants */}
              <tr className="h-4 bg-gray-100">
                <td colSpan={100}></td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  
  <style jsx>{`
    .vertical-text {
      writing-mode: vertical-lr;
      transform: rotate(180deg);
      text-orientation: mixed;
      white-space: nowrap;
      margin: 0 auto;
    }
    .vertical-header {
      writing-mode: vertical-lr;
      transform: rotate(180deg);
      text-orientation: mixed;
      height: 120px;
      vertical-align: bottom;
      padding: 5px 2px;
    }
  `}</style>
</div>

      </Layout.Content>
    </Layout>
  );
};
