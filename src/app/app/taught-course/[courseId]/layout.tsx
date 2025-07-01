"use client";

import {
  Card,
  Form,
  Layout,
  Skeleton,
  Space,
  Tag,
  theme,
  Typography,
} from "antd";
import { Palette } from "@/components/palette";
import BackButton from "@/components/backButton";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getClassrooms,
  getCoursesByFacultyId,
  getDepartmentsByFacultyId,
  getFaculties,
  getPeriods,
  getTaughtCours,
  getTeachersByFaculty,
  getTeachingUnitsByfaculty,
  getYearStatusColor,
  getYearStatusName,
} from "@/lib/api";
import { TaughtCourseDetails } from "./(dashboard)/course-details";

export default function FacultyLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  const { courseId } = useParams();
  const pathname = usePathname();
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

  return (
    <Layout>
      <Layout.Sider
        width={280}
        theme="light"
        style={{ borderRight: `1px solid ${colorBorderSecondary}` }}
      >
        <TaughtCourseDetails
          data={course}
          isError={isError}
          faculties={faculties}
          departments={departments}
          periods={periods}
          teachers={teachers}
          courses={courses}
          teachingUnits={teachingUnits}
          classrooms={classrooms}
        />
      </Layout.Sider>
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
            <BackButton />
            {!isPending ? (
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                {course?.available_course.name} (Cours)
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
        <Card
          tabList={[
            {
              key: `/app/taught-course/${courseId}`,
              label: "Aperçu",
            },
            {
              key: `/app/taught-course/${courseId}/students`,
              label: "Étudiants inscrits",
            },
            {
              key: `/app/taught-course/${courseId}/attendances`,
              label: "Listes des présences",
            },
            {
              key: `/app/taught-course/${courseId}/hours-tracking`,
              label: "Suivis des heures",
            },
            {
              key: `/app/taught-course/${courseId}/assessments`,
              label: "Notes (TD/TP & Examens)",
            },
            {
              key: `/app/taught-course/${courseId}/course-evaluations`,
              label: "Évaluations du cours",
            },
          ]}
          defaultActiveTabKey={pathname}
          activeTabKey={pathname}
          onTabChange={(key) => {
            router.push(key);
          }}
          tabBarExtraContent={
            !isPending?<Space>
              <Typography.Text type="secondary">Statut:</Typography.Text>
              <Tag
                color={getYearStatusColor(course?.status!)}
                style={{ border: 0 }}
              >
                {getYearStatusName(course?.status!)}
              </Tag>
            </Space>:<Skeleton.Input active/>
          }
        >
          {children}
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
