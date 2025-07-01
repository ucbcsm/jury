"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { useYid } from "@/hooks/use-yid";
import {
  getAllYearEnrollmentsByFaculty,
  getClasses,
  getDepartmentsByFacultyId,
  getPeriodEnrollmentsbyFaculty,
  getPeriodsByYear,
} from "@/lib/api";
import { Period } from "@/types";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Form, Layout, Skeleton, Space, Tabs, theme, Typography } from "antd";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { NewPeriodEnrollmentForm } from "./[periodId]/forms/new";
import { Palette } from "@/components/palette";

export default function StudentsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const router = useRouter();
  const pathname = usePathname();
  const { facultyId, periodId } = useParams();
  const { yid } = useYid();

  const { data: yearEnrollments } = useQuery({
    queryKey: ["all_year_enrollments", `${yid}`, facultyId],
    queryFn: ({ queryKey }) =>
      getAllYearEnrollmentsByFaculty(Number(queryKey[1]), Number(queryKey[2])),
    enabled: !!yid && !!facultyId,
  });

  const {
    data: periods,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["periods", `${yid}`],
    queryFn: ({ queryKey }) => getPeriodsByYear(Number(queryKey[1])),
    enabled: !!yid,
  });

  const { data: periodEnrollments } = useQuery({
    queryKey: ["period_enrollments", `${yid}`, facultyId, periodId],
    queryFn: ({ queryKey }) =>
      getPeriodEnrollmentsbyFaculty(
        Number(queryKey[1]),
        Number(queryKey[2]),
        Number(queryKey[3])
      ),
    enabled: !!yid && !!facultyId && !!periodId,
  });

  const getPeriodsAsTabs = (periods?: Period[]) => {
    return periods?.map((period) => ({
      key: `/faculty/${facultyId}/students/${period.id}`,
      label: `${period.name} (${period.acronym})`,
    }));
  };

  const { data: departments } = useQuery({
    queryKey: ["departments", facultyId],
    queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });

  const getPeriodsAsDropdownMenu = (periods?: Period[]) => {
    return periods?.map((period) => ({
      key: `${period.id}`,
      label: `${period.name} (${period.acronym})`,
      icon: <ClockCircleOutlined />,
    }));
  };

  if (isPending) {
    return <DataFetchPendingSkeleton variant="table" />;
  }

  if (isError) {
    return <DataFetchErrorResult />;
  }

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
            {/* <BackButton /> */}
            {!isPending ? (
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                Inscriptions
              </Typography.Title>
            ) : (
              <Form>
                <Skeleton.Input active />
              </Form>
            )}
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        {/* <Typography.Title level={3}>Inscriptions</Typography.Title> */}
        <Tabs
          items={[
            {
              key: `/faculty/${facultyId}/students`,
              label: "Année",
            },
            ...getPeriodsAsTabs(periods)!,
          ]}
          defaultActiveKey={pathname}
          activeKey={pathname}
          onChange={(key) => router.push(key)}
          tabBarExtraContent={
            <NewPeriodEnrollmentForm
              periodsAsMenu={[...getPeriodsAsDropdownMenu(periods)!]}
              periods={periods}
              yearEnrollments={yearEnrollments}
              periodEnrollments={periodEnrollments}
              departments={departments}
              classes={classes} // Promotions
            />
          }
        />
        <>{children}</>
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
    </Layout>
  );
}
