"use client";

import { NewYearForm } from "@/app/console/years/forms/new";
import { useYid } from "@/hooks/use-yid";
import {
  getYears,
  getYearsAsOptions,
  getYearStatusColor,
  getYearStatusName,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Flex,
  Form,
  Image,
  Progress,
  Radio,
  Select,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { Palette } from "./palette";
import { DataFetchErrorResult } from "./errorResult";
import { useSessionStore } from "@/store";

type FormDataType = {
  yid: number;
};

export function YearSelector() {
  const [form] = Form.useForm();
  const { yid, setYid } = useYid();
  const [percent, setPercent] = useState(-50);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const faculty = useSessionStore((state) => state.faculty);

  const {
    data: years,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["years"],
    queryFn: getYears,
  });

  const onFinish = (values: FormDataType) => {
    setYid(values.yid);
    window.location.reload();
  };

  const checkYidInYears = () => {
    const exists = years?.some((y) => y.id === yid);
    return typeof exists === "boolean" ? !exists : false;
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setPercent((prev) => {
        const nextPercent = prev + 5;
        return nextPercent > 150 ? 100 : nextPercent;
      });
    }, 200);
    return () => clearTimeout(timerRef.current!);
  }, [percent]);

  if (isError) {
    return (
      <div
        style={{
          display: "flex",
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
        <div style={{ width: 560, margin: "auto" }}>
          <DataFetchErrorResult />
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className=""
        style={{
          display: isPending || typeof yid === "undefined" ? "flex" : "none",
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
        {checkYidInYears() ? (
          <div style={{ width: 440, margin: "auto" }}>
            <Card
              title={
                <Typography.Title level={2} style={{ marginBottom: 0 }}>
                  Année
                </Typography.Title>
              }
              extra={!faculty ? <NewYearForm buttonType="link" /> : undefined}
            >
              <Form
                disabled={isPending}
                key="select_year_id_as_yid"
                layout="vertical"
                form={form}
                name="select_year_id_as_id"
                onFinish={onFinish}
              >
                <Form.Item
                  name="yid"
                  // label="Année"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez sélectionner une année académique",
                    },
                  ]}
                >
                  <Radio.Group
                    style={{ display: "flex", flexDirection: "column" }}
                    options={years?.map((year) => ({
                      value: year.id,
                      label: (
                        <Space>
                          <Typography.Title
                            level={5}
                            style={{ marginBottom: 0 }}
                          >
                            {year.name}
                          </Typography.Title>
                          <Tag
                            color={getYearStatusColor(year.status)}
                            style={{ border: 0 }}
                          >
                            {getYearStatusName(year.status)}
                          </Tag>
                        </Space>
                      ),
                    }))}
                  />
                </Form.Item>
                <Flex justify="space-between" align="center">
                  <Palette />
                  <Form.Item noStyle>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ boxShadow: "none" }}
                      loading={isPending}
                    >
                      OK
                    </Button>
                  </Form.Item>
                </Flex>
              </Form>
            </Card>
            <Typography.Text type="secondary">
              © {new Date().getFullYear()} CI-UCBC. Tous droits réservés.
            </Typography.Text>
          </div>
        ) : (
          <Flex
            vertical
            className=""
            style={{
              width: 340,
              margin: "auto",
              alignItems: "center",
            }}
          >
            <Image
              src="/ucbc-logo.png"
              alt="logo ucbc"
              height="auto"
              width={180}
              preview={false}
            />
            <Progress
              strokeColor={"#E84C37"}
              percent={percent}
              showInfo={false}
            />
            <Typography.Title type="secondary" level={3}>
              Academic Workspace
            </Typography.Title>
            <Typography.Text type="secondary">
              © {new Date().getFullYear()} CI-UCBC. Tous droits réservés.
            </Typography.Text>
          </Flex>
        )}
      </div>

      {!isPending ? (
        <Select
          value={yid}
          variant="filled"
          options={getYearsAsOptions(years)}
          style={{ width: 108 }}
          onSelect={(value) => {
            setYid(value);
            window.location.reload();
          }}
        />
      ) : (
        <Form>
          <Skeleton.Input size="default" block />
        </Form>
      )}
    </>
  );
}
