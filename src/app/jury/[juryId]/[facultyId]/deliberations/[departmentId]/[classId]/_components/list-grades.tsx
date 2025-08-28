"use client";

import {
  getDecisionText,
  getResultGrid,
  getShortGradeValidationText,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "antd";
import { useParams } from "next/navigation";

import React, { FC } from "react";

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

  if (!data?.HeaderData?.no_retaken?.period_list) {
    return "No to view";
  }

  return (
    <Layout>
      <Layout.Content
        style={{ height: `calc(100vh - 213px)`, padding: 28, overflow: "auto" }}
      >
        <table className="min-w-fit divide-y rounded-lg divide-gray-200  border border-red-300 overflow-hidden ">
          <thead className="bg-gray-50">
            {data?.HeaderData?.no_retaken?.period_list?.map(
              (period, periodIdx) => (
                <React.Fragment key={period.period.id || periodIdx}>
                  <tr>
                    <th
                      colSpan={4 + period.course_counter}
                      className="px-4 py-2 text-left text-lg font-semibold bg-white border-b  border border-gray-300"
                    >
                      {period.period.name}
                    </th>
                  </tr>
                  <tr>
                    <th
                      colSpan={4}
                      className="px-4 py-2 bg-gray-100 text-sm font-medium border-b border border-gray-300"
                    >
                      Unités d'Enseignement
                    </th>
                    {data?.HeaderData?.no_retaken?.teaching_unit_list
                      .slice(0, period.teaching_unit_counter)
                      .map((TU) => (
                        <th
                          key={TU.teaching_unit.code}
                          colSpan={TU.course_counter}
                          className="px-4 py-2 uppercase bg-gray-100 text-xs font-semibold border-b border border-gray-300 text-center"
                        >
                          {TU.teaching_unit.code}
                        </th>
                      ))}
                    <th
                      style={{
                        writingMode: "sideways-lr",
                        textOrientation: "mixed",
                      }}
                      className="px-2 py-2 w-8 text-xs font-semibold bg-gray-100 border-b border border-gray-300 text-left uppercase"
                      rowSpan={2}
                    >
                      Total Crédits
                    </th>
                    <th
                      style={{
                        writingMode: "sideways-lr",
                        textOrientation: "mixed",
                      }}
                      className="px-2 py-2 w-8 text-xs font-semibold bg-gray-100 border-b border border-gray-300 text-left"
                      rowSpan={2}
                    >
                      Pourcentage
                    </th>
                    <th
                      style={{
                        writingMode: "sideways-lr",
                        textOrientation: "mixed",
                      }}
                      className="px-2 py-2 w-8 text-xs font-semibold bg-gray-100 border-b border border-gray-300 text-left"
                      rowSpan={2}
                    >
                      Grade
                    </th>
                    <th
                      style={{
                        writingMode: "sideways-lr",
                        textOrientation: "mixed",
                      }}
                      className="px-2 py-2 text-xs font-semibold bg-gray-100 border-b border border-gray-300 text-center"
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
                      className="px-2 py-2 text-xs font-semibold bg-gray-100 border-b border border-gray-300 text-center"
                    >
                      Décision
                    </th>
                  </tr>
                  <tr>
                    <th
                      colSpan={4}
                      className="px-4 py-2 bg-gray-50 text-xs font-medium border-b  border border-gray-300"
                    >
                      Éléments Constitutifs
                    </th>
                    {data?.HeaderData?.no_retaken?.course_list.map((course) => (
                      <th
                        key={course.id}
                        style={{
                          writingMode: "sideways-lr",
                          textOrientation: "mixed",
                        }}
                        className="px-2 py-2 w-8 text-xs font-normal bg-gray-50 border-b  border border-gray-300 text-left"
                      >
                        {course.available_course.name}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    <th
                      colSpan={4}
                      className="bg-white border border-gray-300"
                    ></th>
                    {data.HeaderData.no_retaken.course_list.map((_, index) => (
                      <th
                        key={index}
                        className="px-2 py-1 w-8 text-xs bg-white border-b border border-gray-300 text-center"
                      >
                        {index + 1}
                      </th>
                    ))}
                    <th className="bg-white border border-gray-300"></th>
                    <th className="bg-white border border-gray-300"></th>
                    <th className="bg-white border border-gray-300"></th>
                  </tr>
                  <tr>
                    <th
                      colSpan={4}
                      className="bg-gray-50 text-xs font-medium border border-gray-300"
                    >
                      Crédits
                    </th>
                    {data.HeaderData.no_retaken.credits.map((credit, idx) => (
                      <th
                        key={idx}
                        className="px-2 py-1 w-8 text-xs bg-gray-50 border-b border border-gray-300 text-center"
                      >
                        {credit}
                      </th>
                    ))}
                    <th className="px-2 py-1  text-xs bg-gray-50 border-b border border-gray-300 text-center font-bold">
                      {data.HeaderData.no_retaken.credits.reduce(
                        (prevValue, currenValue) => currenValue + prevValue
                      )}
                    </th>
                    <th className="bg-gray-50 border border-gray-300"></th>
                    <th className="bg-gray-50 border border-gray-300"></th>
                    {/* <th className="bg-gray-50 border border-gray-300"></th> */}
                  </tr>
                  <tr>
                    <th
                      colSpan={4}
                      className="bg-white text-xs font-medium border border-gray-300"
                    >
                      CC
                    </th>
                    {data.HeaderData.no_retaken.course_list.map((_, index) => (
                      <th
                        key={index}
                        className="px-2 py-1 w-8 text-xs bg-white border-b  border border-gray-300 text-center"
                      >
                        10
                      </th>
                    ))}
                    <th className="bg-white border border-gray-300"></th>
                    <th className="bg-white border border-gray-300"></th>
                    <th className="bg-white border border-gray-300"></th>
                  </tr>
                  <tr>
                    <th
                      colSpan={4}
                      className="bg-gray-50 text-xs font-medium border border-gray-300"
                    >
                      Examen
                    </th>
                    {data.HeaderData.no_retaken.course_list.map((_, index) => (
                      <th
                        key={index}
                        className="px-2 py-1 w-8 text-xs bg-gray-50 border-b  border border-gray-300 text-center"
                      >
                        10
                      </th>
                    ))}
                    <th className="bg-gray-50 border border-gray-300"></th>
                    <th className="bg-gray-50 border border-gray-300"></th>
                    <th className="bg-gray-50 border border-gray-300"></th>
                  </tr>
                  <tr>
                    <th
                      colSpan={4}
                      className="bg-white text-xs font-medium border border-gray-300"
                    >
                      TOTAL
                    </th>
                    {data.HeaderData.no_retaken.course_list.map((_, index) => (
                      <th
                        key={index}
                        className="px-2 py-1 w-8 text-xs border-b border border-gray-300 text-center"
                      >
                        20
                      </th>
                    ))}
                    <th className="px-2 py-1 text-xs bg-white border-b border border-gray-300 text-center font-bold">
                      20
                    </th>
                    <th className="bg-white border border-gray-300"></th>
                    <th className="bg-white border border-gray-300"></th>
                    <th className="px-2 py-1 w-8 text-xs bg-gray-50 border-b border border-gray-300  font-bold">
                      V
                    </th>
                    <th className="px-2 py-1 w-8 text-xs bg-gray-50 border-b border border-gray-300  font-bold">
                      NV
                    </th>
                    <th className="bg-gray-50 border border-gray-300"></th>
                  </tr>
                </React.Fragment>
              )
            )}
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data?.BodyDataList.map((record, indexRecord) => (
              <React.Fragment key={record.matricule}>
                <tr className="hover:bg-blue-50 transition">
                  <td
                    colSpan={4}
                    className="px-4 py-1 bg-white border border-gray-300"
                  ></td>
                  {record.no_retaken.continuous_assessments.map((cc, idx) => (
                    <td
                      key={idx}
                      className="px-2 py-1 text-center text-xs border border-gray-300"
                    >
                      {cc}
                    </td>
                  ))}
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                </tr>
                <tr className="hover:bg-blue-50 transition">
                  <td
                    colSpan={4}
                    className="px-4 py-1 bg-white border border-gray-300"
                  ></td>
                  {record.no_retaken.exams.map((exam, idx) => (
                    <td
                      key={idx}
                      className="px-2 py-1 text-center text-xs border border-gray-300"
                    >
                      {exam}
                    </td>
                  ))}
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                </tr>
                <tr className="bg-blue-100 transition font-medium">
                  <td className="px-2 py-2 w-8 text-right text-xs font-semibold border border-gray-300">
                    {indexRecord + 1}
                  </td>
                  <td className="px-2 py-2 w-64 text-left text-xs border border-gray-300">{`${record.first_name} ${record.last_name} ${record.surname}`}</td>
                  <td className="px-2 py-2 w-8 text-right text-xs border border-gray-300">
                    {record.matricule}
                  </td>
                  <td className="px-2 py-2 w-8 text-center text-xs border border-gray-300">
                    {record.gender}
                  </td>
                  {record.no_retaken.totals.map((total, idx) => (
                    <td
                      key={idx}
                      className="px-2 py-2 text-center text-xs border border-gray-300"
                    >
                      {total}
                    </td>
                  ))}
                  <td
                    className="px-2 py-2 text-center text-re text-xs font-semibold border bg-r border-gray-300"
                    style={{
                      backgroundColor:
                        record.weighted_average >= 10 ? "#f0fdf4" : "#fef2f2",
                      color:
                        record.weighted_average >= 10 ? "#00a63e" : "#e7000b",
                    }}
                  >
                    {record.weighted_average}
                  </td>
                  <td className="px-2 py-2 text-center text-xs border border-gray-300">
                    {record.percentage}
                  </td>
                  <td className="px-2 py-2 text-center text-xs font-bold border border-gray-300">
                    {record.grade_letter}
                  </td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                </tr>
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-1 bg-gray-50 text-xs font-medium border border-gray-300 text-center"
                  >
                    Grade
                  </td>
                  {record.no_retaken.grade_letters.map((letter, idx) => (
                    <td
                      key={idx}
                      className="px-2 py-1 text-center text-xs border border-gray-300"
                    >
                      {letter}
                    </td>
                  ))}
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                </tr>
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-1 bg-white text-xs font-medium border border-gray-300 text-center"
                  >
                    Validation EC
                  </td>
                  {record.no_retaken.course_decisions.map((decision, idx) => (
                    <td
                      key={idx}
                      className="px-2 py-1 text-center text-xs border border-gray-300"
                    >
                      {getShortGradeValidationText(decision)}
                    </td>
                  ))}
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className="px-2 py-1 text-center text-xs  font-bold border border-gray-300">
                    {
                      record.no_retaken.course_decisions.filter(
                        (dec) => dec === "validated"
                      ).length
                    }
                  </td>
                  <td className="px-2 py-1 text-center text-xs  font-bold border border-gray-300">
                    {
                      record.no_retaken.course_decisions.filter(
                        (dec) => dec === "no_validated"
                      ).length
                    }
                  </td>
                  <td className="bg-white border border-gray-300"></td>
                </tr>
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-1 bg-gray-50 text-xs font-medium border border-gray-300 text-center"
                  >
                    Crédits validés
                  </td>
                  {record.no_retaken.earned_credits.map((credits, idx) => (
                    <td
                      key={idx}
                      className="px-2 py-1 text-center text-xs border border-gray-300"
                    >
                      {credits}
                    </td>
                  ))}
                  <td className="bg-gray-50 border border-gray-300"></td>
                  <td className="bg-gray-50 border border-gray-300"></td>
                  <td className="bg-gray-50 border border-gray-300"></td>
                  <td className="px-2 py-1 text-center text-xs  font-bold border border-gray-300">
                    {record.validated_credit_sum}
                  </td>
                  <td className="px-2 py-1 text-center text-xs  font-bold border border-gray-300">
                    {record.unvalidated_credit_sum}
                  </td>
                  <td
                    className="px-2 py-1 w-24 text-center text-xs font-semibold border border-gray-300"
                    style={{
                      backgroundColor:
                        record.decision === "passed" ? "#f0fdf4" : "#fef2f2",
                      color:
                        record.decision === "passed" ? "#00a63e" : "#e7000b",
                    }}
                  >
                    {getDecisionText(record.decision)}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-1 bg-white text-xs font-medium border border-gray-300 text-center"
                  >
                    Validation UE
                  </td>
                  {record.no_retaken.teaching_unit_decisions.map(
                    (TUcredits, idx) => (
                      <td
                        key={idx}
                        colSpan={TUcredits.cols_counter}
                        className="px-2 py-1 text-center text-xs border border-gray-300"
                      >
                        {getShortGradeValidationText(TUcredits.value)}
                      </td>
                    )
                  )}
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className="px-2 py-1 text-center text-xs  font-bold border border-gray-300">
                    {record.validated_TU_sum}
                  </td>
                  <td className="px-2 py-1 text-center text-xs  font-bold border border-gray-300">
                    {record.unvalidated_TU_sum}
                  </td>
                  <td className="bg-white border border-gray-300"></td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </Layout.Content>
    </Layout>
  );
};
