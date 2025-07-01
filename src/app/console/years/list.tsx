"use client";

import { Button, Dropdown, Input, Space, Table, Tag } from "antd";
import { NewYearForm } from "./forms/new";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getYears } from "@/lib/api";
import { FC, useState } from "react";
import { Year } from "@/types";
import { DeleteYearForm } from "./forms/delete";
import { EditYearForm } from "./forms/edit";
import dayjs from "dayjs";
import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";

type ActionsBarProps = {
  record: Year;
};
const ActionsBar: FC<ActionsBarProps> = ({ record }) => {
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space size="middle">
      <Button
        color="primary"
        variant="dashed"
        title="Gérer l'année académique"
        onClick={() => {
          router.push(`/console/years/${record.id}/periods`);
        }}
        style={{ boxShadow: "none" }}
      >
        Gérer
      </Button>
      <EditYearForm year={record} open={openEdit} setOpen={setOpenEdit} />
      <DeleteYearForm year={record} open={openDelete} setOpen={setOpenDelete} />
      <Dropdown
        menu={{
          items: [
            {
              key: "edit",
              label: "Modifier",
              icon: <EditOutlined />,
            },
            {
              key: "delete",
              label: "Supprimer",
              icon: <DeleteOutlined />,
              danger: true,
            },
          ],
          onClick: ({ key }) => {
            if (key === "edit") {
              setOpenEdit(true);
            } else if (key === "delete") {
              setOpenDelete(true);
            }
          },
        }}
      >
        <Button
          type="text"
          icon={<MoreOutlined />}
          title="Ajouter un membre du bureau"
        />
      </Dropdown>
    </Space>
  );
};

export const ListYears = () => {
  const {
    data: years,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["years"],
    queryFn: getYears,
  });

  if (isPending) {
    return <DataFetchPendingSkeleton variant="table" />;
  }
  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <Table
      loading={isPending}
      title={() => (
        <header className="flex  pb-3">
          <Space>
            <Input.Search placeholder="Rechercher ..." />
          </Space>
          <div className="flex-1" />
          <Space>
            <NewYearForm />
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
                    title: "Exporter ver excel",
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
      columns={[
        {
          key: "name",
          dataIndex: "name",
          title: "Nom",
          render: (_, record, __) => {
            return (
              <Link href={`/console/years/${record.id}/periods`}>
                {record.name}
              </Link>
            );
          },
        },
        {
          key: "start_date",
          dataIndex: "start_date",
          title: "Date de début",
          render: (_, record, __) =>
            dayjs(record.start_date).format("DD/MM/YYYY"),
        },
        {
          key: "end_date",
          dataIndex: "end_date",
          title: "Date de fin",
          render: (_, record, __) =>
            dayjs(record.end_date).format("DD/MM/YYYY"),
        },
        {
          key: "status",
          dataIndex: "status",
          title: "Inscriptions",
          render: (_, record, __) => {
            let color = "";
            let text = "";
            switch (record.status) {
              case "pending":
                color = "orange";
                text = "En attente";
                break;
              case "progress":
                color = "blue";
                text = "En cours";
                break;
              case "finished":
                color = "green";
                text = "Terminé";
                break;
              case "suspended":
                color = "red";
                text = "Suspendu";
                break;
              default:
                color = "default";
                text = "Inconnu";
            }
            return (
              <Tag color={color} style={{ border: 0 }}>
                {text}
              </Tag>
            );
          },
        },
        {
          key: "actions",
          dataIndex: "actions",
          title: "Actions",
          render: (_, record, __) => <ActionsBar record={record} />,
          width: 120,
        },
      ]}
      dataSource={years}
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
      bordered={false}
    />
  );
};
