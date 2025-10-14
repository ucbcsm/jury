"use client";

import { getDecisionText, getMomentText, getSessionText } from "@/lib/api";
import { Announcement, Jury } from "@/types";
import { CloseOutlined, PrinterOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Descriptions,
  Divider,
  Drawer,
  Empty,
  Result,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import { Options } from "nuqs";

import React, { FC, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { getDeliberationMinutes } from "@/lib/api/deliberation-minutes";
import { PrintableDeliberationMinutes } from "./printable/printDeliberationMinutes";

type PeriodDeliberationMinutesProps = {
  annoucement: Announcement;
  announcementId: number | null;
  setAnnoucementId: (
    value: number | ((old: number | null) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
  jury?: Jury;
};

export const PeriodDeliberationMinutes: FC<PeriodDeliberationMinutesProps> = ({
  annoucement,
  announcementId,
  setAnnoucementId,
  jury,
}) => {
  const { facultyId, departmentId, classId } = useParams();

  const refToPrint = useRef<HTMLDivElement | null>(null);
  const printDeliberationMinutes = useReactToPrint({
    contentRef: refToPrint,
    documentTitle: `PV-${annoucement.period.acronym}-${
      annoucement.academic_year.name
    }-${annoucement.class_year.acronym}-${
      annoucement.departement.acronym
    }-${getSessionText(annoucement.session).replace(" ", "-")}-${getMomentText(
      annoucement.moment
    ).replace(" ", "-")}`,
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: [
      "period-deliberation-minutes",
      annoucement.academic_year.id,
      facultyId,
      departmentId,
      classId,
      annoucement.period.id,
      annoucement.session,
      annoucement.moment,
    ],
    queryFn: () =>
      getDeliberationMinutes({
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
            Procès-verbal de délibération :
          </Typography.Title>
          <Typography.Title level={5} style={{ marginBottom: 0 }} ellipsis={{}}>
            {annoucement.class_year.acronym} {annoucement.departement.name}
          </Typography.Title>
        </Space>
      }
      styles={
        {
          // body: { padding: 0 },
        }
      }
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
            onClick={printDeliberationMinutes}
            disabled={isPending || data === undefined}
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
      {data && (
        <div className=" max-w-3xl mx-auto">
          <Descriptions
            title="Statistiques générales"
            column={3}
            bordered
            size="small"
            items={[
              {
                key: "total_class_announced",
                label: "Ont participé aux épreuves",
                children: data?.general_statistics.total_class_announced || 0,
              },
              {
                key: "male_count",
                label: data?.general_statistics.male_count || 0,
                children: "Hommes",
              },
              {
                key: "female_count",
                label: data?.general_statistics.female_count || 0,
                children: "Femmes",
              },
            ]}
          />

          <Descriptions
            style={{ marginTop: 16 }}
            column={1}
            bordered
            size="small"
            items={[
              {
                key: "passed_count",
                label: "Ont été admis",
                children: data?.general_statistics.passed_count || 0,
              },
              {
                key: "postponed_count",
                label: "Ont été ajournés",
                children: data?.general_statistics.postponed_count || 0,
              },
            ]}
          />

          {Object.keys(data?.body).map((key) => {
            const keyTyped = key as
              | keyof typeof data.body
              | keyof typeof data.grade_statistics;

            return (
              <Table
                key={key}
                title={() => (
                  <header className="flex justify-between">
                    <Space>
                      <Typography.Title level={5} style={{ marginBottom: 0 }}>
                        {data.body[keyTyped].title}
                      </Typography.Title>
                    </Space>
                    <Space>
                      <Typography.Title
                        type="secondary"
                        level={5}
                        style={{ marginBottom: 0 }}
                      >
                        {data.grade_statistics[keyTyped].count}
                      </Typography.Title>
                    </Space>
                  </header>
                )}
                dataSource={data.body[keyTyped].student_list}
                bordered
                size="small"
                pagination={false}
                style={{ marginTop: 28 }}
                rowKey="id"
                columns={[
                  {
                    key: "number",
                    render: (_, __, index) => index + 1,
                    width: 36,
                    align: "right",
                  },
                  {
                    key: "matricule",
                    dataIndex: "matricule",
                    title: "Matricule",
                    width: 80,
                  },
                  {
                    key: "gender",
                    dataIndex: "gender",
                    title: "Genre",
                    width: 60,
                    align: "center",
                  },
                  {
                    key: "names",
                    title: `Noms`,
                    render: (_, record) =>
                      `${record.surname} ${record.first_name} ${record.last_name}`,
                  },
                  {
                    key: "percentage",
                    dataIndex: "percentage",
                    title: "Pourcentage",
                    width: 100,
                  },
                  {
                    key: "grade",
                    dataIndex: "grade",
                    title: "Grade",
                    width: 60,
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
                        color={
                          record.decision === "passed" ? "success" : "error"
                        }
                        bordered={false}
                        style={{
                          marginRight: 0,
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        {getDecisionText(record.decision)}
                      </Tag>
                    ),
                  },
                ]}
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={`Aucun étudiant`}
                    />
                  ),
                }}
              />
            );
          })}

          <Descriptions
            title="Conclusion"
            style={{ marginTop: 28 }}
            column={1}
            bordered
            size="small"
            items={[
              {
                key: "passed_count",
                label: "Ainsi, ont été admis",
                children: data?.general_statistics.passed_count || 0,
              },
              {
                key: "postponed_count",
                label: "Ont été ajournés",
                children: data?.general_statistics.postponed_count || 0,
              },
            ]}
          />
          <Divider />
          <Typography.Title level={5} style={{ marginBottom: 16 }}>
            Membres du jury
          </Typography.Title>
          <Table
            dataSource={jury?.members}
            size="small"
            bordered
            columns={[
              {
                key: "number",
                render: (_, __, index) => index + 1,
                width: 36,
              },
              {
                key: "name",
                title: "Noms",
                render: (_, record) =>
                  `${record?.user.surname} ${record?.user?.first_name} ${record?.user?.last_name}`,
              },
            ]}
            pagination={false}
            rowKey="id"
          />
          <Descriptions
            title="Secrétaire du jury"
            column={2}
            bordered
            style={{ marginTop: 16 }}
            size="small"
            items={[
              {
                key: "chairperson",
                label: "Noms",
                children: `${jury?.secretary.user.surname} ${jury?.secretary.user.first_name} ${jury?.secretary.user.last_name}`,
              },
              {
                key: "signature",
                label: "Signature",
                children: "                             ",
              },
            ]}
          />
          <Descriptions
            title="Président du jury"
            style={{ marginTop: 16 }}
            column={2}
            bordered
            size="small"
            items={[
              {
                key: "chairperson",
                label: "Noms",
                children: `${jury?.chairperson.user.surname} ${jury?.chairperson.user.first_name} ${jury?.chairperson.user.last_name}`,
              },
              {
                key: "signature",
                label: "Signature",
                children: "                             ",
              },
            ]}
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
      <PrintableDeliberationMinutes
        ref={refToPrint}
        annoucement={annoucement}
        data={data}
        jury={jury}
      />
    </Drawer>
  );
};
