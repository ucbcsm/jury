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
import { Faculty, Field, Teacher } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFaculty,
  getCurrentFieldsAsOptions,
  getTeachersAsOptions,
} from "@/lib/api";
import { filterOption } from "@/lib/utils";

type FormDataType = Omit<Faculty, "id" | "field"> & { field_id: number };
type NewFacultyFormProps = {
  fields?: Field[];
  teachers?: Teacher[];
};
export const NewFacultyForm: React.FC<NewFacultyFormProps> = ({
  fields,
  teachers,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createFaculty,
  });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["faculties"] });
        messageApi.success("Faculté créée avec succès !");
        setOpen(false);
      },
      onError: () => {
        messageApi.error(
          "Une erreur s'est produite lors de la création de la faculté."
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
        title="Ajouter une faculté"
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Ajouter
      </Button>
      <Modal
        open={open}
        title="Nouvelle faculté"
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
            key="create_new_faculty"
            layout="vertical"
            form={form}
            name="create_new_faculty"
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
          name="field_id"
          label="Domaine"
          rules={[
            { required: true, message: "Veuillez sélectionner un  domaine" },
          ]}
        >
          <Select
            placeholder="Sélectionnez un domaine"
            options={getCurrentFieldsAsOptions(fields)}
          />
        </Form.Item>
        <Card>
          <Typography.Title level={5}>Membres de la faculté</Typography.Title>
          <Form.Item name="coordinator_id" label="Coordinateur" rules={[]}>
            <Select
              placeholder="Séléctionnez le coordinateur"
              prefix={<UserOutlined />}
              options={getTeachersAsOptions(teachers)}
              filterOption={filterOption}
              allowClear
            />
          </Form.Item>
          <Form.Item name="secretary_id" label="Secrétaire" rules={[]}>
            <Select
              placeholder="Séléctionnez le nom du secrétaire"
              prefix={<UserOutlined />}
              options={getTeachersAsOptions(teachers)}
              filterOption={filterOption}
              allowClear
            />
          </Form.Item>

          <Form.Item name="other_members_ids" label="Autres membres" rules={[]}>
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
