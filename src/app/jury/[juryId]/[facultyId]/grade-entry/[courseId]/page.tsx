"use client";

import { getCourseEnrollments, getTaughtCours } from "@/lib/api";
import {
  GradeClass,
  Jury,
  LetterGrading,
  PeriodEnrollment,
  TaughtCourse,
} from "@/types";
import { CloseOutlined, MoreOutlined, UploadOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Form,
  Layout,
  Select,
  Skeleton,
  Space,
  Table,
  theme,
  Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type NewGradeClass = Omit<
  GradeClass,
  | "id"
  | "status"
  | "is_retaken"
  | "moment"
  | "session"
  | "validation"
  | "earned_credits"
  | "grade_letter"
  | "total"
  | "course"
  | "jury"
  | "continuous_assessment"
  | "exam"
  | "student"
> & {
  id?: number;
  status?: "validated" | "pending";
  is_retaken?: boolean;
  moment?: "before_appeal" | "after_appeal";
  session?: "main_session" | "retake_session";
  validation?: "validated" | "no_validated";
  earned_credits?: number;
  grade_letter?: LetterGrading;
  total?: number;
  course?: TaughtCourse;
  jury?: Jury;
  continuous_assessment?: number | null;
  exam?: number | null;
  student?: PeriodEnrollment;
};

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { juryId, facultyId, courseId } = useParams();
  const router = useRouter();
  const [newGradeClassItems, setNewGradeClassItems] = useState<
    NewGradeClass[] | undefined
  >([]);

  const {
    data: course,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["taught_courses", courseId],
    queryFn: ({ queryKey }) => getTaughtCours(Number(queryKey[1])),
    enabled: !!courseId,
  });

  const {
    data: courseEnrollments,
    isPending: isPendingCourseEnrollments,
    isError: isErrorCourseEnrollments,
  } = useQuery({
    queryKey: ["course_enrollments", courseId],
    queryFn: ({ queryKey }) => getCourseEnrollments(Number(queryKey[1])),
    enabled: !!courseId,
  });

  const getGradeItemsFromCourseEnrollments = () => {
    const items = courseEnrollments?.map((student) => ({
      student: student.student,
      continuous_assessment: null,
      exam: null,
    }));
    return items;
  };

  useEffect(() => {
    const grades = getGradeItemsFromCourseEnrollments();
    setNewGradeClassItems(grades);
  }, [courseEnrollments]);

  return (
    <Layout>
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          background: colorBgContainer,
          paddingLeft: 28,
          paddingRight: 28,
        }}
      >
        <Space>
          {!isPending ? (
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              {course?.available_course.name} ({course?.available_course.code})
            </Typography.Title>
          ) : (
            <Form>
              <Skeleton.Input active />
            </Form>
          )}
        </Space>
        <div className="flex-1" />
        <Space>
          <Select
            variant="filled"
            placeholder="Moment"
            options={[
              { value: "before_appeal", label: "Avant recours" },
              { value: "after_appeal", label: "Après recours" },
            ]}
            style={{ width: 150 }}
          />
          <Select
            variant="filled"
            placeholder="Session"
            options={[
              { value: "main_session", label: "Session principale" },
              { value: "retake_session", label: "Session de rattrapage" },
            ]}
            style={{ width: 150 }}
          />
          <Button
            title="Quitter la saisie des notes de ce cours"
            icon={<CloseOutlined />}
            type="text"
            style={{ boxShadow: "none" }}
            onClick={() =>
              router.push(`/jury/${juryId}/${facultyId}/grade-entry`)
            }
          />
        </Space>
      </Layout.Header>
      <Layout.Content
        style={{ height: `calc(100vh - 238px)`, overflow: "auto", padding: 28 }}
      >
        <Table
          title={() => (
            <header className="flex pb-1">
              <Space>
                <Typography.Title level={3} style={{ marginBottom: 0 }}>
                  Etudiants
                </Typography.Title>
              </Space>
              <div className="flex-1" />
              <Space>
                <Button
                  color="primary"
                  variant="dashed"
                  style={{ boxShadow: "none" }}
                >
                  Saisir manuellement
                </Button>
                <Button
                  color="default"
                  variant="dashed"
                  icon={<UploadOutlined />}
                  style={{ boxShadow: "none" }}
                >
                  Importer
                </Button>
              </Space>
            </header>
          )}
          dataSource={newGradeClassItems}
          columns={[
            {
              key: "matricule",
              dataIndex: "matricule",
              title: "Matricule",
              render:(_, record)=>`${record.student?.year_enrollment.user.matricule.padStart(6, "0")}`,
              width: 96,
              align: "center",
            },
            {
              key: "names",
              dataIndex: "names",
              title: "Noms",
              render: (_, record) =>
                `${record.student?.year_enrollment.user.first_name} ${record.student?.year_enrollment.user.last_name} ${record.student?.year_enrollment.user.surname}`,
              ellipsis: true,
            },
            {
              key: "cc",
              dataIndex: "cc",
              title: "C. continu",
              width: 100,
            },
            {
              key: "exam",
              dataIndex: "exam",
              title: "Examen",
              width: 100,
            },
            {
              key: "total",
              dataIndex: "total",
              title: "Total",
              width: 100,
            },
          ]}
        />
      </Layout.Content>
      <Layout.Footer
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 64,
          background: colorBgContainer,
          paddingLeft: 28,
          paddingRight: 28,
        }}
      >
        <Typography.Title
          type="secondary"
          level={3}
          style={{ marginBottom: 0 }}
        >
          Saisie des notes
        </Typography.Title>
        {/* <Palette /> */}

        <Space>
          <Button type="primary" style={{ boxShadow: "none" }}>
            Sauvegarder
          </Button>
          <Button icon={<MoreOutlined />} type="text" />
        </Space>
      </Layout.Footer>
    </Layout>
  );
}
