"use client";

import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  Layout,
  List,
  Space,
  theme,
  Typography,
  Avatar,
} from "antd";

import { Palette } from "@/components/palette";
import BackButton from "@/components/backButton";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function ClassLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const { classId } = useParams();
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
              Nom de la promotion ou classe
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
          tabBarExtraContent={
            <Space>
              <Button
                title="Programmer un cours"
                style={{ boxShadow: "none" }}
                type="dashed"
              >
                Programmer
              </Button>
              <Dropdown
                menu={{
                  items: [
                    { key: "1", label: "Action 1" },
                    { key: "2", label: "Action 2" },
                    { key: "3", label: "Action 3" },
                  ],
                }}
              >
                <Button
                  type="text"
                  icon={<MoreOutlined />}
                  style={{ boxShadow: "none" }}
                />
              </Dropdown>
            </Space>
          }
          tabList={[
            {
              key: `/app/class/${classId}`,
              label: "Aperçu",
            },
            { key: `/app/class/${classId}/students`, label: "Étudiants" },
            { key: `/app/class/${classId}/courses`, label: "Cours prévus" },
            { key: `/app/class/${classId}/taught-courses`, label: "Cours dispensés" },
            { key: `/app/class/${classId}/teachers`, label: "Enseignants" },
            { key: `/app/class/${classId}/fees`, label: "Frais" },
          ]}
          defaultActiveTabKey={pathname}
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
        <Card
          variant="borderless"
          title="Organisation Informelle"
          style={{ boxShadow: "none" }}
          extra={
            <Button type="link" icon={<PlusOutlined />}>
              Ajouter
            </Button>
          }
        >
          <List
            dataSource={[
              {
                label: "Chef de Promotion",
                value: "M. Jean Kabila",
                avatar: "https://via.placeholder.com/40",
              },
              {
                label: "Adjoint au Chef de Promotion",
                value: "Mme. Aline Tshisekedi",
                avatar: "https://via.placeholder.com/40",
              },
              {
                label: "Trésorier",
                value: "Mme. Marie Mobutu",
                avatar: "https://via.placeholder.com/40",
              },
            ]}
            renderItem={(item) => (
              <List.Item
                key={item.value}
                extra={
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "edit",
                          label: "Modifier",
                          icon: <EditOutlined />,
                        },
                        {
                          key: "delete",
                          label: "Retirer",
                          icon: <DeleteOutlined />,
                          danger: true,
                        },
                      ],
                    }}
                  >
                    <Button type="text" icon={<MoreOutlined />} />
                  </Dropdown>
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} alt={item.label} />}
                  title={item.value}
                  description={item.label}
                />
              </List.Item>
            )}
          />
        </Card>
      </Layout.Sider>
    </Layout>
  );
}
