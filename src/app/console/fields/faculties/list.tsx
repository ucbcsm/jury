"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { Faculty, Field, Teacher } from "@/types";
import { getAllTeachers, getFaculties, getFields } from "@/lib/api";
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
import { EditFacultyForm } from "./forms/edit";
import { DeleteFacultyForm } from "./forms/delete";
import { NewFacultyForm } from "./forms/new";
import { ListFacultyMembers } from "./list-members";
import { useRouter } from "next/navigation";

type ActionsBarProps = {
  record: Faculty;
  fields?: Field[];
  teachers?: Teacher[];
};

const ActionsBar: FC<ActionsBarProps> = ({ record, fields, teachers }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const router =useRouter()

  return (
    <Space size="middle">
      <Button
        color="primary"
        variant="dashed"
        title="Gérer la faculté"
        onClick={() => {router.push(`/app/faculty/${record.id}`)}}
        style={{ boxShadow: "none" }}
      >
        Gérer
      </Button>
      <EditFacultyForm
        faculty={record}
        fields={fields}
        teachers={teachers}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <DeleteFacultyForm
        faculty={record}
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

export function ListFaculties() {
  const {
    data: faculties,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["faculties"],
    queryFn: getFaculties,
  });

  const { data: fields } = useQuery({
    queryKey: ["fields"],
    queryFn: getFields,
  });

  const {
    data: teachers,
    isPending: isPendinfTeachers,
    isError: isErrorTeachers,
  } = useQuery({
    queryKey: ["all_teachers"],
    queryFn: getAllTeachers,
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
            <Input.Search placeholder="Rechercher une faculté ..." />
          </Space>
          <div className="flex-1" />
          <Space>
            <NewFacultyForm fields={fields} teachers={teachers} />
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
          title: "Nom de la faculté",
        },
        {
          key: "acronym",
          dataIndex: "acronym",
          title: "Code",
          width: 100,
        },
        {
          key: "parentDomain",
          dataIndex: "parentDomain",
          title: "Domaine",
          render: (_, record, __) => `${record.field.name}`,
          ellipsis: true,
        },
        {
          key: "members",
          dataIndex: "members",
          title: "Membres",
          ellipsis: true,
          render: (_, record) => (
            <Space size={1}>
              <Avatar icon={<TeamOutlined />} />{" "}
              <ListFacultyMembers faculty={record} />
            </Space>
          ),
        },
        {
          key: "actions",
          dataIndex: "actions",
          render: (_, record, __) => {
            return (
              <ActionsBar record={record} fields={fields} teachers={teachers} />
            );
          },
          width: 132,
        },
      ]}
      dataSource={faculties}
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
