"use client";

import {
  AppstoreOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Layout,
  List,
  Radio,
  Space,
  theme,
  Typography,
} from "antd";
import { StaffList } from "./list";
import Link from "next/link";
import { Palette } from "@/components/palette";
import BackButton from "@/components/backButton";

export default function Page() {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  return (
    <Layout>
      <Layout.Content
        style={{
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
            <BackButton/>
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Finances
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette/>
          </Space>
        </Layout.Header>
        <Card
          tabBarExtraContent={
            <Radio.Group>
              <Radio.Button value="grid">
                <AppstoreOutlined />
              </Radio.Button>
              <Radio.Button value="list">
                <UnorderedListOutlined />
              </Radio.Button>
            </Radio.Group>
          }
          tabList={[
            {
              key: "all",
              label: "Factures",
            },
            {
              key: "fees",
              label: "Frais",
            },
          ]}
        >
          <StaffList />
        </Card>
        <Layout.Footer
          style={{ display:"flex", background: colorBgContainer, padding: " 24px 0" }}
        >
          <Typography.Text type="secondary">
            © {new Date().getFullYear()} CI-UCBC. Tous droits réservés.
          </Typography.Text>
          <div className="flex-1" />
          <Space>
            <Palette/>
          </Space>
        </Layout.Footer>
      </Layout.Content>
      <Layout.Sider
        width={280}
        theme="light"
        style={{ borderLeft: `1px solid ${colorBorderSecondary}` }}
      >
        <Card
          variant="borderless"
          title="Bureau des finances"
          style={{ boxShadow: "none" }}
          extra={
            <Button
              type="link"
              icon={<PlusCircleOutlined />}
              title="Ajouter un membre du bureau"
            >
              Ajouter
            </Button>
          }
        >
          <List
            dataSource={[
              {
                id: "1",
                name: "Kahindo Lwanzo Alfred",
                role: "Finance Director",
              },
              {
                id: "2",
                name: "Kahindo Lwanzo Alfred",
                role: "Accounting Manager",
              },
              {
                id: "3",
                name: "Kahindo Lwanzo Alfred",
                role: "Budget Officer",
              },
              {
                id: "4",
                name: "Kahindo Lwanzo Alfred",
                role: "Treasurer",
              },
              {
                id: "5",
                name: "Kahindo Lwanzo Alfred",
                role: "Financial Analyst",
              },
            ]}
            renderItem={(item, index) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                    />
                  }
                  title={<Link href="#">{item.name}</Link>}
                  description={item.role}
                />
              </List.Item>
            )}
          />
        </Card>
      </Layout.Sider>
    </Layout>
  );
}
