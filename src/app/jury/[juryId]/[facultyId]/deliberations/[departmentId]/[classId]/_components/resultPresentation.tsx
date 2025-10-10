"use client";

import { getMomentText, getSessionText } from "@/lib/api";
import { Announcement } from "@/types";
import { CloseOutlined, PrinterOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Divider, Drawer, Result, Space, Typography } from "antd";
import { useParams } from "next/navigation";
import { Options } from "nuqs";

import React, { FC, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { PrintableListGrades } from "./printable/print-list-grades";
import { getResultPresentation } from "@/lib/api/result-presentation";

type ResultPresentationProps = {
  annoucement: Announcement;
  announcementId: number | null;
  setAnnoucementId: (
    value: number | ((old: number | null) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const ResultPresentation: FC<ResultPresentationProps> = ({
  annoucement,
  announcementId,
  setAnnoucementId,
}) => {
  const { facultyId, departmentId, classId } = useParams();

  const refToPrint = useRef<HTMLDivElement | null>(null);
  const printListGrades = useReactToPrint({
    contentRef: refToPrint,
    documentTitle: `${annoucement.class_year.acronym}-${
      annoucement.departement.name
    }-${getSessionText(annoucement.session)}-${getMomentText(
      annoucement.moment
    )}`,
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
      getResultPresentation({
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
      {/* <PrintableListGrades
        ref={refToPrint}
        annoucement={annoucement}
        data={data}
      /> */}
    </Drawer>
  );
};
