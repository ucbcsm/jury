"use client";

import {
  exportGridToExcel,
  getDecisionText,
  getMomentText,
  getResultGrid,
  getSessionText,
  getShortGradeValidationText,
} from "@/lib/api";
import { Announcement } from "@/types";
import {
  CloseOutlined,
  DownloadOutlined,
  EyeOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Descriptions,
  Drawer,
  Result,
  Select,
  Skeleton,
  Space,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import {
  Options,
  parseAsBoolean,
  parseAsStringEnum,
  useQueryState,
} from "nuqs";

import React, { FC, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { PrintableListGrades } from "./printable/print-list-grades";
import { ButtonDeleteGradeFromGrid } from "./delete-grade-item";
import { useYid } from "@/hooks/use-yid";

type ListYearGradesProps = {
  //   annoucement: Announcement;
  //   anouncementId: number | null;
  //   setAnnoucementId: (
  //     value: number | ((old: number | null) => number | null) | null,
  //     options?: Options
  //   ) => Promise<URLSearchParams>;
};

export const ListYearGrades: FC<ListYearGradesProps> = (
  {
    //   annoucement,
    //   anouncementId,
    //   setAnnoucementId,
  }
) => {
  const { yid } = useYid();
  const { facultyId, departmentId, classId } = useParams();
  const [open, setOpen] = useQueryState(
    "year-grid",
    parseAsBoolean.withDefault(false)
  );

  const [session, setSession] = useQueryState(
    "session",
    parseAsStringEnum(["main_session", "retake_session"]).withDefault(
      "main_session"
    )
  );
  const [moment, setMoment] = useQueryState(
    "moment",
    parseAsStringEnum(["before_appeal", "after_appeal"]).withDefault(
      "before_appeal"
    )
  );

  const refToPrint = useRef<HTMLDivElement | null>(null);
  const printListGrades = useReactToPrint({
    contentRef: refToPrint,
    documentTitle: `Resultat-${yid}`,
  });

  const { data, isPending, isError } = useQuery({
    queryKey: [
      "year_grid_grades",
      Number(yid),
      facultyId,
      departmentId,
      classId,
      session,
      moment,
      "YEAR-GRADE",
    ],
    queryFn: () =>
      getResultGrid({
        yearId: Number(yid),
        facultyId: Number(facultyId),
        departmentId: Number(departmentId),
        classId: Number(classId),
        session: session,
        moment: moment,
        mode: "YEAR-GRADE",
      }),
    enabled: !!yid && !!facultyId && !!departmentId && !!classId,
    // !!annoucement.period.id &&
    // !!anouncementId,
  });

  const onClose = () => {
    setOpen(false);
    setSession("main_session");
    setMoment("before_appeal");
  };

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        icon={<EyeOutlined />}
        variant="dashed"
        color="lime"
      >
        Voir résultats annuels
      </Button>
      <Drawer
        width="100%"
        title={
          <Space>
            <Typography.Title level={5}>Résultats</Typography.Title>
            <Select
              variant="filled"
              placeholder="Session"
              value={session}
              options={[
                { value: "main_session", label: "Principale" },
                { value: "retake_session", label: "Rattrapage" },
              ]}
              style={{ width: 180 }}
              onSelect={(value) => {
                setSession(value as "main_session" | "retake_session");
              }}
            />
            <Typography.Text type="secondary">Moment: </Typography.Text>
            <Select
              variant="filled"
              placeholder="Moment"
              value={moment}
              options={[
                { value: "before_appeal", label: "Avant recours" },
                { value: "after_appeal", label: "Après recours" },
              ]}
              style={{ width: 150 }}
              onSelect={(value) => {
                setMoment(value as "before_appeal" | "after_appeal");
              }}
            />
          </Space>
        }
        styles={{
          header: { borderBottom: 0 },
          body: { paddingTop: 0, paddingBottom: 0 },
        }}
        loading={isPending}
        open={open}
        onClose={onClose}
        footer={false}
        closable={false}
        extra={
          <Space>
            <Button
              style={{
                boxShadow: "none",
                display:
                  data && data.BodyDataList.length > 0 ? "block" : "none",
              }}
              icon={<PrinterOutlined />}
              color="default"
              variant="dashed"
              onClick={printListGrades}
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
        <div
          className="h-[calc(100vh-64px)] overflow-y-auto"
          style={{
            display: data && data.BodyDataList.length > 0 ? "block" : "none",
          }}
        >
          <div className="min-w-fit overflow-x-auto pb-10">
            <table className="min-w-fit divide-y rounded-lg divide-gray-200  border border-red-300 overflow-hidden ">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    colSpan={4}
                    className="px-4 py-2 text-left text-lg font-semibold bg-white border-b  border border-gray-300"
                  >
                    Semestre
                  </th>
                  {data?.HeaderData?.no_retaken?.period_list?.map((period) => (
                    <th
                      colSpan={period.course_counter}
                      className="px-4 py-2 text-left text-lg font-semibold bg-white border-b  border border-gray-300"
                    >
                      {period.period.acronym}
                    </th>
                  ))}
                </tr>
                <tr>
                  <th
                    colSpan={4}
                    className="px-4 py-2 bg-gray-100 text-sm font-medium border-b border border-gray-300"
                  >
                    Unités d&apos;Enseignement
                  </th>
                  {data?.HeaderData?.no_retaken?.teaching_unit_list?.map(
                    (TU) => (
                      <th
                        key={TU.teaching_unit.code}
                        colSpan={TU.course_counter}
                        className="px-4 py-2 uppercase bg-gray-100 text-xs font-semibold border-b border border-gray-300 text-center"
                      >
                        {TU.teaching_unit.code}
                      </th>
                    )
                  )}
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
                  {data?.HeaderData?.no_retaken?.course_list?.map((course) => (
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
                  {data?.HeaderData?.no_retaken?.course_list?.map(
                    (_, index) => (
                      <th
                        key={index}
                        className="px-2 py-1 w-8 text-xs bg-white border-b border border-gray-300 text-center"
                      >
                        {index + 1}
                      </th>
                    )
                  )}
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
                  {data?.HeaderData?.no_retaken?.credits?.map((credit, idx) => (
                    <th
                      key={idx}
                      className="px-2 py-1 w-8 text-xs bg-gray-50 border-b border border-gray-300 text-center"
                    >
                      {credit}
                    </th>
                  ))}
                  <th className="px-2 py-1  text-xs bg-gray-50 border-b border border-gray-300 text-center font-bold">
                    {data?.HeaderData?.no_retaken?.credits?.reduce(
                      (prevValue, currenValue) => currenValue + prevValue
                    )}
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
                    (_, index) => (
                      <th
                        key={index}
                        className="px-2 py-1 w-8 text-xs bg-white border-b  border border-gray-300 text-center"
                      >
                        10
                      </th>
                    )
                  )}
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
                    (_, index) => (
                      <th
                        key={index}
                        className="px-2 py-1 w-8 text-xs bg-gray-50 border-b  border border-gray-300 text-center"
                      >
                        10
                      </th>
                    )
                  )}
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
                  {data?.HeaderData?.no_retaken?.course_list?.map(
                    (_, index) => (
                      <th
                        key={index}
                        className="px-2 py-1 w-8 text-xs border-b border border-gray-300 text-center"
                      >
                        20
                      </th>
                    )
                  )}
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
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {data?.BodyDataList.map((record, indexRecord) => (
                  <React.Fragment key={record.matricule}>
                    <tr className="bg-blue-100 transition">
                      <td
                        rowSpan={7}
                        className="px-2 py-2 w-8 text-right align-top text-xs font-semibold bg-white border border-gray-300"
                      >
                        {indexRecord + 1}
                      </td>
                      <td
                        rowSpan={2}
                        className="px-2 py-2 w-64 text-left align-top text-xs font-semibold border border-gray-300 "
                      >{`${record.first_name} ${record.last_name} ${record.surname}`}</td>
                      <td
                        rowSpan={2}
                        className="px-2 py-2 w-8 text-right align-top text-xs font-semibold border border-gray-300 "
                      >
                        {record.matricule}
                      </td>
                      <td
                        rowSpan={2}
                        className="px-2 py-2 w-8 text-center align-top text-xs font-semibold border border-gray-300 "
                      >
                        {record.gender}
                      </td>
                      {/* <td
                                    colSpan={3}
                                    rowSpan={2}
                                    className="px-4 py-1 bg-white border border-gray-300"
                                  ></td> */}
                      {record.no_retaken.continuous_assessments.map(
                        (cc, idx) => (
                          <td
                            key={idx}
                            className="px-2 py-1 text-center text-xs border border-gray-300"
                          >
                            {cc}
                          </td>
                        )
                      )}
                      <td className=" border border-gray-300"></td>
                      <td className=" border border-gray-300"></td>
                      <td className=" border border-gray-300"></td>
                      <td className=" border border-gray-300"></td>
                      <td className=" border border-gray-300"></td>
                      <td className=" border border-gray-300"></td>
                      <td
                        rowSpan={7}
                        className="px-2 py-1 bg-white align-top border border-gray-300 "
                      >
                        <ButtonDeleteGradeFromGrid
                          periodEnrollmentId={record.id}
                        />
                      </td>
                    </tr>
                    <tr className="bg-blue-100 transition ">
                      {/* <td
                                    colSpan={3}
                                    className="px-4 py-1 bg-white border border-gray-300"
                                  ></td> */}
                      {record.no_retaken.exams.map((exam, idx) => (
                        <td
                          key={idx}
                          className="px-2 py-1 text-center text-xs border border-gray-300"
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
                      {/* <td className="px-2 py-2 w-8 text-right text-xs font-semibold border border-gray-300">
                                    {indexRecord + 1}
                                  </td> */}
                      <td
                        colSpan={3}
                        className="px-2 py-2 text-xs border text-center border-gray-300"
                      >
                        Total
                      </td>

                      {record.no_retaken.totals.map((total, idx) => (
                        <td
                          key={idx}
                          className="px-2 py-2 text-center text-xs border border-gray-300"
                          style={{
                            backgroundColor:
                              total >= 10 ? "#f0fdf4" : "#fef2f2",
                            color: total >= 10 ? "#00a63e" : "#e7000b",
                          }}
                        >
                          {total}
                        </td>
                      ))}
                      <td
                        className="px-2 py-2 text-center text-re text-xs border bg-r border-gray-300"
                        style={{
                          backgroundColor:
                            record.weighted_average >= 10
                              ? "#f0fdf4"
                              : "#fef2f2",
                          color:
                            record.weighted_average >= 10
                              ? "#00a63e"
                              : "#e7000b",
                        }}
                      >
                        {record.weighted_average}
                      </td>
                      <td
                        className="px-2 py-2 text-center text-xs border border-gray-300"
                        style={{
                          backgroundColor:
                            record.decision === "passed"
                              ? "#f0fdf4"
                              : "#fef2f2",
                          color:
                            record.decision === "passed"
                              ? "#00a63e"
                              : "#e7000b",
                        }}
                      >
                        {record.percentage}
                      </td>
                      <td
                        className="px-2 py-2 text-center text-xs font-bold border border-gray-300"
                        style={{
                          backgroundColor:
                            record.decision === "passed"
                              ? "#f0fdf4"
                              : "#fef2f2",
                          color:
                            record.decision === "passed"
                              ? "#00a63e"
                              : "#e7000b",
                        }}
                      >
                        {record.grade_letter}
                      </td>
                      <td
                        className="bg-white border border-gray-300"
                        style={{
                          backgroundColor:
                            record.decision === "passed"
                              ? "#f0fdf4"
                              : "#fef2f2",
                          color:
                            record.decision === "passed"
                              ? "#00a63e"
                              : "#e7000b",
                        }}
                      ></td>
                      <td
                        className="bg-white border border-gray-300"
                        style={{
                          backgroundColor:
                            record.decision === "passed"
                              ? "#f0fdf4"
                              : "#fef2f2",
                          color:
                            record.decision === "passed"
                              ? "#00a63e"
                              : "#e7000b",
                        }}
                      ></td>
                      <td
                        className="px-2 py-1 w-24 text-center text-xs font-semibold border border-gray-300 "
                        style={{
                          backgroundColor:
                            record.decision === "passed"
                              ? "#f0fdf4"
                              : "#fef2f2",
                          color:
                            record.decision === "passed"
                              ? "#00a63e"
                              : "#e7000b",
                        }}
                      >
                        {getDecisionText(record.decision)}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td
                        colSpan={3}
                        className="px-4 py-1  text-xs  border border-gray-300 text-center"
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
                      {record.no_retaken.course_decisions.map(
                        (decision, idx) => (
                          <td
                            key={idx}
                            className="px-2 py-1 text-center text-xs border border-gray-300"
                          >
                            {getShortGradeValidationText(decision)}
                          </td>
                        )
                      )}
                      <td className="bg-white border border-gray-300"></td>
                      <td className="bg-white border border-gray-300"></td>
                      <td className="bg-white border border-gray-300"></td>
                      <td className="px-2 py-1 text-center text-xs  font-bold border border-gray-300">
                        {record.validated_courses_count}
                      </td>
                      <td className="px-2 py-1 text-center text-xs  font-bold border border-gray-300">
                        {record.unvalidated_courses_count}
                      </td>
                      <td className="bg-white border border-gray-300"></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td
                        colSpan={3}
                        className="px-4 py-1  text-xs  border border-gray-300 text-center"
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
                      <td className=" border border-gray-300"></td>
                      <td className=" border border-gray-300"></td>
                      <td className=" border border-gray-300"></td>
                      <td className="px-2 py-1 text-center text-xs  font-bold border border-gray-300">
                        {record.validated_credit_sum}
                      </td>
                      <td className="px-2 py-1 text-center text-xs  font-bold border border-gray-300">
                        {record.unvalidated_credit_sum}
                      </td>
                      <td className=" border border-gray-300"></td>
                    </tr>
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-1 bg-white text-xs  border border-gray-300 text-center"
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
                        {record.validated_TU_count}
                      </td>
                      <td className="px-2 py-1 text-center text-xs  font-bold border border-gray-300">
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

        <Result
          title="Erreur de récupération des données"
          subTitle="Une erreur est survenue lors de la tentative de récupération des données depuis le serveur. Veuillez réessayer."
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

        <PrintableListGrades
          ref={refToPrint}
          // annoucement={annoucement}
          data={data}
        />
      </Drawer>
    </>
  );
};
