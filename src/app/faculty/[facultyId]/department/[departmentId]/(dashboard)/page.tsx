"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { useYid } from "@/hooks/use-yid";
import { getAllTeachers, getDepartment, getDepartmentDashboard, getFaculties } from "@/lib/api";
import { EditOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  Progress,
  Row,
  Skeleton,
  Statistic,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import { DepartmentMembersList } from "./_components/members/list";
import { useState } from "react";
import { EditDepartmentForm } from "@/app/console/fields/departments/forms/edit";

export default function Page() {
  const { departmentId } = useParams();
  const { yid } = useYid();
  const [openEdit, setOpenEdit] = useState<boolean>(false);

  const {
    data: department,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["department", departmentId],
    queryFn: ({ queryKey }) => getDepartment(Number(queryKey[1])),
    enabled: !!departmentId,
  });

  const {
    data: departmentDashboard,
    isPending: isPendingDashboard,
    isError: isErrorDashboard,
  } = useQuery({
    queryKey: ["department", yid, departmentId],
    queryFn: ({ queryKey }) =>
      getDepartmentDashboard(yid!, Number(queryKey[2])),
    enabled: !!yid && !!departmentId,
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

  if (isError || isErrorDashboard) {
    return <DataFetchErrorResult />;
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={24} md={16}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPendingDashboard}
                  title="Étudiants"
                  value={departmentDashboard?.student_counter}
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
                  value={departmentDashboard?.male_count}
                />
                {!isPendingDashboard ? (
                  <Progress
                    type="dashboard"
                    percent={
                      (departmentDashboard.male_count /
                        departmentDashboard.student_counter) *
                      100
                    }
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
                  value={departmentDashboard?.female_count}
                />
                {!isPendingDashboard ? (
                  <Progress
                    type="dashboard"
                    percent={
                      (departmentDashboard.female_count /
                        departmentDashboard.student_counter) *
                      100
                    }
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
                  value={departmentDashboard?.actif_count}
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
                  value={departmentDashboard?.inactif_count}
                />
              </Flex>
            </Card>
          </Col>
          {/* <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic loading={isPending} title="Promotions" value={8} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic loading={isPending} title="Programmes" value={"6"} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic loading={isPending} title="Personnel" value={"5"} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPending}
                  title="Taux de réussite"
                  value={"95%"}
                />
              </Flex>
            </Card>
          </Col> */}
        </Row>
      </Col>
      <Col xs={24} md={8}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card loading={isPending}>
              <Descriptions
                title="Détails"
                extra={
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setOpenEdit(true);
                    }}
                  >
                    Modifier
                  </Button>
                }
                column={1}
                items={[
                  {
                    label: "Code",
                    children: department?.acronym,
                  },
                  {
                    label: "Nom",
                    children: department?.name,
                  },
                  {
                    label: "Faculté",
                    children: department?.faculty.name,
                  },
                  // {
                  //   label: "Année académique",
                  //   children: "",
                  // },
                ]}
              />
              <div className="pt-5">
                <Typography.Title level={5}>Membres</Typography.Title>
                <DepartmentMembersList department={department} />
              </div>
            </Card>
          </Col>
        </Row>
      </Col>
      <EditDepartmentForm
        department={department!}
        faculties={faculties}
        teachers={teachers}
        open={openEdit}
        setOpen={setOpenEdit}
      />
    </Row>
  );
}
