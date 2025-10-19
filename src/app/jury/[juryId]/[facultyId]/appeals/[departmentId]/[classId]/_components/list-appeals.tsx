"use client";

import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { getAppeals, getAppealStatusColor, getAppealStatusText, } from "@/lib/api/appeal";
import { useQuery } from "@tanstack/react-query";
import { Flex,  List, Skeleton, Tag, theme, Typography } from "antd";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import { Options, parseAsString, useQueryState } from "nuqs";
import { FC } from "react";
import { useYid } from "@/hooks/use-yid";



type ListAppealsProps = {
  appealId: number | null;
  setAppealId: (
    value: number | ((old: number | null) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
  status: string;
};
export const ListAppeals: FC<ListAppealsProps> = ({
  appealId,
  setAppealId,
  status,
}) => {
  const {token:{colorBgContainer}}=theme.useToken();
  const { yid } = useYid();
  const { juryId, facultyId, departmentId, classId } = useParams();

  const {
    data: data,
    isPending: isPendingAppeals,
    isError: isErrorAppeals,
  } = useQuery({
    queryKey: ["appeals", yid, juryId, facultyId, departmentId, classId],
    queryFn: ({ queryKey }) =>
      getAppeals({
        yearId: Number(yid),
        juryId: String(queryKey[1]),
        facultyId: String(queryKey[2]),
        status: status !== "all" ? status : undefined,
        departmentId: Number(departmentId),
        classId: Number(classId),
      }),
    enabled: !!yid && !!juryId && !!facultyId && !!departmentId && !!classId,
  });
  if (isPendingAppeals)
    return (
      <div className="p-4">
        <Skeleton active />
      </div>
    );
  return (
    <div>
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
      />
    </div>
  );
};
