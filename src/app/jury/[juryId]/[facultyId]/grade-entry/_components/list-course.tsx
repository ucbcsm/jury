"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { getTaughtCoursesByFacultyId } from "@/lib/api";
import { Period } from "@/types";
import { BookOutlined, SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Flex, Input, List, Tag, theme } from "antd";
import { useParams, useRouter } from "next/navigation";
import { FC } from "react";

type ListCourseProps = {
  period: Period;
};

export const ListCourse: FC<ListCourseProps> = ({ period }) => {
    
    const {
      token: { colorBgTextHover },
    } = theme.useToken();

    const { juryId, facultyId, courseId } = useParams();
    const router = useRouter();

  const {
    data: taughtCourses,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["taught_courses", `${period.academic_year.id}`, facultyId],
    queryFn: ({ queryKey }) =>
      getTaughtCoursesByFacultyId(Number(queryKey[1]), Number(queryKey[2])),
    enabled: !!period.academic_year.id && !!facultyId,
  });

  if (isPending) {
    return <DataFetchPendingSkeleton />;
  }

  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <div>
      <Input
        style={{ borderRadius: 20 }}
        variant="filled"
        placeholder="Rechercher ..."
        prefix={<SearchOutlined />}
      />
      <Flex gap={4} wrap align="center" style={{ paddingTop: 16 }}>
        <Tag.CheckableTag
          key="all"
          checked={true}
          // onChange={(checked) => setSelectedTag("new")}
          style={{ borderRadius: 12 }}
        >
          Tous
        </Tag.CheckableTag>
        <Tag.CheckableTag
          key="gi"
          checked={false}
          // onChange={(checked) => setSelectedTag("new")}
          style={{ borderRadius: 12 }}
        >
          GI
        </Tag.CheckableTag>

        <Tag.CheckableTag
          key="em"
          checked={false}
          // onChange={(checked) => setSelectedTag("old")}
          style={{ borderRadius: 12 }}
        >
          EM
        </Tag.CheckableTag>
      </Flex>
      <div className="pt-4">
        <List
          size="small"
          dataSource={taughtCourses}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              className=" hover:cursor-pointer hover:bg-gray-50"
              style={{ background: item.id === Number(courseId) ? colorBgTextHover : "",}}
              onClick={() => {
                router.push(
                  `/jury/${juryId}/${facultyId}/grade-entry/${item.id}`
                );
              }}
            >
              <List.Item.Meta
                avatar={<BookOutlined />}
                title={item.available_course.name}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};
