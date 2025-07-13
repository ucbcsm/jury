"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { useYid } from "@/hooks/use-yid";
import { getYearEnrollmentsByDepatmentId } from "@/lib/api";
import { getHSLColor } from "@/lib/utils";
import {
  AppstoreOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PrinterOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Radio,
  Space,
  Table,
  Tag,
} from "antd";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const { departmentId } = useParams();
  const { yid } = useYid();
  const { data, isPending, isError } = useQuery({
    queryKey: ["year_enrollments", `${yid}`, departmentId],
    queryFn: ({ queryKey }) =>
      getYearEnrollmentsByDepatmentId(Number(queryKey[1]), Number(queryKey[2])),
    enabled: !!yid && !!departmentId,
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
            <Input.Search placeholder="Rechercher un étudiant ..." />
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
            <Radio.Group>
              <Radio.Button value="grid">
                <AppstoreOutlined />
              </Radio.Button>
              <Radio.Button value="list">
                <UnorderedListOutlined />
              </Radio.Button>
            </Radio.Group>
          </Space>
        </header>
      )}
      dataSource={data}
      columns={[
        {
          title: "Photo",
          dataIndex: "avatar",
          key: "avatar",
          render: (_, record) => (
            <Avatar
              src={record.user.avatar || null}
              style={{
                backgroundColor: getHSLColor(
                  `${record.user.first_name} ${record.user.last_name} ${record.user.surname}`
                ),
              }}
            >
              {record?.user.first_name?.charAt(0).toUpperCase()}
              {record?.user.last_name?.charAt(0).toUpperCase()}
            </Avatar>
          ),
          width: 56,
        },
        {
          title: "Matricule",
          dataIndex: "matricule",
          key: "matricule",
          render: (_, record) => (
            <Link href={`/app/student/${record.id}`}>
              {record.user.matricule.padStart(6, "0")}
            </Link>
          ),
          width: 80,
          align: "center",
        },
        {
          title: "Noms",
          dataIndex: "name",
          key: "name",
          render: (value, record) => (
            <Link href={`/app/student/${record.id}`}>
              {record.user.first_name} {record.user.last_name}{" "}
              {record.user.surname}
            </Link>
          ),
        },
        {
          title: "Promotion",
          dataIndex: "promotion",
          render: (_, record, __) => `${record.class_year.acronym}`,
          key: "class",
          width: 86,
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
              color={record.status === "enabled" ? "success" : "red"}
              className="w-full mr-0"
            >
              {record.status === "enabled" ? "Actif" : "Abandon"}
            </Tag>
          ),
          align: "start",
        },
        {
          title: "Actions",
          key: "actions",
          render: (_, record, __) => (
            <Space>
              <Button
                color="primary"
                variant="dashed"
                onClick={() => router.push(`/app/student/${record.id}`)}
                style={{ boxShadow: "none" }}
              >
                Gérer
              </Button>
              <Dropdown
                menu={{
                  items: [
                    { key: "1", label: "Action 1" },
                    { key: "2", label: "Action 2" },
                    { key: "3", label: "Action 3" },
                  ],
                }}
              >
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown>
            </Space>
          ),
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
}
