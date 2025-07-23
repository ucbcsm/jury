"use client";

import {
  getCourseEnrollments,
  getGradeByTaughtCourse,
  getGradeValidationColor,
  getGradeValidationText,
  getTaughtCours,
  multiUpdateGradeClasses,
} from "@/lib/api";
import { GradeClass, NewGradeClass } from "@/types";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FormOutlined,
  HourglassOutlined,
  MoreOutlined,
  PrinterOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  Dropdown,
  Form,
  Layout,
  message,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IndividualGradeEntryForm } from "./_components/individual-grade-entry-form";
import { BulkGradeSubmissionForm } from "./_components/bulk-grade-submission-form";
import { InputGrade } from "./_components/input-grade";
import { FileGradeSubmissionForm } from "./_components/file-grade-entry-form";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { ButtonMultiUpdateFormConfirm } from "./_components/button-multi-update-form-confirm";
import { ButtonMultiUpdateFormReject } from "./_components/reject-multi-update-form";
import { ButtonDeleteGrades } from "./_components/delete-grades";

export default function Page() {
  const {
    token: { colorBgContainer, colorSuccess, colorWarning, colorSuccessBgHover },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [openIndividualEntry, setOpenIndividualEntry] =
    useState<boolean>(false);
  const [openBulkSubmission, setOpenBulkSubmission] = useState<boolean>(false);
  const [openFileSubmission, setOpenFileSubmission] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [openMultiUpdateConfirm, setOpenMultiUpdateConfirm] =
    useState<boolean>(false);
  const [openRejectUpdates, setOpenRejectUpdates] = useState<boolean>(false);
  const [openDeleteGrades, setOpenDeleteGrades] = useState<boolean>(false);
  const { juryId, facultyId, courseId } = useParams();
  const router = useRouter();
  const [newGradeClassItems, setNewGradeClassItems] = useState<
    NewGradeClass[] | undefined
  >([]);

  const [editGradeClassItems, setEditGradeClassItems] = useState<
    GradeClass[] | undefined
  >();

  const [session, setSession] = useQueryState(
    "session",
    parseAsStringEnum(["main_session", "retake_session"]).withDefault(
      "main_session"
    )
  );
  const [moment, setMoment] = useQueryState(
    "moment",
    parseAsStringEnum(["before_appeal", "after_appeal"]).withDefault(
      "before_appeal"
    )
  );

  const queryClient = useQueryClient();
  const { mutateAsync: mutateMultiGrades, isPending: isPendingMultiupdate } =
    useMutation({
      mutationFn: multiUpdateGradeClasses,
    });

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
    queryKey: ["grade_classes", courseId, session, moment],
    queryFn: ({ queryKey }) =>
      getGradeByTaughtCourse(Number(queryKey[1]), session, moment),
    enabled: !!courseId && !!session && !!moment,
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
      is_retaken: false,
      status: "validated",
      moment: "before_appeal",
      session: "retake_session",
    }));
    return items as NewGradeClass[];
  };

  const onFinishMultiUpdateGrades = () => {
    mutateMultiGrades([...(editGradeClassItems || [])], {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["grade_classes", courseId, session, moment],
        });
        messageApi.success("Notes mise à jour avec succès !");
        setOpenMultiUpdateConfirm(false);
      },
      onError: (error) => {
        messageApi.error(
          "Une erreur s'est produite lors de la mise à jour des notes"
        );
      },
    });
  };

  useEffect(() => {
    if (gradeClasses) {
      const items = [...gradeClasses];
      setEditGradeClassItems(items);
    }
  }, [gradeClasses]);

  useEffect(() => {
    if (editGradeClassItems && gradeClasses) {
      // Use a map for faster lookup by id
      const editedMap = new Map(
        editGradeClassItems.map((item) => [item.id, item])
      );

      for (const original of gradeClasses) {
        const edited = editedMap.get(original.id);

        if (
          original.continuous_assessment !== edited?.continuous_assessment ||
          original.exam !== edited?.exam ||
          original.is_retaken !== edited?.is_retaken ||
          original.session !== edited?.session ||
          original.moment !== edited?.moment ||
          original.status !== edited?.status
        ) {
          setDisabled(false);
        }
      }
    }
  }, [gradeClasses, editGradeClassItems]);

  return (
    <Layout>
      {contextHolder}
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
                  value={session}
                  options={[
                    { value: "main_session", label: "Principale" },
                    { value: "retake_session", label: "Rattrapage" },
                  ]}
                  style={{ width: 180 }}
                  onSelect={(value) => {
                    setSession(value as "main_session" | "retake_session");
                  }}
                />
                <Typography.Text type="secondary">Moment: </Typography.Text>
                <Select
                  variant="filled"
                  placeholder="Moment"
                  value={moment}
                  options={[
                    { value: "before_appeal", label: "Avant recours" },
                    { value: "after_appeal", label: "Après recours" },
                  ]}
                  style={{ width: 150 }}
                  onSelect={(value) => {
                    setMoment(value as "before_appeal" | "after_appeal");
                  }}
                />
              </Space>
            </header>
          )}
          dataSource={editGradeClassItems}
          loading={isPendingGradeClasses}
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
                    const updatedItems = [...(editGradeClassItems ?? [])];
                    const index = updatedItems.findIndex(
                      (item) => item.student?.id === record.student?.id
                    );
                    if (index !== -1) {
                      updatedItems[index].continuous_assessment = value;
                      setEditGradeClassItems(updatedItems);
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
                    const updatedItems = [...(editGradeClassItems ?? [])];
                    const index = updatedItems.findIndex(
                      (item) => item.student?.id === record.student?.id
                    );
                    if (index !== -1) {
                      updatedItems[index].exam = value;
                      setEditGradeClassItems(updatedItems);
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
                    ? `${Number(
                        record.continuous_assessment + record.exam
                      ).toFixed(2)}`
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
              title: "Retake?",
              render: (_, record) => (
                <Checkbox
                  checked={record.is_retaken}
                  onChange={(e) => {
                    const updatedItems = [...(editGradeClassItems ?? [])];
                    const index = updatedItems.findIndex(
                      (item) => item.student?.id === record.student?.id
                    );
                    if (index !== -1) {
                      updatedItems[index].is_retaken = e.target.checked;
                      setEditGradeClassItems(updatedItems);
                    }
                  }}
                />
              ),
              width: 66,
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
                    const updatedItems = [...(editGradeClassItems ?? [])];
                    const index = updatedItems.findIndex(
                      (item) => item.student?.id === record.student?.id
                    );
                    if (index !== -1) {
                      updatedItems[index].session = value as
                        | "main_session"
                        | "retake_session";
                      setEditGradeClassItems(updatedItems);
                    }
                  }}
                />
              ),
              width: 136,
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
                    const updatedItems = [...(editGradeClassItems ?? [])];
                    const index = updatedItems.findIndex(
                      (item) => item.student?.id === record.student?.id
                    );
                    if (index !== -1) {
                      updatedItems[index].moment = value as
                        | "before_appeal"
                        | "after_appeal";
                      setEditGradeClassItems(updatedItems);
                    }
                  }}
                />
              ),
              width: 144,
            },
            {
              key: "status",
              dataIndex: "status",
              title: "Statut",
              render: (_, record) => (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "validated",
                        label: "Validée",
                        icon: <CheckCircleOutlined />,
                        // className:"bg-green-100 text-green-800",
                        style: {  color: colorSuccess },
                      },
                      {
                        key: "pending",
                        label: "En attente",
                        icon: <HourglassOutlined />,
                        style: { color: colorWarning },
                      },
                    ],
                    onClick: ({ key }) => {
                      const updatedItems = [...(editGradeClassItems ?? [])];
                      const index = updatedItems.findIndex(
                        (item) => item.student?.id === record.student?.id
                      );
                      if (index !== -1) {
                        updatedItems[index].status = key as
                          | "validated"
                          | "pending";
                        setEditGradeClassItems(updatedItems);
                      }
                    },
                  }}
                  arrow
                >
                  <Tag
                    color={record.status === "validated" ? "success" : "warning"}
                    
                    bordered={false}
                    style={{ width: "100%", padding: "4px 8px" }}
                    icon={
                      record.status === "validated" ? (
                        <CheckCircleOutlined style={{ color: colorSuccess }} />
                      ) : (
                        <HourglassOutlined />
                      )}
                      
                  >
                    {record.status === "validated" ? "Validée" : "En attente"}
                  </Tag>
                </Dropdown>
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
                  style={{ width: "100%", padding: "4px 8px" }}
                  icon={record.validation === "validated" ? (
                    <CheckCircleOutlined />):(<CloseCircleOutlined />)}
                >
                  {getGradeValidationText(record.validation)}
                </Tag>
              ),
              width: 82,
            },
          ]}
          size="small"
          pagination={false}
          rowKey="id"
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
        <FileGradeSubmissionForm
          open={openFileSubmission}
          setOpen={setOpenFileSubmission}
          course={course}
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
          {/* Saisie des notes */}
        </Typography.Title>
        <Space>
          <ButtonMultiUpdateFormReject
            open={openRejectUpdates}
            setOpen={setOpenRejectUpdates}
            onFinish={() => setEditGradeClassItems(gradeClasses)}
          />

          <ButtonMultiUpdateFormConfirm
            open={openMultiUpdateConfirm}
            setOpen={setOpenMultiUpdateConfirm}
            onFinish={onFinishMultiUpdateGrades}
            isPending={isPendingMultiupdate}
          />

          <ButtonDeleteGrades
            open={openDeleteGrades}
            setOpen={setOpenDeleteGrades}
            onFinish={() => {}}
          />

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
              onClick: ({ key }) => {
                if (key === "delete") {
                  setOpenDeleteGrades(true);
                }
              },
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
