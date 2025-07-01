"use client";

import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Classroom } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClassroom, getRoomsTypeAsOptions } from "@/lib/api";

type FormDataType = Omit<Classroom, "id">;

export const NewClassroomForm: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createClassroom,
  });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["classrooms"] });
        messageApi.success("Salle de classe créée avec succès !");
        setOpen(false);
      },
      onError: () => {
        messageApi.error(
          "Une erreur s'est produite lors de la création de la salle de classe."
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
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Nouvelle salle de classe
      </Button>
      <Modal
        open={open}
        title="Nouvelle salle de classe"
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
            key="create_new_classroom"
            layout="vertical"
            form={form}
            name="create_new_classroom"
            onFinish={onFinish}
            clearOnDestroy
          >
            {dom}
          </Form>
        )}
      >
        <Row gutter={[16,16]} style={{ marginTop: 24 }}>
          <Col span={16}>
            <Form.Item
              name="name"
              label="Nom de la salle"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer le nom de la salle",
                },
              ]}
            >
              <Input placeholder="Nom de la salle" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="code"
              label="Code de la salle"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer le code de la salle",
                },
              ]}
            >
              <Input placeholder="Code de la salle" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16,16]}>
            <Col span={16}>
            <Form.Item
            name="room_type"
            label="Type de salle"
            rules={[
            {
              required: true,
              message: "Veuillez sélectionner un type de salle",
            },
            ]}
          >
            <Select
            placeholder="Sélectionnez un type"
            options={getRoomsTypeAsOptions}
            />
          </Form.Item>
            </Col>
        <Col span={8}>
        <Form.Item
          name="capacity"
          label="Capacité"
          rules={[{ required: true, message: "Veuillez entrer la capacité" }]}
        >
          <InputNumber type="number" placeholder="Capacité" />
        </Form.Item>
        </Col>
        </Row>
        <Form.Item
          name="status"
          label="Statut"
          rules={[
            { required: true, message: "Veuillez sélectionner un statut" },
          ]}
        >
          <Radio.Group
            options={[
              { value: "occupied", label: "Occupé" },
              { value: "unoccupied", label: "Inoccupé" },
            ]}
          />
        </Form.Item>
      </Modal>
    </>
  );
};
