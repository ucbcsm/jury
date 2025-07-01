"use client";

import React, { useState } from "react";
import { Button, Form, Input, message, Modal, Switch } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEnrollmentQuestion } from "@/lib/api";
import { EnrollmentQuestion } from "@/types";

type FormDataType = Omit<EnrollmentQuestion, "id">;

export const NewEnrollmentQuestionForm: React.FC = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createEnrollmentQuestion,
  });

  const onFinish = (values: FormDataType) => {
    mutateAsync(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["enrollment_questions"] });
        messageApi.success("Question créée avec succès !");
        setOpen(false);
      },
      onError: () => {
        messageApi.error(
          "Une erreur s'est produite lors de la création de la question."
        );
      },
    });
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        title="Ajouter"
        onClick={() => setOpen(true)}
        style={{ boxShadow: "none" }}
      >
        Ajouter
      </Button>
      <Modal
        open={open}
        title="Nouvelle question importante"
        centered
        okText="Créer"
        cancelText="Annuler"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          disabled: isPending,
          loading: isPending,
        }}
        cancelButtonProps={{
          style: { boxShadow: "none" },
          disabled: isPending,
        }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        closable={{ disabled: isPending }}
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            name="create_enrollment_question_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={{ enabled: true }}
            clearOnDestroy
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="question"
          label="Question"
          rules={[{ required: true, }]}
        >
          <Input placeholder="La question" />
        </Form.Item>
        <Form.Item name="enabled" label="Visible"  >
          <Switch />
        </Form.Item>
      </Modal>
    </>
  );
};
