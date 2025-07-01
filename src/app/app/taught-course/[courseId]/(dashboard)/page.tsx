"use client";

import { EditTaughtCourseForm } from "@/app/faculty/[facultyId]/taught-courses/forms/edit";
import { DataFetchErrorResult } from "@/components/errorResult";
import {
  getClassrooms,
  getCourseEnrollments,
  getCourseEnrollmentsCountByStatus,
  getCoursesByFacultyId,
  getCourseTypeName,
  getCumulativeHours,
  getDepartmentsByFacultyId,
  getFaculties,
  getHoursTrackings,
  getPeriods,
  getTaughtCours,
  getTeachersByFaculty,
  getTeachingUnitCategoryName,
  getTeachingUnitsByfaculty,
  getYearStatusName,
} from "@/lib/api";
import { getHSLColor, toFixedNumber } from "@/lib/utils";
import { EditOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  List,
  Progress,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const { courseId } = useParams();
  const router = useRouter();

  const {
    data: course,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["taught_courses", courseId],
    queryFn: ({ queryKey }) => getTaughtCours(Number(queryKey[1])),
    enabled: !!courseId,
  });

  const { data: courses } = useQuery({
    queryKey: ["courses", `${course?.faculty.id}`],
    queryFn: ({ queryKey }) => getCoursesByFacultyId(Number(queryKey[1])),
    enabled: !!course?.faculty.id,
  });

  const { data: departments } = useQuery({
    queryKey: ["departments", `${course?.faculty.id}`],
    queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
    enabled: !!course?.faculty.id,
  });

  const { data: teachers } = useQuery({
    queryKey: ["teachers", `${course?.faculty.id}`],
    queryFn: ({ queryKey }) => getTeachersByFaculty(Number(queryKey[1])),
    enabled: !!course?.faculty.id,
  });

  const { data: periods } = useQuery({
    queryKey: ["periods"],
    queryFn: getPeriods,
  });

  const { data: faculties } = useQuery({
    queryKey: ["faculties"],
    queryFn: getFaculties,
  });

  const { data: teachingUnits } = useQuery({
    queryKey: ["teaching-units", `${course?.faculty.id}`],
    queryFn: ({ queryKey }) => getTeachingUnitsByfaculty(Number(queryKey[1])),
    enabled: !!course?.faculty.id,
  });

  const { data: classrooms } = useQuery({
    queryKey: ["classrooms"],
    queryFn: getClassrooms,
  });

  const { data: hours } = useQuery({
    queryKey: ["course_hours_tracking", courseId],
    queryFn: ({ queryKey }) => getHoursTrackings(Number(queryKey[1])),
    enabled: !!courseId,
  });

  const { data: enrollments, isPending: isPendingEnrollments } = useQuery({
    queryKey: ["course_enrollments", courseId],
    queryFn: ({ queryKey }) => getCourseEnrollments(Number(queryKey[1])),
    enabled: !!courseId,
  });

  const getCourseProgressStatus = (
    status: "pending" | "progress" | "finished" | "suspended"
  ) => {
    switch (status) {
      case "finished":
        return "success";
      case "progress":
        return "normal";
      case "pending":
        return "active";
      case "suspended":
        return "exception";
      default:
        break;
    }
  };

  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <Row gutter={24}>
      <Col span={16}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPending}
                  title="Inscriptions"
                  value={getCourseEnrollmentsCountByStatus(
                    enrollments,
                    "validated"
                  )}
                />
                <Button
                  style={{ marginTop: 32 }}
                  type="link"
                  onClick={() =>
                    router.push(`/app/taught-course/${courseId}/students`)
                  }
                >
                  Inscrire
                </Button>
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPending}
                  title="Heures"
                  value={`${getCumulativeHours(hours)}/${
                    course?.theoretical_hours! + course?.practical_hours!
                  }`}
                />
                <Button
                  style={{ marginTop: 32 }}
                  type="link"
                  onClick={() =>
                    router.push(`/app/taught-course/${courseId}/hours-tracking`)
                  }
                >
                  Suivre
                </Button>
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPending}
                  title="Statut"
                  value={getYearStatusName(course?.status!)}
                />
                {!isPending ? (
                  <Progress
                    type="dashboard"
                    percent={toFixedNumber(
                      (getCumulativeHours(hours) /
                        (course.theoretical_hours! + course.practical_hours!)) *
                        100,1
                    )}
                    size={58}
                    status={getCourseProgressStatus(course?.status!)}
                  />
                ) : (
                  <Skeleton.Avatar size={58} active />
                )}
              </Flex>
            </Card>
          </Col>
          <Col span={24}>
            <Card loading={isPending}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Typography.Title level={5}>
                  Équipe pédagogique
                </Typography.Title>
                <div>
                  <Typography.Text type="secondary">
                    Enseignant principal
                  </Typography.Text>
                  <List
                    dataSource={[{ ...course?.teacher }]}
                    renderItem={(item, index) => (
                      <List.Item key={item.id}>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              style={{
                                backgroundColor: getHSLColor(
                                  `${item?.user?.first_name} ${item.user?.last_name} ${item.user?.surname}`
                                ),
                              }}
                            >
                              {item.user?.first_name?.charAt(0).toUpperCase()}
                              {item.user?.last_name?.charAt(0).toUpperCase()}
                            </Avatar>
                          }
                          title={`${item?.user?.first_name} ${item?.user?.last_name} ${item?.user?.surname}`}
                          description={item.academic_title}
                        />
                      </List.Item>
                    )}
                  />
                </div>
                <div>
                  <Typography.Text type="secondary">Assistants</Typography.Text>
                  <List
                    dataSource={course?.assistants!}
                    renderItem={(item, index) => (
                      <List.Item key={item.id}>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              style={{
                                backgroundColor: getHSLColor(
                                  `${item.user.first_name} ${item.user.last_name} ${item.user.surname}`
                                ),
                              }}
                            >
                              {item.user.first_name?.charAt(0).toUpperCase()}
                              {item.user.last_name?.charAt(0).toUpperCase()}
                            </Avatar>
                          }
                          title={`${item?.user.first_name} ${item?.user.last_name} ${item?.user.surname}`}
                          description={item.academic_title}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={8}>
        <Descriptions
          title="Détails du cours"
          extra={
            <>
              <Button
                icon={<EditOutlined />}
                type="link"
                style={{ marginRight: 16 }}
                onClick={() => setOpenEdit(true)}
              />
              <EditTaughtCourseForm
                open={openEdit}
                setOpen={setOpenEdit}
                taughtCourse={course!}
                faculties={faculties}
                departments={departments}
                periods={periods}
                teachers={teachers}
                courses={courses}
                teachingUnits={teachingUnits}
                classrooms={classrooms}
              />
            </>
          }
          column={1}
          items={[
            {
              key: "name",
              label: "Intitulé",
              children: course?.available_course.name || "",
            },
            {
              key: "code",
              label: "Code du cours",
              children: course?.available_course.code || "",
            },
            {
              key: "category",
              label: "Catégorie",
              children: getCourseTypeName(course?.available_course.code!) || "",
            },
            {
              key: "credits",
              label: "Crédits",
              children: course?.credit_count || "",
            },
            {
              key: "max",
              label: "Note maximale",
              children: course?.max_value || "",
            },
            {
              key: "hours",
              label: "Heures",
              children:
                course?.theoretical_hours! + course?.practical_hours! || "",
            },
            {
              key: "theoretical_hours",
              label: "Heures théoriques",
              children: course?.theoretical_hours || "",
            },
            {
              key: "practical_hours",
              label: "Heures pratiques",
              children: course?.practical_hours || "",
            },
            {
              key: "teaching_unit",
              label: "UE",
              children: `${course?.teaching_unit?.name} ${
                course?.teaching_unit?.code &&
                `(${course?.teaching_unit?.code})`
              }`,
            },
            {
              key: "teaching_unit_category",
              label: "Catgorie UE",
              children: getTeachingUnitCategoryName(
                course?.teaching_unit?.category!
              ),
            },
            {
              key: "start_date",
              label: "Date de début",
              children: course?.start_date
                ? new Intl.DateTimeFormat("fr", { dateStyle: "long" }).format(
                    new Date(`${course.start_date}`)
                  )
                : "",
            },
            {
              key: "end_date",
              label: "Date de fin",
              children: course?.end_date
                ? new Intl.DateTimeFormat("fr", { dateStyle: "long" }).format(
                    new Date(`${course.end_date}`)
                  )
                : "",
            },
            {
              key: "status",
              label: "Statut",
              children: (
                <Tag bordered={false}>{getYearStatusName(course?.status!)}</Tag>
              ),
            },
          ]}
        />
      </Col>
    </Row>
  );
}
