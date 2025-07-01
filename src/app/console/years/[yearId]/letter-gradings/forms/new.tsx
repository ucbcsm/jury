"use client";

import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLetterGrading } from "@/lib/api";

type FormDataType = {
  grade_letter: string;
  lower_bound: number;
  upper_bound: number;
  appreciation: string;
  description: string;
};

export const NewLetterGradingForm: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createLetterGrading,
  });

  const onFinish = (values: FormDataType) => {
    mutateAsync(
      { ...values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["letter_gradings"] });
          messageApi.success("Notation à lettres créée avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la création de la notation."
          );
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className="shadow-none"
        title="Ajouter une notation à lettres"
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Créer
      </Button>
      <Modal
        open={open}
        title="Nouvelle notation à lettres"
        centered
        okText="Créer"
        cancelText="Annuler"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          loading: isPending,
        }}
        cancelButtonProps={{
          style: { boxShadow: "none" },
        }}
        onCancel={() => setOpen(false)}
        destroyOnHidden
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            disabled={isPending}
            key="create_new_letter_grading"
            layout="vertical"
            form={form}
            name="create_new_letter_grading"
            onFinish={onFinish}
            clearOnDestroy
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="grade_letter"
          label="Lettre de la note"
          rules={[
            { required: true, message: "Veuillez entrer la lettre de la note" },
          ]}
        >
          <Input placeholder="Ex: A, B, C..." maxLength={2} />
        </Form.Item>
        <Form.Item
          name="lower_bound"
          label="Borne inférieure"
          rules={[
            { required: true, message: "Veuillez entrer la borne inférieure" },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} step={0.1} placeholder="Ex: 15" />
        </Form.Item>
        <Form.Item
          name="upper_bound"
          label="Borne supérieure"
          rules={[
            { required: true, message: "Veuillez entrer la borne supérieure" },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} step={0.1} placeholder="Ex: 20" />
        </Form.Item>
        <Form.Item
          name="appreciation"
          label="Appréciation"
          rules={[
            { required: true, message: "Veuillez entrer l'appréciation" },
          ]}
        >
          <Input placeholder="Ex: Excellent" />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[]}>
          <Input.TextArea placeholder="Description optionnelle" />
        </Form.Item>
      </Modal>
    </>
  );
};
