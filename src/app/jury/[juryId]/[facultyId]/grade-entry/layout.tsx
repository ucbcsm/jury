"use client";

import { getJury, getPeriodsByYear } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Collapse,
  type CollapseProps,
  Flex,
  Skeleton,
  Splitter,
  theme,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { DataFetchErrorResult } from "@/components/errorResult";
import { TreeCourses } from "./_components/tree-courses";

export default function GradeEntryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBorder },
  } = theme.useToken();
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
      children: <TreeCourses period={period} />, //<ListCourse period={period} />
      styles: {
        header: {
          background: "#fff",
          fontWeight: 700
        },
        body: { background: "#fff" },
      },
    }));
    return items as CollapseProps["items"];
  };

  return (
    <Splitter style={{ height: `calc(100vh - 110px)` }}>
      <Splitter.Panel defaultSize="20%" min={320} max="25%">
        <Flex
          style={{
            paddingLeft: 16,
            height: 64,
            borderBottom: `1px solid ${colorBorder}`,
          }}
          align="center"
        >
          <Typography.Title
            level={3}
            style={{ marginBottom: 0, textTransform: "uppercase" }}
            ellipsis={{}}
          >
            Cours / Périodes
          </Typography.Title>
        </Flex>

        {isPendingPeriods && (
          <div className="p-4">
            <Skeleton active />
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
