"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { Palette } from "@/components/palette";
import { getUserIsJury, getYears } from "@/lib/api";
import {
  CalendarOutlined,
  LoadingOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Card, Flex, Layout, List, Typography } from "antd";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [yearId, setYearId] = useState<number>();
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
    refetch,
  } = useQuery({
    queryKey: ["get", `${yearId}`],
    queryFn: ({ queryKey }) => getUserIsJury(Number(queryKey[1])),
    enabled: false,
  });

  if (jury) {
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
        <div style={{ width: 400, margin: "auto" }}>
          <Card loading={isPending}>
            <Typography.Title level={4}> Année</Typography.Title>
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
                    setYearId(item.id);
                    refetch();
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
              © {new Date().getFullYear()} CI-UCBC. Tous droits réservés.
            </Typography.Text>
            <Palette />
          </Flex>
        </div>
      </Layout.Content>
    </Layout>
  );
}
