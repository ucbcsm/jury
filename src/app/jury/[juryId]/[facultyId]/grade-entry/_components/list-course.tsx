"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { getDepartmentsByFacultyId, getTaughtCoursesByFacultyPediodAndDepartement } from "@/lib/api";
import { Period, TaughtCourse } from "@/types";
import { BookOutlined, SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Alert, Flex, Input, List, Tag, theme } from "antd";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";

type ListCourseProps = {
  period: Period;
};

export const ListCourse: FC<ListCourseProps> = ({ period }) => {
    
    const {
      token: { colorBgTextHover },
    } = theme.useToken();

    const { juryId, facultyId, courseId } = useParams();
    const router = useRouter();
    const [departmentId, setDepartmentId] = useState<string | number>("all");
    const [searchResult, setSearchResult] = useState<
      TaughtCourse[] | undefined
    >();

  const { data: departments } = useQuery({
    queryKey: ["departments", facultyId],
    queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  const {
    data: courses,
    isPending: isPendingCourses,
    isError:isErrorCourses,
  } = useQuery({
    queryKey: [
      "taughtCourses",
      `${period.academic_year.id}`,
      facultyId,
      `${period.id}`,
      `${departmentId}`,
    ],
    queryFn: () =>
      getTaughtCoursesByFacultyPediodAndDepartement({
        yearId: Number(period.academic_year.id),
        facultyId: Number(facultyId),
        periodId:period.id,
        departmentId: departmentId !== "all" ? Number(departmentId) : undefined,
      }),
    enabled: !!period.academic_year.id && !!facultyId,
  });

  const handleSearch = (searchString: string) => {
    if (searchString.length > 0) {
      setDepartmentId("all");
      searchString.toLowerCase();
      const newSearchResult = courses?.filter(
        (course) =>
          course.available_course.code.toLowerCase().includes(searchString) ||
          course.available_course.name.toLowerCase().includes(searchString)
      );
      setSearchResult(newSearchResult);
    } else {
      setSearchResult(undefined);
    }
  };

  if (isPendingCourses) {
    return <DataFetchPendingSkeleton />;
  }

  if (isErrorCourses) {
    return <DataFetchErrorResult />;
  }

  return (
    <div>
      <Input
        style={{ borderRadius: 20 }}
        variant="filled"
        placeholder="Rechercher ..."
        prefix={<SearchOutlined />}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        allowClear
      />
      <Flex gap={4} wrap align="center" style={{ paddingTop: 16 }}>
        <Tag.CheckableTag
          key="all"
          checked={departmentId === "all"}
          onChange={(checked) => setDepartmentId("all")}
          style={{ borderRadius: 12 }}
        >
          Tous
        </Tag.CheckableTag>
        {departments?.map((department) => (
          <Tag.CheckableTag
            key={department.id}
            checked={departmentId === department.id}
            onChange={(checked) => setDepartmentId(department.id)}
            style={{ borderRadius: 12, textTransform: "uppercase" }}
          >
            {department.acronym}
          </Tag.CheckableTag>
        ))}
      </Flex>
      <div className="pt-4">
        {searchResult && searchResult.length > 0 && (
          <Alert
            message={`${searchResult.length} resultat (s) de recherche`}
            type="info"
            banner
          />
        )}
        <List
          size="small"
          dataSource={
            searchResult && searchResult.length > 0 ? searchResult : courses
          }
          renderItem={(item) => (
            <Link
              href={`/jury/${juryId}/${facultyId}/grade-entry/${item.id}`}
              key={item.id}
            >
              <List.Item
                className=" hover:cursor-pointer hover:bg-gray-50"
                style={{
                  background:
                    item.id === Number(courseId) ? colorBgTextHover : "",
                }}
                // onClick={() => {
                //   router.push(
                //     `/jury/${juryId}/${facultyId}/grade-entry/${item.id}`
                //   );
                // }}
              >
                <List.Item.Meta
                  avatar={<BookOutlined />}
                  title={item.available_course.name}
                />
              </List.Item>
            </Link>
          )}
        />
      </div>
    </div>
  );
};
