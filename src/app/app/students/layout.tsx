"use client";
import { UserAddOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  Flex,
  Layout,
  Space,
  Tabs,
  theme,
  Typography,
} from "antd";
import { usePathname, useRouter } from "next/navigation";
import { parseAsBoolean, useQueryState } from "nuqs";
import { ListNewApplications } from "./applications/lists/new_applications";
import { ListReApplications } from "./applications/lists/reapplications";
import { ReapplyForm } from "./applications/forms/reapply";
import { NewApplicationForm } from "./applications/forms/new/new";
import BackButton from "@/components/backButton";
import { Palette } from "@/components/palette";

export default function StudentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  const [reapply, setReapply] = useQueryState(
    "reapply",
    parseAsBoolean.withDefault(false)
  );
  const [newApplication, SetNewApplication] = useQueryState(
    "new",
    parseAsBoolean.withDefault(false)
  );

  const pathname = usePathname();
  const router = useRouter();

  return (
    <Layout>
      <Layout.Sider
        width={360}
        theme="light"
        style={{ borderRight: `1px solid ${colorBorderSecondary}` }}
      >
        <Flex
          justify="space-between"
          align="center"
          className="px-7 pt-3"
          style={{ paddingLeft: 28, paddingRight: 28, paddingTop: 12 }}
        >
          <Typography.Title level={3} className="">
            Candidatures
          </Typography.Title>
          <Dropdown
            menu={{
              items: [
                {
                  key: "reapply",
                  label: "Réinscrire (Pour les anciens)",
                  icon: <UserOutlined />,
                },
                {
                  key: "newApplication",
                  label: "Nouvelle candidature",
                  icon: <UserAddOutlined />,
                },
              ],
              onClick: ({ key }) => {
                if (key === "reapply") {
                  setReapply(true);
                } else if (key === "newApplication") {
                  SetNewApplication(true);
                }
              },
            }}
          >
            <Button
              icon={<UserAddOutlined />}
              type="primary"
              style={{ boxShadow: "none" }}
              variant="dashed"
            >
              Créer
            </Button>
          </Dropdown>
        </Flex>
        <Tabs
          tabBarStyle={{ paddingLeft: 28, marginBottom: 0 }}
          // tabPosition="bottom"

          items={[
            {
              key: "waiting",
              label: "Nouveaux étudiants",
              children: <ListNewApplications />,
            },
            {
              key: "accepted",
              label: "Anciens étudiants",
              children: <ListReApplications />,
            },
          ]}
        />
        <ReapplyForm open={reapply} setOpen={setReapply} />
        <NewApplicationForm open={newApplication} setOpen={SetNewApplication} />
      </Layout.Sider>
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
              Etudiants
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card>{children}</Card>
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
