"use client";

import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Layout,
  List,
  Skeleton,
  Space,
  theme,
  Typography,
} from "antd";

import { Palette } from "@/components/palette";
import { useParams, usePathname, useRouter } from "next/navigation";
import BackButton from "@/components/backButton";
import { useQuery } from "@tanstack/react-query";
import { getYearById, getYearStatusName } from "@/lib/api";
import { useState } from "react";
import { EditYearForm } from "../forms/edit";

export default function YearLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const { yearId } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false)

  const { data: year, isPending } = useQuery({
    queryKey: ["year", yearId],
    queryFn: async ({ queryKey }) => getYearById(Number(queryKey[1])),
    enabled:!!yearId
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
              Année {year?.name}
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
          tabList={[
            {
              key: `/console/years/${yearId}/periods`,
              label: "Périodes",
            },
            {
              key: `/console/years/${yearId}/fees`,
              label: "Frais",
            },
            {
              key: `/console/years/${yearId}/jurys`,
              label: "Jurys d'examen",
            },
            {
              key: `/console/years/${yearId}/letter-gradings`,
              label: "Notation par lettres",
            },
            {
              key: `/console/years/${yearId}/currencies`,
              label: "Monnaies",
            },
            {
              key: `/console/years/${yearId}/payment-methods`,
              label: "Modes de paiement", 
            },
          ]}
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
          loading={isPending}
          variant="borderless"
          title={
            !isPending ? "Détails de l'année" : <Skeleton.Input size="small" />
          }
          style={{ boxShadow: "none" }}
          extra={
            !isPending ? (
              <Button
                type="link"
                icon={<EditOutlined />}
                title="Modifier l'année"
                onClick={()=>{setOpenEdit(true)}}
              />
            ) : (
              <Skeleton.Button size="small" />
            )
          }
        >
          {year&&<EditYearForm year={year} open={openEdit} setOpen={setOpenEdit}/>}
          {year && (
            <List
              dataSource={[
                {
                  id: "0",
                  name: "Nom",
                  description: `${year?.name}`,
                },
                {
                  id: "1",
                  name: "Date de début",
                  description: `${new Intl.DateTimeFormat("FR", {
                    dateStyle: "full",
                  }).format(new Date(`${year?.start_date}`))}`,
                },
                {
                  id: "2",
                  name: "Date de fin",
                  description: `${new Intl.DateTimeFormat("FR", {
                    dateStyle: "full",
                  }).format(new Date(`${year?.end_date}`))}`,
                },
                {
                  id: "3",
                  name: "Status des inscriptions",
                  description: getYearStatusName(`${year?.status}`),
                },
              ]}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    title={
                      <Typography.Text strong>{item.name}</Typography.Text>
                    }
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </Layout.Sider>
    </Layout>
  );
}
