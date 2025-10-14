"use client";

import { getCurrentDepartmentsAsOptions, getDepartmentsByFacultyId } from "@/lib/api";
import { getRetakeCourses, getRetakeReasonText } from "@/lib/api/retake-course";
import { RetakeCourse } from "@/types";
import { BookOutlined, CheckCircleOutlined, CloseOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Dropdown,
  Empty,
  Flex,
  Layout,
  List,
  Select,
  Space,
  Splitter,
  Table,
  Tabs,
  theme,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";
import { record } from "zod";

export default function Page() {
  const {
    token: { colorBgContainer, colorBorder },
  } = theme.useToken();
  const { facultyId } = useParams();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(0));
  const [pageSize, setPageSize] = useQueryState(
    "page_size",
    parseAsInteger.withDefault(0)
  );
  const [departmentId, setDepartmentId] = useQueryState(
    "dep",
    parseAsInteger.withDefault(0)
  );
  const [selectedRetake, setSelectedRetake] = useState<
    RetakeCourse | undefined
  >();

  const { data, isPending } = useQuery({
    queryKey: ["retake-courses", facultyId, departmentId, page, pageSize],
    queryFn: () =>
      getRetakeCourses({
        facultyId: Number(facultyId),
        departmentId: departmentId !== 0 ? departmentId : undefined,
        page: page !== 0 ? page : undefined,
        pageSize: pageSize !== 0 ? pageSize : undefined,
      }),
    enabled: !!facultyId,
  });

   const {
     data: departments,
     isPending: isPendingDepartments,
     isError: isErrorDepartments,
   } = useQuery({
     queryKey: ["departments", facultyId],
     queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
     enabled: !!facultyId,
   });

  return (
    <Splitter style={{ height: `calc(100vh - 110px)` }}>
      {/* <Splitter.Panel defaultSize={320} min={320} max="25%">
        <Flex
          style={{
            paddingLeft: 16,
            height: 64,
            borderBottom: `1px solid ${colorBorder}`,
          }}
          align="center"
        >
          <Typography.Title
            level={3}
            style={{ marginBottom: 0, textTransform: "uppercase" }}
          >
            Cours à refaire
          </Typography.Title>
        </Flex>
      </Splitter.Panel> */}
      <Splitter.Panel style={{ background: "#f5f5f5" }}>
        <Layout.Content style={{ padding: "16px 16px 0 16px" }}>
          <Table
            title={() => (
              <header className="flex justify-between ">
                <Space>
                  <Typography.Title
                    level={3}
                    style={{ marginBottom: 0 }}
                    type="secondary"
                  >
                    Étudiants et cours à reprendre
                  </Typography.Title>
                </Space>
                <Space>
                  <Select
                    prefix={
                      <Typography.Text type="secondary">
                        Mention:
                      </Typography.Text>
                    }
                    variant="filled"
                    value={departmentId}
                    onChange={(value) => {
                      setDepartmentId(value);
                    }}
                    style={{ flex: 1 }}
                    options={[
                      { value: 0, label: "Toutes" },
                      ...(getCurrentDepartmentsAsOptions(departments) || []),
                    ]}
                    loading={isPendingDepartments}
                    disabled={isPendingDepartments || isErrorDepartments}
                  />
                  <Button
                    icon={<PlusOutlined />}
                    variant="dashed"
                    color="primary"
                    style={{ boxShadow: "none" }}
                    title="Ajouter un étudiant avec un cours à reprendre"
                  >
                    Ajouter
                  </Button>
                </Space>
              </header>
            )}
            dataSource={data?.results}
            columns={[
              {
                key: "name",
                title: "Noms",
                dataIndex: "user",
                render: (_, record) =>
                  `${record.user.surname} ${record.user.first_name} ${record.user.last_name}`,
                ellipsis: true,
              },
              {
                key: "matricule",
                title: "Matricule",
                dataIndex: "matricule",
                render: (_, record) => record.user.matricule,
                width: 80,
              },
              {
                key: "department",
                dataIndex: "departement",
                title: "Mention",
                render: (_, record) => record.departement.name,
              },
              {
                key: "retake_course_list",
                dataIndex: "retake_course_list",
                title: "À refaire",
                render: (_, record) =>
                  `${record.retake_course_list.length || 0} cours`,
                width: 100,
              },
              {
                key: "retake_course_done_list",
                dataIndex: "retake_course_done_list",
                title: "Repris et acquis",
                render: (_, record) =>
                  `${record.retake_course_done_list.length || 0} cours`,
                width: 120,
              },
              {
                key: "actions",
                dataIndex: "actions",
                title: "",
                render: (_, record) => (
                  <Button
                    color="primary"
                    variant="dashed"
                    style={{ boxShadow: "none" }}
                  >
                    Voir détails
                  </Button>
                ),
                width: 120,
              },
            ]}
            size="small"
            rowClassName={(record) =>
              `bg-white odd:bg-[#f5f5f5] hover:cursor-pointer ${
                record.id === selectedRetake?.id ? "bg-green-400" : ""
              }`
            }
            rowKey="id"
            loading={isPending}
            bordered
            scroll={{ y: "calc(100vh - 271px)" }}
            pagination={{
              defaultPageSize: 25,
              pageSizeOptions: [25, 50, 75, 100],
              size: "small",
              showSizeChanger: true,
              total: data?.count,
              current: page !== 0 ? page : 1,
              pageSize: pageSize !== 0 ? pageSize : 25,
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
            onRow={(record, index) => {
              return {
                onClick: () => {
                  setSelectedRetake(record);
                },
              };
            }}
          />
        </Layout.Content>
      </Splitter.Panel>
      {selectedRetake && (
        <Splitter.Panel defaultSize={320} min={320} max="25%">
          <Flex justify="space-between" style={{ padding: "16px 16px 0 16px" }}>
            <Typography.Text
              type="secondary"
              //   style={{ textTransform: "uppercase" }}
            >
              Étudiant {selectedRetake.user.matricule}
            </Typography.Text>
            <Button
              type="text"
              size="small"
              shape="circle"
              title="Fermer"
              icon={<CloseOutlined />}
              onClick={() => {
                setSelectedRetake(undefined);
              }}
            />
          </Flex>
          <Flex justify="space-between" style={{ padding: "16px 16px 0 16px" }}>
            <Typography.Title
              level={5}
              style={{ textTransform: "uppercase" }}
            >{`${selectedRetake.user.surname} ${selectedRetake.user.first_name} ${selectedRetake.user.last_name}`}</Typography.Title>
          </Flex>
          <Tabs
            tabBarStyle={{ padding: "0 16px 0 16px" }}
            tabBarExtraContent={
              <Button
                icon={<PlusOutlined />}
                size="small"
                variant="dashed"
                color="primary"
                style={{ boxShadow: "none" }}
                title="Ajouter un cours à reprendre"
              />
            }
            items={[
              {
                key: "retake_course_list",
                label: "À refaire",
                children: (
                  <div className="px-4">
                    <List
                      dataSource={selectedRetake.retake_course_list}
                      renderItem={(item) => (
                        <List.Item
                          key={item.id}
                          extra={
                            <Dropdown
                              menu={{
                                items: [
                                  {
                                    key: "validate",
                                    label: "Marquer comme repris et validé",
                                    icon: <CheckCircleOutlined />,
                                  },
                                ],
                              }}
                            >
                              <Button type="text" icon={<MoreOutlined />} />
                            </Dropdown>
                          }
                        >
                          <List.Item.Meta
                            title={
                              <Typography.Text>
                                <BookOutlined /> {item.available_course.name}
                              </Typography.Text>
                            }
                            description={
                              <Space>
                                <Typography.Text type="secondary">
                                  Raison :
                                </Typography.Text>
                                <Typography.Text type="danger">
                                  {getRetakeReasonText(item.reason)}
                                </Typography.Text>
                              </Space>
                            }
                          />
                        </List.Item>
                      )}
                      size="small"
                      locale={{
                        emptyText: (
                          <Empty
                            description="Aucun cours"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                          />
                        ),
                      }}
                    />
                  </div>
                ),
              },
              {
                key: "retake_course_done_list",
                label: "Repris et acquis",
                children: (
                  <List
                    dataSource={selectedRetake.retake_course_done_list}
                    locale={{
                      emptyText: (
                        <Empty
                          description="Aucun cours"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      ),
                    }}
                  />
                ),
              },
            ]}
          />
        </Splitter.Panel>
      )}
    </Splitter>
  );
}
