"use client";

import { getJury, getPeriodsByYear } from "@/lib/api";
import { SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Collapse,
  type CollapseProps,
  Flex,
  Input,
  List,
  Splitter,
  Tag,
  Typography,
} from "antd";
import { useParams } from "next/navigation";

export default function GradeEntryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { juryId, facultyId } = useParams();

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
    // isPending,
    isLoading: isLoadingPeriods,
    // isError,
  } = useQuery({
    queryKey: ["periods", `${jury?.academic_year.id}`],
    queryFn: ({ queryKey }) => getPeriodsByYear(Number(queryKey[1])),
    enabled: !!jury?.id,
  });

  const getPeriodsAsCollapseItems = () => {
    const items = periods?.map((period) => ({
      key: `${period.id}`,
      label: `${period.acronym} (${period.name})`,
      children: (
        <div>
          <Input
            style={{ borderRadius: 20 }}
            variant="filled"
            placeholder="Rechercher ..."
            prefix={<SearchOutlined />}
          />
          <Flex gap={4} wrap align="center" style={{ paddingTop: 12 }}>
            <Tag.CheckableTag
              key="new"
              checked={true}
              // onChange={(checked) => setSelectedTag("new")}
              style={{ borderRadius: 12 }}
            >
              Tous
            </Tag.CheckableTag>
            <Tag.CheckableTag
              key="new"
              checked={false}
              // onChange={(checked) => setSelectedTag("new")}
              style={{ borderRadius: 12 }}
            >
              GI
            </Tag.CheckableTag>

            <Tag.CheckableTag
              key="old"
              checked={false}
              // onChange={(checked) => setSelectedTag("old")}
              style={{ borderRadius: 12 }}
            >
              EM
            </Tag.CheckableTag>
          </Flex>
          <List />
        </div>
      ),
      //   extra: <Button type="text" icon={<MoreOutlined />} />,
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
        <Flex style={{ padding: `12px 16px 0 16px` }}>
          <Typography.Title level={3} style={{ marginBottom: 0 }}>
            Cours & Périodes
          </Typography.Title>
        </Flex>
        <Collapse
          accordion
          items={getPeriodsAsCollapseItems()}
          bordered={false}
          style={{ borderRadius: 0 }}

          //   ghost
        />
      </Splitter.Panel>
      <Splitter.Panel>{children}</Splitter.Panel>
    </Splitter>
  );
}
