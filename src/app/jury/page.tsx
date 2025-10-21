"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { Palette } from "@/components/palette";
import { useYid } from "@/hooks/use-yid";
import { getUserIsJury, getYears } from "@/lib/api";
import { logout } from "@/lib/api/auth";
import {
  CalendarOutlined,
  LoadingOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Card,
  Flex,
  Layout,
  List,
  message,
  Spin,
  Typography,
} from "antd";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [yearId, setYearId] = useState<number | undefined>();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoadingLogout, setIsLoadingLogout] = useState<boolean>(false);
  const { setYid,removeYid } = useYid();

  const {
    data: years,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["years"],
    queryFn: getYears,
  });

  const {
    data: jury,
    isLoading,
    isError: isErrorJury,
    error,
  } = useQuery({
    queryKey: ["get", `${yearId}`],
    queryFn: ({ queryKey }) => getUserIsJury(Number(queryKey[1])),
    enabled: !!yearId,
    refetchOnReconnect:false,
    refetchOnWindowFocus:false
  });

  if (jury && yearId) {
    setYid(yearId);
    redirect(`/jury/${jury.id}`);
  }

  if (isError) {
    return (
      <Layout>
        <Layout.Content
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            width: "100%",
            padding: 28,
          }}
        >
          <DataFetchErrorResult />
        </Layout.Content>
      </Layout>
    );
  }

  useEffect(() => {
    if (
      isErrorJury &&
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      ((error as any).status === 404 || (error as any).status === 503)
    ) {
      messageApi.error("Vous n'êtes associé(e) à aucun jury!");
    } else if (isErrorJury) {
      messageApi.error("Erreur inconnue. Merci de réessayer.");
      setYearId(undefined);
    }
  }, [error]);

  return (
    <Layout>
      {contextHolder}
      <Layout.Content
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          width: "100%",
          padding: 28,
        }}
      >
        <div style={{ width: 400, margin: "auto" }}>
          {isErrorJury &&
            ((error as any).status === 404 ||
              (error as any).status === 503) && (
              <Alert
                showIcon
                type="info"
                message="Accès non autorisé"
                description="Vous n'êtes associé(e) à aucun jury dans le système. Merci de contacter l'administrateur afin qu'il vous associe à un jury."
                style={{ marginBottom: 20, border: 0 }}
                action={
                  <Button
                    type="primary"
                    style={{ boxShadow: "none" }}
                    onClick={() => {
                      setIsLoadingLogout(true);
                      logout()
                        .then(() => {
                          removeYid();
                          window.location.href = "/auth/login";
                        })
                        .catch((error) => {
                          messageApi.error(
                            "Ouf, une erreur est survenue, Veuillez réessayer!"
                          );
                          setIsLoadingLogout(false);
                        });
                    }}
                  >
                    OK
                  </Button>
                }
              />
            )}
          <Card loading={isPending}>
            <Typography.Title level={4}>Année</Typography.Title>
            <List
              dataSource={years}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  className=" hover:cursor-pointer"
                  extra={
                    isLoading && item.id === yearId ? (
                      <LoadingOutlined />
                    ) : (
                      <RightOutlined />
                    )
                  }
                  style={{ paddingLeft: 16, paddingRight: 16 }}
                  onClick={() => {
                    if (!isLoading) {
                      setYearId(item.id);
                    }
                  }}
                >
                  <List.Item.Meta
                    title={item.name}
                    avatar={<CalendarOutlined />}
                  />
                </List.Item>
              )}
            />
          </Card>
          <Flex
            justify="space-between"
            align="center"
            style={{ paddingTop: 16 }}
          >
            <Typography.Text type="secondary">
              © {new Date().getFullYear()} UCBC. Tous droits réservés.
            </Typography.Text>
            <Palette />
          </Flex>
        </div>
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
      </Layout.Content>
    </Layout>
  );
}
