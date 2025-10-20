"use client";

import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  Button,
  Drawer,
  Form,
  Select,
  message,
  Space,
  Typography,
  theme,
  Table,
  Checkbox,
  Flex,
  Dropdown,
  Tag,
  Modal,
  Alert,
} from "antd";
import {
  CheckCircleOutlined,
  CloseOutlined,
  HourglassOutlined,
} from "@ant-design/icons";
import { InputGrade } from "./input-grade";
import { CourseEnrollment, NewGradeClass, TaughtCourse } from "@/types";
import { ButtonRemoveGrade } from "./button-remove-grade-list";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBulkGradeClasses } from "@/lib/api";
import { Options } from "nuqs";

type FormDataType = {
  moment: "before_appeal" | "after_appeal";
  session: "main_session" | "retake_session";
};

type BulkGradeSubmissionFormProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  course?: TaughtCourse;
  juryId?: number;
  enrollments?: CourseEnrollment[];
  setSession: (
    value:
      | "main_session"
      | "retake_session"
      | ((
          old: "main_session" | "retake_session"
        ) => "main_session" | "retake_session" | null)
      | null,
    options?: Options
  ) => Promise<URLSearchParams>;
  setMoment: (
    value:
      | "before_appeal"
      | "after_appeal"
      | ((
          old: "before_appeal" | "after_appeal"
        ) => "before_appeal" | "after_appeal" | null)
      | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const BulkGradeSubmissionForm: FC<BulkGradeSubmissionFormProps> = ({
  open,
  setOpen,
  course,
  juryId,
  enrollments,
  setSession,
  setMoment,
}) => {
  const {
    token: { colorPrimary, colorSuccess, colorWarning },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [openCancelForm, setOpenCancelForm] = useState<boolean>(false);
  const [newGradeClassItems, setNewGradeClassItems] = useState<
    NewGradeClass[] | undefined
  >();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createBulkGradeClasses,
  });

  const onClose = () => {
    setOpen(false);
    const items = getGradeItemsFromCourseEnrollments();
    setNewGradeClassItems(items);
    form.resetFields();
  };

  const handleFinish = (values: FormDataType) => {
    if (newGradeClassItems && newGradeClassItems.length > 0) {
      mutateAsync(
        {
          juryId: Number(juryId),
          courseId: Number(course?.id),
          session: values.session,
          moment: values.moment,
          gradesClass: newGradeClassItems,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: [
                "grade_classes",
                `${course?.id}`,
                `${values.session}`,
                `${values.moment}`,
              ],
            });
            setSession(values.session);
            setMoment(values.moment);
            messageApi.success("Soumission en masse réussie !");
            setOpen(false);
          },
          onError: (error:Error) => {
            messageApi.error(
              (error as any)?.response?.data?.message ||
                "Erreur lors de la soumission en masse."
            );
          },
        }
      );
    } else {
      messageApi.error("Aucun étudiant à soumettre.");
    }
  };

  const getGradeItemsFromCourseEnrollments = () => {
    return enrollments?.map((student) => ({
      student: student.student,
      continuous_assessment: null,
      exam: null,
      is_retaken: false,
      status: "validated",
    })) as NewGradeClass[];
  };

  useEffect(() => {
    if (enrollments) {
      const items = getGradeItemsFromCourseEnrollments();
      setNewGradeClassItems(items);
    }
  }, [enrollments]);

  return (
    <>
      {contextHolder}
      <Drawer
        open={open}
        title={
          <Flex align="center" gap={8}>
            <Typography.Title
              level={4}
              style={{ marginBottom: 0, color: "#fff" }}
            >
              Saisie collective des notes
            </Typography.Title>
            <div className="flex-1" />
            <Typography.Title
              level={4}
              style={{
                marginBottom: 0,
                marginTop: 0,
                textTransform: "uppercase",
              }}
              type="success"
            >
              {course?.available_course.name}
            </Typography.Title>
            <Button
              onClick={() => setOpenCancelForm(true)}
              type="text"
              icon={<CloseOutlined />}
              disabled={isPending || !newGradeClassItems}
            />
          </Flex>
        }
        destroyOnHidden
        onClose={onClose}
        closable={false}
        maskClosable={false}
        width="60%"
        styles={{ header: { background: colorPrimary, color: "#fff" } }}
        footer={
          <Flex
            justify="space-between"
            style={{
              padding: "12px 24px",
            }}
          >
            <Typography.Title
              type="secondary"
              level={5}
              style={{ marginBottom: 0 }}
            >
              Saisie des notes
            </Typography.Title>
            <Space>
              <Button
                disabled={
                  isPending ||
                  newGradeClassItems?.length === 0 ||
                  !newGradeClassItems
                }
                onClick={() => setOpenCancelForm(true)}
                style={{ boxShadow: "none" }}
              >
                Annuler
              </Button>
              <Modal
                title="Annuler la saisie des notes"
                centered
                open={openCancelForm}
                destroyOnHidden
                cancelText="Retour"
                okText="Confirmer"
                onOk={() => {
                  setOpenCancelForm(false);
                  onClose();
                }}
                onCancel={() => setOpenCancelForm(false)}
                cancelButtonProps={{ style: { boxShadow: "none" } }}
                okButtonProps={{ style: { boxShadow: "none" }, danger: true }}
              >
                <Alert
                  message="Attention !"
                  description="Vous êtes sur le point de quitter ce formulaire. Toutes les notes non enregistrées seront perdues."
                  type="warning"
                  showIcon
                  style={{ border: 0, marginBottom: 16 }}
                />
              </Modal>
              <Button
                type="primary"
                onClick={() => form.submit()}
                style={{ boxShadow: "none" }}
                icon={<CheckCircleOutlined />}
                disabled={
                  isPending ||
                  newGradeClassItems?.length === 0 ||
                  !newGradeClassItems
                }
                loading={isPending}
              >
                Sauvegarder
              </Button>
            </Space>
          </Flex>
        }
      >
        <Form
          key="bulk_grade_submission_form"
          form={form}
          name="bulk_grade_submission_form"
          onFinish={handleFinish}
          disabled={isPending}
        >
          <Table
            title={() => (
              <header className="flex pb-1 px-0">
                <Space>
                  <Typography.Title
                    type="secondary"
                    level={5}
                    style={{
                      marginBottom: 0,
                      marginTop: 0,
                      textTransform: "uppercase",
                    }}
                  >
                    Notes
                  </Typography.Title>
                </Space>
                <div className="flex-1" />
                <Space>
                  <Form.Item
                    name="session"
                    label="Session"
                    rules={[
                      {
                        required: true,
                        message: "Veuillez sélectionner la session",
                      },
                    ]}
                    layout="horizontal"
                    style={{ marginBottom: 0 }}
                  >
                    <Select
                      variant="filled"
                      placeholder="Session"
                      options={[
                        { value: "main_session", label: "Principale" },
                        { value: "retake_session", label: "Rattrapage" },
                      ]}
                      style={{ width: 110 }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="moment"
                    label="Moment"
                    rules={[
                      {
                        required: true,
                        message: "Veuillez sélectionner le moment",
                      },
                    ]}
                    layout="horizontal"
                    style={{ marginBottom: 0 }}
                  >
                    <Select
                      variant="filled"
                      placeholder="Moment"
                      options={[
                        { value: "before_appeal", label: "Avant recours" },
                        { value: "after_appeal", label: "Après recours" },
                      ]}
                      style={{ width: 128 }}
                    />
                  </Form.Item>
                </Space>
              </header>
            )}
            dataSource={newGradeClassItems}
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
                  `${record.student?.year_enrollment.user.surname} ${record.student?.year_enrollment.user.last_name} ${record.student?.year_enrollment.user.first_name}`,
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
                    disabled={!record.student || isPending}
                  />
                ),
                width: 92,
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
                    disabled={!record.student || isPending}
                  />
                ),
                width: 92,
                // align: "right",
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
                key: "is_retaken",
                dataIndex: "is_retaken",
                title: "Retake?",
                render: (_, record) => (
                  <Checkbox
                    checked={record.is_retaken}
                    onChange={(e) => {
                      const updatedItems = [...(newGradeClassItems ?? [])];
                      const index = updatedItems.findIndex(
                        (item) => item.student?.id === record.student?.id
                      );
                      if (index !== -1) {
                        updatedItems[index] = {
                          ...updatedItems[index],
                          is_retaken: e.target.checked,
                        };
                        setNewGradeClassItems(updatedItems);
                      }
                    }}
                    disabled={isPending}
                  />
                ),
                width: 68,
                align: "center",
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
                        const updatedItems = [...(newGradeClassItems ?? [])];
                        const index = updatedItems.findIndex(
                          (item) => item.student?.id === record.student?.id
                        );
                        if (index !== -1) {
                          updatedItems[index] = {
                            ...updatedItems[index],
                            status: key as "validated" | "pending",
                          };
                          setNewGradeClassItems(updatedItems);
                        }
                      },
                    }}
                    arrow
                    disabled={isPending}
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
                      {record.status === "validated" ? "Validée" : "En attente"}
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
                  <ButtonRemoveGrade
                    onDelete={() => {
                      const updatedItems = [...(newGradeClassItems ?? [])];
                      const index = updatedItems.findIndex(
                        (item) => item.student?.id === record.student?.id
                      );
                      if (index !== -1) {
                        updatedItems.splice(index, 1);
                        setNewGradeClassItems(updatedItems);
                      }
                    }}
                    disabled={isPending}
                  />
                ),
                width: 48,
              },
            ]}
            size="small"
            pagination={false}
            scroll={{ y: "calc(100vh - 280px)" }}
          />
        </Form>
      </Drawer>
    </>
  );
};
