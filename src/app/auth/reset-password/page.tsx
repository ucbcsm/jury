'use client'

import { Palette } from "@/components/palette";
import { resetPassword } from "@/lib/api/auth";
import { MailOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Layout,
  message,
  Result,
  Space,
  theme,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useState } from "react";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse e-mail valide."),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Page() {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [pendingEmail, setPendingEmail] = useQueryState(
    "pending-email",
    parseAsBoolean.withDefault(false)
  );

  const onFinish = (values: FormSchema) => {
    setLoading(true);

    resetPassword(values.email)
      .then(() => {
        setPendingEmail(true);
        messageApi.success(
          "Un e-mail de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception."
        );
      })
      .catch(() => {
        messageApi.error(
          "Ouf, une erreur est survenue. Veuillez réessayer plus tard."
        );
      })
      .finally(() => {
        setLoading(false);
      });
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
            {!pendingEmail ? (
              <>
                <div className="">
                  <Typography.Title level={5} style={{ marginBottom: 0 }}>
                    Réinitialiser le mot de passe
                  </Typography.Title>
                  <Typography.Text type="secondary">
                    Veuillez entrer votre adresse e-mail pour recevoir un lien
                    de réinitialisation.
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
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez entrer votre e-mail.",
                        },
                        {type: "email", message: "Le format de l'adresse mail n'est pas valide!",}
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined />}
                        placeholder="Adresse mail"
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
                        Envoyer
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        block
                        type="link"
                        htmlType="button"
                        onClick={() => router.push("/auth/login")}
                      >
                        Retour à la connexion
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </>
            ) : (
              <Result
                status="success"
                title="E-mail envoyé avec succès"
                subTitle="Un e-mail de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe."
                // extra={[
                //   <Button
                //     type="link"
                //     key="login"
                //     onClick={() => router.push("/auth/login")}
                //   >
                //     Retour à la connexion
                //   </Button>,
                // ]}
              />
            )}
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
