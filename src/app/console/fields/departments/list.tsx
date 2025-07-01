"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { Department, Faculty, Teacher } from "@/types";
import { getAllTeachers, getDepartments, getFaculties } from "@/lib/api";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PrinterOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Button, Dropdown, Input, Space, Table } from "antd";
import { FC, useState } from "react";
import { EditDepartmentForm } from "./forms/edit";
import { DeleteDepartmentForm } from "./forms/delete";
import { NewDepartmentForm } from "./forms/new";
import { ListDepartmentMembers } from "./list-members";
import { useRouter } from "next/navigation";

type ActionsBarProps = {
  record: Department;
  faculties?: Faculty[];
  teachers?: Teacher[];
};

const ActionsBar: FC<ActionsBarProps> = ({ record, faculties, teachers }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const router =useRouter()
  return (
    <Space size="middle">
      <Button
        color="primary"
        variant="dashed"
        title="Gérer le département"
        onClick={() => {router.push(`/app/department/${record.id}`)}}
        style={{ boxShadow: "none" }}
      >
        Gérer
      </Button>
      <EditDepartmentForm
        department={record}
        faculties={faculties}
        teachers={teachers}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <DeleteDepartmentForm
        department={record}
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

export function ListDepartments() {
  const {
    data: departments,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const { data: faculties } = useQuery({
    queryKey: ["faculties"],
    queryFn: getFaculties,
  });

  const {
    data: teachers,
    isPending: isPendinfTeachers,
    isError: isErrorTeachers,
  } = useQuery({
    queryKey: ["all_teachers"],
    queryFn: getAllTeachers,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (isPending || isPendinfTeachers) {
    return <DataFetchPendingSkeleton variant="table" />;
  }

  if (isError || isErrorTeachers) {
    return <DataFetchErrorResult />;
  }
  return (
    <Table
      loading={isPending}
      title={() => (
        <header className="flex pb-3">
          <Space>
            <Input.Search placeholder="Rechercher un département ..." />
          </Space>
          <div className="flex-1" />
          <Space>
            <NewDepartmentForm faculties={faculties} teachers={teachers} />
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
          title: "Nom du département",
        },
        {
          key: "acronym",
          dataIndex: "acronym",
          title: "Code",
          width: 100,
        },
        {
          key: "faculty",
          dataIndex: "faculty",
          title: "Faculté",
          render: (_, record, __) => `${record.faculty.name}`,
          ellipsis: true,
        },
        {
          key: "members",
          dataIndex: "members",
          title: "Membres",
          ellipsis: true,
          render: (_, record) => (
            <Space size={1}>
              <Avatar icon={<TeamOutlined />} />
              <ListDepartmentMembers department={record} />
            </Space>
          ),
        },
        {
          key: "actions",
          dataIndex: "actions",
          render: (_, record, __) => {
            return (
              <ActionsBar
                record={record}
                faculties={faculties}
                teachers={teachers}
              />
            );
          },
          width: 132,
        },
      ]}
      dataSource={departments}
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
