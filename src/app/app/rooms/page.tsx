"use client";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Layout,
  List,
  Radio,
  Space,
  theme,
  Typography,
} from "antd";
import {
  AppstoreOutlined,
  DeleteOutlined,
  EditFilled,
  MoreOutlined,
  PlusCircleOutlined,
  TagsOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
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
              Gestion des salles
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
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
              label: "Toutes",
            },
            { key: "available", label: "Disponibles" },
            { key: "occupied", label: "Occupées" },
            { key: "maintenance", label: "En maintenance" },
          ]}
        >
          <List
            dataSource={[
              {
                id: "1",
                title: "Salle A101",
                description: "Capacité : 30 étudiants. Étage : 1.",
              },
              {
                id: "2",
                title: "Salle B202",
                description: "Capacité : 50 étudiants. Étage : 2.",
              },
              {
                id: "3",
                title: "Salle C303",
                description: "Capacité : 40 étudiants. Étage : 3.",
              },
              {
                id: "4",
                title: "Salle D404",
                description: "Capacité : 25 étudiants. Étage : 4.",
              },
              {
                id: "5",
                title: "Salle E505",
                description: "Capacité : 35 étudiants. Étage : 5.",
              },
            ]}
            renderItem={(item, index) => (
              <List.Item
                key={item.id}
                extra={
                  <Space>
                    <Dropdown
                      menu={{
                        items: [
                          { key: "1", label: "Modifier", icon: <EditFilled /> },
                          {
                            key: "2",
                            label: "Supprimer",
                            danger: true,
                            icon: <DeleteOutlined />,
                          },
                        ],
                      }}
                    >
                      <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                  </Space>
                }
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<TagsOutlined />} />}
                  title={<Link href="#">{item.title}</Link>}
                  description={item.description}
                />
              </List.Item>
            )}
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
      <Layout.Sider
        width={280}
        theme="light"
        style={{ borderLeft: `1px solid ${colorBorderSecondary}` }}
      >
        <Card
          variant="borderless"
          title="Équipe de gestion"
          style={{ boxShadow: "none" }}
          extra={
            <Button
              type="link"
              icon={<PlusCircleOutlined />}
              title="Ajouter une salle"
            >
              Ajouter
            </Button>
          }
        >
          <List
            dataSource={[
              {
                id: "1",
                title: "Planification des salles",
                description: "Réunion pour organiser l'utilisation des salles.",
              },
              {
                id: "2",
                title: "Maintenance",
                description: "Vérification des équipements des salles.",
              },
              {
                id: "3",
                title: "Réservations",
                description: "Gestion des réservations pour les événements.",
              },
              {
                id: "4",
                title: "Nettoyage",
                description: "Planification du nettoyage des salles.",
              },
              {
                id: "5",
                title: "Rapports d'utilisation",
                description: "Analyse des rapports d'utilisation des salles.",
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
                  title={<Link href="#">{item.title}</Link>}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Card>
      </Layout.Sider>
    </Layout>
  );
}
