"use client";

import {
  Card,
  Layout,
  Space,
  theme,
  Typography,
} from "antd";

import { Palette } from "@/components/palette";
import BackButton from "@/components/backButton";
import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function CoursesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  const pathname = usePathname();
  const router = useRouter();

  return (
    <Layout>
      <Layout.Content
        style={{
          minHeight: 280,
          padding: "0 32px 0 32px",
          background: colorBgContainer,
          overflowY: "auto",
          height: "calc(100vh - 64px)",
        }}
      >
        <Layout.Header
          style={{
            display: "flex",
            alignItems: "center",
            background: colorBgContainer,
            padding: 0,
          }}
        >
          <Space>
            <BackButton />
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Gestion du formulaire d&apos;inscription
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
          tabList={[
            { key: "/console/enrollment-form", label: "Documents" },
            {
              key: "/console/enrollment-form/questions",
              label: "Autres questions",
            },
            {
              key: "/console/enrollment-form/tests",
              label: "Matières des tests",
            },
            {
              key: "/console/enrollment-form/fees",
              label: "Frais d'inscription",
            },
          ]}
          activeTabKey={pathname}
          onTabChange={(key) => {
            router.push(key);
          }}
        >
          {children}
        </Card>
        <Layout.Footer
          style={{
            display: "flex",
            background: colorBgContainer,
            padding: "24px 0",
          }}
        >
          <Typography.Text type="secondary">
            © {new Date().getFullYear()} CI-UCBC. Tous droits réservés.
          </Typography.Text>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Footer>
      </Layout.Content>
    </Layout>
  );
}
