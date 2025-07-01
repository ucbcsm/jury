"use client";

import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import {
  getClasses,
  getCycles,
  getDepartments,
  getEnabledRequiredDocuments,
  getEnabledTestCourses,
  getFaculties,
  getFields,
  getPendingApplications,
  getRejectedApplications,
  getTestCourses,
  getValidatedApplications,
} from "@/lib/api";
import { SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Badge, Input, List, Tabs } from "antd";
import { FC } from "react";
import { ListItemApplication } from "./listItem";
import { DataFetchErrorResult } from "@/components/errorResult";

export const DataFetchingSkeleton = () => (
  <>
    <DataFetchPendingSkeleton />
    <div className="mt-5">
      <DataFetchPendingSkeleton />
    </div>
  </>
);

export const ListNewApplications: FC = () => {
  const {
    data: pendingApplications,
    isPending: isPendingPendingApplications,
    isError: isErrorPendingApplications,
  } = useQuery({
    queryKey: ["applications", "pending", "is_new_student"],
    queryFn: async ({ queryKey }) =>
      getPendingApplications({ student_tab_type: queryKey[2] }),
  });

  const {
    data: rejectedApplications,
    isPending: isPendingRejectdApplications,
    isError: isErrorRejectedApplications,
  } = useQuery({
    queryKey: ["applications", "rejected", "is_new_student"],
    queryFn: async ({ queryKey }) =>
      getRejectedApplications({ student_tab_type: queryKey[2] }),
  });

  const {
    data: validatedApplications,
    isPending: isPendingValidatedApplications,
    isError: isErrorValidatedApplications,
  } = useQuery({
    queryKey: ["applications", "validated", "is_new_student"],
    queryFn: async ({ queryKey }) =>
      getValidatedApplications({ student_tab_type: queryKey[2] }),
  });

  const { data: test_courses } = useQuery({
    queryKey: ["test_courses", "enabled"],
    queryFn: getEnabledTestCourses,
  });

  const { data: required_documents } = useQuery({
    queryKey: ["required_documents", "enabled"],
    queryFn: getEnabledRequiredDocuments,
  });

  const { data: cycles } = useQuery({
    queryKey: ["cycles"],
    queryFn: getCycles,
  });

  const { data: faculties } = useQuery({
    queryKey: ["faculties"],
    queryFn: getFaculties,
  });

  const { data: fields } = useQuery({
    queryKey: ["fields"],
    queryFn: getFields,
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });

  return (
    <Tabs
      tabPosition="bottom"
      type="card"
      tabBarStyle={{ paddingLeft: 28, marginTop: 0 }}
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
                      <ListItemApplication
                        key={item.id}
                        item={item}
                        courses={test_courses}
                        documents={required_documents}
                        cycles={cycles}
                        faculties={faculties}
                        fields={fields}
                        departments={departments}
                        classes={classes}
                      />
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
                      <ListItemApplication
                        key={item.id}
                        item={item}
                        courses={test_courses}
                        documents={required_documents}
                        cycles={cycles}
                        faculties={faculties}
                        fields={fields}
                        departments={departments}
                        classes={classes}
                      />
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
                      <ListItemApplication
                        key={item.id}
                        item={item}
                        courses={test_courses}
                        documents={required_documents}
                        cycles={cycles}
                        faculties={faculties}
                        fields={fields}
                        departments={departments}
                        classes={classes}
                      />
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
