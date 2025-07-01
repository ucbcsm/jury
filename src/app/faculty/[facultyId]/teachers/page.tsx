"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { useYid } from "@/hooks/use-yid";
import { getTeachersByFaculty } from "@/lib/api";
import { getHSLColor } from "@/lib/utils";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PlusOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Input,
  Row,
  Space,
  Table,
  Tag,
} from "antd";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ListStaffOfficer } from "./staff";

export default function Page() {
  const { facultyId } = useParams();
  const router = useRouter();
  const { data, isPending, isError } = useQuery({
    queryKey: ["teachers", facultyId],
    queryFn: ({ queryKey }) => getTeachersByFaculty(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  if (isPending) {
    return <DataFetchPendingSkeleton variant="table" />;
  }

  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <Table
      title={() => (
        <header className="flex pb-3">
          <Space>
            <Input.Search placeholder="Rechercher un enseignant ..." />
          </Space>
          <div className="flex-1" />
          <Space>
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
      dataSource={data}
      columns={[
        {
          title: "Photo",
          dataIndex: "avatar",
          key: "avatar",
          render: (_, record, __) => (
            <Avatar
              style={{
                backgroundColor: getHSLColor(
                  `${record.user.first_name} ${record.user.last_name} ${record.user.surname}`
                ),
              }}
            >
              {record.user.first_name?.charAt(0).toUpperCase()}
              {record.user.last_name?.charAt(0).toUpperCase()}
            </Avatar>
          ),

          width: 58,
        },
        {
          title: "Matricule",
          dataIndex: "matricule",
          key: "matricule",
          width: 92,
          render: (_, record, __) => (
            <Link href={`/app/teacher/${record.id}`}>
              {record.user.matricule.padStart(6, "0")}
            </Link>
          ),
          align: "center",
        },
        {
          title: "Noms",
          dataIndex: "lastname",
          key: "name",
          render: (_, record, __) => (
            <Link href={`/app/teacher/${record.id}`}>
              {record.user.first_name} {record.user.last_name}{" "}
              {record.user.surname}
            </Link>
          ),
          ellipsis: true,
        },
        {
          title: "Sexe",
          dataIndex: "gender",
          key: "gender",
          width: 58,
          render: (value) => value,
          align: "center",
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
          render: (_, record, __) => record.user.email || "",
          ellipsis: true,
        },
        {
          title: "Téléphone",
          dataIndex: "phone_number_1",
          key: "phone_number_1",
          render: (value) => `${value}`,
          ellipsis: true,
        },
        {
          title: "Catégorie",
          dataIndex: "category",
          key: "category",
          render: (_, record, __) =>
            record.user.is_permanent_teacher ? "Permanent" : "Visiteur",
          ellipsis: true,
        },

        {
          title: "Statut",
          dataIndex: "status",
          key: "status",
          render: (_, record, __) => (
            <Tag
              color={record.user.is_active ? "green" : "red"}
              style={{ border: 0, width: "100%" }}
            >
              {record.user.is_active ? "Actif" : "Inactif"}
            </Tag>
          ),
          width: 80,
        },
        {
          key: "actions",
          title: "Actions",
          dataIndex: "actions",
          width: 120,
          render: (_, record, __) => (
            <Space>
              <Button
                type="dashed"
                onClick={() => router.push(`/app/teacher/${record.id}`)}
                style={{ boxShadow: "none" }}
              >
                Gérer
              </Button>
              <Dropdown
                menu={{
                  items: [
                    // {
                    //   key: "edit",
                    //   label: "Modifier",
                    //   icon: <EditOutlined />,
                    // },
                    // {
                    //   key: "delete",
                    //   label: "Supprimer",
                    //   danger: true,
                    //   icon: <DeleteOutlined />,
                    // },
                  ],
                }}
              >
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown>
            </Space>
          ),
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
}
