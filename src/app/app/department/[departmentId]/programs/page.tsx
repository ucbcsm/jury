"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import {
  getCoursesByFacultyId,
  getDepartment,
  getDepartmentPrograms,
} from "@/lib/api";
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
import { Button, Dropdown, Input, Space, Table } from "antd";
import { useParams, useRouter } from "next/navigation";
import { NewDepartmentProgramForm } from "./forms/new";
import { FC, useState } from "react";
import { Course, DepartmentProgram } from "@/types";
import { DeleteDepartmentProgramForm } from "./forms/delete";
import { EditDepartmentProgramForm } from "./forms/edit";

type ActionsBarProps = {
  record: DepartmentProgram;
  courses?: Course[];
};

const ActionsBar: FC<ActionsBarProps> = ({ record, courses }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space size="middle">
      <EditDepartmentProgramForm
        departmentProgram={record}
        courses={courses}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <DeleteDepartmentProgramForm
        departmentProgram={record}
        open={openDelete}
        setOpen={setOpenDelete}
      />
      <Button
        type="dashed"
        style={{ boxShadow: "none" }}
        onClick={() => setOpenEdit(true)}
      >
        Gérer
      </Button>
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

export default function Page() {
  const { departmentId } = useParams();

  const { data, isPending, isError } = useQuery({
    queryKey: ["programs", departmentId],
    queryFn: ({ queryKey }) => getDepartmentPrograms(Number(queryKey[1])),
    enabled: !!departmentId,
  });

  const { data: department } = useQuery({
    queryKey: ["department", departmentId],
    queryFn: ({ queryKey }) => getDepartment(Number(queryKey[1])),
    enabled: !!departmentId,
  });

  const { data: courses } = useQuery({
    queryKey: ["courses", `${department?.faculty.id}`],
    queryFn: ({ queryKey }) => getCoursesByFacultyId(Number(queryKey[1])),
    enabled: !!department?.faculty.id,
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
            <Input.Search placeholder="Rechercher un programme ..." />
          </Space>
          <div className="flex-1" />
          <Space>
            <NewDepartmentProgramForm courses={courses} />
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
          title: "Nom du programme",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Crédits",
          dataIndex: "credit_count",
          key: "credit_count",
          render: (_, record, __) => `${record.credit_count || ""} `,
          width: 62,
        },
        {
          title: "Durée",
          dataIndex: "duration",
          key: "duration",
          render: (_, record, __) =>
            record.duration ? `${record.duration}H` : "",
          width: 58,
        },
        {
          title: "Cours",
          dataIndex: "courses",
          key: "courses",
          render: (_, record) =>
            record.courses_of_program.length > 0
              ? record.courses_of_program.length
              : "",
          width: 54,
          align: "start",
        },
        {
          title: "Description",
          dataIndex: "description",
          key: "description",
          ellipsis: true,
        },
        {
          title: "Actions",
          key: "actions",
          render: (_, record) => (
            <ActionsBar record={record} courses={courses} />
          ),
          width: 132,
        },
      ]}
      rowKey="key"
      rowClassName={`bg-[#f5f5f5] odd:bg-white`}
      size="small"
      rowSelection={{
        type: "checkbox",
      }}
      pagination={{
        defaultPageSize: 25,
        pageSizeOptions: [25, 50, 75, 100],
        size: "small",
      }}
    />
  );
}
