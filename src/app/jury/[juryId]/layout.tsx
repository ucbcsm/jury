"use client";

import { useYid } from "@/hooks/use-yid";
import { getFacultiesAAsOptionsWithAcronym, getJury } from "@/lib/api";
import { logout } from "@/lib/api/auth";
import { filterOption } from "@/lib/utils";
import {
  CloseOutlined,
  LoadingOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Divider,
  Dropdown,
  Form,
  Image,
  Layout,
  message,
  Select,
  Skeleton,
  Space,
  Spin,
  theme,
  Typography,
} from "antd";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  const { juryId, facultyId } = useParams();
  const router = useRouter();

  const { removeYid } = useYid();

  const {
    data: jury,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["jury", juryId],
    queryFn: ({ queryKey }) => getJury(Number(queryKey[1])),
    enabled: !!juryId,
  });
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
            href={`/jury/${juryId}`}
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
          {!isPending ? (
            <Typography.Text type="secondary">{jury?.name}</Typography.Text>
          ) : (
            <Form>
              <Skeleton.Input size="small" active />
            </Form>
          )}
          {facultyId && <Divider type="vertical" />}
          {facultyId && (
            <Typography.Text type="secondary">Filière:</Typography.Text>
          )}

          {facultyId && (
            <Select
              value={Number(facultyId)}
              showSearch
              variant="filled"
              filterOption={filterOption}
              options={getFacultiesAAsOptionsWithAcronym(jury?.faculties)}
              style={{ width: 108 }}
              loading={isPending}
              onSelect={(value) => {
                router.push(`/jury/${juryId}/${value}`);
              }}
            />
          )}
        </Space>

        <div className="flex-1" />
        <Space>
          <Typography.Title
            level={5}
            type="secondary"
            style={{ marginBottom: 0 }}
          >
            {jury?.academic_year.name}
          </Typography.Title>
          {/* <YearSelector /> */}
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
          <Button
            type="text"
            icon={<CloseOutlined />}
            title="Fermer"
            onClick={() => {
              router.push("/jury");
            }}
          />
          {/* <LanguageSwitcher /> */}
        </Space>
      </Layout.Header>
      <Layout>
        <Layout.Content>
          <div
            style={{
              background: colorBgContainer,
              minHeight: 280,
              borderRadius: borderRadiusLG,
            }}
          >
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
