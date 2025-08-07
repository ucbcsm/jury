"use client";

import { getClasses, getDepartmentsByFacultyId, getJury, getPeriodsByYear } from "@/lib/api";
import { SearchOutlined, SubnodeOutlined, TagOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Collapse,
  type CollapseProps,
  Flex,
  Input,
  List,
  Splitter,
  Tag,
  theme,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import { ListClasses } from "./_components/list-classes";

export default function DeliberationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {token:{colorBorder}}=theme.useToken()
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
        isPending:isPendingClasses,
        isError:isErrorClasses,
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
            <ListClasses classes={classes} department={dep}/>
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
        <Flex  style={{
            paddingLeft: 16,
            height: 64,
            borderBottom: `1px solid ${colorBorder}`,
          }}
          align="center">
          <Typography.Title level={3} style={{ marginBottom: 0, textTransform:"uppercase" }}>
            Promotions
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
