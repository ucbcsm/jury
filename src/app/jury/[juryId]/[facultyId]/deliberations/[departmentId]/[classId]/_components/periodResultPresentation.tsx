"use client";

import { getDecisionText, getMomentText, getSessionText } from "@/lib/api";
import { Announcement } from "@/types";
import { CloseOutlined, PrinterOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Divider, Drawer, Result, Space, Table, Tag, Typography } from "antd";
import { useParams } from "next/navigation";
import { Options } from "nuqs";

import React, { FC, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { getPeriodResultPresentation } from "@/lib/api/result-presentation";
import { PrintablePeriodResultPresentation } from "./printable/printPeriodResultPresentation";

type PeriodResultPresentationProps = {
  annoucement: Announcement;
  announcementId: number | null;
  setAnnoucementId: (
    value: number | ((old: number | null) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const PeriodResultPresentation: FC<
  PeriodResultPresentationProps
> = ({ annoucement, announcementId, setAnnoucementId }) => {
  const { facultyId, departmentId, classId } = useParams();

  const refToPrint = useRef<HTMLDivElement | null>(null);
  const printListGrades = useReactToPrint({
    contentRef: refToPrint,
    documentTitle: `presentation-resultat-${annoucement.period.acronym}-${
      annoucement.academic_year.name
    }-${annoucement.class_year.acronym}-${
      annoucement.departement.name
    }-${getSessionText(annoucement.session).replace(" ", "-")}-${getMomentText(
      annoucement.moment
    ).replace(" ", "-")}`,
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: [
      "period-result-presentation",
      annoucement.academic_year.id,
      facultyId,
      departmentId,
      classId,
      annoucement.period.id,
      annoucement.session,
      annoucement.moment,
    ],
    queryFn: () =>
      getPeriodResultPresentation({
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
            Présentation des résultats
          </Typography.Title>
          <Typography.Title level={5} style={{ marginBottom: 0 }} ellipsis={{}}>
            {annoucement.class_year.acronym} {annoucement.departement.name}
          </Typography.Title>
        </Space>
      }
      styles={{
        body: { padding: 0 },
      }}
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
            disabled={isPending || data?.length === 0}
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
            key: "weighted_average",
            title: "Moyenne",
            dataIndex: "weighted_average",
            width: 80,
            align: "right",
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
            key: "validated_credit_sum",
            title: "Crédits validés",
            dataIndex: "validated_credit_sum",
            width: 120,
            align: "center",
          },
          {
            key: "unvalidated_credit_sum",
            title: "Crédits non validés",
            dataIndex: "unvalidated_credit_sum",
            width: 140,
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
        scroll={{ y: "calc(100vh - 105px)" }}
      />

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
      <PrintablePeriodResultPresentation
        ref={refToPrint}
        annoucement={annoucement}
        data={data}
      />
    </Drawer>
  );
};
