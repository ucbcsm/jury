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
  Row,
  Select,
  Switch,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { TestCourse, Faculty } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTestCourse, getCurrentFacultiesAsOptions } from "@/lib/api";

type FormDataType = Omit<TestCourse, "id" | "faculty"> & { faculty_id: number };
type NewTestCourseFormProps = {
  faculties?: Faculty[];
};
export const NewTestCourseForm: React.FC<NewTestCourseFormProps> = ({
  faculties,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createTestCourse,
  });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["test_courses"] });
        messageApi.success("Cours créé avec succès !");
        setOpen(false);
      },
      onError: () => {
        messageApi.error(
          "Une erreur s'est produite lors de la création du cours."
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
        title="Ajouter un cours"
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Ajouter
      </Button>
      <Modal
        open={open}
        title="Nouveau cours"
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
            key="create_new_test_course"
            layout="vertical"
            form={form}
            name="create_new_test_course"
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
              label="Matière"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="Intitulé de la matière" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="max_value"
              label="Max"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} step={0.1} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="faculty_id"
          label="Pour faculté"
          rules={[
            { required: true, message: "Veuillez sélectionner une faculté" },
          ]}
        >
          <Select
            placeholder="Sélectionnez une faculté"
            options={getCurrentFacultiesAsOptions(faculties)}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea placeholder="Décrire la matière pour le test" rows={4} />
        </Form.Item>
         <Form.Item name="enabled" label="Visible" >
            <Switch />
          </Form.Item>
      </Modal>
    </>
  );
};
