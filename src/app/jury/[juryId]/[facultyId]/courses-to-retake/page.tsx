"use client";

import {
  getAllCourses,
  getCurrentDepartmentsAsOptions,
  getDepartmentsByFacultyId,
} from "@/lib/api";
import { getRetakeCourses, getRetakeReasonText } from "@/lib/api/retake-course";
import { RetakeCourse } from "@/types";
import {
  BookOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  MoreOutlined,
  PlusOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Dropdown,
  Empty,
  Flex,
  Input,
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
import { useEffect, useState } from "react";
import { RetakeReasonItem } from "./_components/retakeReasonItem";
import { NewRetakeReasonForm } from "./_components/newRetakeReasonForm";
import { useClasses } from "@/hooks/useClasses";
import { DeleteStudentFromRetakeForm } from "./_components/deleteStudentFromRetake";
import { NewStudentWithRetakeForm } from "./_components/newStudentWithRetake";
import { getHSLColor } from "@/lib/utils";

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

  const [search, setSearch] = useQueryState("search");

  const [selectedRetake, setSelectedRetake] = useState<
    RetakeCourse | undefined
  >();

  const { data, isPending } = useQuery({
    queryKey: [
      "retake-courses",
      facultyId,
      departmentId,
      page,
      pageSize,
      search,
    ],
    queryFn: () =>
      getRetakeCourses({
        facultyId: Number(facultyId),
        departmentId: departmentId !== 0 ? departmentId : undefined,
        page: page !== 0 ? page : undefined,
        pageSize: pageSize !== 0 ? pageSize : undefined,
        search: search !== null && search.trim() !== "" ? search : undefined,
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

  const { data: courses } = useQuery({
    queryKey: ["courses", facultyId, "all"],
    queryFn: ({ queryKey }) =>
      getAllCourses({ facultyId: Number(queryKey[1]) }),
    enabled: !!facultyId,
  });

  const {
    data: classes,
    isPending: isPendingClasses,
    isError: isErrorClasses,
  } = useClasses();

  useEffect(() => {
    if (selectedRetake && data) {
      const refreshedSelectedRetake = data.results.find(
        (retake) => retake.id === selectedRetake.id
      );
      setSelectedRetake(refreshedSelectedRetake);
    }
  }, [data]);

  return (
    <Splitter style={{ height: `calc(100vh - 110px)` }}>
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
                  <Input.Search
                    placeholder="Rechercher un étudiant ..."
                    onChange={(e) => {
                      setPage(0);
                      setSearch(e.target.value);
                    }}
                    allowClear
                    variant="filled"
                  />
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

                  <NewStudentWithRetakeForm
                    courses={courses}
                    classes={classes}
                  />
                </Space>
              </header>
            )}
            dataSource={data?.results}
            columns={[
              {
                key: "avatar",
                title: "Photo",
                dataIndex: "user",
                render: (_, record) => (
                  <Avatar
                    src={record.user.avatar}
                    style={{
                      backgroundColor: getHSLColor(
                        `${record.user.surname} ${record.user.last_name} ${record.user.first_name}`
                      ),
                    }}
                  >
                    {record.user.first_name?.charAt(0).toUpperCase()}
                  </Avatar>
                ),
                width: 56,
                align: "center",
              },
              {
                key: "name",
                title: "Noms",
                dataIndex: "user",
                render: (_, record) =>
                  `${record.user.surname} ${record.user.last_name} ${record.user.first_name}`,
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
                  <Space>
                    <Button
                      color="primary"
                      variant="dashed"
                      style={{ boxShadow: "none" }}
                    >
                      Voir détails
                    </Button>
                    <DeleteStudentFromRetakeForm studentWithRetake={record} />
                  </Space>
                ),
                width: 158,
              },
            ]}
            size="small"
            rowClassName={(record) =>
              `${
                record.id === selectedRetake?.id
                  ? "bg-green-100"
                  : "bg-white odd:bg-[#f5f5f5] hover:cursor-pointer"
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
            // tabBarExtraContent={

            // }
            items={[
              {
                key: "retake_course_list",
                label: "Cours à reprendre",
                children: (
                  <div className="px-4">
                    <List
                      header={
                        <header className="flex justify-between ">
                          <Typography.Title
                            level={5}
                            style={{ marginBottom: 0 }}
                            type="secondary"
                          >
                            {selectedRetake.retake_course_list.length} cours
                          </Typography.Title>
                          <NewRetakeReasonForm
                            type="not_done"
                            courses={courses}
                            staticData={{
                              userRetakeId: selectedRetake.id,
                              userId: selectedRetake.user.id,
                              matricule: selectedRetake.user.matricule,
                              studentName: `${selectedRetake.user.surname} ${selectedRetake.user.last_name} ${selectedRetake.user.first_name}`,
                              facultyId: selectedRetake.faculty.id,
                              departmentId: selectedRetake.departement.id,
                            }}
                            currentRetakeCourseReason={
                              selectedRetake.retake_course_list
                            }
                            currentDoneRetakeCourseReason={
                              selectedRetake.retake_course_done_list
                            }
                            classes={classes}
                          />
                        </header>
                      }
                      dataSource={selectedRetake.retake_course_list}
                      renderItem={(item) => (
                        <RetakeReasonItem
                          key={item.id}
                          itemData={item}
                          staticData={{
                            userRetakeId: selectedRetake.id,
                            userId: selectedRetake.user.id,
                            matricule: selectedRetake.user.matricule,
                            studentName: `${selectedRetake.user.surname} ${selectedRetake.user.last_name} ${selectedRetake.user.first_name}`,
                            facultyId: selectedRetake.faculty.id,
                            departmentId: selectedRetake.departement.id,
                          }}
                          classes={classes}
                          courses={courses}
                          currentRetakeCourseReason={
                            selectedRetake.retake_course_list
                          }
                          currentDoneRetakeCourseReason={
                            selectedRetake.retake_course_done_list
                          }
                        />
                      )}
                      //   size="small"
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
                label: "Cours repris et acquis",
                children: (
                  <div className="px-4">
                    <List
                      header={
                        <header className="flex justify-between ">
                          <Typography.Title
                            level={5}
                            style={{ marginBottom: 0 }}
                            type="secondary"
                          >
                            {selectedRetake.retake_course_done_list.length}{" "}
                            cours
                          </Typography.Title>
                          <NewRetakeReasonForm
                            type="done"
                            courses={courses}
                            staticData={{
                              userRetakeId: selectedRetake.id,
                              userId: selectedRetake.user.id,
                              matricule: selectedRetake.user.matricule,
                              studentName: `${selectedRetake.user.surname} ${selectedRetake.user.last_name} ${selectedRetake.user.first_name}`,
                              facultyId: selectedRetake.faculty.id,
                              departmentId: selectedRetake.departement.id,
                            }}
                            currentRetakeCourseReason={
                              selectedRetake.retake_course_list
                            }
                            currentDoneRetakeCourseReason={
                              selectedRetake.retake_course_done_list
                            }
                            classes={classes}
                          />
                        </header>
                      }
                      dataSource={selectedRetake.retake_course_done_list}
                      renderItem={(item) => (
                        <RetakeReasonItem
                          key={item.id}
                          type="done"
                          itemData={item}
                          staticData={{
                            userRetakeId: selectedRetake.id,
                            userId: selectedRetake.user.id,
                            matricule: selectedRetake.user.matricule,
                            studentName: `${selectedRetake.user.surname} ${selectedRetake.user.last_name} ${selectedRetake.user.first_name}`,
                            facultyId: selectedRetake.faculty.id,
                            departmentId: selectedRetake.departement.id,
                          }}
                          classes={classes}
                          courses={courses}
                          currentRetakeCourseReason={
                            selectedRetake.retake_course_list
                          }
                          currentDoneRetakeCourseReason={
                            selectedRetake.retake_course_done_list
                          }
                        />
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
            ]}
          />
        </Splitter.Panel>
      )}
    </Splitter>
  );
}
