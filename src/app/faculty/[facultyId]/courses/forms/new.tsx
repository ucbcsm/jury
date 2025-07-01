"use client";

import React, { useState } from "react";
import { Button, Col, Form, Input, message, Modal, Row, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCourse,
  getCourseTypesAsOptions,
  getCurrentFacultiesAsOptions,
} from "@/lib/api";
import { Course, Faculty } from "@/types";
import { filterOption } from "@/lib/utils";
import { useParams } from "next/navigation";

type FormDataType = Omit<Course, "id" | "faculties"> & {
  faculties: number[];
};

type NewCourseFormProps = {
  faculties?: Faculty[];
};
export const NewCourseForm: React.FC<NewCourseFormProps> = ({ faculties }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const {facultyId} = useParams()
  const [open, setOpen] = useState(false);


  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createCourse,
  });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["courses"] });
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
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Nouveau cours
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
        destroyOnHidden
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            disabled={isPending}
            key="create_new_course"
            layout="vertical"
            form={form}
            name="create_new_course"
            onFinish={onFinish}
            clearOnDestroy
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
          label="Type de cours"
          rules={[
            {
              required: true,
              message: "Veuillez sélectionner un type de cours",
            },
          ]}
        >
          <Select options={getCourseTypesAsOptions} />
        </Form.Item>
        <Form.Item name="faculties" label="Pour facultés" rules={[{required:true}]} initialValue={[Number(facultyId)]}>
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
