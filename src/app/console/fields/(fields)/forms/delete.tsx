"use client";

import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteField } from "@/lib/api";
import { Field } from "@/types";

type FormDataType = {
  validate: string;
};

type DeleteFieldFormProps = {
  field: Field;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteFieldForm: FC<DeleteFieldFormProps> = ({
  field,
  open,
  setOpen,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteField,
  });

  const onFinish = (values: FormDataType) => {
    if (values.validate === field.name) {
      mutateAsync(field.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["fields"] });
          messageApi.success("Domaine supprimé avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la suppression du domaine."
          );
        },
      });
    } else {
      messageApi.error("Le nom saisi ne correspond pas au domaine.");
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title="Suppression"
        centered
        okText="Supprimer"
        cancelText="Annuler"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          disabled: isPending,
          loading: isPending,
          danger: true,
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
            name="delete_field_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={{ enabled: true }}
          >
            {dom}
          </Form>
        )}
      >
        <Alert
          message="Attention"
          description={`Êtes-vous sûr de vouloir supprimer le domaine "${field.name}" ? Cette action est irréversible.`}
          type="warning"
          showIcon
          style={{ border: 0 }}
        />
        <Form.Item
          name="validate"
          label="Veuillez saisir le nom du domaine pour confirmer."
          rules={[{ required: true }]}
          style={{ marginTop: 24 }}
        >
          <Input placeholder={field.name} />
        </Form.Item>
      </Modal>
    </>
  );
};
