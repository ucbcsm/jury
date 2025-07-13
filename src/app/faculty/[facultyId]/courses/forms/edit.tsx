"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Col, Form, Input, message, Modal, Row, Select } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateCourse,
  getCourseTypesAsOptions,
  getCurrentFacultiesAsOptions,
} from "@/lib/api";
import { Course, Faculty } from "@/types";
import { filterOption } from "@/lib/utils";

type FormDataType = Omit<Course, "id" | "faculties"> & {
  faculties: number[];
};

type EditCourseFormProps = {
  course: Course;
  faculties?: Faculty[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditCourseForm: React.FC<EditCourseFormProps> = ({
  course,
  faculties,
  open,
  setOpen,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateCourse,
  });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(
      { id: course.id, params: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["courses"] });
          messageApi.success("Cours modifié avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification du cours."
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
        okText="Enregistrer"
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
        destroyOnHidden
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            disabled={isPending}
            key="edit_course"
            layout="vertical"
            form={form}
            name="edit_course"
            initialValues={{
              ...course,
              faculties: course.faculties.map(
                (fac) => fac.id
              ),
            }}
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
              label="Nom du cours"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer le nom du cours",
                },
              ]}
            >
              <Input placeholder="Nom du cours" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="code"
              label="Code"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer le code du cours",
                },
              ]}
            >
              <Input placeholder="Code du cours" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="course_type"
          label="Nature du cours"
          rules={[
            {
              required: true,
              message: "Veuillez sélectionner un type de cours",
            },
          ]}
        >
          <Select options={getCourseTypesAsOptions} />
        </Form.Item>
        <Form.Item name="faculties" label="Pour facultés" rules={[{required:true}]}>
          <Select
            placeholder="Sélectionnez une faculté"
            showSearch
            options={getCurrentFacultiesAsOptions(faculties)}
            mode="multiple"
            filterOption={filterOption}
            disabled
          />
        </Form.Item>
      </Modal>
    </>
  );
};
