"use client";

import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClass } from "@/lib/api";
import { Class } from "@/types";

type FormDataType = {
  validate: string;
};

type DeleteClassFormProps = {
  classe: Class;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteClassForm: FC<DeleteClassFormProps> = ({
  classe,
  open,
  setOpen,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteClass,
  });

  const onFinish = (values: FormDataType) => {
    if (values.validate === classe.name) {
      mutateAsync(classe.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["classes"] });
          messageApi.success("Classe supprimée avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la suppression de la classe."
          );
        },
      });
    } else {
      messageApi.error("Le nom saisi ne correspond pas à la classe.");
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
            name="delete_class_form"
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
          description={`Êtes-vous sûr de vouloir supprimer la classe "${classe.name}" ? Cette action est irréversible.`}
          type="warning"
          showIcon
          style={{ border: 0 }}
        />
        <Form.Item
          name="validate"
          label="Veuillez saisir le nom de la classe pour confirmer."
          rules={[{ required: true }]}
          style={{ marginTop: 24 }}
        >
          <Input placeholder={classe.name} />
        </Form.Item>
      </Modal>
    </>
  );
};
