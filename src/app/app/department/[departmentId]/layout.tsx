"use client";

import {
  AppstoreOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  RightOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Form,
  Layout,
  List,
  Radio,
  Skeleton,
  Space,
  theme,
  Typography,
} from "antd";

import Link from "next/link";
import { Palette } from "@/components/palette";
import BackButton from "@/components/backButton";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getDepartment } from "@/lib/api";

export default function DepartmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const { departmentId } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const {
    data: department,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["department", departmentId],
    queryFn: ({ queryKey }) => getDepartment(Number(queryKey[1])),
    enabled: !!departmentId,
  });
console.log(department)
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
            {!isPending ? (
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                {department?.name} (Département)
              </Typography.Title>
            ) : (
              <Form>
                <Skeleton.Input active />
              </Form>
            )}
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
          tabBarExtraContent={
            <Space>
              <Button type="dashed" title="Programmer un cours" style={{boxShadow:"none"}}>
                Programmer un cours
              </Button>
            </Space>
          }
          tabList={[
            {
              key: `/app/department/${departmentId}`,
              label: "Aperçu",
            },
            {
              key: `/app/department/${departmentId}/students`,
              label: "Étudiants",
            },
            {
              key: `/app/department/${departmentId}/classes`,
              label: "Promotions",
            },
            {
              key: `/app/department/${departmentId}/programs`,
              label: "Programmes",
            },
            {
              key: `/app/department/${departmentId}/teachers`,
              label: "Enseignants",
            },
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
      {/* <Layout.Sider
        width={280}
        theme="light"
        style={{ borderLeft: `1px solid ${colorBorderSecondary}` }}
      >
        <Card
          variant="borderless"
          title="Personnel"
          style={{ boxShadow: "none" }}
          extra={
            <Button
              type="link"
              icon={<PlusCircleOutlined />}
              title="Ajouter un membre du personnel"
            >
              Ajouter
            </Button>
          }
        >
          <List
            dataSource={[
              {
                id: "1",
                name: "Dr. Alfred L.",
                role: "Responsable",
              },
              {
                id: "2",
                name: "Mme. Sophie K.",
                role: "Secrétaire académique",
              },
              {
                id: "3",
                name: "M. Jean P.",
                role: "Chargé des finances",
              },
              {
                id: "4",
                name: "Mme. Claire T.",
                role: "Coordonnatrice des cours",
              },
              {
                id: "5",
                name: "M. David M.",
                role: "Technicien informatique",
              },
            ]}
            renderItem={(item, index) => (
              <List.Item
                key={item.id}
                extra={<Button type="text" icon={<RightOutlined />} />}
              >
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
      </Layout.Sider> */}
    </Layout>
  );
}
