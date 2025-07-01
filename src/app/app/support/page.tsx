"use client";

import React from "react";
import { Button, Card, Layout, Result, Space, theme, Typography } from "antd";
import {
  PhoneOutlined,
  QuestionCircleOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import BackButton from "@/components/backButton";
import { Palette } from "@/components/palette";

export default function Page() {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
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
              Assistance technique
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card>
          <Result
            className="max-w-3xl mx-auto"
            icon={<QuestionCircleOutlined style={{ color: "" }} />}
            title="Assistance technique"
            subTitle="Les experts à la matière n'attendent que vous. Nous vous proposons de l’expertise,
    de l’expérience et de la méthodologie pour une bonne utilisation de cette application. Pour tout problème technique n'hésitez pas à nous contacter et nous pouvons nous déplacer vers vous s'il le faut."
            extra={[
              <Button
                type="dashed"
                key="call"
                icon={<PhoneOutlined />}
                style={{ boxShadow: "none" }}
              >
                Télephone
              </Button>,
              <Button
                type="primary"
                key="write"
                icon={<WhatsAppOutlined />}
                style={{ boxShadow: "none" }}
              >
                Whatsapp
              </Button>,
            ]}
          />
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
