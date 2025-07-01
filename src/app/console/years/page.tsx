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
import { ListYears } from "./list";

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  

  return (
    <Layout>
      <Layout.Content
        style={{
          padding: "0 32px 0 32px",
          height: "calc(100vh - 64px)",
          overflowY: "auto",
        }}
        className="px-4 md:px-8 bg-white"
      >
        <Layout.Header
          className="flex top-0 z-[1]"
          style={{ background: colorBgContainer, padding: 0 }}
        >
          <Space className="font-medium">
            <BackButton />
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Années académiques
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card>
          <ListYears/>
        </Card>
        <Layout.Footer
          style={{
            display: "flex",
            background: colorBgContainer,
            padding: " 24px 0",
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
