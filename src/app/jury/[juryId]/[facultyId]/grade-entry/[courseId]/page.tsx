"use client";

import { getCourseEnrollments, getGradeByTaughtCourse, getGradeValidationColor, getGradeValidationText, getTaughtCours } from "@/lib/api";
import {
  GradeClass,
  Jury,
  LetterGrading,
  NewGradeClass,
  PeriodEnrollment,
  TaughtCourse,
} from "@/types";
import {
  CheckCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FormOutlined,
  MoreOutlined,
  PrinterOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  Dropdown,
  Form,
  Layout,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { IndividualGradeEntryForm } from "./_components/individual-grade-entry-form";
import { BulkGradeSubmissionForm } from "./_components/bulk-grade-submission-form";
import { InputGrade } from "./_components/input-grade";
import { FileGradeSubmissionForm } from "./_components/file-grade-entry-form";


export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [openIndividualEntry, setOpenIndividualEntry] =
    useState<boolean>(false);
  const [openBulkSubmission, setOpenBulkSubmission] = useState<boolean>(false);
  const [openFileSubmission, setOpenFileSubmission] =useState<boolean>(false)
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
    data: gradeClasses,
    isPending: isPendingGradeClasses,
    isError: isErrorGradeClasses,
  } = useQuery({
    queryKey: ["grade_classes", courseId],
    queryFn: ({ queryKey }) => getGradeByTaughtCourse(Number(queryKey[1])),
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

  console.log(gradeClasses);

  const getGradeItemsFromCourseEnrollments = () => {
    const items = courseEnrollments?.map((student) => ({
      student: student.student,
      continuous_assessment: null,
      exam: null,
      is_retaken: false,
      status: "validated",
      moment: "before_appeal",
      session: "retake_session",
    }));
    return items as NewGradeClass[];
  };

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
            <Typography.Title
              level={3}
              style={{ marginBottom: 0, textTransform: "uppercase" }}
            >
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
          <Dropdown
            menu={{
              items: [
                {
                  key: "individualGradeEntry",
                  label: "Saisie individuelle",
                  icon: <UserOutlined />,
                },
                {
                  key: "bulkGradeSubmission",
                  label: "Saisie collective",
                  icon: <TeamOutlined />,
                },
              ],
              onClick: ({ key }) => {
                if (key === "individualGradeEntry") {
                  setOpenIndividualEntry(true);
                } else if (key === "bulkGradeSubmission") {
                  setOpenBulkSubmission(true);
                  const grades = getGradeItemsFromCourseEnrollments();
                  setNewGradeClassItems(grades);
                }
              },
            }}
          >
            <Button
              icon={<FormOutlined />}
              color="primary"
              variant="dashed"
              style={{ boxShadow: "none" }}
              title="Saisir manuellement"
            >
              Saisir
            </Button>
          </Dropdown>
          <Button
            color="default"
            variant="dashed"
            icon={<UploadOutlined />}
            style={{ boxShadow: "none" }}
            title="Importer un fichier CSV"
            onClick={() => setOpenFileSubmission(true)}
          >
            Importer
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: "export",
                  label: "Exporter",
                  icon: <DownloadOutlined />,
                  disabled: true,
                },
                {
                  key: "print",
                  label: "Imprimer",
                  icon: <PrinterOutlined />,
                  disabled: true,
                },
                {
                  type: "divider",
                },
                {
                  key: "close",
                  label: "Quitter",
                  title: "Quitter la saisie des notes de ce cours",
                  icon: <CloseOutlined />,
                },
              ],
              onClick: ({ key }) => {
                if (key === "export") {
                  // Handle export logic
                } else if (key === "print") {
                  // Handle print logic
                } else if (key === "close") {
                  router.push(`/jury/${juryId}/${facultyId}/grade-entry`);
                }
              },
            }}
            arrow
          >
            <Button icon={<MoreOutlined />} type="text" />
          </Dropdown>
        </Space>
      </Layout.Header>
      <Layout.Content
        style={{ height: `calc(100vh - 238px)`, overflow: "auto", padding: 28 }}
      >
        <Table
          title={() => (
            <header className="flex pb-1 px-2">
              <Space>
                <Typography.Title
                  type="secondary"
                  level={5}
                  style={{ marginBottom: 0 }}
                >
                  Étudiants
                </Typography.Title>
              </Space>
              <div className="flex-1" />
              <Space>
                <Typography.Text type="secondary">Session: </Typography.Text>
                <Select
                  variant="filled"
                  placeholder="Session"
                  defaultValue="main_session"
                  options={[
                    { value: "main_session", label: "Principale" },
                    { value: "retake_session", label: "Rattrapage" },
                  ]}
                  style={{ width: 180 }}
                />
                <Typography.Text type="secondary">Moment: </Typography.Text>
                <Select
                  variant="filled"
                  placeholder="Moment"
                  defaultValue="before_appeal"
                  options={[
                    { value: "before_appeal", label: "Avant recours" },
                    { value: "after_appeal", label: "Après recours" },
                  ]}
                  style={{ width: 150 }}
                />
              </Space>
            </header>
          )}
          dataSource={gradeClasses}
          columns={[
            {
              key: "matricule",
              dataIndex: "matricule",
              title: "Matricule",
              render: (_, record) =>
                `${record.student?.year_enrollment.user.matricule.padStart(
                  6,
                  "0"
                )}`,
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
              render: (_, record) => (
                <InputGrade
                  value={record.continuous_assessment}
                  onChange={(value) => {
                    const updatedItems = [...(newGradeClassItems ?? [])];
                    const index = updatedItems.findIndex(
                      (item) => item.student?.id === record.student?.id
                    );
                    if (index !== -1) {
                      updatedItems[index].continuous_assessment = value;
                      setNewGradeClassItems(updatedItems);
                    }
                  }}
                  disabled={!record.student}
                />
              ),
              width: 90,
            },
            {
              key: "exam",
              dataIndex: "exam",
              title: "Examen",
              render: (_, record) => (
                <InputGrade
                  value={record.exam}
                  onChange={(value) => {
                    const updatedItems = [...(newGradeClassItems ?? [])];
                    const index = updatedItems.findIndex(
                      (item) => item.student?.id === record.student?.id
                    );
                    if (index !== -1) {
                      updatedItems[index].exam = value;
                      setNewGradeClassItems(updatedItems);
                    }
                  }}
                  disabled={!record.student}
                />
              ),
              width: 90,
            },
            {
              key: "total",
              dataIndex: "total",
              title: "Total",
              render: (_, record) => (
                <Typography.Text strong>
                  {typeof record.continuous_assessment === "number" &&
                  typeof record.exam === "number"
                    ? `${record.continuous_assessment + record.exam}`
                    : ""}
                </Typography.Text>
              ),
              width: 52,
              align: "right",
            },
            {
              key: "grade_letter",
              dataIndex: "grade_letter",
              title: "Notation",
              render: (_, record) => `${record.grade_letter.grade_letter}`,
              width: 74,
              align: "center",
            },
            {
              key: "earned_credits",
              dataIndex: "earned_credits",
              title: "Crédits",
              render: (_, record) => (
                <Typography.Text strong>
                  {record.earned_credits}
                </Typography.Text>
              ),
              width: 64,
              align: "center",
            },
            {
              key: "is_retaken",
              dataIndex: "is_retaken",
              title: "Repris",
              render: (_, record) => <Checkbox />,
              width: 62,
              align: "center",
            },
            {
              key: "session",
              dataIndex: "session",
              title: "Session",
              render: (_, record) => (
                <Select
                  options={[
                    { value: "main_session", label: "Principale" },
                    { value: "retake_session", label: "Rattrapage" },
                  ]}
                  value={record.session}
                  style={{ width: 120 }}
                  variant="filled"
                  onSelect={(value) => {
                    const updatedItems = [...(newGradeClassItems ?? [])];
                    const index = updatedItems.findIndex(
                      (item) => item.student?.id === record.student?.id
                    );
                    if (index !== -1) {
                      updatedItems[index].session = value as
                        | "main_session"
                        | "retake_session";
                      setNewGradeClassItems(updatedItems);
                    }
                  }}
                />
              ),
              width:136
            },
            {
              key: "moment",
              dataIndex: "moment",
              title: "Moment",
              render: (_, record) => (
                <Select
                  options={[
                    { value: "before_appeal", label: "Avant recours" },
                    { value: "after_appeal", label: "Après recours" },
                  ]}
                  value={record.moment}
                  style={{ width: 128 }}
                  variant="filled"
                  onSelect={(value) => {
                    const updatedItems = [...(newGradeClassItems ?? [])];
                    const index = updatedItems.findIndex(
                      (item) => item.student?.id === record.student?.id
                    );
                    if (index !== -1) {
                      updatedItems[index].moment = value as
                        | "before_appeal"
                        | "after_appeal";
                      setNewGradeClassItems(updatedItems);
                    }
                  }}
                />
              ),
              width:144
            },
            {
              key: "status",
              dataIndex: "status",
              title: "Statut",
              render: (_, record) => (
                <Select
                  options={[
                    { value: "validated", label: "Validée" },
                    { value: "pending", label: "En attente" },
                  ]}
                  value={record.status}
                  style={{ width: 108 }}
                  variant="filled"
                  status={record.status === "validated" ? undefined : "warning"}
                  onSelect={(value) => {
                    const updatedItems = [...(newGradeClassItems ?? [])];
                    const index = updatedItems.findIndex(
                      (item) => item.student?.id === record.student?.id
                    );
                    if (index !== -1) {
                      updatedItems[index].status = value as
                        | "validated"
                        | "pending";
                      setNewGradeClassItems(updatedItems);
                    }
                  }}
                />
              ),
              width: 128,
            },
            {
              key: "validation",
              dataIndex: "validation",
              title: "Validation",
              render: (_, record) => (
                <Tag
                  color={getGradeValidationColor(record.validation)}
                  bordered={false}
                  style={{width:"100%"}}
                >
                  {getGradeValidationText(record.validation)}
                </Tag>
              ),
              width: 82,
            },
          ]}
          size="small"
          pagination={false}
        />
        <IndividualGradeEntryForm
          open={openIndividualEntry}
          setOpen={setOpenIndividualEntry}
          students={courseEnrollments}
        />
        <BulkGradeSubmissionForm
          open={openBulkSubmission}
          setOpen={setOpenBulkSubmission}
          newGradeClassItems={newGradeClassItems}
          setNewGradeClassItems={setNewGradeClassItems}
          course={course}
        />
        <FileGradeSubmissionForm open={openFileSubmission} setOpen={setOpenFileSubmission} course={course}/>
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
          {/* Saisie des notes */}
        </Typography.Title>
        <Space>
          {/* <Button>Annuler</Button> */}
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            style={{ boxShadow: "none" }}
          >
            Sauvegarder
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: "delete",
                  label: "Supprimer les notes",
                  icon: <DeleteOutlined />,
                  danger: true,
                },
              ],
            }}
            arrow
            placement="topLeft"
          >
            <Button icon={<MoreOutlined />} type="text" />
          </Dropdown>
        </Space>
      </Layout.Footer>
    </Layout>
  );
}
