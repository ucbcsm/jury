"use client";

import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRequiredDocument } from "@/lib/api";
import { RequiredDocument } from "@/types";

type FormDataType = {
  validate: string;
};

type DeleteRequiredDocumentFormProps = {
  document: RequiredDocument;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteRequiredDocumentForm: FC<
  DeleteRequiredDocumentFormProps
> = ({ document, open, setOpen }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteRequiredDocument,
  });

  const onFinish = (values: FormDataType) => {
    if (values.validate === document.title) {
      mutateAsync(document.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["required-documents"] });
          messageApi.success("Elément supprimé avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la suppression de l'élément."
          );
        },
      });
    } else {
      messageApi.error(
        "Le nom saisi ne correspond pas à l'élément du dossier."
      );
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
            name="delete_required_document_form"
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
          description={`Êtes-vous sûr de vouloir supprimer l'élément "${document.title}" ? Cette action est irréversible.`}
          type="warning"
          showIcon
          style={{ border: 0 }}
        />
        <Form.Item
          name="validate"
          label="Veuillez saisir le nom du document pour confirmer."
          rules={[{ required: true }]}
          style={{ marginTop: 24 }}
        >
          <Input placeholder={document.title} />
        </Form.Item>
      </Modal>
    </>
  );
};
