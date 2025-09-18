"use client";

import { getCurrentPeriodsAsOptions } from "@/lib/api";
import { createAnnoucementWithSome } from "@/lib/api";
import { Class, Department, Period } from "@/types";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Flex,
  Form,
  message,
  Row,
  Select,
  Space,
  Spin,
  Table,
  theme,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import { Options } from "nuqs";
import { FC } from "react";

type NewAnnoucementWithSomeFormProps = {
  department?: Department;
  classYear?: Class;
  yearId?: number;
  periods?: Period[];
  open: boolean;
  setOpen: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

type FormDataType = {
  session: "main_session" | "retake_session";
  moment: "before_appeal" | "after_appeal";
  status: "locked" | "unlocked";
  period_id: number;
};

export const NewAnnoucementWithSomeForm: FC<
  NewAnnoucementWithSomeFormProps
> = ({ department, classYear, yearId, periods, open, setOpen }) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const { juryId, facultyId, departmentId, classId } = useParams();

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createAnnoucementWithSome,
  });

  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const onFinish = (values: FormDataType) => {
    mutateAsync(
      {
        // ...values,
        // jury_id: Number(juryId),
        // faculty_id: Number(facultyId),
        // department_id: Number(departmentId),
        // class_id: Number(classId),
        // year_id: Number(yearId),
        mode: "ALL-STUDENTS",
        selectedRegisteredStudentsList: [],
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["annoucements"] });
          messageApi.success("Publication Créée avec succès !");
          setOpen(false);
        },
        onError: (error: Error) => {
          messageApi.error(
            error.message ||
              "Une erreur s'est produite lors de la création de la publication."
          );
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Drawer
        title="Nouvelle publication"
        extra={
          <Button
            icon={<CloseOutlined />}
            type="text"
            onClick={onClose}
            disabled={isPending}
          />
        }
        open={open}
        onClose={onClose}
        closable={false}
        maskClosable={false}
        footer={
          <Flex justify="end" gap={8}>
            <Button
              onClick={onClose}
              style={{ boxShadow: "none" }}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button
              type="primary"
              disabled={isPending}
              loading={isPending}
              onClick={() => {
                form.submit();
              }}
              style={{ boxShadow: "none" }}
            >
              Démarrer
            </Button>
          </Flex>
        }
        styles={{ header: { background: colorPrimary, color: "#fff" } }}
        width={"100%"}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "auto",
            display: !isPending ? "block" : "none",
          }}
        >
          <Row gutter={[24, 24]}>
            <Col span={16}>
              <Card>
                <Table
                  title={() => (
                    <header className="flex pb-3">
                      <Space>
                        <Typography.Title level={5} style={{ marginBottom: 0 }}>
                          Étudiants
                        </Typography.Title>
                      </Space>
                      <div className="flex-1" />
                      <Space></Space>
                    </header>
                  )}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Descriptions
                  title="Détails"
                  bordered
                  size="small"
                  column={1}
                  items={[
                    {
                      key: "faculty",
                      label: "Filière",
                      children: department?.faculty.name || "",
                    },
                    {
                      key: "department",
                      label: "Mention",
                      children: department?.name || "",
                    },
                    {
                      key: "class",
                      label: "Promotion",
                      children: classYear?.acronym,
                    },
                  ]}
                />

                <div className="mt-6">
                  <Form.Item
                    name="period_id"
                    label="Période"
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="Sélectionnner une période"
                      variant="filled"
                      // style={{ width: "100%" }}
                      options={getCurrentPeriodsAsOptions(periods)}
                    />
                  </Form.Item>
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
                      // style={{ width: "100%" }}
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
                      // style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="status"
                    label="Statut"
                    rules={[{ required: true }]}
                    initialValue="locked"
                  >
                    <Select
                      variant="filled"
                      placeholder="Statut"
                      options={[
                        { value: "locked", label: "Verrouillé" },
                        { value: "unlocked", label: "Ouvert" },
                      ]}
                      // style={{ width: "100%" }}
                    />
                  </Form.Item>
                </div>
              </Form>
            </Col>
          </Row>
        </div>
        <div
          className="h-[calc(100vh-196px)] flex-col justify-center items-center"
          style={{ display: !isPending ? "none" : "flex" }}
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <Typography.Title
            type="secondary"
            level={3}
            style={{ marginTop: 10 }}
          >
            Calcul en cours ...
          </Typography.Title>
          <Typography.Text type="secondary">
            Cette opération peut prendre plus de temps selon les cas.
          </Typography.Text>
          <Typography.Text type="secondary">
            Veuillez donc patienter!
          </Typography.Text>
        </div>
      </Drawer>
    </>
  );
};
