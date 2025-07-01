"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Typography,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLetterGrading } from "@/lib/api";
import { LetterGrading } from "@/types";

type FormDataType = {
  grade_letter: string;
  lower_bound: number;
  upper_bound: number;
  appreciation: string;
  description: string;
};

type EditLetterGradingFormProps = {
  letterGrading: LetterGrading;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditLetterGradingForm: React.FC<EditLetterGradingFormProps> = ({
  letterGrading,
  open,
  setOpen,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
console.log(letterGrading)
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateLetterGrading,
  });

  const onFinish = (values: FormDataType) => {
    mutateAsync(
      { id: letterGrading.id, data: { ...values } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["letter_gradings"] });
          messageApi.success("Notation à lettres modifiée avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification de la notation."
          );
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title="Modifier la notation à lettres"
        centered
        okText="Enregistrer"
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
            key={`edit_letter_grading_${letterGrading.id}`}
            layout="vertical"
            form={form}
            name="edit_letter_grading"
            onFinish={onFinish}
            initialValues={{...letterGrading}}
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
