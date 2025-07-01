"use client";

import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Flex,
  Layout,
  List,
  Space,
  theme,
  Typography,
} from "antd";

import { Palette } from "@/components/palette";
import Link from "next/link";
import BackButton from "@/components/backButton";
import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getGroups, getPermissions } from "@/lib/api";
import { GroupList } from "./groups/list";
import { NewGroupForm } from "./groups/new";

export default function UsersLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  const pathname = usePathname();
  const router = useRouter();

   const {
    data: permissions,
    isPending: isPendingPermissions,
    isError: isErrorPermissions,
  } = useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  });
 

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
              Gestion des utilisateurs
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
          // tabList={[
          //   {
          //     key: "/console/users",
          //     label: "Tous",
          //   },
          //   { key: "/console/users/students", label: "Étudiants" },
          //   { key: "/console/users/teachers", label: "Enseignants" },
          //   { key: "/console/users/admins", label: "Admins" },
          // ]}
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
        <Flex
          justify="space-between"
          align="center"
          style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 12 }}
        >
          <Typography.Title level={5} className="">
            Groupes
          </Typography.Title>
          <NewGroupForm permissions={permissions}/>
        </Flex>
        <div
          style={{
            padding: "20px 12px 28px 28px",
            width: "100%",
            height: "calc(100vh - 108px)",
            overflowY: "auto",
          }}
        >
          <GroupList permissions={permissions}/>
        </div>
      </Layout.Sider>
    </Layout>
  );
}
