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
import { usePathname, useRouter } from "next/navigation";
import { ListCycles } from "./(cycles)/list";

export default function FieldsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const router = useRouter();
  const pathname = usePathname();

 

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
              Gestion des filières et mentions
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
          tabList={[
            { key: "/console/fields", label: "Domaines" },
            { key: "/console/fields/faculties", label: "Filières" },
            { key: "/console/fields/departments", label: "Mentions" },
            { key: "/console/fields/classes", label: "Promotions" },
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

      <Layout.Sider
        width={280}
        theme="light"
        style={{ borderLeft: `1px solid ${colorBorderSecondary}` }}
      >
        <ListCycles />
      </Layout.Sider>
    </Layout>
  );
}
