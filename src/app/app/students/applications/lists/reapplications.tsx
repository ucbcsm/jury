"use client";

import {
  getPendingApplications,
  getRejectedApplications,
  getValidatedApplications,
} from "@/lib/api";
import { SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Badge, Input, List, Tabs } from "antd";
import { FC } from "react";
import { ListItemApplication } from "./listItem";
import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchingSkeleton } from "./new_applications";

export const ListReApplications: FC = () => {
  const {
    data: pendingApplications,
    isPending: isPendingPendingApplications,
    isError: isErrorPendingApplications,
  } = useQuery({
    queryKey: ["applications", "pending", "is_old_student"],
    queryFn: async ({ queryKey }) =>
      getPendingApplications({ student_tab_type: queryKey[2] }),
  });

  const {
    data: rejectedApplications,
    isPending: isPendingRejectdApplications,
    isError: isErrorRejectedApplications,
  } = useQuery({
    queryKey: ["applications", "rejected", "is_old_student"],
    queryFn: async ({ queryKey }) =>
      getRejectedApplications({ student_tab_type: queryKey[2] }),
  });

  const {
    data: validatedApplications,
    isPending: isPendingValidatedApplications,
    isError: isErrorValidatedApplications,
  } = useQuery({
    queryKey: ["applications", "validated", "is_old_student"],
    queryFn: async ({ queryKey }) =>
      getValidatedApplications({ student_tab_type: queryKey[2] }),
  });

  return (
    <Tabs
      tabBarStyle={{ paddingLeft: 28, marginTop: 0 }}
      type="card"
      tabPosition="bottom"
      items={[
        {
          key: "pending",
          label: (
            <Badge
              count={pendingApplications?.length}
              color="red"
              overflowCount={9}
            >
              En attentes
            </Badge>
          ),
          children: (
            <div
              style={{
                height: "calc(100vh - 210px)",
                overflowY: "auto",
                paddingLeft: 28,
                paddingRight: 12,
                paddingBottom: 28,
                paddingTop: 20,
              }}
            >
              {pendingApplications && (
                <>
                  <Input
                    placeholder="Rechercher ..."
                    allowClear
                    className="mb-4 mt-2"
                    prefix={<SearchOutlined />}
                    variant="borderless"
                  />
                  <List
                    dataSource={pendingApplications}
                    renderItem={(item) => (
                      <ListItemApplication key={item.id} item={item} />
                    )}
                  />
                </>
              )}
              {isPendingPendingApplications && <DataFetchingSkeleton />}
              {isErrorPendingApplications && <DataFetchErrorResult />}
            </div>
          ),
        },
        {
          key: "rejected",
          label: "Rejetées",
          children: (
            <div
              style={{
                height: "calc(100vh - 210px)",
                overflowY: "auto",
                paddingLeft: 28,
                paddingRight: 12,
                paddingBottom: 28,
                paddingTop: 20,
              }}
            >
              {rejectedApplications && (
                <>
                  <Input
                    placeholder="Rechercher ..."
                    allowClear
                    className="mb-4 mt-2"
                    prefix={<SearchOutlined />}
                    variant="borderless"
                  />
                  <List
                    dataSource={rejectedApplications}
                    renderItem={(item) => (
                      <ListItemApplication key={item.id} item={item} />
                    )}
                  />
                </>
              )}
              {isPendingRejectdApplications && <DataFetchingSkeleton />}
              {isErrorRejectedApplications && <DataFetchErrorResult />}
            </div>
          ),
        },
        {
          key: "validated",
          label: "Acceptées",
          children: (
            <div
              style={{
                height: "calc(100vh - 210px)",
                overflowY: "auto",
                paddingLeft: 28,
                paddingRight: 12,
                paddingBottom: 28,
                paddingTop: 20,
              }}
            >
              {validatedApplications && (
                <>
                  <Input
                    placeholder="Rechercher ..."
                    allowClear
                    className="mb-4 mt-2"
                    prefix={<SearchOutlined />}
                    variant="borderless"
                  />
                  <List
                    dataSource={validatedApplications}
                    renderItem={(item) => (
                      <ListItemApplication key={item.id} item={item} />
                    )}
                  />
                </>
              )}
              {isPendingValidatedApplications && <DataFetchingSkeleton />}
              {isErrorValidatedApplications && <DataFetchErrorResult />}
            </div>
          ),
        },
      ]}
    />
  );
};
