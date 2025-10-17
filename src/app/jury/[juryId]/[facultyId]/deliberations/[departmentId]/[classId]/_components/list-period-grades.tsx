"use client";

import {
  getDecisionText,
  getMomentText,
  getResultGrid,
  getSessionText,
  getShortGradeValidationText,
} from "@/lib/api";
import { Announcement } from "@/types";
import { CloseOutlined, PrinterOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Divider, Drawer, Result, Space, Typography } from "antd";
import { useParams } from "next/navigation";
import { Options } from "nuqs";

import React, { FC, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { PrintableListGrades } from "./printable/print-list-grades";
import { ButtonDeleteGradeFromGrid } from "./delete-grade-item";
import { CompensationForm } from "./compensation-form";
import { ListPostponeReasons } from "./listPostponeReasons";

type ListPeriodGradesProps = {
  annoucement: Announcement;
  announcementId: number | null;
  setAnnoucementId: (
    value: number | ((old: number | null) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const ListPeriodGrades: FC<ListPeriodGradesProps> = ({
  annoucement,
  announcementId,
  setAnnoucementId,
}) => {
  const { facultyId, departmentId, classId } = useParams();

  const refToPrint = useRef<HTMLDivElement | null>(null);
  const printListGrades = useReactToPrint({
    contentRef: refToPrint,
    documentTitle: `grille-resultats-${annoucement.period.acronym}-${
      annoucement.academic_year.name
    }-${annoucement.class_year.acronym}-${
      annoucement.departement.name
    }-${getSessionText(annoucement.session).replace(" ", "-")}-${getMomentText(
      annoucement.moment
    ).replace(" ", "-")}`,
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: [
      "grid_grades",
      annoucement.academic_year.id,
      facultyId,
      departmentId,
      classId,
      annoucement.period.id,
      annoucement.session,
      annoucement.moment,
    ],
    queryFn: () =>
      getResultGrid({
        yearId: annoucement.academic_year.id,
        facultyId: Number(facultyId),
        departmentId: Number(departmentId),
        classId: Number(classId),
        periodId: annoucement.period.id,
        session: annoucement.session,
        moment: annoucement.moment,
        mode: "PERIOD-GRADE",
      }),
    enabled:
      !!annoucement.academic_year.id &&
      !!facultyId &&
      !!departmentId &&
      !!classId &&
      !!annoucement.period.id &&
      !!announcementId,
  });

  const onClose = () => {
    setAnnoucementId(null);
  };

  return (
    <Drawer
      width="100%"
      title={
        <Space>
          <Typography.Title
            level={5}
            style={{ marginBottom: 0, textTransform: "uppercase" }}
            type="secondary"
            ellipsis={{}}
          >
            Résultats:
          </Typography.Title>
          <Typography.Title level={5} style={{ marginBottom: 0 }} ellipsis={{}}>
            {annoucement.class_year.acronym} {annoucement.departement.name}
          </Typography.Title>
        </Space>
      }
      styles={{
        header: { borderColor: "#d1d5dc" },
        body: { padding: "0 0 40px 0" },
      }}
      style={{ padding: 0 }}
      loading={isPending}
      open={annoucement.id === announcementId}
      onClose={onClose}
      footer={false}
      closable={false}
      extra={
        <Space>
          <Typography.Text type="secondary">Année: </Typography.Text>
          <Typography.Text strong>
            {annoucement.academic_year.name}
          </Typography.Text>
          <Divider type="vertical" />
          <Typography.Text type="secondary">Session: </Typography.Text>
          <Typography.Text strong>
            {getSessionText(annoucement.session)}
          </Typography.Text>
          <Divider type="vertical" />
          <Typography.Text type="secondary">Moment: </Typography.Text>
          <Typography.Text strong>
            {getMomentText(annoucement.moment)}
          </Typography.Text>
          <Divider type="vertical" />
          <Button
            style={{
              boxShadow: "none",
            }}
            icon={<PrinterOutlined />}
            color="primary"
            variant="dashed"
            onClick={printListGrades}
            disabled={isPending || data?.BodyDataList?.length === 0}
          >
            Imprimer
          </Button>

          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
            title="Fermer la grille"
          />
        </Space>
      }
    >
      <table
        className="min-w-fit  [&_th]:whitespace-nowrap [&_th]:p-1 [&_td]:whitespace-nowrap [&_td]:p-1"
        style={{
          display: data && data?.BodyDataList?.length > 0 ? "block" : "none",
        }}
      >
        <thead className="">
          <tr className=" uppercase">
            <th
              colSpan={4}
              className="sticky left-0 z-10 text-center font-semibold bg-white border-b  border border-gray-300"
            >
              Semestre
            </th>
            {data?.HeaderData?.no_retaken?.period_list?.map((period) => (
              <th
                colSpan={period.course_counter}
                className=" text-center font-semibold bg-white border-b  border border-gray-300"
                key={period.period.id}
              >
                {period.period.acronym}
              </th>
            ))}

            {data?.HeaderData?.retaken?.course_list &&
              data?.HeaderData?.retaken.course_list.length > 0 &&
              data?.HeaderData?.retaken?.header?.map((header, index) => (
                <th
                  colSpan={header.course_counter}
                  className=" text-center font-semibold bg-white border-b  border border-gray-300"
                  key={`$index-${header.retake_title}`}
                >
                  Cours repassés {/* {header.retake_title} */}
                </th>
              ))}
            <th colSpan={7} className="bg-white border border-gray-300"></th>
          </tr>
          <tr className=" sticky top-0 z-10">
            <th
              colSpan={4}
              className="sticky left-0 z-10   bg-gray-100 text-xs font-semibold border-b border border-gray-300"
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
              className="  text-xs font-semibold bg-gray-100 border-b border border-gray-300 text-left uppercase"
              rowSpan={2}
            >
              Total Crédits
            </th>
            <th
              style={{
                writingMode: "sideways-lr",
                textOrientation: "mixed",
              }}
              className="  text-xs font-semibold bg-gray-100 border-b border border-gray-300 text-left"
              rowSpan={2}
            >
              Pourcentage
            </th>
            <th
              style={{
                writingMode: "sideways-lr",
                textOrientation: "mixed",
              }}
              className="  text-xs font-semibold bg-gray-100 border-b border border-gray-300 text-left"
              rowSpan={2}
            >
              Grade
            </th>
            <th
              style={{
                writingMode: "sideways-lr",
                textOrientation: "mixed",
              }}
              className=" text-xs font-semibold bg-gray-100 border-b border border-gray-300 text-left"
              colSpan={2}
              rowSpan={2}
            >
              Total des EC et Crédits Validés et Non Validés
            </th>
            <th
              style={{
                writingMode: "sideways-lr",
                textOrientation: "mixed",
              }}
              rowSpan={2}
              className=" text-xs font-semibold bg-gray-100 border-b border border-gray-300 text-left"
            >
              Décision
            </th>
            <th rowSpan={2} className="bg-white border border-gray-300"></th>
          </tr>
          <tr className="sticky top-[27px] z-10  ">
            <th
              colSpan={4}
              className="sticky left-0  bg-gray-50 text-xs font-semibold  border border-gray-300"
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
                  className="  text-xs font-semibold bg-gray-50 border-b  border border-gray-300 text-left"
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
                className="  text-xs font-semibold bg-gray-50 border-b  border border-gray-300 text-left"
              >
                {course.available_course.name}
              </th>
            ))}
          </tr>
          <tr>
            <th
              colSpan={4}
              className=" sticky left-0 bg-white border border-gray-300"
            ></th>
            {data?.HeaderData?.no_retaken?.course_list?.map((list, listIndex) =>
              list.map((_, index) => (
                <th
                  key={`${listIndex}-${index}`}
                  className="  text-xs bg-white border-b border border-gray-300 text-center"
                >
                  {index + 1}
                </th>
              ))
            )}
            {data?.HeaderData?.retaken?.course_list?.map((_, index) => (
              <th
                key={`${index}`}
                className="  text-xs bg-white border-b border border-gray-300 text-center"
              >
                {index + 1}
              </th>
            ))}
            <th className="bg-white border border-gray-300"></th>
            <th className="bg-white border border-gray-300"></th>
            <th className="bg-white border border-gray-300"></th>
            <th className="bg-white border border-gray-300"></th>
            <th className="bg-white border border-gray-300"></th>
            <th className="bg-white border border-gray-300"></th>
            <th className="bg-white border border-gray-300"></th>
          </tr>
          <tr className="bg-gray-50">
            <th
              colSpan={4}
              className="sticky left-0 bg-gray-50 text-xs font-medium border border-gray-300"
            >
              Crédits
            </th>
            {data?.HeaderData?.no_retaken?.credits?.map((list, listIndex) =>
              list.map((credit, idx) => (
                <th
                  key={`${listIndex}-${idx}-credits`}
                  className="  text-xs bg-gray-50 border-b border border-gray-300 text-center"
                >
                  {credit}
                </th>
              ))
            )}
            {data?.HeaderData?.retaken?.credits?.map((credit, idx) => (
              <th
                key={idx}
                className="  text-xs bg-gray-50 border-b border border-gray-300 text-center"
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
            <th className=" border border-gray-300"></th>
            <th className=" border border-gray-300"></th>
            <th className=" border border-gray-300"></th>
            <th className=" border border-gray-300"></th>
          </tr>
          <tr>
            <th
              colSpan={4}
              className="sticky left-0 bg-white text-xs font-medium border border-gray-300"
            >
              CC
            </th>
            {data?.HeaderData?.no_retaken?.course_list?.map((list, listIndex) =>
              list.map((_, index) => (
                <th
                  key={`${listIndex}-${index}`}
                  className=" text-xs bg-white border-b  border border-gray-300 text-center"
                >
                  10
                </th>
              ))
            )}
            {data?.HeaderData?.retaken?.course_list?.map((_, index) => (
              <th
                key={index}
                className=" text-xs bg-white border-b  border border-gray-300 text-center"
              >
                10
              </th>
            ))}
            <th className="bg-white border border-gray-300"></th>
            <th className="bg-white border border-gray-300"></th>
            <th className="bg-white border border-gray-300"></th>
            <th className="bg-white border border-gray-300"></th>
            <th className="bg-white border border-gray-300"></th>
            <th className="bg-white border border-gray-300"></th>
            <th className="bg-white border border-gray-300"></th>
          </tr>
          <tr className="bg-gray-50">
            <th
              colSpan={4}
              className="sticky left-0 bg-gray-50 text-xs font-medium border border-gray-300"
            >
              Examen
            </th>
            {data?.HeaderData?.no_retaken?.course_list?.map((list, listIndex) =>
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
            <th className=" border border-gray-300"></th>
            <th className=" border border-gray-300"></th>
            <th className=" border border-gray-300"></th>
            <th className=" border border-gray-300"></th>
          </tr>
          <tr className="bg-white">
            <th
              colSpan={4}
              className=" sticky left-0  text-xs font-medium border border-gray-300"
            >
              TOTAL
            </th>
            {data?.HeaderData?.no_retaken?.course_list?.map((list, listIndex) =>
              list.map((_, index) => (
                <th
                  key={index}
                  className=" text-xs border-b border border-gray-300 text-center"
                >
                  20
                </th>
              ))
            )}
            {data?.HeaderData?.retaken?.course_list?.map((_, index) => (
              <th
                key={index}
                className=" text-xs border-b border border-gray-300 text-center"
              >
                20
              </th>
            ))}
            <th className="px-2 py-1 text-xs  border-b border border-gray-300 text-center font-bold">
              20
            </th>
            <th className=" border border-gray-300"></th>
            <th className=" border border-gray-300"></th>
            <th className=" text-xs  border-b border border-gray-300  font-bold">
              V
            </th>
            <th className=" text-xs  border-b border border-gray-300  font-bold">
              NV
            </th>
            <th className=" border border-gray-300"></th>
            <th className=" border border-gray-300"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data?.BodyDataList?.map((record, indexRecord) => (
            <React.Fragment key={record.matricule}>
              <tr className="bg-blue-100 transition">
                <td
                  rowSpan={7}
                  className=" sticky left-0  text-right align-top text-xs font-semibold bg-white border border-gray-300"
                >
                  {indexRecord + 1}
                </td>
                <td
                  rowSpan={2}
                  className=" text-left align-top text-xs font-semibold border border-gray-300 "
                >{`${record.surname} ${record.last_name} ${record.first_name}`}</td>
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
                                          className="px-4 py-1 bg-white border border-gray-300"
                                        ></td> */}
                {record.no_retaken.continuous_assessments.map(
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
                <td
                  rowSpan={7}
                  className=" bg-white align-top  border border-gray-300 "
                >
                  <Space>
                    <CompensationForm
                      hearderData={data.HeaderData}
                      itemData={record}
                      session={annoucement.session}
                      moment={annoucement.moment}
                    />
                    <ButtonDeleteGradeFromGrid periodEnrollmentId={record.id} />
                  </Space>
                </td>
              </tr>
              <tr className="bg-blue-100 transition ">
                {/* <td
                                          colSpan={3}
                                          className="px-4 py-1 bg-white border border-gray-300"
                                        ></td> */}
                {record.no_retaken.exams.map((list, listIndex) =>
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
                {/* <td className=" text-right text-xs font-semibold border border-gray-300">
                                          {indexRecord + 1}
                                        </td> */}
                <td
                  colSpan={3}
                  className=" text-xs border text-center border-gray-300"
                >
                  Total
                </td>

                {record.no_retaken.totals.map((list, listIndex) =>
                  list.map((total, idx) => (
                    <td
                      key={`${listIndex}-${idx}`}
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
                    color: record.decision === "passed" ? "#00a63e" : "#e7000b",
                  }}
                >
                  {record.percentage}
                </td>
                <td
                  className=" text-center text-xs font-bold border border-gray-300"
                  style={{
                    backgroundColor:
                      record.decision === "passed" ? "#f0fdf4" : "#fef2f2",
                    color: record.decision === "passed" ? "#00a63e" : "#e7000b",
                  }}
                >
                  {record.grade_letter}
                </td>
                <td
                  className="bg-white border border-gray-300"
                  style={{
                    backgroundColor:
                      record.decision === "passed" ? "#f0fdf4" : "#fef2f2",
                    color: record.decision === "passed" ? "#00a63e" : "#e7000b",
                  }}
                ></td>
                <td
                  className="bg-white border border-gray-300"
                  style={{
                    backgroundColor:
                      record.decision === "passed" ? "#f0fdf4" : "#fef2f2",
                    color: record.decision === "passed" ? "#00a63e" : "#e7000b",
                  }}
                ></td>
                <td
                  className=" text-center text-xs font-semibold border border-gray-300 "
                  style={{
                    backgroundColor:
                      record.decision === "passed" ? "#f0fdf4" : "#fef2f2",
                    color: record.decision === "passed" ? "#00a63e" : "#e7000b",
                  }}
                >
                  {getDecisionText(record.decision)}{" "}
                  {record.decision === "postponed" &&
                    (annoucement.class_year.acronym === "L3" ||
                      annoucement.class_year.acronym === "M2") && (
                      <ListPostponeReasons
                        itemData={record}
                        mode="PERIOD-GRADE"
                      />
                    )}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td
                  colSpan={3}
                  className="px-4 py-1  text-xs  border border-gray-300 text-center"
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
                  className="px-4 py-1 bg-white text-xs border border-gray-300 text-center"
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

      {isError && (
        <Result
          title="Erreur de récupération des données"
          subTitle={
            error
              ? (error as any)?.response?.data?.message
              : "Une erreur est survenue lors de la tentative de récupération des données depuis le serveur. Veuillez réessayer."
          }
          status={"error"}
          extra={
            <Button
              type="link"
              onClick={() => {
                window.location.reload();
              }}
            >
              Réessayer
            </Button>
          }
        />
      )}
      <PrintableListGrades
        ref={refToPrint}
        annoucement={annoucement}
        data={data}
      />
    </Drawer>
  );
};
