"use client";

import {
  exportEmptyGradesToExcel,
  getCourseEnrollments,
  getGradeByTaughtCourse,
  getGradeValidationColor,
  getShortGradeValidationText,
  getTaughtCours,
  multiUpdateGradeClasses,
} from "@/lib/api";
import { CourseEnrollment, GradeClass } from "@/types";
import {
  CheckCircleOutlined,
  CheckSquareOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FormOutlined,
  HourglassOutlined,
  InfoOutlined,
  LoadingOutlined,
  MinusSquareOutlined,
  MoreOutlined,
  PrinterOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Checkbox,
  Dropdown,
  Form,
  Layout,
  message,
  Popover,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IndividualGradeEntryForm } from "./_components/individual-grade-entry-form";
import { BulkGradeSubmissionForm } from "./_components/bulk-grade-submission-form";
import { InputGrade } from "./_components/input-grade";
import { ImportFileGradeSubmissionForm } from "./_components/import-file-grade-entry-form";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { ButtonMultiUpdateFormConfirm } from "./_components/button-multi-update-form-confirm";
import { ButtonMultiUpdateFormReject } from "./_components/reject-multi-update-form";
import { DeleteMultiGradesButton } from "./_components/delete-multi-grades";
import { DataFetchErrorResult } from "@/components/errorResult";
import { useGradeClassArraysDifferent } from "@/hooks/use-grade-class-arrays-different";
import { useReactToPrint } from "react-to-print";
import { EmptyListGradesToPrint } from "./_components/printable/empty-list-grades";
import { ButtonDeleteSingleGrade } from "./_components/delete-single-grade";
import { useYid } from "@/hooks/use-yid";
import { ExportSomeStudentsToExcelForm } from "./_components/export-some-students-to-excel";
import { PrintSomeStudentsForm } from "./_components/print-some-students";

