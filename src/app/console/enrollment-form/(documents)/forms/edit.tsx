"use client";

import React, { Dispatch, FC, SetStateAction } from "react";
import { Checkbox, Col, Form, Input, message, Modal, Row, Switch } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRequiredDocument } from "@/lib/api";
import { RequiredDocument } from "@/types";

type FormDataType = Omit<RequiredDocument, "id">;

type EditRequiredDocumentFormProps = {
  document: RequiredDocument;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditRequiredDocumentForm: FC<EditRequiredDocumentFormProps> = ({
  document,
  open,
  setOpen,
}) => {
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateRequiredDocument,
  });

  const onFinish = (values: FormDataType) => {
    mutateAsync(
      { id: document.id, params: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["required-documents"] });
          messageApi.success("Elément modifié avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification de l'élément du dossier."
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
        title="Modification de l'élément du dossier"
        centered
        okText="Mettre à jour"
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
            name="edit_required_document_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={document}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="title"
          label="Titre du document"
          rules={[{ required: true }]}
        >
          <Input placeholder="Elément du dossier" />
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              name="required"
              label="Obligatoire"
              valuePropName="checked"
              layout="horizontal"
            >
              <Checkbox />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="enabled" label="Visible" layout="horizontal">
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
