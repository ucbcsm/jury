"use client";

import { DocHeader } from "@/components/doc-header";
import {
  getDecisionText,
  getMomentText,
  getSessionText,
  getShortGradeValidationText,
} from "@/lib/api";
import { Announcement, Class, Department, ResultGrid, Year } from "@/types";
import { Card, Descriptions, Watermark } from "antd";
import React, { FC, RefObject } from "react";

type PrintableListGradesProps = {
  ref: RefObject<HTMLDivElement | null>;
  annoucement?: Announcement;
  data?: ResultGrid;
  forYearResult?: {
    year?: Year;
    department?: Department;
    classYear?: Class;
    session: "main_session" | "retake_session";
    moment: "before_appeal" | "after_appeal";
  };
};
export const PrintableListGrades: FC<PrintableListGradesProps> = ({
  ref,
  annoucement,
  data,
  forYearResult
}) => {
  return (
    <div className="hidden">
      <div ref={ref} className=" ">
        <DocHeader />
        {annoucement && (
          <Card style={{ marginBottom: 28 }}>
            <Descriptions
              title="Résultats"
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
              title="Résultats"
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

        <table className="min-w-fit divide-y divide-gray-200 [&_th]:whitespace-nowrap [&_th]:p-1 [&_td]:whitespace-nowrap [&_td]:p-1 ">
          <thead className="bg-gray-50">
            <tr className=" uppercase">
              <th
                colSpan={4}
                className=" text-center font-semibold bg-white border-b  border border-gray-300"
              >
                Semestre
              </th>
              {data?.HeaderData?.no_retaken?.period_list?.map((period) => (
                <th
                  colSpan={period.course_counter}
                  className=" text-center font-semibold bg-white border-b  border border-gray-300"
                >
                  {period.period.acronym}
                </th>
              ))}
              {data?.HeaderData?.retaken?.course_list &&
                data?.HeaderData?.retaken.course_list.length > 0 &&
                data?.HeaderData?.retaken?.header?.map((header) => (
                  <th
                    colSpan={header.course_counter}
                    className=" text-center font-semibold bg-white border-b  border border-gray-300"
                  >
                    Cours repassés {/* {header.retake_title} */}
                  </th>
                ))}
              <th colSpan={6} className="bg-white border border-gray-300"></th>
            </tr>
            <tr>
              <th
                colSpan={4}
                className=" bg-gray-100 text-sm font-medium border-b border border-gray-300"
              >
                Unités d&apos;Enseignement
              </th>
              {data?.HeaderData?.no_retaken?.teaching_unit_list?.map((list) =>
                list.map((TU) => (
                  <th
                    key={TU.teaching_unit.code}
                    colSpan={TU.course_counter}
                    className=" uppercase bg-gray-100 text-xs font-semibold border-b border border-gray-300 text-center"
                  >
                    {TU.teaching_unit.code}
                  </th>
                ))
              )}
              {data?.HeaderData?.retaken?.teaching_unit_list?.map((TU) => (
                <th
                  key={TU.teaching_unit.code}
                  colSpan={TU.course_counter}
                  className=" uppercase bg-gray-100 text-xs font-semibold border-b border border-gray-300 text-center"
                >
                  {TU.teaching_unit.code}
                </th>
              ))}
              <th
                style={{
                  writingMode: "sideways-lr",
                  textOrientation: "mixed",
                }}
                className=" text-xs font-semibold bg-gray-100 border-b border border-gray-300 text-left uppercase"
                rowSpan={2}
              >
                Total Crédits
              </th>
              <th
                style={{
                  writingMode: "sideways-lr",
                  textOrientation: "mixed",
                }}
                className=" text-xs font-semibold bg-gray-100 border-b border border-gray-300 text-left"
                rowSpan={2}
              >
                Pourcentage
              </th>
              <th
                style={{
                  writingMode: "sideways-lr",
                  textOrientation: "mixed",
                }}
                className=" text-xs font-semibold bg-gray-100 border-b border border-gray-300 text-left"
                rowSpan={2}
              >
                Grade
              </th>
              <th
                style={{
                  writingMode: "sideways-lr",
                  textOrientation: "mixed",
                }}
                className=" text-xs font-semibold bg-gray-100 border-b border border-gray-300 text-center"
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
                className=" text-xs font-semibold bg-gray-100 border-b border border-gray-300 text-center"
              >
                Décision
              </th>
            </tr>
            <tr>
              <th
                colSpan={4}
                className=" bg-gray-50 text-xs font-medium border-b  border border-gray-300"
              >
                Éléments Constitutifs
              </th>
              {data?.HeaderData?.no_retaken?.course_list?.map((list) =>
                list.map((course) => (
                  <th
                    key={course.id}
                    style={{
                      writingMode: "sideways-lr",
                      textOrientation: "mixed",
                    }}
                    className=" text-xs font-normal bg-gray-50 border-b  border border-gray-300 text-left"
                  >
                    {course.available_course.name}
                  </th>
                ))
              )}
              {data?.HeaderData?.retaken?.course_list?.map((course) => (
                <th
                  key={course.id}
                  style={{
                    writingMode: "sideways-lr",
                    textOrientation: "mixed",
                  }}
                  className=" text-xs font-normal bg-gray-50 border-b  border border-gray-300 text-left"
                >
                  {course.available_course.name}
                </th>
              ))}
            </tr>
            <tr>
              <th colSpan={4} className="bg-white border border-gray-300"></th>
              {data?.HeaderData?.no_retaken?.course_list?.map(
                (list, listIndex) =>
                  list.map((_, index) => (
                    <th
                      key={`${listIndex}-${index}`}
                      className="text-xs bg-white border-b border border-gray-300 text-center"
                    >
                      {index + 1}
                    </th>
                  ))
              )}
              {data?.HeaderData?.retaken?.course_list?.map((_, index) => (
                <th
                  key={index}
                  className="text-xs bg-white border-b border border-gray-300 text-center"
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
              {data?.HeaderData?.no_retaken?.credits?.map((list, listIndex) =>
                list.map((credit, idx) => (
                  <th
                    key={`${listIndex}-${idx}`}
                    className="text-xs bg-gray-50 border-b border border-gray-300 text-center"
                  >
                    {credit}
                  </th>
                ))
              )}
              {data?.HeaderData?.retaken?.credits?.map((credit, idx) => (
                <th
                  key={idx}
                  className="text-xs bg-gray-50 border-b border border-gray-300 text-center"
                >
                  {credit}
                </th>
              ))}
              <th className="  text-xs bg-gray-50 border-b border border-gray-300 text-center font-bold">
                {data?.HeaderData?.no_retaken?.credits
                  ?.flat()
                  .reduce((sum, value) => sum + value, 0)}
              </th>
              <th className="bg-gray-50 border border-gray-300"></th>
              <th className="bg-gray-50 border border-gray-300"></th>
            </tr>
            <tr>
              <th
                colSpan={4}
                className="bg-white text-xs font-medium border border-gray-300"
              >
                CC
              </th>
              {data?.HeaderData?.no_retaken?.course_list?.map(
                (list, listIndex) =>
                  list.map((_, index) => (
                    <th
                      key={`${listIndex}-${index}`}
                      className="text-xs bg-white border-b  border border-gray-300 text-center"
                    >
                      10
                    </th>
                  ))
              )}
              {data?.HeaderData?.retaken?.course_list?.map((_, index) => (
                <th
                  key={index}
                  className="text-xs bg-white border-b  border border-gray-300 text-center"
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
              {data?.HeaderData?.no_retaken?.course_list?.map(
                (list, listIndex) =>
                  list.map((_, index) => (
                    <th
                      key={`${listIndex}-${index}`}
                      className="text-xs bg-gray-50 border-b  border border-gray-300 text-center"
                    >
                      10
                    </th>
                  ))
              )}
              {data?.HeaderData?.retaken?.course_list?.map((_, index) => (
                <th
                  key={index}
                  className="text-xs bg-gray-50 border-b  border border-gray-300 text-center"
                >
                  10
                </th>
              ))}
              <th className="bg-gray-50 border border-gray-300"></th>
              <th className="bg-gray-50 border border-gray-300"></th>
              <th className="bg-gray-50 border border-gray-300"></th>
            </tr>
            <tr className="bg-white">
              <th
                colSpan={4}
                className=" text-xs font-medium border border-gray-300"
              >
                TOTAL
              </th>
              {data?.HeaderData?.no_retaken?.course_list?.map(
                (list, listIndex) =>
                  list.map((_, index) => (
                    <th
                      key={`${listIndex}-${index}`}
                      className="text-xs border-b border border-gray-300 text-center"
                    >
                      20
                    </th>
                  ))
              )}
              {data?.HeaderData?.retaken?.course_list?.map((_, index) => (
                <th
                  key={index}
                  className="text-xs border-b border border-gray-300 text-center"
                >
                  20
                </th>
              ))}
              <th className=" text-xs  border-b border border-gray-300 text-center font-bold">
                20
              </th>
              <th className=" border border-gray-300"></th>
              <th className=" border border-gray-300"></th>
              <th className="text-xs  border-b border border-gray-300  font-bold">
                V
              </th>
              <th className="text-xs  border-b border border-gray-300  font-bold">
                NV
              </th>
              <th className=" border border-gray-300"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data?.BodyDataList.map((record, indexRecord) => (
              <React.Fragment key={record.matricule}>
                <tr className="bg-blue-100 transition">
                  <td
                    rowSpan={7}
                    className=" text-right align-top text-xs font-semibold bg-white border border-gray-300"
                  >
                    {indexRecord + 1}
                  </td>
                  <td
                    rowSpan={2}
                    className=" text-left align-top text-xs font-semibold border border-gray-300 "
                  >{`${record.first_name} ${record.last_name} ${record.surname}`}</td>
                  <td
                    rowSpan={2}
                    className=" text-right align-top text-xs font-semibold border border-gray-300 "
                  >
                    {record.matricule}
                  </td>
                  <td
                    rowSpan={2}
                    className=" text-center align-top text-xs font-semibold border border-gray-300 "
                  >
                    {record.gender}
                  </td>
                  {/* <td
                                colSpan={3}
                                rowSpan={2}
                                className=" bg-white border border-gray-300"
                              ></td> */}
                  {record?.no_retaken.continuous_assessments?.map(
                    (list, listIndex) =>
                      list.map((cc, idx) => (
                        <td
                          key={`${listIndex}-${idx}`}
                          className=" text-center text-xs border border-gray-300"
                        >
                          {cc}
                        </td>
                      ))
                  )}
                  {record.retaken.continuous_assessments.map((cc, idx) => (
                    <td
                      key={idx}
                      className=" text-center text-xs border border-gray-300"
                    >
                      {cc}
                    </td>
                  ))}
                  <td className=" border border-gray-300"></td>
                  <td className=" border border-gray-300"></td>
                  <td className=" border border-gray-300"></td>
                  <td className=" border border-gray-300"></td>
                  <td className=" border border-gray-300"></td>
                  <td className=" border border-gray-300"></td>
                </tr>
                <tr className="bg-blue-100 transition ">
                  {record?.no_retaken?.exams?.map((list, listIndex) =>
                    list.map((exam, idx) => (
                      <td
                        key={`${listIndex}-${idx}`}
                        className=" text-center text-xs border border-gray-300"
                      >
                        {exam}
                      </td>
                    ))
                  )}
                  {record.retaken.exams.map((exam, idx) => (
                    <td
                      key={idx}
                      className=" text-center text-xs border border-gray-300"
                    >
                      {exam}
                    </td>
                  ))}
                  <td className=" border border-gray-300"></td>
                  <td className=" border border-gray-300"></td>
                  <td className=" border border-gray-300"></td>
                  <td className=" border border-gray-300"></td>
                  <td className=" border border-gray-300"></td>
                  <td className=" border border-gray-300"></td>
                </tr>
                <tr className=" font-semibold">
                  <td
                    colSpan={3}
                    className=" text-xs border text-center border-gray-300"
                  >
                    Total
                  </td>

                  {record?.no_retaken?.totals?.map((list, listIndex) =>
                    list.map((total, idx) => (
                      <td
                        key={`${listIndex}-${idx}`}
                        className=" text-center text-xs border border-gray-300"
                        style={{
                          backgroundColor: total >= 10 ? "#f0fdf4" : "#fef2f2",
                          color: total >= 10 ? "#00a63e" : "#e7000b",
                        }}
                      >
                        {total}
                      </td>
                    ))
                  )}
                  {record.retaken.totals.map((total, idx) => (
                    <td
                      key={idx}
                      className=" text-center text-xs border border-gray-300"
                      style={{
                        backgroundColor:
                          total === null
                            ? "#fff"
                            : total >= 10
                            ? "#f0fdf4"
                            : "#fef2f2",
                        color: total >= 10 ? "#00a63e" : "#e7000b",
                      }}
                    >
                      {total}
                    </td>
                  ))}
                  <td
                    className=" text-center text-re text-xs border bg-r border-gray-300"
                    style={{
                      backgroundColor:
                        record.weighted_average >= 10 ? "#f0fdf4" : "#fef2f2",
                      color:
                        record.weighted_average >= 10 ? "#00a63e" : "#e7000b",
                    }}
                  >
                    {record.weighted_average}
                  </td>
                  <td
                    className=" text-center text-xs border border-gray-300"
                    style={{
                      backgroundColor:
                        record.decision === "passed" ? "#f0fdf4" : "#fef2f2",
                      color:
                        record.decision === "passed" ? "#00a63e" : "#e7000b",
                    }}
                  >
                    {record.percentage}
                  </td>
                  <td
                    className=" text-center text-xs font-bold border border-gray-300"
                    style={{
                      backgroundColor:
                        record.decision === "passed" ? "#f0fdf4" : "#fef2f2",
                      color:
                        record.decision === "passed" ? "#00a63e" : "#e7000b",
                    }}
                  >
                    {record.grade_letter}
                  </td>
                  <td
                    className="bg-white border border-gray-300"
                    style={{
                      backgroundColor:
                        record.decision === "passed" ? "#f0fdf4" : "#fef2f2",
                      color:
                        record.decision === "passed" ? "#00a63e" : "#e7000b",
                    }}
                  ></td>
                  <td
                    className="bg-white border border-gray-300"
                    style={{
                      backgroundColor:
                        record.decision === "passed" ? "#f0fdf4" : "#fef2f2",
                      color:
                        record.decision === "passed" ? "#00a63e" : "#e7000b",
                    }}
                  ></td>
                  <td
                    className=" w-24 text-center text-xs font-semibold border border-gray-300 "
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
                <tr className="bg-gray-50">
                  <td
                    colSpan={3}
                    className="  text-xs  border border-gray-300 text-center"
                  >
                    Grade
                  </td>
                  {record.no_retaken.grade_letters.map((list, listIndex) =>
                    list.map((letter, idx) => (
                      <td
                        key={`${listIndex}-${idx}`}
                        className=" text-center text-xs border border-gray-300"
                      >
                        {letter}
                      </td>
                    ))
                  )}
                  {record.retaken.grade_letters.map((letter, idx) => (
                    <td
                      key={idx}
                      className=" text-center text-xs border border-gray-300"
                    >
                      {letter}
                    </td>
                  ))}
                  <td className="border border-gray-300"></td>
                  <td className="border border-gray-300"></td>
                  <td className="border border-gray-300"></td>
                  <td className="border border-gray-300"></td>
                  <td className="border border-gray-300"></td>
                  <td className="border border-gray-300"></td>
                </tr>
                <tr>
                  <td
                    colSpan={3}
                    className=" bg-white text-xs border border-gray-300 text-center"
                  >
                    Validation EC
                  </td>
                  {record.no_retaken.course_decisions.map((list, listIndex) =>
                    list.map((decision, idx) => (
                      <td
                        key={`${listIndex}-${idx}`}
                        className=" text-center text-xs border border-gray-300"
                      >
                        {getShortGradeValidationText(decision)}
                      </td>
                    ))
                  )}
                  {record.retaken.course_decisions.map((decision, idx) => (
                    <td
                      key={idx}
                      className=" text-center text-xs border border-gray-300"
                    >
                      {getShortGradeValidationText(decision)}
                    </td>
                  ))}
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className=" text-center text-xs  font-bold border border-gray-300">
                    {record.validated_courses_count}
                  </td>
                  <td className=" text-center text-xs  font-bold border border-gray-300">
                    {record.unvalidated_courses_count}
                  </td>
                  <td className="bg-white border border-gray-300"></td>
                </tr>
                <tr className="bg-gray-50">
                  <td
                    colSpan={3}
                    className="  text-xs  border border-gray-300 text-center"
                  >
                    Crédits validés
                  </td>
                  {record.no_retaken.earned_credits.map((list, listIndex) =>
                    list.map((credits, idx) => (
                      <td
                        key={`${listIndex}-${idx}`}
                        className=" text-center text-xs border border-gray-300"
                      >
                        {credits}
                      </td>
                    ))
                  )}
                  {record.retaken.earned_credits.map((credits, idx) => (
                    <td
                      key={idx}
                      className=" text-center text-xs border border-gray-300"
                    >
                      {credits}
                    </td>
                  ))}
                  <td className=" border border-gray-300"></td>
                  <td className=" border border-gray-300"></td>
                  <td className=" border border-gray-300"></td>
                  <td className=" text-center text-xs  font-bold border border-gray-300">
                    {record.validated_credit_sum}
                  </td>
                  <td className=" text-center text-xs  font-bold border border-gray-300">
                    {record.unvalidated_credit_sum}
                  </td>
                  <td className=" border border-gray-300"></td>
                </tr>
                <tr>
                  <td
                    colSpan={3}
                    className=" bg-white text-xs  border border-gray-300 text-center"
                  >
                    Validation UE
                  </td>
                  {record.no_retaken.teaching_unit_decisions.map(
                    (list, listIndex) =>
                      list.map((TUcredits, idx) => (
                        <td
                          key={`${listIndex}-${idx}`}
                          colSpan={TUcredits.cols_counter}
                          className=" text-center text-xs border border-gray-300"
                        >
                          {getShortGradeValidationText(TUcredits.value)}
                        </td>
                      ))
                  )}
                  {record.retaken.teaching_unit_decisions.map(
                    (TUcredits, idx) => (
                      <td
                        key={idx}
                        colSpan={TUcredits.cols_counter}
                        className=" text-center text-xs border border-gray-300"
                      >
                        {getShortGradeValidationText(TUcredits.value)}
                      </td>
                    )
                  )}
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className="bg-white border border-gray-300"></td>
                  <td className=" text-center text-xs  font-bold border border-gray-300">
                    {record.validated_TU_count}
                  </td>
                  <td className=" text-center text-xs  font-bold border border-gray-300">
                    {record.unvalidated_TU_count}
                  </td>
                  <td className="bg-white border border-gray-300"></td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
