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
import {
  Button,
  Drawer,
  Dropdown,
  Space,
  Table,
  theme,
  Typography,
} from "antd";
import { Options } from "nuqs";
import { FC } from "react";

type ListLetterGradingsProps = {
  open: boolean;
  setOpen: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const ListLetterGradings: FC<ListLetterGradingsProps> = ({
  open,
  setOpen,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const {
    data: letterGradings,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["letter_gradings"],
    queryFn: getLetterGradings,
  });

  const onClose = () => setOpen(false);

  // if (isPending) {
  //   return (
  //     <div
  //       style={{
  //         padding: 32,
  //         overflowY: "auto",
  //         height: "calc(100vh - 110px)",
  //       }}
  //     >
  //       <DataFetchPendingSkeleton />
  //     </div>
  //   );
  // }
  // if (isError) {
  //   return (
  //     <div
  //       style={{
  //         padding: 32,
  //         overflowY: "auto",
  //         height: "calc(100vh - 110px)",
  //       }}
  //     >
  //       <DataFetchErrorResult />
  //     </div>
  //   );
  // }

  return (
    <Drawer
      open={open}
      title="Notation en lettres"
      destroyOnHidden
      onClose={onClose}
      closable
      maskClosable
      width="50%"
      styles={{ header: { background: colorPrimary, color: "#fff" } }}
      loading={isPending}
    >
      <Table
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
        bordered
        size="small"
        pagination={{
          defaultPageSize: 25,
          pageSizeOptions: [25, 50, 75, 100],
          size: "small",
        }}
      />
    </Drawer>
  );
};
