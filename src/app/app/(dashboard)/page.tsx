"use client";

import { Palette } from "@/components/palette";
import { Button, Card, Flex, Layout, Space, theme, Typography } from "antd";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { StudentsStatistics } from "./statistics/students";
import { TeachersStatistics } from "./statistics/teachers";
import { DepartmentsStatistics } from "./statistics/departments";

export default function Page() {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  const [statTab, setStatTab] = useQueryState(
    "tab",
    parseAsStringEnum(["students", "teachers"]).withDefault("students")
  );

  // const [dashTab, setDashTab] = useQueryState(
  //   "dash_tab",
  //   parseAsStringEnum(["faculty", "department", "enrollment"]).withDefault(
  //     "faculty"
  //   )
  // );

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
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            padding: 0,
          }}
        >
          <Space>
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Tableau de bord
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Flex vertical={true} gap={24}>
          <Card
            title="Statistiques"
            tabList={[
              { key: "students", label: "Etudiants" },
              { key: "teachers", label: "Enseignants" },
            ]}
            // tabBarExtraContent={<Button type="link">Voir plus</Button>}
            onTabChange={(key) => {
              setStatTab(key as "teachers" | "students");
            }}
            activeTabKey={statTab}
          >
            {statTab === "teachers" ? (
              <TeachersStatistics />
            ) : (
              <StudentsStatistics />
            )}
          </Card>
          {/* <Card
            title={
              <>
                Candidatures en attente{" "}
                <Badge count={41} color="red" overflowCount={9} />
              </>
            }
          >
            <div
              style={{ display: dashTab === "enrollment" ? "block" : "none" }}
            >
              <EnrollmentsStatistics />
            </div>
          </Card> */}
        </Flex>
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
        <DepartmentsStatistics />
      </Layout.Sider>
    </Layout>
  );
}
