"use client";

import React, { Dispatch, FC, SetStateAction } from "react";
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
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { InputGrade } from "./input-grade";
import { NewGradeClass, TaughtCourse } from "@/types";

type BulkGradeSubmissionFormProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  newGradeClassItems?: NewGradeClass[];
  setNewGradeClassItems: Dispatch<SetStateAction<NewGradeClass[] | undefined>>;
  course?: TaughtCourse;
};

export const BulkGradeSubmissionForm: FC<BulkGradeSubmissionFormProps> = ({
  open,
  setOpen,
  newGradeClassItems,
  setNewGradeClassItems,
  course,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const onClose = () => setOpen(false);

  const handleFinish = async (values: any) => {
    try {
      // Traitez ici la soumission en masse
      messageApi.success("Soumission en masse réussie !");
      setOpen(false);
    } catch {
      messageApi.error("Erreur lors de la soumission en masse.");
    }
  };

  return (
    <>
      {contextHolder}
      <Drawer
        open={open}
        title={
          <Flex justify="space-between" align="center">
            <Typography.Title
              level={4}
              style={{ marginBottom: 0, color: "#fff" }}
            >
              Saisie collective des notes
            </Typography.Title>
            <Typography.Title
              level={4}
              style={{
                marginBottom: 0,
                marginTop: 0,
                textTransform: "uppercase",
              }}
              type="warning"
            >
              {course?.available_course.name}
            </Typography.Title>
          </Flex>
        }
        destroyOnHidden
        onClose={onClose}
        closable
        maskClosable
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
              <Button onClick={onClose} style={{ boxShadow: "none" }}>
                Annuler
              </Button>
              <Button
                type="primary"
                onClick={() => form.submit()}
                style={{ boxShadow: "none" }}
                icon={<CheckCircleOutlined />}
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
          layout="vertical"
        >
          <Table
            title={() => (
              <header className="flex pb-1 px-0">
                <Space>
                  <Typography.Title
                    type="secondary"
                    level={5}
                    style={{ marginBottom: 0,marginTop:0 }}
                  >
                    Étudiants
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
                  >
                    <Select
                      variant="filled"
                      placeholder="Session"
                      options={[
                        { value: "main_session", label: "Principale" },
                        { value: "retake_session", label: "Rattrapage" },
                      ]}
                      style={{ width: "100%" }}
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
                  >
                    <Select
                      variant="filled"
                      placeholder="Moment"
                      options={[
                        { value: "before_appeal", label: "Avant recours" },
                        { value: "after_appeal", label: "Après recours" },
                      ]}
                      style={{ width: "100%" }}
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
                    disabled={!record.student}
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
                      ? `${record.continuous_assessment + record.exam}`
                      : ""}
                  </Typography.Text>
                ),
                width: 72,
                align: "right",
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
                    status={
                      record.status === "validated" ? undefined : "warning"
                    }
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
                key: "is_retaken",
                dataIndex: "is_retaken",
                title: "Retake",
                render: (_, record) => <Checkbox />,
                width: 62,
                align: "center",
              },
            ]}
            size="small"
            pagination={false}
          />
        </Form>
      </Drawer>
    </>
  );
};
