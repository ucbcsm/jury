"use client";

import React, { Dispatch, FC, SetStateAction } from "react";
import {
  Alert,
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGroupsAsOptions,
  getPermissionsAsOptions,
  getRolesAsOptions,
  updateUser,
} from "@/lib/api";
import { Group, Permission, Role, User } from "@/types";
import { filterOption } from "@/lib/utils";

type EditUserFormProps = {
  user: User;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  groups?: Group[];
  roles?: Role[];
  permissions?: Permission[];
};

type FormDataType = Omit<User, "id">;

export const EditUserForm: FC<EditUserFormProps> = ({
  user,
  groups,
  roles,
  permissions,
  open,
  setOpen,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateUser,
  });

  const onClose = () => {
    setOpen(false);
  };

  const onFinish = (values: FormDataType) => {
    mutateAsync(
      { id: user.id, params: {...values, is_permanent_teacher:user.is_permanent_teacher, avatar: user.avatar||null} },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
          queryClient.invalidateQueries({
            queryKey: ["user", String(user.id)],
          });
          messageApi.success("Compte utilisateur mis à jour avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la mise à jour du compte utilisateur."
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
        title={`Compte utilisateur ${user.matricule}`}
        destroyOnHidden
        onClose={onClose}
        closable={!isPending}
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
              <Button
                disabled={isPending}
                style={{ boxShadow: "none" }}
                onClick={onClose}
              >
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
          </div>
        }
      >
        <Form
          disabled={isPending}
          key="edit_user_form"
          layout="vertical"
          form={form}
          name="edit_user_form"
          initialValues={{
            is_superuser: user.is_superuser,
            first_name: user.first_name,
            last_name: user.last_name,
            is_staff: user.is_staff,
            is_student: user.is_student,
            is_active: user.is_active,
            surname: user.surname,
            username: user.username,
            email: user.email,
            matricule: user.matricule,
            avatar: user.avatar,
            pending_avatar: user.pending_avatar,
            groups: user.groups.map((g) => g.id),
            roles: user.roles.map((r) => r.id),
            user_permissions: user.user_permissions.map((p) => p.id),
          }}
          onFinish={onFinish}
        >
          <Typography.Title level={5}>Identité</Typography.Title>
          <Divider />
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="first_name" label="Prénom">
                <Input placeholder="Prénom" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="last_name" label="Nom">
                <Input placeholder="Nom" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Nom d'utilisateur"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer le nom d'utilisateur",
                  },
                ]}
              >
                <Input placeholder="Nom d'utilisateur" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Veuillez entrer un email valide",
                  },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="matricule"
                label="Matricule"
                rules={[
                  { required: true, message: "Veuillez entrer le matricule" },
                ]}
              >
                <Input placeholder="Matricule" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="surname" label="Surnom">
                <Input placeholder="Surnom" />
              </Form.Item>
            </Col>
          </Row>

          <Typography.Title level={5}>
            Rôles, permissions et statut
          </Typography.Title>

          <Divider />
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="is_superuser"
                label="Admin"
                valuePropName="checked"
              >
                <Switch checkedChildren="Oui" unCheckedChildren="Non" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="is_staff" label="Staff" valuePropName="checked">
                <Switch checkedChildren="Oui" unCheckedChildren="Non" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="is_student"
                label="Étudiant"
                valuePropName="checked"
              >
                <Switch checkedChildren="Oui" unCheckedChildren="Non" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="roles" label="Autres rôles">
            <Select
              mode="multiple"
              options={getRolesAsOptions(roles)}
              showSearch
              filterOption={filterOption}
              allowClear
            />
          </Form.Item>
          <Form.Item name="user_permissions" label="Permissions">
            <Select
              mode="multiple"
              options={getPermissionsAsOptions(permissions)}
              showSearch
              filterOption={filterOption}
              allowClear
            />
          </Form.Item>
          <Form.Item name="groups" label="Groupes">
            <Select
              mode="multiple"
              showSearch
              options={getGroupsAsOptions(groups)}
              filterOption={filterOption}
              allowClear
            />
          </Form.Item>
          <Alert
            showIcon
            type={user.is_active ? "success" : "error"}
            message="Statut du compte"
            description={
              <Form.Item name="is_active" valuePropName="checked">
                <Switch checkedChildren="Actif" unCheckedChildren="Inactif" />
              </Form.Item>
            }
          />

          <Typography.Title level={5} style={{ marginTop: 24 }}>
            Autres informations
          </Typography.Title>
          <Divider />
          <Form.Item name="avatar" label="Avatar">
            <Input placeholder="URL de l'avatar" />
          </Form.Item>
          <Form.Item name="pending_avatar" label="Avatar en attente">
            <Input placeholder="URL de l'avatar en attente" />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
