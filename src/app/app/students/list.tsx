"use client";

import {
  getPendingApplications,
  getRejectedApplications,
  getValidatedApplications,
  getYearEnrollments,
} from "@/lib/api";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Input,
  List,
  Space,
  Tag,
  theme,
  Typography,
} from "antd";
import { FC } from "react";
import { useYid } from "@/hooks/use-yid";
import { useParams, useRouter } from "next/navigation";
import { Enrollment } from "@/types";
import { getHSLColor } from "@/lib/utils";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { DataFetchErrorResult } from "@/components/errorResult";

type ListItemProps = {
  item: Enrollment;
};

export const ListItem: FC<ListItemProps> = ({ item }) => {
  const {
    token: { colorBgTextHover },
  } = theme.useToken();
  const router = useRouter();
  const { studentId } = useParams();

  const goToStudentDetails = () => {
    router.push(`/app/students/${item.id}`);
  };
  return (
    <List.Item
      style={{
        background: Number(studentId) === item.id ? colorBgTextHover : "",
        cursor: "pointer",
        paddingLeft: 12,
        paddingRight: 12,
        // borderRadius:Number(studentId) === item.id ? 8 : ""
      }}
      onClick={goToStudentDetails}
    >
      <List.Item.Meta
        avatar={
          <Avatar
            src={item.user?.avatar}
            style={{
              backgroundColor: getHSLColor(
                `${item.user.first_name} ${item.user.last_name} ${item.user.surname}`
              ),
            }}
          >
            {item.user.first_name?.charAt(0).toUpperCase()}
            {item.user.last_name?.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={
          <Typography.Text>
            {item.user.first_name} {item.user.last_name} {item.user.surname} [
            {item.user.matricule}]
          </Typography.Text>
        }
        description={
          <Flex justify="space-between">
            <span>
              {item.class_year?.acronym || ""} {item.departement.name}
            </span>
            <Tag
              bordered={false}
              color={item.status === "enabled" ? "success" : "red"}
              className=" rounded-full"
              style={{ marginRight: 0 }}
            >
              {item.status === "enabled" ? "Actif" : "Abandon"}
            </Tag>
          </Flex>
        }
      />
    </List.Item>
  );
};

export const ListStudents: FC = () => {
  const { yid } = useYid();
  const {
    data: students,
    isPending: isPendingStudents,
    isError: isErrorStudents,
  } = useQuery({
    queryKey: ["year_enrollments", `${yid}`],
    queryFn: ({ queryKey }) => getYearEnrollments(Number(queryKey[1])),
    enabled: !!yid,
  });

  if(isPendingStudents){
    return <DataFetchPendingSkeleton/>
  }

  if(isErrorStudents){
    return <DataFetchErrorResult/>
  }

  return (
    <div>
      <List
        dataSource={students}
        renderItem={(item) => <ListItem key={item.id} item={item} />}
      />
    </div>
  );
};
