"use client";

import React, { Dispatch, FC, SetStateAction, useState } from "react";
import {
  Button,
  Drawer,
  Form,
  InputNumber,
  message,
  Space,
  Select,
  theme,
  Card,
  Divider,
  Flex,
  Typography,
  Checkbox,
} from "antd";
import { CheckCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { filterOption } from "@/lib/utils";
import { CourseEnrollment, NewGradeClass } from "@/types";
import {
  createBulkGradeClasses,
  getCourseEnrollmentsAsOptions,
} from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Options } from "nuqs";

type IndividualGradeEntryFormProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  students?: CourseEnrollment[];
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

type FormDataType = {
  student_id: number;
  continuous_assessment?: number;
  exam?: number;
  session: "main_session" | "retake_session";
  moment: "before_appeal" | "after_appeal";
  is_retaken?: boolean;
};

export const IndividualGradeEntryForm: FC<IndividualGradeEntryFormProps> = ({
  open,
  setOpen,
  students,
  setSession,
  setMoment,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const { juryId, courseId } = useParams();
  const [total, setTotal] = useState<number | undefined>();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createBulkGradeClasses,
  });

  const onClose = () => {
    form.resetFields();
    setOpen(false);
    setTotal(undefined)
  };

  const handleFinish = async (values: FormDataType) => {
    const formatedData: NewGradeClass[] = [
      {
        student: students?.find((item) => item.id === values.student_id)
          ?.student,
        continuous_assessment: values.continuous_assessment,
        exam: values.exam,
        is_retaken: values.is_retaken ?? false,
        status: "validated",
      },
    ];

    mutateAsync(
      {
        juryId: Number(juryId),
        courseId: Number(courseId),
        session: values.session,
        moment: values.moment,
        gradesClass: formatedData,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              "grade_classes",
              courseId,
              `${values.session}`,
              `${values.moment}`,
            ],
          });
          setSession(values.session);
          setMoment(values.moment);
          messageApi.success("Note enregistrée avec succès !");
          onClose();
        },
        onError: (error) => {
          messageApi.error(
            (error as any)?.response?.data?.message ||
              "Erreur lors de l'enregistrement de la note."
          );
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Drawer
        open={open}
        title={
          <Flex justify="space-between">
            <Typography.Title
              level={4}
              style={{ marginBottom: 0, color: "#fff" }}
            >
              Saisie individuelle des notes
            </Typography.Title>
            <Button onClick={onClose} type="text" icon={<CloseOutlined />} />
          </Flex>
        }
        destroyOnHidden
        onClose={onClose}
        closable={false}
        maskClosable={false}
        styles={{ header: { background: colorPrimary, color: "#fff" } }}
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "12px 24px",
            }}
          >
            <Space>
              <Button
                onClick={onClose}
                style={{ boxShadow: "none" }}
                disabled={isPending}
              >
                Annuler
              </Button>
              <Button
                type="primary"
                onClick={() => form.submit()}
                style={{ boxShadow: "none" }}
                icon={<CheckCircleOutlined />}
                loading={isPending}
                disabled={isPending}
              >
                Sauvegarder
              </Button>
            </Space>
          </div>
        }
      >
        <Form
          key="individual_grade_entry_form"
          form={form}
          name="individual_grade_entry_form"
          onFinish={handleFinish}
          disabled={isPending}
        >
          <Card>
            <Form.Item
              name="student_id"
              label="Étudiant"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer l'ID de l'étudiant",
                },
              ]}
              layout="vertical"
            >
              <Select
                placeholder="Sélectionner un étudiant"
                options={getCourseEnrollmentsAsOptions(students)}
                showSearch
                filterOption={filterOption}
                allowClear
                variant="filled"
              />
            </Form.Item>
          </Card>
          <Card style={{ marginTop: 16 }} variant="borderless">
            <Form.Item
              name="continuous_assessment"
              label="Contrôle continu"
              rules={[
                { type: "number", message: "Veuillez entrer une note valide" },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Note du contrôle continu"
                min={0.0}
                step={0.01}
                max={10}
                addonAfter="/10"
                variant="filled"
                onChange={(value) => {
                  if (typeof form.getFieldValue("exam") === "number") {
                    const newTotal = value + form.getFieldValue("exam");
                    setTotal(newTotal);
                  }
                }}
              />
            </Form.Item>
            <Form.Item
              name="exam"
              label="Examen"
              rules={[
                { type: "number", message: "Veuillez entrer une note valide" },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Note de l'examen"
                min={0.0}
                step={0.01}
                max={10}
                addonAfter="/10"
                variant="filled"
                onChange={(value) => {
                  if (typeof form.getFieldValue("continuous_assessment") === "number") {
                    const newTotal = value + form.getFieldValue("continuous_assessment");
                    setTotal(newTotal);
                  }
                }}
              />
            </Form.Item>
            <Divider />
            <Flex justify="space-between" align="center">
              <Typography.Title
                level={5}
                style={{ marginBottom: 0, marginTop: 0 }}
              >
                Total
              </Typography.Title>
              <Typography.Title
                level={5}
                style={{ marginBottom: 0, marginTop: 0 }}
              >
                {total}/20
              </Typography.Title>
            </Flex>
            <Divider />
            <div>
              <Form.Item
                name="session"
                label="Session"
                rules={[{ required: true }]}
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
                rules={[{ required: true }]}
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
              <Form.Item
                name="is_retaken"
                valuePropName="checked"
                // label="A repassé l'examen"
                style={{ marginBottom: 0 }}
              >
                <Checkbox style={{ width: "100%" }}>
                  Cours suivi comme Retake ?
                </Checkbox>
              </Form.Item>
            </div>
          </Card>
        </Form>
      </Drawer>
    </>
  );
};
