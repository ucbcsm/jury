"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Typography,
} from "antd";
import { PlusOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Department, Faculty, Teacher } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDepartment, getCurrentFacultiesAsOptions, getTeachersAsOptions } from "@/lib/api";
import { filterOption } from "@/lib/utils";

type FormDataType = Omit<Department, "id" | "faculty"> & { faculty_id: number };
type NewDepartmentFormProps = {
  faculties?: Faculty[];
  teachers?: Teacher[];
};
export const NewDepartmentForm: React.FC<NewDepartmentFormProps> = ({
  faculties,
  teachers,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createDepartment,
  });

  const onFinish = (values: FormDataType) => {

    mutateAsync(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["departments"] });
        messageApi.success("Département créé avec succès !");
        setOpen(false);
      },
      onError: () => {
        messageApi.error(
          "Une erreur s'est produite lors de la création du département."
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
        title="Ajouter un département"
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Ajouter
      </Button>
      <Modal
        open={open}
        title="Nouveau département"
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
            key="create_new_department"
            layout="vertical"
            form={form}
            name="create_new_department"
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
                  message: "Veuillez entrer un nom de la faculté",
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
          name="faculty_id"
          label="Faculté"
          rules={[
            { required: true, message: "Veuillez sélectionner une faculté" },
          ]}
        >
          <Select
            placeholder="Sélectionnez une faculté"
            options={getCurrentFacultiesAsOptions(faculties)}
          />
        </Form.Item>
        <Card>
          <Typography.Title level={5}>Membres du département </Typography.Title>
          <Form.Item name="director" label="Directeur" rules={[]}>
            <Select
              placeholder="Séléctionnez le directeur"
              prefix={<UserOutlined />}
              options={getTeachersAsOptions(teachers)}
              filterOption={filterOption}
              allowClear
            />
          </Form.Item>
          <Form.Item name="other_members" label="Autres membres" rules={[]}>
            <Select
              mode="multiple"
              placeholder="Séléctionnez les autres membres"
              prefix={<TeamOutlined />}
              options={getTeachersAsOptions(teachers)}
              filterOption={filterOption}
              allowClear
            />
          </Form.Item>
        </Card>
      </Modal>
    </>
  );
};
