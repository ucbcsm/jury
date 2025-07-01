"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Drawer,
  Form,
  Input,
  message,
  Space,
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Permission } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup, getPermissionsAsOptions } from "@/lib/api";
import { Palette } from "@/components/palette";

type FormDataType = {
  name: string;
  permissions: number[];
};
type NewGroupFormProps = {
  permissions?: Permission[];
};
export const NewGroupForm: React.FC<NewGroupFormProps> = ({ permissions }) => {
  
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createGroup,
  });

  const onClose = () => {
    setOpen(false);
  };

  const onFinish = (values: FormDataType) => {
    mutateAsync(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["groups"] });
        messageApi.success("Groupe créé avec succès !");
        setOpen(false);
      },
      onError: () => {
        messageApi.error(
          "Une erreur s'est produite lors de la création du groupe."
        );
      },
    });
  };

  return (
    <>
      {contextHolder}
      <Button
        type="link"
        icon={<PlusOutlined />}
        className="shadow-none"
        title="Ajouter un groupe"
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Ajouter
      </Button>
      <Drawer
        open={open}
        title="Nouveau groupe"
        onClose={onClose}
        destroyOnHidden
        maskClosable={!isPending}
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: "12px 24px",
            }}
          >

            <Space>
              <Button disabled={isPending} style={{ boxShadow: "none" }}>
                Annuler
              </Button>
              <Button
                type="primary"
                onClick={() => form.submit()}
                loading={isPending}
                style={{ boxShadow: "none" }}
                disabled={isPending}
              >
                Créer
              </Button>
            </Space>
          </div>
        }
      >
        <Form
          disabled={isPending}
          key="create_new_group"
          layout="vertical"
          form={form}
          name="create_new_group"
          onFinish={onFinish}
          clearOnDestroy
        >
          <Form.Item
            name="name"
            label="Nom"
            rules={[
              {
                required: true,
                message: "Veuillez entrer un nom du groupe",
              },
            ]}
          >
            <Input placeholder="Entrez le nom du groupe" />
          </Form.Item>
          <Card>
            <Typography.Title level={5}>Permissions</Typography.Title>
            <Form.Item name="permissions" label="" rules={[]}>
              <Checkbox.Group options={getPermissionsAsOptions(permissions)} />
            </Form.Item>
          </Card>
        </Form>
      </Drawer>
    </>
  );
};
