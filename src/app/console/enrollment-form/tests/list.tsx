"use client";
import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { getFaculties, getTestCourses, updateTestCourse } from "@/lib/api";
import { Faculty, TestCourse } from "@/types";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Dropdown,
  Input,
  message,
  Select,
  Space,
  Switch,
  Table,
} from "antd";
import { FC, useState } from "react";
import { DeleteTestCourseForm } from "./forms/delete";
import { EditTestCourseForm } from "./forms/edit";
import { NewTestCourseForm } from "./forms/new";

type ActionsBarProps = {
  record: TestCourse;
  faculties?: Faculty[];
};

const ActionsBar: FC<ActionsBarProps> = ({ record, faculties }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space size="middle">
      <EditTestCourseForm
        testCourse={record}
        faculties={faculties}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <DeleteTestCourseForm
        testCourse={record}
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

type SwitchVisibilityProps = {
  record: TestCourse;
};
const SwitchVisibility: FC<SwitchVisibilityProps> = ({ record }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateTestCourse,
  });
  return (
    <>
      {contextHolder}
      <Switch
        loading={isPending}
        checked={record.enabled}
        onChange={(checked) => {
          mutateAsync(
            {
              id: record.id,
              params: {
                enabled: checked,
                name: record.name,
                faculty_id: record.faculty.id,
                description: record.description,
                max_value: record.max_value,
              },
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: ["test_courses"],
                });
                messageApi.success("Cours modifié avec succès !");
              },
              onError: () => {
                messageApi.error(
                  "Une erreur s'est produite lors de la modification du cours."
                );
              },
            }
          );
        }}
      />
    </>
  );
};

export function ListTestCourses() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["test_courses"],
    queryFn: getTestCourses,
  });

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
        <header className="flex  pb-3">
          <Space>
            <Input.Search placeholder="Rechercher ..." />
            <Select placeholder="Faculté" showSearch />
          </Space>
          <div className="flex-1" />
          <Space>
            <NewTestCourseForm faculties={faculties} />
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
          title: "Matière",
        },
        {
          title: "Max",
          dataIndex: "max_value",
          key: "max_value",
          width: 44,
          align: "end",
        },
        {
          title: "Faculté",
          dataIndex: "faculty",
          key: "faculty",
          render: (_, record, __) => `${record.faculty.name}`,
          ellipsis: true,
        },
        {
          title: "Description",
          dataIndex: "description",
          key: "description",
          ellipsis: true,
        },

        {
          title: "Visible",
          dataIndex: "enabled",
          key: "enabled",
          width: 64,
          render: (_, record, __) => <SwitchVisibility record={record} />,
        },
        {
          key: "actions",
          render: (_, record, __) => (
            <ActionsBar record={record} faculties={faculties} />
          ),
          width: 50,
        },
      ]}
      dataSource={data}
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
      // onRow={(record) => ({
      //   onClick: () => {
      //     router.push(`/app/students/${record.id}`); // Navigate to the student details page
      //   },
      // })}
    />
  );
}
