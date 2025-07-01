"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { Cycle, Field } from "@/types";
import { getCycles, getFields } from "@/lib/api";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Dropdown, Input, Space, Table } from "antd";
import { FC, useState } from "react";
import { EditFieldForm } from "./forms/edit";
import { DeleteFieldForm } from "./forms/delete";
import { NewFieldForm } from "./forms/new";

type ActionsBarProps = {
  record: Field;
  cycles?: Cycle[];
};

const ActionsBar: FC<ActionsBarProps> = ({ record, cycles }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space size="middle">
      <EditFieldForm
        field={record}
        cycles={cycles}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <DeleteFieldForm
        field={record}
        open={openDelete}
        setOpen={setOpenDelete}
      />
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
        <Button type="text" icon={<MoreOutlined />} />
      </Dropdown>
    </Space>
  );
};

export function ListFields() {
  const {
    data: fields,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["fields"],
    queryFn: getFields,
  });

  const { data: cycles } = useQuery({
    queryKey: ["cycles"],
    queryFn: getCycles,
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
        <header className="flex pb-3">
          <Space>
            <Input.Search placeholder="Rechercher un domaine ..." />
          </Space>
          <div className="flex-1" />
          <Space>
            <NewFieldForm cycles={cycles} />
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
                    title: "Exporter vers excel",
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
          title: "Nom du domaine",
        },
        {
          key: "acronym",
          dataIndex: "acronym",
          title: "Code",
          width: 100,
        },
        {
          key: "cycle",
          dataIndex: "cycle",
          title: "Cycle",
          render: (_, record, __) => record.cycle?.name || "",
        },
        {
          key: "actions",
          dataIndex: "actions",
          render: (_, record, __) => {
            return <ActionsBar record={record} cycles={cycles} />;
          },
          width: 50,
        },
      ]}
      dataSource={fields}
      rowKey="id"
      rowClassName={`bg-[#f5f5f5] odd:bg-white`}
      // rowSelection={{
      //   type: "checkbox",
      // }}
      size="small"
      pagination={{
        defaultPageSize: 10,
        pageSizeOptions: [10, 25, 50],
        size: "small",
      }}
      bordered={false}
    />
  );
}
