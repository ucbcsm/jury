"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import {
  getAllTeachers,
  getDepartmentsByFacultyId,
  getFaculty,
  getFacultyDashboard,
  getFields,
} from "@/lib/api";
import { getHSLColor, toFixedNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  Form,
  Layout,
  List,
  Progress,
  Row,
  Skeleton,
  Space,
  Statistic,
  theme,
  Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useYid } from "@/hooks/use-yid";
import { FacultyMembersList } from "./_components/members/list";
import { EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import { EditFacultyForm } from "@/app/console/fields/faculties/forms/edit";
import { Palette } from "@/components/palette";

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const { facultyId } = useParams();
  const { yid } = useYid();
  const router = useRouter();

  const {
    data: faculty,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["faculty", facultyId],
    queryFn: ({ queryKey }) => getFaculty(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  const {
    data: facultyDashboard,
    isPending: isPendingDashboard,
    isError: isErrorDashboard,
  } = useQuery({
    queryKey: ["faculty_dashboard", yid, facultyId],
    queryFn: ({ queryKey }) => getFacultyDashboard(yid!, Number(queryKey[2])),
    enabled: !!yid && !!facultyId,
  });

  const { data: departments } = useQuery({
    queryKey: ["departments", facultyId],
    queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
    enabled: !!facultyId,
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
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (isError || isErrorDashboard) {
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
                {faculty?.name} (Filière)
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
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={16}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Flex justify="space-between">
                    <Statistic
                      loading={isPendingDashboard}
                      title="Étudiants"
                      value={facultyDashboard?.student_counter}
                    />
                    {!isPendingDashboard ? (
                      <Progress type="dashboard" percent={100} size={58} />
                    ) : (
                      <Skeleton.Avatar size={58} active />
                    )}
                  </Flex>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Flex justify="space-between">
                    <Statistic
                      loading={isPendingDashboard}
                      title="Hommes"
                      value={facultyDashboard?.male_count}
                    />
                    {!isPendingDashboard ? (
                      <Progress
                        type="dashboard"
                        percent={toFixedNumber(
                          (facultyDashboard?.male_count! /
                            facultyDashboard?.student_counter!) *
                            100
                        )}
                        size={58}
                      />
                    ) : (
                      <Skeleton.Avatar size={58} active />
                    )}
                  </Flex>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Flex justify="space-between">
                    <Statistic
                      loading={isPendingDashboard}
                      title="Femmes"
                      value={facultyDashboard?.female_count}
                    />
                    {!isPendingDashboard ? (
                      <Progress
                        type="dashboard"
                        percent={toFixedNumber(
                          (facultyDashboard?.female_count! /
                            facultyDashboard?.student_counter!) *
                            100
                        )}
                        size={58}
                        strokeColor="cyan"
                      />
                    ) : (
                      <Skeleton.Avatar size={58} active />
                    )}
                  </Flex>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Flex justify="space-between">
                    <Statistic
                      loading={isPendingDashboard}
                      title="Actifs"
                      value={facultyDashboard?.actif_count}
                    />
                  </Flex>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Flex justify="space-between">
                    <Statistic
                      loading={isPendingDashboard}
                      title="Abandons"
                      value={facultyDashboard?.inactif_count}
                    />
                  </Flex>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Flex justify="space-between">
                    <Statistic
                      loading={isPendingDashboard}
                      title="Départements"
                      value={facultyDashboard?.departement_count}
                    />
                  </Flex>
                </Card>
              </Col>
              <Col span={24}>
                <Card>
                  <Typography.Title level={5}>Départements</Typography.Title>
                  <List
                    dataSource={departments}
                    renderItem={(item) => (
                      <List.Item
                        extra={
                          <Space>
                            <Button
                              color="primary"
                              variant="dashed"
                              style={{ boxShadow: "none" }}
                              onClick={() =>
                                router.push(`/app/department/${item.id}`)
                              }
                            >
                              Gérer
                            </Button>
                          </Space>
                        }
                      >
                        <List.Item.Meta
                          title={`${item.name}`}
                          description={
                            <Space>
                              Code:
                              <Badge
                                count={item?.acronym}
                                color={getHSLColor(`${item?.name}`)}
                              />
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card loading={isPending}>
                  <Descriptions
                    title="Détails"
                    extra={
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => setOpenEdit(true)}
                      >
                        Modifier
                      </Button>
                    }
                    column={1}
                    items={[
                      {
                        label: "Code",
                        children: faculty?.acronym,
                      },
                      {
                        label: "Nom",
                        children: faculty?.name,
                      },
                      {
                        label: "Domaine",
                        children: faculty?.field.name,
                      },
                    ]}
                  />
                  <div className="pt-5">
                    <Typography.Title level={5}>Membres</Typography.Title>
                    <FacultyMembersList faculty={faculty} />
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
          <EditFacultyForm
            faculty={faculty!}
            fields={fields}
            teachers={teachers}
            open={openEdit}
            setOpen={setOpenEdit}
          />
        </Row>
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
