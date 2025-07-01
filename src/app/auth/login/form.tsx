"use client";

import { Palette } from "@/components/palette";
import { login } from "@/lib/api/auth";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
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

const formSchema = z.object({
  matricule: z.string(),
  password: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

export function LoginForm() {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = (values: FormSchema) => {
    setLoading(true);
    login(values)
      .then(() => {
        messageApi.success("Connexion réussie!");
        // router.refresh()
        window.location.reload();
      })
      .catch((error) => {
        setLoading(false);
        if (error?.message === "Invalid credentials. Please try again.") {
          messageApi.error("Matricule ou mot de passe incorrect!");
        } else {
          messageApi.error("Ouf, une erreur est survenue, Veuillez réessayer!");
        }
      })
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
                Bienvenue!
              </Typography.Title>
              <Typography.Text type="secondary">
                Veuillez vous connecter pour accéder à votre compte.
              </Typography.Text>
            </div>
            <div className="mt-8">
              <Form
                name="login"
                initialValues={{ remember: true }}
                style={{ maxWidth: 360 }}
                onFinish={onFinish}
                disabled={loading}
              >
                <Form.Item name="matricule" rules={[{ required: true }]}>
                  <Input prefix={<UserOutlined />} placeholder="Matricule" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true }]}>
                  <Input.Password
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Mot de passe"
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
                    Connexion
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    block
                    type="link"
                    htmlType="button"
                    onClick={() => router.push("/auth/reset-password")}
                  >
                    Mot de passe oublié
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
