"use client";

import { getCurrentPeriodsAsOptions } from "@/lib/api";
import { createAnnoucement } from "@/lib/api/annoucement";
import { Class, Department, Period } from "@/types";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Descriptions, Drawer, Flex, Form, Select, theme } from "antd";
import { useParams } from "next/navigation";
import { parseAsBoolean, useQueryState } from "nuqs";
import { FC } from "react";

type NewAnnoucementFormProps = {
  department?: Department;
  classYear?: Class;
  yearId?: number;
  periods?: Period[];
};

type FormDataType = {
  session: "main_session" | "retake_session";
  moment: "before_appeal" | "after_appeal";
  status: "locked" | "unlocked";
  period_id: number;
};

export const NewAnnoucementForm: FC<NewAnnoucementFormProps> = ({
  department,
  classYear,
  yearId,
  periods,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [form] = Form.useForm();
  const { facultyId, departmentId, classId } = useParams();
  const [open, setOpen] = useQueryState(
    "new",
    parseAsBoolean.withDefault(false)
  );

  const { mutateAsync, isPending, isError } = useMutation({
    mutationFn: createAnnoucement,
  });

  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const onFinish = (values: FormDataType) => {
    mutateAsync(
      {
        ...values,
        faculty_id: Number(facultyId),
        department_id: Number(departmentId),
        class_id: Number(classId),
        year_id: Number(yearId),
        field_id: Number(),
      },
      {
        onSuccess: () => {},
        onError: () => {},
      }
    );
  };

  return (
    <>
      <Button
        icon={<PlusOutlined />}
        color="primary"
        variant="solid"
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Nouvelle publication
      </Button>
      <Drawer
        title="Nouvelle publication"
        extra={
          <Button icon={<CloseOutlined />} type="text" onClick={onClose} />
        }
        open={open}
        onClose={onClose}
        closable={false}
        maskClosable={false}
        footer={
          <Flex justify="end" gap={8}>
            <Button onClick={onClose} style={{ boxShadow: "none" }}>
              Annuler
            </Button>
            <Button
              type="primary"
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
      >
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
                style={{ width: "100%" }}
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
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    </>
  );
};
