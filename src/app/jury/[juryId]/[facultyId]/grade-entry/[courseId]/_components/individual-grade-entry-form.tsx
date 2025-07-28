"use client";

import React, { Dispatch, FC, SetStateAction } from "react";
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
import { CheckCircleOutlined } from "@ant-design/icons";
import { filterOption } from "@/lib/utils";
import { CourseEnrollment } from "@/types";
import { getCourseEnrollmentsAsOptions } from "@/lib/api";
// import { updateGradeEntry } from "@/lib/api"; // À adapter selon votre API

type IndividualGradeEntryFormProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  students?: CourseEnrollment[];
  //   initialValues?: {
  //     continuous_assessment: number | null;
  //     exam: number | null;
  //     total: number;
  //   };
  //   onSubmit: (values: {
  //     continuous_assessment: number | null;
  //     exam: number | null;
  //     total: number;
  //   }) => Promise<void>;
};

export const IndividualGradeEntryForm: FC<IndividualGradeEntryFormProps> = ({
  open,
  setOpen,
  students,
  //   initialValues,
  //   onSubmit,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const onClose = () => setOpen(false);

  const handleFinish = async (values: any) => {
    try {
      //   await onSubmit(values);
      messageApi.success("Note enregistrée avec succès !");
      setOpen(false);
    } catch {
      messageApi.error("Erreur lors de l'enregistrement de la note.");
    }
  };

  return (
    <>
      {contextHolder}
      <Drawer
        open={open}
        title="Saisie individuelle des notes"
        destroyOnHidden
        onClose={onClose}
        closable
        maskClosable
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
          </div>
        }
      >
        <Form
          key="individual_grade_entry_form"
          form={form}
          name="individual_grade_entry_form"
          //   initialValues={initialValues}
          onFinish={handleFinish}
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
                /20
              </Typography.Title>
            </Flex>
            <Divider />
            <div>
              <Form.Item
                name="session"
                label="Session"
                initialValue="main_session"
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
                initialValue="before_appeal"
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
