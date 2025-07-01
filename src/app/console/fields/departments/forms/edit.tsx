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
import { Department, Faculty, Teacher } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentFacultiesAsOptions,
  getTeachersAsOptions,
  updateDepartment,
} from "@/lib/api";
import { TeamOutlined, UserOutlined } from "@ant-design/icons";
import { filterOption } from "@/lib/utils";

type FormDataType = Omit<Department, "id" | "faculty"> & { faculty_id: number };

interface EditDepartmentFormProps {
  department: Department;
  faculties?: Faculty[];
  teachers?: Teacher[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditDepartmentForm: React.FC<EditDepartmentFormProps> = ({
  department,
  faculties,
  teachers,
  open,
  setOpen,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateDepartment,
  });

  const onFinish = (values: FormDataType) => {

    mutateAsync(
      { id: department.id, params: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["departments"] });
          queryClient.invalidateQueries({queryKey:["department", `${department.id}`]})
          messageApi.success("Département modifié avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification du département"
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
        title="Modifier le département"
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
            key="edit_department_form"
            layout="vertical"
            form={form}
            name="edit_department_form"
            initialValues={{
              ...department,
              faculty_id: department.faculty.id,
              director_id: department.director?.id,
              other_members_ids: department.other_members?.map(
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
          <Form.Item name="director_id" label="Directeur" rules={[]}>
            <Select
              placeholder="Séléctionnez le directeur"
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
