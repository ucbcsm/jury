"use client";

import {
  getDepartmentsByFacultyId,
} from "@/lib/api";
import {
    EyeOutlined,
  SubnodeOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
    Badge,
  Collapse,
  type CollapseProps,
  Flex,
  Skeleton,
  Splitter,
  theme,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import { useClasses } from "@/hooks/useClasses";
import { TreeClassesAppeals } from "./_components/treeClasses";

export default function DeliberationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBorder },
  } = theme.useToken();
  const { juryId, facultyId, departmentId } = useParams();

  const { data: departments, isPending: isPendingDepartment } = useQuery({
    queryKey: ["departments", facultyId],
    queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  const {
    data: classes,
    isPending: isPendingClasses,
    isError: isErrorClasses,
  } = useClasses();

  const getDepartmentsAsCollapseItems = () => {
    const items = departments?.map((dep) => ({
      key: `/faculty/${dep.faculty.id}/department/${dep.id}`,
      label: dep.name,
      icon: <SubnodeOutlined />,
      children: (
        <div className="pl-8">
          <TreeClassesAppeals classes={classes} department={dep} />
        </div>
      ),
      extra: dep.id.toString() === departmentId ? <EyeOutlined /> : undefined,
      styles: {
        header: {
          background: "#fff",
          fontWeight: 700,
        },
        body: { background: "#fff" },
      },
    }));
    return items as CollapseProps["items"];
  };

  return (
    <Splitter style={{ height: `calc(100vh - 110px)` }}>
      <Splitter.Panel defaultSize={320} min={320} max="25%">
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
          >
            Promotions
          </Typography.Title>
        </Flex>
        {isPendingDepartment && (
          <div className="p-4">
            <Skeleton active />
          </div>
        )}
        {departments && (
          <Collapse
            accordion
            items={getDepartmentsAsCollapseItems()}
            bordered={false}
            style={{ borderRadius: 0 }}
          />
        )}
      </Splitter.Panel>
      <Splitter.Panel>{children}</Splitter.Panel>
    </Splitter>
  );
}
