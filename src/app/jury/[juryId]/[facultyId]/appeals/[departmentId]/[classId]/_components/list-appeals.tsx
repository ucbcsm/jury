"use client";

import { getAppeals, getAppealStatusColor, getAppealStatusText, } from "@/lib/api/appeal";
import { useQuery } from "@tanstack/react-query";
import { Flex,  Input,  List, Skeleton, Tag, Typography } from "antd";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import { Options, parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { FC } from "react";
import { useYid } from "@/hooks/use-yid";
import { SearchOutlined } from "@ant-design/icons";

const appealsStatus = [
  "submitted",
  // "in_progress",
  "processed",
  "rejected",
  // "archived",
];

type ListAppealsProps = {
  appealId: number | null;
  setAppealId: (
    value: number | ((old: number | null) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;

};
export const ListAppeals: FC<ListAppealsProps> = ({
  appealId,
  setAppealId,
}) => {
 
  const { yid } = useYid();
  const { juryId, facultyId, departmentId, classId } = useParams();
  const [status, setStatus] = useQueryState(
    "status",
    parseAsString.withDefault("all")
  );
  const [search, setSearch] = useQueryState("search");
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(0));
    const [pageSize, setPageSize] = useQueryState(
      "size",
      parseAsInteger.withDefault(0)
    );

  const {
    data: data,
    isPending: isPendingAppeals,
    isError: isErrorAppeals,
  } = useQuery({
    queryKey: [
      "appeals",
      yid,
      juryId,
      facultyId,
      departmentId,
      classId,
      status,
      search,
      page,
      pageSize,
    ],
    queryFn: ({ queryKey }) =>
      getAppeals({
        yearId: Number(yid),
        juryId: String(queryKey[1]),
        facultyId: String(queryKey[2]),
        status: status !== "all" ? status : undefined,
        departmentId: Number(departmentId),
        classId: Number(classId),
        search: search !== null && search.trim() !== "" ? search : undefined,
        page:page!==0?page:undefined,
        pageSize:pageSize!==0?pageSize:undefined,
      }),
    enabled: !!yid && !!juryId && !!facultyId && !!departmentId && !!classId,
  });
 
  return (
    <div>
      <div className="px-4">
        <Flex gap={4} wrap align="center" style={{}}>
          <Tag.CheckableTag
            key="all"
            checked={status === "all"}
            onChange={(checked) => setStatus("all")}
            style={{ borderRadius: 12 }}
          >
            Tous
          </Tag.CheckableTag>
          {appealsStatus.map((checkedStatus) => (
            <Tag.CheckableTag
              key={checkedStatus}
              checked={checkedStatus === status}
              onChange={(checked) => setStatus(checkedStatus)}
              style={{ borderRadius: 12 }}
            >
              {getAppealStatusText(
                checkedStatus as
                  | "rejected"
                  | "submitted"
                  | "in_progress"
                  | "processed"
                  | "archived"
              )}
            </Tag.CheckableTag>
          ))}
        </Flex>

        <Input
          style={{ borderRadius: 20, marginTop: 16, marginBottom: 16 }}
          variant="filled"
          placeholder="Rechercher ..."
          prefix={<SearchOutlined />}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          allowClear
        />
      </div>
      {isPendingAppeals || isErrorAppeals ? (
        <div className="p-4">
          <Skeleton active />
        </div>
      ) : (
        <List
          size="small"
          dataSource={data?.results}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              onClick={() => setAppealId(item.id)}
              style={{
                cursor: "pointer",
                background: item.id === appealId ? "#f5f5f5" : undefined,
              }}
              className=" hover:bg-[#f5f5f5]"
            >
              <List.Item.Meta
                title={`${item.student.user.surname} ${item.student.user.last_name} ${item.student.user.first_name} (${item.student.user.matricule})`}
                description={
                  <Flex justify="space-between" gap={8}>
                    <Typography.Text type="secondary" ellipsis={{}}>
                      {dayjs(item.submission_date).format("DD/MM/YYYY HH:mm")}
                    </Typography.Text>
                    <Tag
                      color={getAppealStatusColor(item.status)}
                      bordered={false}
                      style={{ marginRight: 0 }}
                    >
                      {getAppealStatusText(item.status)}
                    </Tag>
                  </Flex>
                }
              />
            </List.Item>
          )}
          pagination={{
            defaultPageSize: 25,
            pageSizeOptions: [25, 50, 75, 100],
            size: "small",
            showSizeChanger: true,
            total: data?.count,
            current: page !== 0 ? page : 1,
            pageSize: pageSize !== 0 ? pageSize : 25,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
            style: { paddingRight: 16 },
          }}
        />
      )}
    </div>
  );
};