export default function Page() {
  const {
    token: { colorBgContainer, colorSuccess, colorWarning },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [openIndividualEntry, setOpenIndividualEntry] =
    useState<boolean>(false);
  const [openBulkSubmission, setOpenBulkSubmission] = useState<boolean>(false);
  const [openFileSubmission, setOpenFileSubmission] = useState<boolean>(false);
  const [openMultiUpdateConfirm, setOpenMultiUpdateConfirm] =
    useState<boolean>(false);
  const [openRejectUpdates, setOpenRejectUpdates] = useState<boolean>(false);
  const [openDeleteGrades, setOpenDeleteGrades] = useState<boolean>(false);
  const [openExportSomeStudentsToExcel, setOpenExportSomeStudentsToExcel] =
    useState<boolean>(false);
  const [openPrintSome, setOpenPrintSome] = useState<boolean>(false);

  const { juryId, facultyId, courseId } = useParams();
  const { yid } = useYid();

  const emptyAllGradeRef = useRef<HTMLDivElement>(null);
  const emptySomeGradeRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const [editedGradeClassItems, setEditedGradeClassItems] = useState<
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

  const [selectedRowsForPrint, setSelectedRowsForPrint] = useState<
    CourseEnrollment[]
  >([]);

  const queryClient = useQueryClient();
  const { mutateAsync: mutateMultiGrades, isPending: isPendingMultiupdate } =
    useMutation({
      mutationFn: multiUpdateGradeClasses,
    });

  const {
    data: course,
    isPending: isPendingCourse,
    isError: isErrorCourse,
  } = useQuery({
    queryKey: ["taught_courses", courseId],
    queryFn: ({ queryKey }) => getTaughtCours(Number(queryKey[1])),
    enabled: !!courseId,
  });

  const {
    data: gradeClasses,
    isPending: isPendingGradeClasses,
    isError: isErrorGradeClasses,
    refetch: refetchGradeClasses,
    isLoading: isLoadingGradeClasses,
  } = useQuery({
    queryKey: ["grade_classes", courseId, session, moment],
    queryFn: ({ queryKey }) =>
      getGradeByTaughtCourse(Number(queryKey[1]), session, moment),
    enabled: !!courseId && !!session && !!moment,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const {
    data: courseEnrollments,
    isPending: isPendingCourseEnrollments,
    isError: isErrorCourseEnrollments,
  } = useQuery({
    queryKey: ["course_enrollments", yid, facultyId, courseId],
    queryFn: ({ queryKey }) =>
      getCourseEnrollments({
        academicYearId: Number(yid),
        facultyId: Number(queryKey[2]),
        courseId: Number(queryKey[3]),
        status:"validated"
      }),
    enabled: !!yid && !!facultyId && !!courseId,
  });

  const printAllEmptyGradeList = useReactToPrint({
    contentRef: emptyAllGradeRef,
    documentTitle: `${course?.available_course.code}-fiche-de-notes-${course?.available_course.name}`,
  });

  const printSomeEmptyGradeList = useReactToPrint({
    contentRef: emptySomeGradeRef,
    documentTitle: `${course?.available_course.code}-fiche-de-notes-${course?.available_course.name}`,
    onAfterPrint:()=>{
      setOpenPrintSome(false)
      setSelectedRowsForPrint([])
    },
    onPrintError:()=>{
      setOpenPrintSome(false);
      setSelectedRowsForPrint([]);
    }
  });

  const onFinishMultiUpdateGrades = () => {
    mutateMultiGrades([...(editedGradeClassItems || [])], {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["grade_classes", courseId, session, moment],
        });
        messageApi.success("Notes mise à jour avec succès !");
        setOpenMultiUpdateConfirm(false);
      },
      onError: (error) => {
        messageApi.error(
          (error as any)?.response?.data?.message ||
            "Une erreur s'est produite lors de la mise à jour des notes"
        );
        console.error(error);
      },
    });
  };

  useEffect(() => {
    if (gradeClasses) {
      setEditedGradeClassItems(gradeClasses);
    }
  }, [gradeClasses]);

  const isDifferent = useGradeClassArraysDifferent(
    gradeClasses,
    editedGradeClassItems
  );

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
          {!isPendingCourse ? (
            <Typography.Title
              level={3}
              style={{ marginBottom: 0, textTransform: "uppercase" }}
              ellipsis={{}}
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
                  disabled: isPendingCourseEnrollments,
                },
                {
                  key: "bulkGradeSubmission",
                  label: "Saisie collective",
                  icon: isPendingCourseEnrollments ? (
                    <LoadingOutlined />
                  ) : (
                    <TeamOutlined />
                  ),
                  disabled: isPendingCourseEnrollments,
                },
              ],
              onClick: ({ key }) => {
                if (key === "individualGradeEntry") {
                  setOpenIndividualEntry(true);
                } else if (key === "bulkGradeSubmission") {
                  setOpenBulkSubmission(true);
                  // const grades = getGradeItemsFromCourseEnrollments();
                  // setNewGradeClassItems(grades);
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
              disabled={
                isPendingCourse ||
                isPendingCourseEnrollments ||
                isPendingGradeClasses
              }
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
            disabled={
              isPendingCourse ||
              isPendingCourseEnrollments ||
              isPendingGradeClasses
            }
          >
            Importer
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: "export",
                  label: "Exporter vers Excel",
                  icon: <DownloadOutlined />,
                  disabled: isPendingCourseEnrollments,
                  children: [
                    {
                      key: "export_all",
                      label: "Tous les étudiants",
                      icon: <CheckSquareOutlined />,
                    },
                    {
                      key: "export_some",
                      label: "Quelques étudiants",
                      icon: <MinusSquareOutlined />,
                    },
                  ],
                  // disabled: courseEnrollments?.length === 0,
                },
                {
                  key: "print",
                  label: "Imprimer",
                  icon: <PrinterOutlined />,
                  disabled: isPendingCourseEnrollments,
                  children: [
                    {
                      key: "print_all",
                      label: "Tous les étudiants",
                      icon: <CheckSquareOutlined />,
                    },
                    {
                      key: "print_some",
                      label: "Quelques étudiants",
                      icon: <MinusSquareOutlined />,
                    },
                  ],
                  // disabled: courseEnrollments?.length === 0,
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
                if (key === "export_all") {
                  if (
                    courseEnrollments &&
                    courseEnrollments.length > 0 &&
                    course
                  ) {
                    exportEmptyGradesToExcel(courseEnrollments, course, {
                      sheetName: `Notes - ${course?.available_course.name}`,
                      fileName: `${course?.available_course.name}-notes-${course.available_course.code}.xlsx`,
                    });

                    messageApi.success(
                      "Fichier Excel des notes vides exporté avec succès !"
                    );
                  } else {
                    messageApi.error(
                      "Aucun étudiant trouvé pour exporter les notes vides."
                    );
                  }
                } else if (key === "export_some") {
                  setOpenExportSomeStudentsToExcel(true);
                } else if (key === "print_all") {
                  if (
                    emptyAllGradeRef.current &&
                    courseEnrollments &&
                    courseEnrollments.length > 0
                  ) {
                    printAllEmptyGradeList();
                  } else {
                    messageApi.info(
                      "Aucun étudiant trouvé pour imprimer les notes vides."
                    );
                  }
                } else if (key === "print_some") {
                  setOpenPrintSome(true);
                } else if (key === "close") {
                  router.push(`/jury/${juryId}/${facultyId}/grade-entry`);
                }
              },
            }}
            arrow
          >
            <Button
              icon={<MoreOutlined />}
              type="text"
              disabled={
                isPendingCourse ||
                isPendingCourseEnrollments ||
                isPendingGradeClasses
              }
            />
          </Dropdown>
        </Space>
      </Layout.Header>
      <Layout.Content
        style={{
          height: `calc(100vh - 238px)`,
          padding: 28,
          overflowY: "auto",
        }}
      >
        {isErrorCourse || isErrorGradeClasses || isErrorCourseEnrollments ? (
          <DataFetchErrorResult />
        ) : (
          <div>
            {isDifferent && !isPendingGradeClasses && (
              <Alert
                banner
                type="info"
                showIcon
                closable
                style={{ marginBottom: 20 }}
                message="Modifications non enregistrées"
                description="Vous avez effectué des changements dans la liste des notes. N'oubliez pas de sauvegarder si nécessaire."
                action={
                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <Button
                      size="small"
                      onClick={() => setOpenRejectUpdates(true)}
                      color="orange"
                      variant="dashed"
                      style={{ boxShadow: "none" }}
                      title="Annuler les modifications"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => setOpenMultiUpdateConfirm(true)}
                      icon={<CheckCircleOutlined />}
                      style={{ boxShadow: "none" }}
                    >
                      Sauvegarder
                    </Button>
                  </div>
                }
              />
            )}
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
                    <Typography.Text type="secondary">
                      Session:{" "}
                    </Typography.Text>
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
                    {/* <Button
                      icon={
                        !isLoadingGradeClasses ? (
                          <ReloadOutlined />
                        ) : (
                          <LoadingOutlined />
                        )
                      }
                      title="Rafraichir les notes"
                      onClick={async () => await refetchGradeClasses()}
                      type="text"
                    /> */}
                  </Space>
                </header>
              )}
              dataSource={editedGradeClassItems}
              loading={isPendingGradeClasses}
              columns={[
                {
                  key: "matricule",
                  dataIndex: "matricule",
                  title: "Matricule",
                  render: (_, record) =>
                    `${record.student?.year_enrollment.user.matricule}`,
                  width: 96,
                  align: "center",
                  fixed: "left",
                },
                {
                  key: "names",
                  dataIndex: "names",
                  title: "Noms",
                  render: (_, record) =>
                    `${record.student?.year_enrollment.user.surname} ${record.student?.year_enrollment.user.last_name} ${record.student?.year_enrollment.user.first_name}`,
                  ellipsis: true,
                  fixed: "left",
                },
                {
                  key: "cc",
                  dataIndex: "cc",
                  title: "C. continu",
                  render: (_, record) => (
                    <InputGrade
                      value={record.continuous_assessment}
                      onChange={(value) => {
                        const updatedItems = [...(editedGradeClassItems ?? [])];
                        const index = updatedItems.findIndex(
                          (item) => item.student?.id === record.student?.id
                        );
                        if (index !== -1) {
                          updatedItems[index] = {
                            ...updatedItems[index],
                            continuous_assessment: value,
                          };
                          setEditedGradeClassItems(updatedItems);
                        }
                      }}
                      disabled={!record.student}
                    />
                  ),
                  width: 90,
                  fixed: "left",
                },
                {
                  key: "exam",
                  dataIndex: "exam",
                  title: "Examen",
                  render: (_, record) => (
                    <InputGrade
                      value={record.exam}
                      onChange={(value) => {
                        const updatedItems = [...(editedGradeClassItems ?? [])];
                        const index = updatedItems.findIndex(
                          (item) => item.student?.id === record.student?.id
                        );
                        if (index !== -1) {
                          updatedItems[index] = {
                            ...updatedItems[index],
                            exam: value,
                          };
                          setEditedGradeClassItems(updatedItems);
                        }
                      }}
                      disabled={!record.student}
                    />
                  ),
                  width: 90,
                  fixed: "left",
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
                  render: (_, record) => (
                    <Space size={4}>
                      {record.grade_letter?.grade_letter || ""}{" "}
                      {record.grade_letter?.grade_letter && (
                        <Popover
                          content={record.grade_letter?.appreciation}
                          title="Appréciation"
                        >
                          <Button
                            color="blue"
                            variant="filled"
                            icon={<InfoOutlined />}
                            shape="circle"
                            size="small"
                          />
                        </Popover>
                      )}
                    </Space>
                  ),
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
                  width: 68,
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
                        const updatedItems = [...(editedGradeClassItems ?? [])];
                        const index = updatedItems.findIndex(
                          (item) => item.student?.id === record.student?.id
                        );
                        if (index !== -1) {
                          updatedItems[index] = {
                            ...updatedItems[index],
                            is_retaken: e.target.checked,
                          };
                          setEditedGradeClassItems(updatedItems);
                        }
                      }}
                    />
                  ),
                  width: 76,
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
                        const updatedItems = [...(editedGradeClassItems ?? [])];
                        const index = updatedItems.findIndex(
                          (item) => item.student?.id === record.student?.id
                        );
                        if (index !== -1) {
                          updatedItems[index] = {
                            ...updatedItems[index],
                            session: value,
                          };
                          setEditedGradeClassItems(updatedItems);
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
                        const updatedItems = [...(editedGradeClassItems ?? [])];
                        const index = updatedItems.findIndex(
                          (item) => item.student?.id === record.student?.id
                        );
                        if (index !== -1) {
                          updatedItems[index] = {
                            ...updatedItems[index],
                            moment: value,
                          };
                          setEditedGradeClassItems(updatedItems);
                        }
                      }}
                    />
                  ),
                  width: 144,
                },
                {
                  key: "validation",
                  dataIndex: "validation",
                  title: "Validation",
                  render: (_, record) => (
                    <Tag
                      color={getGradeValidationColor(record.validation)}
                      bordered={false}
                      style={{
                        width: "100%",
                        padding: "4px 8px",
                        textAlign: "center",
                      }}
                      icon={
                        record.validation === "validated" ? (
                          <CheckCircleOutlined />
                        ) : (
                          <CloseCircleOutlined />
                        )
                      }
                    >
                      {getShortGradeValidationText(record.validation)}
                    </Tag>
                  ),
                  width: 82,
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
                            style: { color: colorSuccess },
                          },
                          {
                            key: "pending",
                            label: "En attente",
                            icon: <HourglassOutlined />,
                            style: { color: colorWarning },
                          },
                        ],
                        onClick: ({ key }) => {
                          const updatedItems = [
                            ...(editedGradeClassItems ?? []),
                          ];
                          const index = updatedItems.findIndex(
                            (item) => item.student?.id === record.student?.id
                          );
                          if (index !== -1) {
                            updatedItems[index] = {
                              ...updatedItems[index],
                              status: key as "validated" | "pending",
                            };
                            setEditedGradeClassItems(updatedItems);
                          }
                        },
                      }}
                      arrow
                    >
                      <Tag
                        color={
                          record.status === "validated" ? "success" : "warning"
                        }
                        bordered={false}
                        style={{ width: "100%", padding: "4px 8px" }}
                        icon={
                          record.status === "validated" ? (
                            <CheckCircleOutlined
                              style={{ color: colorSuccess }}
                            />
                          ) : (
                            <HourglassOutlined />
                          )
                        }
                      >
                        {record.status === "validated"
                          ? "Validée"
                          : "En attente"}
                      </Tag>
                    </Dropdown>
                  ),
                  width: 128,
                },
                {
                  key: "actions",
                  dataIndex: "actions",
                  title: "",
                  render: (_, record) => (
                    <ButtonDeleteSingleGrade
                      gradeId={record.id}
                      session={session}
                      moment={moment}
                      // onDelete={() => {
                      //   const updatedItems = [...(editedGradeClassItems ?? [])];
                      //   const index = updatedItems.findIndex(
                      //     (item) => item.student?.id === record.student?.id
                      //   );
                      //   if (index !== -1) {
                      //     updatedItems.splice(index, 1);
                      //     setEditedGradeClassItems(updatedItems);
                      //   }
                      // }}
                    />
                  ),
                  width: 48,
                  fixed: "right",
                },
              ]}
              size="small"
              pagination={false}
              rowKey="id"
              scroll={{ y: "calc(100vh - 385px)" }}
            />
          </div>
        )}
        <IndividualGradeEntryForm
          open={openIndividualEntry}
          setOpen={setOpenIndividualEntry}
          students={courseEnrollments}
          setMoment={setMoment}
          setSession={setSession}
        />
        <BulkGradeSubmissionForm
          open={openBulkSubmission}
          setOpen={setOpenBulkSubmission}
          enrollments={courseEnrollments}
          course={course}
          juryId={Number(juryId)}
          setSession={setSession}
          setMoment={setMoment}
        />
        <ImportFileGradeSubmissionForm
          open={openFileSubmission}
          setOpen={setOpenFileSubmission}
          course={course}
          enrollments={courseEnrollments}
          setSession={setSession}
          setMoment={setMoment}
          juryId={Number(juryId)}
        />
        <ExportSomeStudentsToExcelForm
          open={openExportSomeStudentsToExcel}
          setOpen={setOpenExportSomeStudentsToExcel}
          course={course}
          enrollments={courseEnrollments}
        />
        <PrintSomeStudentsForm
          open={openPrintSome}
          setOpen={setOpenPrintSome}
          course={course}
          enrollments={courseEnrollments}
          selectedRows={selectedRowsForPrint}
          setSelectedRows={setSelectedRowsForPrint}
          onPrint={printSomeEmptyGradeList}
        />

        <EmptyListGradesToPrint
          courseEnrollments={courseEnrollments}
          course={course}
          ref={emptyAllGradeRef}
        />
        <EmptyListGradesToPrint
          courseEnrollments={selectedRowsForPrint}
          course={course}
          ref={emptySomeGradeRef}
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
            onFinish={() => {
              setEditedGradeClassItems(gradeClasses),
                setOpenRejectUpdates(false);
            }}
            disabled={!isDifferent || isPendingGradeClasses}
          />

          <ButtonMultiUpdateFormConfirm
            open={openMultiUpdateConfirm}
            setOpen={setOpenMultiUpdateConfirm}
            onFinish={onFinishMultiUpdateGrades}
            isPending={isPendingMultiupdate}
            disabled={!isDifferent || isPendingGradeClasses}
          />

          <DeleteMultiGradesButton
            open={openDeleteGrades}
            setOpen={setOpenDeleteGrades}
            gradeClasses={editedGradeClassItems}
            session={session}
            moment={moment}
          />

          <Dropdown
            menu={{
              items: [
                {
                  key: "delete",
                  label: "Supprimer les notes",
                  icon: <DeleteOutlined />,
                  danger: true,
                  disabled: editedGradeClassItems?.length === 0,
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
            <Button
              icon={<MoreOutlined />}
              type="text"
              disabled={
                isPendingCourse ||
                isPendingCourseEnrollments ||
                isPendingGradeClasses
              }
            />
          </Dropdown>
        </Space>
      </Layout.Footer>
    </Layout>
  );
}
