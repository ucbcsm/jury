"use client";
import { getHSLColor } from "@/lib/utils";
import { PeriodEnrollment } from "@/types";
import {
  CheckOutlined,
  CloseOutlined,
  DownOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  HourglassOutlined,
  MoreOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Space,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { PendingSinglePeriodEnrollmentForm } from "./forms/decisions/pending";
import { ValidateSignlePeriodEnllmentForm } from "./forms/decisions/validate";
import { RejectSinglePeriodEnrollmentForm } from "./forms/decisions/reject";

type ActionsBarProps = {
  item: PeriodEnrollment;
};
const ActionsBar: FC<ActionsBarProps> = ({ item }) => {
  const router = useRouter();
  const {
    token: { colorSuccessActive, colorWarningActive },
  } = theme.useToken();
  const [openPending, setOpenPending] = useState<boolean>(false);
  const [openReject, setOpenReject] = useState<boolean>(false);
  const [openValidate, setOpenValidate] = useState<boolean>(false);

  return (
    <>
      <PendingSinglePeriodEnrollmentForm
        open={openPending}
        setOpen={setOpenPending}
        enrollment={item}
      />
      <ValidateSignlePeriodEnllmentForm
        open={openValidate}
        setOpen={setOpenValidate}
        enrollment={item}
      />
      <RejectSinglePeriodEnrollmentForm
        open={openReject}
        setOpen={setOpenReject}
        enrollment={item}
      />

      <Space>
        <Button
          color="primary"
          variant="dashed"
          style={{ boxShadow: "none" }}
          onClick={() => router.push(`/app/student/${item.year_enrollment.id}`)}
        >
          Gérer
        </Button>
        <Dropdown
          menu={{
            items: [
              item.status === "pending" || item.status === "rejected"
                ? {
                    key: "validate",
                    label: "Accepter",
                    icon: (
                      <CheckOutlined style={{ color: colorSuccessActive }} />
                    ),
                  }
                : null,
              item.status === "validated" || item.status === "rejected"
                ? {
                    key: "pending",
                    label: "Marquer en attente",
                    icon: (
                      <HourglassOutlined
                        style={{ color: colorWarningActive }}
                      />
                    ),
                  }
                : null,
              item.status === "pending" || item.status === "validated"
                ? {
                    key: "reject",
                    label: "Rejeter",
                    icon: <CloseOutlined />,
                    danger: true,
                  }
                : null,
            ],
            onClick: ({ key }) => {
              if (key === "pending") {
                setOpenPending(true);
              } else if (key === "reject") {
                setOpenReject(true);
              } else if (key === "validate") {
                setOpenValidate(true);
              }
            },
          }}
        >
          <Button icon={<MoreOutlined />} type="text" />
        </Dropdown>
      </Space>
    </>
  );
};

type ListPeriodStudentsValidatedProps = {
  periodEnrollments?: PeriodEnrollment[];
};

export const ListPeriodValidatedStudents: FC<
  ListPeriodStudentsValidatedProps
> = ({ periodEnrollments }) => {
  const router = useRouter();
  return (
    <Table
      title={() => (
        <header className="flex pb-3">
          <Space>
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Validées
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Input.Search placeholder="Rechercher un étudiant ..." />
            <Button icon={<PrinterOutlined />} style={{ boxShadow: "none" }}>
              Imprimer
            </Button>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "pdf",
                    label: "PDF",
                    icon: <FilePdfOutlined />,
                    title: "Exporter en pdf",
                  },
                  {
                    key: "excel",
                    label: "EXCEL",
                    icon: <FileExcelOutlined />,
                    title: "Exporter vers Excel",
                  },
                ],
              }}
            >
              <Button icon={<DownOutlined />} style={{ boxShadow: "none" }}>
                Exporter
              </Button>
            </Dropdown>
          </Space>
        </header>
      )}
      dataSource={periodEnrollments}
      columns={[
        {
          title: "Photo",
          dataIndex: "avatar",
          key: "avatar",
          render: (_, record) => (
            <Avatar
              src={record.year_enrollment.user.avatar || null}
              style={{
                backgroundColor: getHSLColor(
                  `${record.year_enrollment.user.first_name} ${record.year_enrollment.user.last_name} ${record.year_enrollment.user.surname}`
                ),
              }}
            >
              {record.year_enrollment.user.first_name?.charAt(0).toUpperCase()}
              {record.year_enrollment.user.last_name?.charAt(0).toUpperCase()}
            </Avatar>
          ),
          width: 56,
        },
        {
          title: "Matricule",
          dataIndex: "matricule",
          key: "matricule",
          render: (_, record) => (
            <Link href={`/app/student/${record.year_enrollment.id}`}>
              {record.year_enrollment.user.matricule.padStart(6, "0")}
            </Link>
          ),
          width: 80,
          align: "center",
        },
        {
          title: "Noms",
          dataIndex: "name",
          key: "name",
          render: (_, record) => (
            <Link href={`/app/student/${record.year_enrollment.id}`}>
              {record.year_enrollment.user.first_name}{" "}
              {record.year_enrollment.user.last_name}{" "}
              {record.year_enrollment.user.surname}
            </Link>
          ),
        },
        {
          title: "Promotion",
          dataIndex: "promotion",
          render: (_, record, __) =>
            `${record.year_enrollment.class_year.acronym}`,
          key: "class",
          width: 86,
          ellipsis: true,
        },
        {
          title: "Département",
          dataIndex: "department",
          key: "department",
          render: (_, record, __) =>
            `${record.year_enrollment.departement.name}`,
          ellipsis: true,
        },
        {
          title: "Statut",
          dataIndex: "status",
          key: "status",
          width: 96,
          render: (_, record, __) => (
            <Tag
              bordered={false}
              color={
                record?.year_enrollment.status === "enabled" ? "success" : "red"
              }
              className="w-full mr-0"
            >
              {record?.year_enrollment?.status === "enabled"
                ? "Actif"
                : "Abandon"}
            </Tag>
          ),
          align: "start",
        },
        {
          title: "Actions",
          key: "actions",
          render: (_, record, __) => <ActionsBar item={record} />,
          width: 120,
        },
      ]}
      rowKey="id"
      rowClassName={`bg-[#f5f5f5] odd:bg-white`}
      rowSelection={{
        type: "checkbox",
      }}
      size="small"
      pagination={{
        defaultPageSize: 25,
        pageSizeOptions: [25, 50, 75, 100],
        size: "small",
      }}
    />
  );
};
