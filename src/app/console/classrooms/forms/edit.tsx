"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
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
import { Classroom } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoomsTypeAsOptions, updateClassroom } from "@/lib/api";

type FormDataType = Omit<Classroom, "id">;

interface EditClassroomFormProps {
  classroom: Classroom;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditClassroomForm: React.FC<EditClassroomFormProps> = ({
  classroom,
  open,
  setOpen,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateClassroom,
  });

  const onFinish = (values: FormDataType) => {
    // console.log("Received values of form: ", values);

    mutateAsync(
      { params: values, id: classroom.id }, // Include the classroom ID for the update
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["classrooms"] });
          messageApi.success("Salle de classe modifiée avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification de la salle de classe."
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
        title="Modifier la salle de classe"
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
            key="edit_classroom"
            layout="vertical"
            form={form}
            name="edit_classroom"
            initialValues={classroom}
            onFinish={onFinish}
          >
            {dom}
          </Form>
        )}
      >
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
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
        <Row gutter={[16, 16]}>
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
              rules={[
                { required: true, message: "Veuillez entrer la capacité" },
              ]}
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
