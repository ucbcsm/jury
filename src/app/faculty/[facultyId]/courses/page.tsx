"use client";

import { DeleteCourseForm } from "@/app/faculty/[facultyId]/courses/forms/delete";
import { EditCourseForm } from "@/app/faculty/[facultyId]/courses/forms/edit";
import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import {
  getCoursesByFacultyId,
  getCourseTypeName,
  getFaculties,
} from "@/lib/api";
import { Course, Faculty } from "@/types";
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
import {
  Button,
  Card,
  Dropdown,
  Form,
  Input,
  Layout,
  Skeleton,
  Space,
  Table,
  theme,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { NewCourseForm } from "@/app/faculty/[facultyId]/courses/forms/new";
import { Palette } from "@/components/palette";

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

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { facultyId } = useParams();
  const { data, isPending, isError } = useQuery({
    queryKey: ["courses", facultyId],
    queryFn: ({ queryKey }) => getCoursesByFacultyId(Number(queryKey[1])),
    enabled: !!facultyId,
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
    <Layout>
      <Layout.Content
        style={{
          minHeight: 280,
          padding: "0 32px 0 32px",
          background: colorBgContainer,
          overflowY: "auto",
          height: "calc(100vh - 64px)",
        }}
      >
        <Layout.Header
          style={{
            display: "flex",
            alignItems: "center",
            background: colorBgContainer,
            padding: 0,
          }}
        >
          <Space>
            {/* <BackButton /> */}
            {!isPending ? (
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                Catalogue de cours
              </Typography.Title>
            ) : (
              <Form>
                <Skeleton.Input active />
              </Form>
            )}
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card>
          <Table
            title={() => (
              <header className="flex pb-3">
                <Space>
                  <Input.Search placeholder="Rechercher un cours dans le catalogue ..." />
                </Space>
                <div className="flex-1" />
                <Space>
                  <NewCourseForm
                    faculties={faculties?.filter(
                      (fac) => fac.id === Number(facultyId)
                    )}
                  />
                  <Button
                    icon={<PrinterOutlined />}
                    style={{ boxShadow: "none" }}
                  >
                    Imprimer
                  </Button>
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "pdf",
                          label: "PDF",
                          icon: <FilePdfOutlined />,
                          title: "Exporter en PDF",
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
                    <Button
                      icon={<DownOutlined />}
                      style={{ boxShadow: "none" }}
                    >
                      Exporter
                    </Button>
                  </Dropdown>
                </Space>
              </header>
            )}
            dataSource={data}
            columns={[
              {
                title: "Titre du cours",
                dataIndex: "title",
                key: "title",
                render: (_, record, __) => record.name,
              },
              {
                title: "Code",
                dataIndex: "code",
                key: "code",
                width: 100,
              },
              {
                title: "Nature",
                dataIndex: "course_type",
                key: "type",
                render: (_, record, __) =>
                  getCourseTypeName(record.course_type),
                // width:100,
                ellipsis: true,
              },
              {
                title: "",
                key: "actions",
                render: (_, record, __) => {
                  return (
                    <ActionsBar
                      record={record}
                      faculties={faculties?.filter(
                        (fac) => fac.id === Number(facultyId)
                      )}
                    />
                  );
                },
                width: 50,
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
        </Card>
        <Layout.Footer
          style={{
            display: "flex",
            background: colorBgContainer,
            padding: "24px 0",
          }}
        >
          <Typography.Text type="secondary">
            © {new Date().getFullYear()} CI-UCBC. Tous droits réservés.
          </Typography.Text>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Footer>
      </Layout.Content>
    </Layout>
  );
}
