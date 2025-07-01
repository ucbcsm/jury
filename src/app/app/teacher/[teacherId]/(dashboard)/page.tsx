"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { useYid } from "@/hooks/use-yid";
import { getTeacher, getTeacherDashboard } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Col,
  Descriptions,
  Flex,
  Progress,
  Row,
  Skeleton,
  Statistic,
} from "antd";
import { useParams } from "next/navigation";

export default function Page() {
  const { teacherId } = useParams();
  const { yid } = useYid();

  const {
    data: teacher,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["teacher", teacherId],
    queryFn: ({ queryKey }) => getTeacher(Number(queryKey[1])),
    enabled: !!teacherId,
  });

  const {
    data: teacherDashboard,
    isPending: isPendingDashboard,
    isError: isErrorDashboard,
  } = useQuery({
    queryKey: ["teacher", yid, teacherId],
    queryFn: ({ queryKey }) => getTeacherDashboard(yid!, Number(queryKey[2])),
    enabled: !!yid && !!teacherId,
  });

  if (isError || isErrorDashboard) {
    return <DataFetchErrorResult />;
  }

  return (
    <Row gutter={24}>
      <Col span={18}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <Card>
              <Statistic
                loading={isPending}
                title="Grade académique"
                value={teacher?.academic_grade}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPending}
                  title="Statut"
                  value={teacher?.user.is_active ? "Actif" : "Inactif"}
                />
                {!isPending ? (
                  <Progress
                    type="dashboard"
                    percent={100}
                    size={58}
                    status={teacher?.user.is_active ? "success" : "exception"}
                  />
                ) : (
                  <Skeleton.Avatar size={58} active />
                )}
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                loading={isPendingDashboard}
                title="Nombre de cours"
                value={teacherDashboard?.taught_course_count}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                loading={isPending}
                title="Date de création"
                value={`${new Intl.DateTimeFormat("fr", {
                  dateStyle: "long",
                }).format(new Date())}`}
              />
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={6}>
        <Card loading={isPending}>
          <Descriptions
            title="Informations professionnelles"
            column={1}
            items={[
              {
                key: "education_level",
                label: "Niveau d'étude",
                children: teacher?.education_level,
              },
              {
                key: "departement",
                label: "Domaine d'étude",
                children: teacher?.field_of_study,
              },
              {
                key: "specialisation",
                label: "Titre académique",
                children: teacher?.academic_title,
              },
              {
                key: "experience",
                label: "Grade académique",
                children: teacher?.academic_grade,
              },
              // {
              //   key: "assigned_faculties",
              //   label: "Facultés assignées",
              //   children: teacher?.assigned_faculties
              //     .map((fac) => fac.name)
              //     .join(", "),
              // },
              // {
              //   key: "experience",
              //   label: "assigned_departements",
              //   children: teacher?.assigned_departements
              //     .map((dep) => dep.name)
              //     .join(", "),
              // },
              {
                key: "experience",
                label: "Autres responsabilités",
                children: teacher?.other_responsabilities,
              },
              {
                key: "origin",
                label: "Origine",
                children: teacher?.institution_of_origin,
              },
            ]}
          />
        </Card>
      </Col>
    </Row>
  );
}
