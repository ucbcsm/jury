"use client";

import React, { Dispatch, SetStateAction } from "react";
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
import { Group, Permission } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGroup, getPermissionsAsOptions } from "@/lib/api";

type FormDataType = {
  name: string;
  permissions: number[];
};

type EditGroupFormProps = {
  permissions?: Permission[];
  group: Group;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};
export const EditGroupForm: React.FC<EditGroupFormProps> = ({
  permissions,
  group,
  open,
  setOpen,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateGroup,
  });

  const onClose = () => {
    setOpen(false);
  };

  const onFinish = (values: FormDataType) => {
    mutateAsync(
      { id: group.id, data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["groups"] });
          messageApi.success("Groupe modifié avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification du groupe."
          );
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Drawer
        open={open}
        title="Modifier le groupe"
        onClose={onClose}
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
              <Button disabled={isPending} style={{ boxShadow: "none" }} onClick={onClose}>
                Annuler
              </Button>
              <Button
                type="primary"
                onClick={() => form.submit()}
                loading={isPending}
                style={{ boxShadow: "none" }}
                disabled={isPending}
              >
                Sauvegarder
              </Button>
            </Space>
          </div>}
      >
        <Form
          disabled={isPending}
          key={`edit_group_${group.id}`}
          layout="vertical"
          form={form}
          name="edit_group"
          onFinish={onFinish}
          initialValues={{
            name: group.name,
            permissions: group.permissions?.map((p) => p.id) || [],
          }}
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
            <Form.Item name="permissions" label="">
              <Checkbox.Group options={getPermissionsAsOptions(permissions)} />
            </Form.Item>
          </Card>
        </Form>
      </Drawer>
    </>
  );
};
