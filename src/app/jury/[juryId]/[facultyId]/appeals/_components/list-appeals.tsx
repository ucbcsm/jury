"use client";

import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { getAppeals, } from "@/lib/api/appeal";
import { useQuery } from "@tanstack/react-query";
import { Flex,  List, Typography } from "antd";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import { Options, parseAsString, useQueryState } from "nuqs";
import { FC } from "react";
import { useYid } from "@/hooks/use-yid";



type ListAppealsProps = {
  setAppealId: (
    value: number | ((old: number | null) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
  departmentId: number;
  classId: number;
  status: string;
};
export const ListAppeals: FC<ListAppealsProps> = ({
  setAppealId,
  departmentId,
  classId,
  status,
}) => {
  const { yid } = useYid();
  const { juryId, facultyId } = useParams();

  const {
    data: data,
    isPending: isPendingAppeals,
    isError: isErrorAppeals,
  } = useQuery({
    queryKey: ["appeals", yid, juryId, facultyId],
    queryFn: ({ queryKey }) =>
      getAppeals({
        yearId: Number(yid),
        juryId: String(queryKey[1]),
        facultyId: String(queryKey[2]),
        status: status !== "all" ? status : undefined,
        departmentId: departmentId !== 0 ? departmentId : undefined,
        classId: classId !== 0 ? classId : undefined,
      }),
    enabled: !!yid && !!juryId && !!facultyId,
  });
  if (isPendingAppeals)
    return (
      <div className="p-4">
        <DataFetchPendingSkeleton />
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
            style={{ cursor: "pointer" }}
          >
            <List.Item.Meta
              title={`${item.student.user.surname} ${item.student.user.last_name} ${item.student.user.first_name}`}
              description={
                <Flex justify="space-between" gap={8}>
                  <Typography.Text type="secondary" ellipsis={{}}>
                    {item.subject}
                  </Typography.Text>
                  <Typography.Text>
                    {dayjs(item.submission_date).format("DD/MM/YYYY HH:mm")}
                  </Typography.Text>
                </Flex>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};
