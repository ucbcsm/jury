"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { getLetterGradings } from "@/lib/api";
import {
  DownOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Dropdown, Layout, Space, Table, Typography } from "antd";

export default function Page() {
  const {
    data: letterGradings,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["letter_gradings"],
    queryFn: getLetterGradings,
  });

  if (isPending) {
    return (
      <div
        style={{
          padding: 32,
          overflowY: "auto",
          height: "calc(100vh - 110px)",
        }}
      >
        <DataFetchPendingSkeleton />
      </div>
    );
  }
  if (isError) {
    return (
      <div
        style={{
          padding: 32,
          overflowY: "auto",
          height: "calc(100vh - 110px)",
        }}
      >
        <DataFetchErrorResult />
      </div>
    );
  }

  return (
    <Layout>
      <Layout.Content
        style={{
          padding: 32,
          overflowY: "auto",
          height: "calc(100vh - 110px)",
        }}
      >
        <Table
          title={() => (
            <header className="flex pb-3 items-center">
              <Space>
                <Typography.Title level={5} style={{ marginBottom: 0 }}>
                  Notations
                </Typography.Title>
              </Space>
              <div className="flex-1" />
              <Space>
                <Button
                  icon={<PrinterOutlined />}
                  style={{ boxShadow: "none" }}
                >
                  Imprimer
                </Button>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "pdf",
                        label: "PDF",
                        icon: <FilePdfOutlined />,
                        title: "Exporter en pdf",
                      },
                      {
                        key: "excel",
                        label: "EXCEL",
                        icon: <FileExcelOutlined />,
                        title: "Exporter vers Excel",
                      },
                    ],
                  }}
                >
                  <Button icon={<DownOutlined />} style={{ boxShadow: "none" }}>
                    Exporter
                  </Button>
                </Dropdown>
              </Space>
            </header>
          )}
          columns={[
            {
              title: "Lettre",
              dataIndex: "grade_letter",
              key: "grade_letter",
              render: (value) => (
                <Typography.Text strong>{value}</Typography.Text>
              ),
              width: 54,
              align: "center",
            },
            {
              title: "Appréciation",
              dataIndex: "appreciation",
              key: "appreciation",
            },
            {
              title: "Description",
              dataIndex: "description",
              key: "description",
              ellipsis: true,
            },
            {
              title: "Seuil Min.",
              dataIndex: "lower_bound",
              key: "lower_bound",
              render: (min: number) => min ?? "-",
              align: "center",
              width: 84,
            },
            {
              title: "Seuil Max.",
              dataIndex: "upper_bound",
              key: "upper_bound",
              render: (max: number) => max ?? "-",
              align: "center",
              width: 84,
            },
          ]}
          dataSource={letterGradings}
          rowKey="id"
          rowClassName={`bg-[#f5f5f5] odd:bg-white`}
          bordered
          // rowSelection={{
          //     type: "checkbox",
          // }}
          size="small"
          pagination={{
            defaultPageSize: 25,
            pageSizeOptions: [25, 50, 75, 100],
            size: "small",
          }}
        />
      </Layout.Content>
    </Layout>
  );
}
