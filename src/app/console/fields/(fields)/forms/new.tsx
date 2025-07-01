"use client";

import React, { useState } from "react";
import { Button, Col, Form, Input, message, Modal, Row, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Cycle, Field } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createField, getCurrentCyclesAsOptions } from "@/lib/api";

type FormDataType = Omit<Field, "id" | "cycle"> & { cycle_id: number };
type NewFieldFormProps = {
  cycles?: Cycle[];
};
export const NewFieldForm: React.FC<NewFieldFormProps> = ({ cycles }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createField,
  });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["fields"] });
        messageApi.success("Domaine créé avec succès !");
        setOpen(false);
      },
      onError: () => {
        messageApi.error(
          "Une erreur s'est produite lors de la création du domaine."
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
        className="shadow-none"
        title="Ajouter un domaine"
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Ajouter
      </Button>
      <Modal
        open={open}
        title="Nouveau domaine"
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
        destroyOnClose
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            disabled={isPending}
            key="create_new_field"
            layout="vertical"
            form={form}
            name="create_new_field"
            onFinish={onFinish}
            clearOnDestroy
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
