"use client";
import {
  DownOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FilterOutlined,
  MoreOutlined,
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  Flex,
  Input,
  Layout,
  Space,
  theme,
  Typography,
} from "antd";
import BackButton from "@/components/backButton";
import { Palette } from "@/components/palette";
import { ListStudents } from "./list";

export default function StudentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

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
          style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 20 }}
        >
          <Typography.Title level={3} className="" style={{marginBottom:0}}>
            Étudiants
          </Typography.Title>
          <Space>
            <Button
              // icon={<FilterOutlined />}
              color="primary"
              style={{ boxShadow: "none" }}
              variant="dashed"
            >
              Filtrer
            </Button>
            <Button type="text" icon={<MoreOutlined />} />
          </Space>
        </Flex>
        <div
          style={{
            height: "calc(100vh - 116px)",
            overflowY: "auto",
            paddingLeft: 16,
            paddingRight: 16,
            paddingBottom: 28,
            paddingTop: 16,
          }}
        >
          <Flex className="" style={{marginBottom:12}}>
            <Input
              placeholder="Rechercher ..."
              allowClear
              className=""
              prefix={<SearchOutlined />}
              variant="borderless"
            />
            <Space>
              <Button
                type="text"
                icon={<PrinterOutlined />}
                style={{ boxShadow: "none" }}
              />
              <Button
                type="text"
                icon={<FilePdfOutlined />}
                style={{ boxShadow: "none" }}
              />
              <Button
                type="text"
                icon={<FileExcelOutlined />}
                style={{ boxShadow: "none" }}
              />
            </Space>
          </Flex>
          <ListStudents />
        </div>
      </Layout.Sider>
      <Layout.Content
        style={{
          background: colorBgContainer,
        }}
      >
        {children}
      </Layout.Content>
    </Layout>
  );
}
