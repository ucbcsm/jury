"use client";

import { LanguageSwitcher } from "@/components/languageSwitcher";
import { YearSelector } from "@/components/yearSelector";
import {
  ApartmentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  HomeOutlined,
  LogoutOutlined,
  ReadOutlined,
  TagsOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Divider,
  Dropdown,
  Image,
  Layout,
  Menu,
  Modal,
  Space,
  theme,
  Typography,
} from "antd";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function ConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, colorBorderSecondary, colorPrimary },
  } = theme.useToken();

  const { yearId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Layout>
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          background: colorBgContainer,
          borderBottom: `1px solid ${colorBorderSecondary}`,
          paddingLeft: 0,
        }}
      >
        <Space style={{ background: colorPrimary }}>
          <Button
            type="primary"
            icon={<CloseOutlined />}
            style={{
              boxShadow: "none",
              height: 64,
              width: 64,
              borderRadius: 0,
            }}
            size="large"
            onClick={() => setIsModalOpen(true)}
          />

          <Modal
            title={`Quitter la console d'administration`}
            centered
            open={isModalOpen}
            onOk={() => {
              router.push("/app");
              setIsModalOpen(false);
            }}
            onCancel={() => setIsModalOpen(false)}
            okButtonProps={{ style: { boxShadow: "none" } }}
            cancelButtonProps={{ style: { boxShadow: "none" } }}
          >
            <Alert
              description="Assurez-vous d'avoir enregistré toutes vos modifications, car toute modification non sauvegardée sera perdue. Voulez-vous vraiment continuer ?"
              message="Vous êtes sur le point de quitter la console d'administration."
              type="info"
              showIcon
              style={{
                marginTop: 16,
                marginBottom: 32,
                // border: 0,
              }}
            />
          </Modal>
        </Space>
        <div className=" flex items-center px-4">
          <Image
            src="/ucbc-logo.png"
            alt="Logo ucbc"
            width={36}
            preview={false}
            style={{}}
          />
        </div>
        <Space style={{}}>
          <Typography.Title level={5} style={{ marginBottom: 0 }}>
            CI-UCBC
          </Typography.Title>
          <Divider type="vertical" />
          <Typography.Text type="secondary">
            Console d&apos;administration
          </Typography.Text>
        </Space>
        <div className="flex-1" />
        <Space>
          <YearSelector />
          <Dropdown
            menu={{
              items: [
                {
                  key: "/app/profile",
                  label: "Mon profile",
                  icon: <UserOutlined />,
                },
                {
                  type: "divider",
                },
                {
                  key: "logout",
                  label: "Déconnexion",
                  icon: <LogoutOutlined />,
                },
              ],
              onClick: ({ key }) => {},
            }}
            trigger={["hover"]}
            destroyOnHidden={true}
          >
            <Button type="text" icon={<UserOutlined />} />
          </Dropdown>
          <LanguageSwitcher />
        </Space>
      </Layout.Header>
      <Layout>
        <Layout.Sider
          width={260}
          style={{
            borderRight: `1px solid ${colorBorderSecondary}`,
            paddingTop: 20,
            background: colorBgContainer,
            height: `calc(100vh - 64px)`,
            overflow: "auto",
          }}
        >
          <Layout style={{}}>
            <Menu
              mode="inline"
              theme="light"
              style={{ height: "100%", borderRight: 0 }}
              items={[
                {
                  key: `/`,
                  label: "Menu",
                  type: "group",
                  children: [
                    {
                      key: `/console`,
                      label: "Profile",
                      icon: <HomeOutlined />,
                    },
                    {
                      key: `/console/years`,
                      label: "Années",
                      icon: <ClockCircleOutlined />,
                      className: "normal-case",
                    },
                    {
                      key: `/console/fields`,
                      label: "Filières & Mentions",
                      icon: <ApartmentOutlined />,
                      className: "normal-case",
                    },
                    {
                      key: "/console/enrollment-form",
                      label: "Formulaire d'inscription",
                      icon: <CheckCircleOutlined />,
                      className: "normal-case",
                    },
                    {
                      key: `/console/evaluation-form`,
                      label: "Formulaire d'évaluation",
                      icon: <ReadOutlined />,
                      className: "normal-case",
                    },
                    {
                      key: "/console/classrooms",
                      label: "Salles de classe",
                      icon: <TagsOutlined />,
                      className: "normal-case",
                    },
                    {
                      key: "/console/users",
                      label: "Comptes",
                      icon: <TeamOutlined />,
                    },
                  ],
                },
              ]}
              onClick={({ key }) => {
                router.push(key);
              }}
            />

            {/* {
                      key: "/console/classrooms",
                      label: "Salles de classe",
                      icon: <TagsOutlined />,
                      className: "normal-case",
                    },
                {
                  key: "/console/users",
                  label: "Utilisateurs",
                  icon: <TeamOutlined />,
                },
              ]}
              onClick={({ key }) => {
                router.push(key);
              }}
            /> */}
            {/* <Layout.Footer
              style={{
                padding: "20px 16px",
                borderTop: `1px solid ${colorBorderSecondary}`,
                background: colorBgContainer,
              }}
            >
              <Typography.Text type="secondary">
                © 2025 CI-UCBC. Tous droits réservés.
              </Typography.Text>
            </Layout.Footer> */}
          </Layout>
        </Layout.Sider>
        <Layout.Content>
          <div>{children}</div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
