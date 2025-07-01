"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { Course, Faculty } from "@/types";
import {
  getCourseTypeName,
  getCouses,
  getCurrentFacultiesAsOptions,
  getFaculties,
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
import { Button, Dropdown, Input, Select, Space, Table, Tag } from "antd";
import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";
import { DeleteCourseForm } from "../../faculty/[facultyId]/courses/forms/delete";
import { NewCourseForm } from "../../faculty/[facultyId]/courses/forms/new";
import { EditCourseForm } from "../../faculty/[facultyId]/courses/forms/edit";

type ActionsBarProps = {
  record: Course;
  faculties?: Faculty[];
};

const ActionsBar: FC<ActionsBarProps> = ({ record, faculties }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space size="middle">
      <EditCourseForm
        course={record}
        faculties={faculties}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <DeleteCourseForm
        course={record}
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

export const ListCourses = () => {
  const { facultyId } = useParams();
  const {
    data: courses,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: getCouses,
  });
  const router = useRouter();
  const { data: faculties } = useQuery({
    queryKey: ["faculties"],
    queryFn: getFaculties,
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
            <Input.Search placeholder="Rechercher un cours ..." />
            <Select
              placeholder="Faculté"
              options={getCurrentFacultiesAsOptions(faculties)}
              style={{ width: 200 }}
              onSelect={(value) => {
                router.push(`/console/courses/${value}`);
              }}
              defaultValue={Number(facultyId)}
            />
          </Space>
          <div className="flex-1" />
          <Space>
            <NewCourseForm faculties={faculties} />
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
          title: "Nom du cours",
        },
        {
          key: "code",
          dataIndex: "code",
          title: "Code",
        },
        {
          key: "faculties",
          dataIndex: "faculties",
          title: "Facultés",
          render: (_, record, __) =>
            record.faculties.map((fac) => (
              <Tag key={fac.id} style={{ border: 0 }}>
                {fac.acronym}
              </Tag>
            )),
          ellipsis: true,
        },
        {
          key: "course_type",
          dataIndex: "course_type",
          title: "Nature",
          render: (_, record, __) => getCourseTypeName(record.course_type),
        },
        {
          key: "actions",
          dataIndex: "actions",
          render: (_, record, __) => {
            return <ActionsBar record={record} faculties={faculties} />;
          },
          width: 50,
        },
      ]}
      dataSource={courses}
      rowKey="id"
      rowClassName={`bg-[#f5f5f5] odd:bg-white`}
      rowSelection={{
        type: "checkbox",
      }}
      size="small"
      pagination={{
        defaultPageSize: 10,
        pageSizeOptions: [10, 25, 50],
        size: "small",
      }}
      bordered={false}
    />
  );
};
