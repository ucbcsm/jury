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
import { Faculty, Teacher } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createJury,
  getCurrentFacultiesAsOptions,
  getTeachersAsOptions,
} from "@/lib/api";
import { filterOption } from "@/lib/utils";
import { useParams } from "next/navigation";

type FormDataType = {
  faculties_ids: number[];
  chairperson_id: number;
  secretary_id: number;
  members_ids: number[];
  name: string;
};

type NewJuryFormProps = {
  faculties?: Faculty[];
  teachers?: Teacher[];
};

export const NewJuryForm: React.FC<NewJuryFormProps> = ({
  faculties,
  teachers,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const { yearId } = useParams();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createJury,
  });

  const onFinish = (values: FormDataType) => {
    mutateAsync(
      { ...values, academic_year_id: Number(yearId) },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["jurys"] });
          messageApi.success("Jury créé avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la création du jury."
          );
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className="shadow-none"
        title="Ajouter un jury"
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Créer un jury
      </Button>
      <Modal
        open={open}
        title="Nouveau jury"
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
            key="create_new_jury"
            layout="vertical"
            form={form}
            name="create_new_jury"
            onFinish={onFinish}
            clearOnDestroy
          >
            {dom}
          </Form>
        )}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Nom du jury"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer le nom du jury",
                },
              ]}
            >
              <Input placeholder="Entrez le nom du jury" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="faculties_ids"
          label="Facultés"
          rules={[
            {
              required: true,
              message: "Veuillez sélectionner au moins une faculté",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Sélectionnez les facultés"
            options={getCurrentFacultiesAsOptions?.(faculties)}
            filterOption={filterOption}
          />
        </Form.Item>
        <Card>
          <Typography.Title level={5}>Membres du jury</Typography.Title>
          <Form.Item name="chairperson_id" label="Président" rules={[{required:true}]}>
            <Select
              placeholder="Sélectionnez le président"
              prefix={<UserOutlined />}
              options={getTeachersAsOptions?.(teachers)}
              filterOption={filterOption}
              allowClear
            />
          </Form.Item>
          <Form.Item name="secretary_id" label="Secrétaire" rules={[{required:true}]}>
            <Select
              placeholder="Sélectionnez le secrétaire"
              prefix={<UserOutlined />}
              options={getTeachersAsOptions?.(teachers)}
              filterOption={filterOption}
              allowClear
            />
          </Form.Item>
          <Form.Item name="members_ids" label="Autres membres" rules={[]}>
            <Select
              mode="multiple"
              placeholder="Sélectionnez les autres membres"
              prefix={<TeamOutlined />}
              options={getTeachersAsOptions?.(teachers)}
              filterOption={filterOption}
              allowClear
            />
          </Form.Item>
        </Card>
      </Modal>
    </>
  );
};
