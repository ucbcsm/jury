"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
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
import { Faculty, TestCourse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentFacultiesAsOptions, updateTestCourse } from "@/lib/api";

type FormDataType = Omit<TestCourse, "id" | "faculty"> & { faculty_id: number };

interface EditTestCourseFormProps {
  testCourse: TestCourse;
  faculties?: Faculty[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditTestCourseForm: React.FC<EditTestCourseFormProps> = ({
  testCourse,
  faculties,
  open,
  setOpen,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateTestCourse,
  });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(
      { id: testCourse.id, params: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["test_courses"] });
          messageApi.success("Cours modifié avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification du cours"
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
        title="Modifier le cours"
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
            key="edit_test_course_form"
            layout="vertical"
            form={form}
            name="edit_test_course_form"
            initialValues={{ faculty_id: testCourse.faculty.id, ...testCourse }}
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
          <Input.TextArea
            placeholder="Décrire la matière pour le test"
            rows={4}
          />
        </Form.Item>
        <Form.Item name="enabled" label="Visible">
          <Switch />
        </Form.Item>
      </Modal>
    </>
  );
};
