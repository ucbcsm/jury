"use client";

import { LanguageSwitcher } from "@/components/languageSwitcher";
import { YearSelector } from "@/components/yearSelector";
import { useYid } from "@/hooks/use-yid";
import { getDepartmentsByFacultyId, getFaculty } from "@/lib/api";
import { logout } from "@/lib/api/auth";
import { useSessionStore } from "@/store";
import {
  LoadingOutlined,
  LogoutOutlined,
  MenuOutlined,
  QuestionOutlined,
  SubnodeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Divider,
  Dropdown,
  Image,
  Layout,
  Menu,
  message,
  Space,
  Spin,
  theme,
  Typography,
} from "antd";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function FacultyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, borderRadiusLG, colorBorderSecondary },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoadingLogout, setIsLoadingLogout] = useState<boolean>(false);
  const { facultyId } = useParams();

  const { removeYid } = useYid();

  const {
      data: faculty,
      isPending,
      isError,
    } = useQuery({
      queryKey: ["faculty", facultyId],
      queryFn: ({ queryKey }) => getFaculty(Number(queryKey[1])),
      enabled: !!facultyId,
    });

  const router = useRouter();
  const pathname = usePathname();

  const { data: departments } = useQuery({
    queryKey: ["departments", facultyId],
    queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  const getDepartmentsAsMenu = () => {
    const menu = departments?.map((dep) => ({
      key: `/faculty/${dep.faculty.id}/department/${dep.id}`,
      label: dep.name,
      icon: <SubnodeOutlined />,
    }));
    return menu;
  };

  return (
    <Layout>
      {contextHolder}
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          background: colorBgContainer,
          borderBottom: `1px solid ${colorBorderSecondary}`,
          paddingLeft: 32,
          paddingRight: 32,
        }}
      >
        <Space>
          <Link
            href={`/faculty/${facultyId}`}
            style={{ display: "flex", alignItems: "center" }}
          >
            <div className="flex items-center pr-3">
              <Image
                src="/ucbc-logo.png"
                alt="Logo ucbc"
                width={36}
                height="auto"
                preview={false}
              />
            </div>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              CI-UCBC
            </Typography.Title>
          </Link>
          <Divider type="vertical" />
          <Typography.Text type="secondary">
           {faculty?.acronym}
          </Typography.Text>
        </Space>

        {/* <Menu
          mode="horizontal"
          theme="light"
          defaultSelectedKeys={[pathname]}
          selectedKeys={[pathname]}
          overflowedIndicator={<MenuOutlined />}
          items={[
            {
              key: `/faculty/${facultyId}`,
              label: "Aperçu",
            },
            { key: `/faculty/${facultyId}/students`, label: "Étudiants" },
            {
              key: `/faculty/${facultyId}/taught-courses`,
              label: "Cours",
            },
            {
              key: `/faculty/${facultyId}/courses`,
              label: "Catalogue",
            },
            {
              key: `departments`,
              label: "Mentions",
              //  icon: <BranchesOutlined />,
              children: getDepartmentsAsMenu(),
            },
          ]}
          style={{ flex: 1, minWidth: 0, borderBottom: 0 }}
          onClick={({ key }) => {
            router.push(key);
          }}
        /> */}
        <div className="flex-1"/>
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
              onClick: async ({ key }) => {
                if (key === "logout") {
                  setIsLoadingLogout(true);
                  await logout()
                    .then(() => {
                      removeYid();
                      window.location.href = "/auth/login";
                    })
                    .catch((error) => {
                      console.log(
                        "Error",
                        error.response?.status,
                        error.message
                      );
                      messageApi.error(
                        "Ouf, une erreur est survenue, Veuillez réessayer!"
                      );
                      setIsLoadingLogout(false);
                    });
                }
              },
            }}
            trigger={["hover"]}
          >
            <Button
              disabled={isLoadingLogout}
              type="text"
              icon={<UserOutlined />}
            />
          </Dropdown>
          <Link href="/app/support">
            <Button type="text" icon={<QuestionOutlined />}></Button>
          </Link>
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
              defaultSelectedKeys={[pathname]}
          selectedKeys={[pathname]}
          overflowedIndicator={<MenuOutlined />}
          items={[
              {
                  key: `/`,
                  label: "Menu",
                  type: "group",
                  children:[
            {
              key: `/faculty/${facultyId}`,
              label: "Aperçu",
            },
            { key: `/faculty/${facultyId}/students`, label: "Étudiants" },
            {
              key: `/faculty/${facultyId}/taught-courses`,
              label: "Cours planifiés",
            },
            {
              key: `/faculty/${facultyId}/courses`,
              label: "Catalogue & UE",
            },
            {
              key: `departments`,
              label: "Mentions",
              //  icon: <BranchesOutlined />,
              children: getDepartmentsAsMenu(),
            },
            {
              key: `/faculty/${facultyId}/class-presidents`,
              label:"Chefs de promotion"
            }
          ]
          }
          ]}
          // style={{ flex: 1, minWidth: 0, borderBottom: 0 }}
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
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            borderRadius: borderRadiusLG,
          }}
        >
          {/* <Menu
          mode="horizontal"
          theme="light"
          defaultSelectedKeys={[pathname]}
          selectedKeys={[pathname]}
          overflowedIndicator={<MenuOutlined />}
          items={[
            {
                  key: `/`,
                  label: "Menu",
                  type: "group",
                  children:[
            {
              key: `/faculty/${facultyId}`,
              label: "Aperçu",
            },
            { key: `/faculty/${facultyId}/students`, label: "Étudiants" },
            {
              key: `/faculty/${facultyId}/taught-courses`,
              label: "Cours",
            },
            {
              key: `/faculty/${facultyId}/courses`,
              label: "Catalogue",
            },
            {
              key: `departments`,
              label: "Mentions",
              //  icon: <BranchesOutlined />,
              children: getDepartmentsAsMenu(),
            },]
          }
          ]}
          style={{ flex: 1, minWidth: 0, borderBottom: 0 }}
          onClick={({ key }) => {
            router.push(key);
          }}
        /> */}
          {children}
          <div
            className=""
            style={{
              display: isLoadingLogout ? "flex" : "none",
              flexDirection: "column",
              background: "#fff",
              position: "fixed",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 99,
              height: "100vh",
              width: "100%",
            }}
          >
            <div
              style={{
                width: 440,
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
              />
              <Typography.Title
                type="secondary"
                level={3}
                style={{ marginTop: 10 }}
              >
                Déconnexion en cours ...
              </Typography.Title>
            </div>
          </div>
        </div>
      </Layout.Content>
      </Layout>
    </Layout>
  );
}
