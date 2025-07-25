"use client";

import { getJury, getPeriodsByYear } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Collapse, type CollapseProps, Flex, Splitter, theme, Typography } from "antd";
import { useParams } from "next/navigation";
import { ListCourse } from "./_components/list-course";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { DataFetchErrorResult } from "@/components/errorResult";

export default function GradeEntryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {token:{colorBorderSecondary}} = theme.useToken()
  const { juryId } = useParams();

  const {
    data: jury,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["jury", juryId],
    queryFn: ({ queryKey }) => getJury(Number(queryKey[1])),
    enabled: !!juryId,
  });

  const {
    data: periods,
    isPending: isPendingPeriods,
    isError: isErrorPeriods,
  } = useQuery({
    queryKey: ["periods", `${jury?.academic_year.id}`],
    queryFn: ({ queryKey }) => getPeriodsByYear(Number(queryKey[1])),
    enabled: !!jury?.id,
  });

  const getPeriodsAsCollapseItems = () => {
    const items = periods?.map((period) => ({
      key: `${period.id}`,
      label: `${period.acronym} (${period.name})`,
      children: <ListCourse period={period} />,
      styles: {
        header: {
          background: "#fff",
          textTransform: "uppercase",
          fontWeight: "bold",
        },
        body: { background: "#fff" },
      },
    }));
    return items as CollapseProps["items"];
  };

  return (
    <Splitter style={{ height: `calc(100vh - 110px)` }}>
      <Splitter.Panel defaultSize="20%" min="20%" max="25%">
        <Flex style={{  height:64, borderBottom:`1px solid ${colorBorderSecondary}` }}>
          <Typography.Title
            type="secondary"
            level={5}
            style={{ marginBottom: 0 }}
          >
            Cours & Périodes
          </Typography.Title>
        </Flex>
        <div></div>
        {isPendingPeriods && (
          <div className="p-4">
            <DataFetchPendingSkeleton />
          </div>
        )}
        {isErrorPeriods && (
          <div className="p-4">
            <DataFetchErrorResult />
          </div>
        )}
        {periods && (
          <Collapse
            accordion
            items={getPeriodsAsCollapseItems()}
            bordered={false}
            style={{ borderRadius: 0 }}
          />
        )}
      </Splitter.Panel>
      <Splitter.Panel>{children}</Splitter.Panel>
    </Splitter>
  );
}
