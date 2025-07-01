"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Col, Form, Input, message, Modal, Row, Select } from "antd";
import { Cycle, Field } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentCyclesAsOptions, updateField } from "@/lib/api";

type FormDataType = Omit<Field, "id" | "cycle"> & { cycle_id: number };

interface EditFieldFormProps {
  field: Field;
  cycles?: Cycle[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditFieldForm: React.FC<EditFieldFormProps> = ({
  field,
  cycles,
  open,
  setOpen,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateField,
  });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(
      { id: field.id, params: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["fields"] });
          messageApi.success("Domaine modifié avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification du domaine"
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
        title="Modifier le domaine"
        centered
        okText="Mettre à jour"
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
        destroyOnClose
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            disabled={isPending}
            key="edit_field_form"
            layout="vertical"
            form={form}
            name="edit_field_form"
            initialValues={{ cycle_id: field.cycle?.id, ...field }}
            onFinish={onFinish}
          >
            {dom}
          </Form>
        )}
      >
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <Form.Item
              name="name"
              label="Nom"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer un nom du domaine",
                },
              ]}
            >
              <Input placeholder="Entrez le nom" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="acronym"
              label="Acronyme"
              rules={[
                { required: true, message: "Veuillez entrer un acronyme" },
              ]}
            >
              <Input placeholder="Entrez l'acronyme" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="cycle_id"
          label="Cycle"
          rules={[
            { required: true, message: "Veuillez sélectionner un cycle" },
          ]}
        >
          <Select
            placeholder="Sélectionnez un cycle"
            options={getCurrentCyclesAsOptions(cycles)}
          />
        </Form.Item>
      </Modal>
    </>
  );
};
