"use client";

import { getClasses, getDepartmentsByFacultyId, getJury, getPeriodsByYear } from "@/lib/api";
import { SearchOutlined, SubnodeOutlined } from "@ant-design/icons";
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

export default function DeliberationsLayout({
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

    const { data: departments } = useQuery({
      queryKey: ["departments", facultyId],
      queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
      enabled: !!facultyId,
    });

    const {
        data: classes,
        // isPending,
        // isError,
      } = useQuery({
        queryKey: ["classes"],
        queryFn: getClasses,
      });
  
    const getDepartmentsAsCollapseItems = () => {
      const items = departments?.map((dep) => ({
        key: `/faculty/${dep.faculty.id}/department/${dep.id}`,
        label: dep.name,
        icon: <SubnodeOutlined />,
        children: (
          <div className="pl-8">
          <List
            bordered={false}
            dataSource={classes}
            renderItem={(item) => (
              <List.Item key={item.id}>
                {item.acronym} ({item.name})
              </List.Item>
            )}
          />
          </div>
        ),
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
          <Typography.Title level={3} type="secondary" style={{ marginBottom: 0 }}>
            Mentions & Promotions
          </Typography.Title>
        </Flex>
        <Collapse
          accordion
          items={getDepartmentsAsCollapseItems()}
          bordered={false}
          style={{ borderRadius: 0 }}

          //   ghost
        />
      </Splitter.Panel>
      <Splitter.Panel>{children}</Splitter.Panel>
    </Splitter>
  );
}
