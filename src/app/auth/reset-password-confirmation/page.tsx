"use client";

import { Palette } from "@/components/palette";
import { LockOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Layout,
  message,
  Space,
  theme,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const formSchema = z
  .object({
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

type FormSchema = z.infer<typeof formSchema>;

export default function Page() {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = (values: FormSchema) => {
    setLoading(true);
    // Simulate API call for password reset confirmation
    setTimeout(() => {
      messageApi.success("Votre mot de passe a été réinitialisé avec succès!");
      router.push("/auth/login");
      setLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      {contextHolder}
      <Layout.Content
        style={{
          backgroundImage: `url("/ucbc-front.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
      ></Layout.Content>
      <Layout.Sider
        theme="light"
        width={300}
        style={{
          borderLeft: `1px solid ${colorBorderSecondary}`,
          background: colorBgContainer,
          height: `100vh`,
          overflow: "auto",
        }}
      >
        <div className="flex flex-col h-full">
          <Layout.Header
            style={{
              background: colorBgContainer,
              paddingLeft: 32,
              paddingRight: 32,
              display: "flex",
            }}
          >
            <Space>
              <Typography.Title level={4} style={{ marginBottom: 0 }}>
                CI-UCBC
              </Typography.Title>
            </Space>
            <div className="flex-1" />
            <Space>
              <Palette />
            </Space>
          </Layout.Header>
          <div className="flex-1 flex flex-col justify-center p-8">
            <div className="">
              <Typography.Title level={5} style={{ marginBottom: 0 }}>
                Réinitialisation du mot de passe
              </Typography.Title>
              <Typography.Text type="secondary">
                Veuillez définir un nouveau mot de passe pour votre compte.
              </Typography.Text>
            </div>
            <div className="mt-8">
              <Form
                name="reset-password"
                style={{ maxWidth: 360 }}
                onFinish={onFinish}
                disabled={loading}
              >
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez entrer un mot de passe.",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Nouveau mot de passe"
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez confirmer votre mot de passe.",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "Les deux mots de passe que vous avez saisis ne correspondent pas!"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Confirmer le mot de passe"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    block
                    type="primary"
                    htmlType="submit"
                    style={{ boxShadow: "none" }}
                    loading={loading}
                  >
                    Réinitialiser le mot de passe
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
          <Layout.Footer
            style={{
              background: colorBgContainer,
              paddingLeft: 32,
              paddingRight: 32,
              borderTop: `1px solid ${colorBorderSecondary}`,
            }}
          >
            <Typography.Text type="secondary">
              © {new Date().getFullYear()} CI-UCBC. Tous droits réservés.
            </Typography.Text>
          </Layout.Footer>
        </div>
      </Layout.Sider>
    </Layout>
  );
}
