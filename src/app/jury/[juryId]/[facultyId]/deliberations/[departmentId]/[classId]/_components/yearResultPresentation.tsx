"use client";

import { getDecisionText, getMomentText, getSessionText } from "@/lib/api";
import { Class, Department } from "@/types";
import { CloseOutlined, PrinterOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Divider, Drawer, Empty, Result, Select, Space, Table, Tag, Typography } from "antd";
import { useParams } from "next/navigation";
import { Options, parseAsStringEnum, useQueryState } from "nuqs";

import React, { FC, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { getYearResultPresentation } from "@/lib/api/result-presentation";
import { useYid } from "@/hooks/use-yid";
import { PrintableYearResultPresentation } from "./printable/printYearResultPresentation";

type YearResultPresentationProps = {
  department?: Department;
  classYear?: Class;
  lastPeriodId: number;
  open:boolean;
  setOpen:  (value: boolean | ((old: boolean) => boolean | null) | null, options?: Options) => Promise<URLSearchParams>
};

export const YearResultPresentation: FC<
  YearResultPresentationProps
> = ({ open, setOpen, department, classYear, lastPeriodId}) => {
    const { yid, year } = useYid();
  const { facultyId, departmentId, classId } = useParams();
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
  const printResultPresenation = useReactToPrint({
    contentRef: refToPrint,
    documentTitle: `presentation-resultat-${year?.name}-${classYear?.acronym}-${
      department?.acronym
    }-${getMomentText(moment).replace(" ", "-")}-${getSessionText(
      session
    ).replace(" ", "-")}`,
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: [
      "year-result-presentation",
      Number(yid),
      facultyId,
      departmentId,
      classId,
      session,
      moment,
      "YEAR-GRADE",
    ],
    queryFn: () =>
      getYearResultPresentation({
        yearId: Number(yid),
        facultyId: Number(facultyId),
        departmentId: Number(departmentId),
        classId: Number(classId),
        periodId: lastPeriodId,
        session: session,
        moment: moment,
        mode: "YEAR-GRADE",
      }),
    enabled: !!yid && !!facultyId && !!departmentId && !!classId,
  });

  const onClose = () => {
    setOpen(false);
    setSession("main_session");
    setMoment("before_appeal");
  };

  const getPeriodHeader=()=>{
    if (data && data?.length > 0) {
      const sampleItem = data[0];
      return {
        period_0: sampleItem.period_0_acronym,
        period_1: sampleItem.period_1_acronym,
        period_2: sampleItem.period_2_acronym,
      };
    }
  }

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
            Présentation des résultats:
          </Typography.Title>
          <Typography.Title level={5} style={{ marginBottom: 0 }} ellipsis={{}}>
            {classYear?.acronym} {department?.name}
          </Typography.Title>
        </Space>
      }
      styles={{
        body: { padding: 0 },
      }}
      loading={isPending}
      open={open}
      onClose={onClose}
      footer={false}
      closable={false}
      extra={
        <Space>
          <Typography.Text type="secondary">Année:</Typography.Text>
          <Typography.Text strong>{year?.name}</Typography.Text>
          <Divider type="vertical" />
          <Typography.Text type="secondary">Session: </Typography.Text>
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
          <Divider type="vertical" />
          <Button
            style={{
              boxShadow: "none",
            }}
            icon={<PrinterOutlined />}
            color="primary"
            variant="dashed"
            onClick={printResultPresenation}
            disabled={isPending || data?.length === 0}
          >
            Imprimer
          </Button>

          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
            title="Fermer"
          />
        </Space>
      }
    >
      <Table
        style={{
          display: data && data?.length > 0 ? "block" : "none",
        }}
        rowKey={"id"}
        size="small"
        bordered
        dataSource={data || []}
        columns={[
          {
            key: "matricule",
            title: "Matricule",
            dataIndex: "matricule",
            width: 80,
            align: "right",
          },
          {
            key: "gender",
            title: "Genre",
            dataIndex: "gender",
            align: "center",
            width: 60,
          },
          {
            key: "full_name",
            title: "Noms",
            dataIndex: "name",
            render: (_, record) =>
              `${record.surname} ${record.last_name} ${record.first_name} `,
          },
          {
            key: "credits",
            title: "Crédits",
            children: [
              {
                key: "period_0_total_credit",
                title: getPeriodHeader()?.period_0 || "",
                dataIndex: "period_0_total_credit",
                width: 64,
                hidden: getPeriodHeader()?.period_0 ? false : true,
              },
              {
                key: "period_1_total_credit",
                title: getPeriodHeader()?.period_1 || "",
                dataIndex: "period_1_total_credit",
                width: 64,
                hidden: getPeriodHeader()?.period_1 ? false : true,
              },
              {
                key: "period_2_total_credit",
                title: getPeriodHeader()?.period_2 || "",
                dataIndex: "period_2_total_credit",
                width: 64,
                hidden: getPeriodHeader()?.period_2 ? false : true,
              },
            ],
          },
          {
            key: "expected_total_credit",
            title: "Total crédits",
            dataIndex: "expected_total_credit",
          },
          {
            key: "validated_credits",
            title: "Crédits validés",
            children: [
              {
                key: "period_0_validated_credit_sum",
                title: getPeriodHeader()?.period_0 || "",
                dataIndex: "period_0_validated_credit_sum",
                width: 64,
                hidden: getPeriodHeader()?.period_0 ? false : true,
              },
              {
                key: "period_1_validated_credit_sum",
                title: getPeriodHeader()?.period_1 || "",
                dataIndex: "period_1_validated_credit_sum",
                width: 64,
                hidden: getPeriodHeader()?.period_1 ? false : true,
              },
              {
                key: "period_2_validated_credit_sum",
                title: getPeriodHeader()?.period_2 || "",
                dataIndex: "period_2_validated_credit_sum",
                width: 64,
                hidden: getPeriodHeader()?.period_2 ? false : true,
              },
            ],
          },
          {
            key: "validated_credit_total",
            title: "Total crédits validés",
            dataIndex: "validated_credit_total",
          },
          {
            key: "weighted_averages",
            title: "Moyennes",
            children: [
              {
                key: "period_0_weighted_average",
                title: getPeriodHeader()?.period_0 || "",
                dataIndex: "period_0_weighted_average",
                width: 64,
                hidden: getPeriodHeader()?.period_0 ? false : true,
              },
              {
                key: "period_1_weighted_average",
                title: getPeriodHeader()?.period_1 || "",
                dataIndex: "period_1_weighted_average",
                width: 64,
                hidden: getPeriodHeader()?.period_1 ? false : true,
              },
              {
                key: "period_2_weighted_average",
                title: getPeriodHeader()?.period_2 || "",
                dataIndex: "period_2_weighted_average",
                width: 64,
                hidden: getPeriodHeader()?.period_2 ? false : true,
              },
            ],
          },
          {
            key: "weighted_average",
            title: "Totale moyenne",
            dataIndex: "weighted_average",
            width: 80,
            // align: "right",
          },
          {
            key: "percentage",
            title: "Pourcentage",
            dataIndex: "percentage",
            width: 100,
          },
          {
            key: "grade",
            title: "Note",
            dataIndex: "grade",
            width: 56,
            align: "center",
          },
          {
            key: "decision",
            title: "Décision",
            dataIndex: "decision",
            width: 88,
            align: "center",
            render: (_, record) => (
              <Tag
                color={record.decision === "passed" ? "success" : "error"}
                bordered={false}
                style={{ marginRight: 0, width: "100%", textAlign: "center" }}
              >
                {getDecisionText(record.decision)}
              </Tag>
            ),
          },
        ]}
        pagination={false}
        scroll={{ y: "calc(100vh - 144px)" }}
      />

      {data?.length === 0 && (
        <div className="py-32">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Aucun résultat trouvé"
            children="Veuillez peut-être sélectionner une autre session ou un autre moment."
          />
        </div>
      )}

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
      <PrintableYearResultPresentation
        ref={refToPrint}
        data={data}
        forYearResult={{
          department,
          classYear,
          year,
          session,
          moment,
        }}
      />
    </Drawer>
  );
};
