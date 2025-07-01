"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
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
import { Faculty, Field, Teacher } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentFieldsAsOptions,
  getTeachersAsOptions,
  updateFaculty,
} from "@/lib/api";
import { TeamOutlined, UserOutlined } from "@ant-design/icons";
import { filterOption } from "@/lib/utils";

type FormDataType = Omit<Faculty, "id" | "field"> & { field_id: number };

interface EditFacultyFormProps {
  faculty: Faculty;
  fields?: Field[];
  teachers?: Teacher[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditFacultyForm: React.FC<EditFacultyFormProps> = ({
  faculty,
  fields,
  teachers,
  open,
  setOpen,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateFaculty,
  });

  const onFinish = (values: FormDataType) => {
    mutateAsync(
      { id: faculty.id, params: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["faculties"] });
          queryClient.invalidateQueries({
            queryKey: ["faculty", `${faculty.id}`],
          });
          messageApi.success("Faculté modifiée avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification de la faculté"
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
        title="Modifier la faculté"
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
        destroyOnHidden
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            disabled={isPending}
            key="edit_faculty_form"
            layout="vertical"
            form={form}
            name="edit_faculty_form"
            initialValues={{
              ...faculty,
              field_id: faculty.field.id,
              coordinator_id: faculty.coordinator?.id,
              secretary_id: faculty.secretary?.id,
              other_members_ids: faculty.other_members?.map(
                (member) => member.id
              ),
            }}
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
              showSearch
              placeholder="Séléctionnez le coordinateur"
              prefix={<UserOutlined />}
              options={getTeachersAsOptions(teachers)}
              filterOption={filterOption}
              allowClear
            />
          </Form.Item>
          <Form.Item name="secretary_id" label="Secrétaire" rules={[]}>
            <Select
              showSearch
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
