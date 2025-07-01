"use client";

import { getDepartments } from "@/lib/api";
import { Department } from "@/types";
import { RightOutlined, SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Flex,
  Input,
  List,
  Space,
  Tag,
  theme,
  Typography,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function DepartmentsStatistics() {
  const {
    token: { colorTextDisabled, colorBorderSecondary },
  } = theme.useToken();
  const [filteredDepartements, setFilteredDepartments] = useState<Department[]>(
    []
  );
  const router = useRouter();
  const { data: departments, isPending } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });
  useEffect(() => {
    if (departments) {
      setFilteredDepartments(departments);
    }
  }, [departments]);

  if (isPending) {
    return;
  }

  return (
    <>
      <Flex
        justify="space-between"
        align="center"
        className="px-7 pt-3"
        style={{
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 12,
          paddingBottom: 6,
          borderBottom: `1px solid ${colorBorderSecondary}`,
        }}
      >
        <Typography.Title level={5} className="">
          Mentions (Départements)
        </Typography.Title>
        <Badge count={departments?.length} color="geekblue" />
      </Flex>
      <div className=" overflow-y-auto h-[calc(100vh-170px)] pl-5 pb-7 pr-3">
        <Input
          placeholder="Rechercher ..."
          allowClear
          onChange={(e) => {
            const textValue = e.target.value.toLowerCase();
            const newFilteredDepartments = departments?.filter(
              (department) =>
                department.acronym.toLowerCase().includes(textValue) ||
                department.name.toLowerCase().includes(textValue) ||
                department.faculty.acronym.toLowerCase().includes(textValue) ||
                department.faculty.name.toLowerCase().includes(textValue)
            );
            setFilteredDepartments(newFilteredDepartments!);
          }}
          className="my-3"
          // variant="borderless"
          prefix={<SearchOutlined style={{ color: colorTextDisabled }} />}
        />
        <List
          dataSource={filteredDepartements}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              extra={
                <Button
                  type="text"
                  icon={<RightOutlined />}
                  onClick={() => router.push(`/app/department/${item.id}`)}
                />
              }
            >
              <List.Item.Meta
                title={
                  <Link href={`/app/department/${item.id}`}>
                    {item.name} ({item.acronym})
                  </Link>
                }
                description={
                  <Space>
                    <Tag bordered={false}>Filière:</Tag>
                    <Typography.Text type="secondary" ellipsis>
                      {item.faculty.name}
                    </Typography.Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </>
  );
}
