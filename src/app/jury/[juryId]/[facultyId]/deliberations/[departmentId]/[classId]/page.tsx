"use client";

import {
  getClassById,
  getDepartment,
  getJury,
  getPeriodsByYear,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Card, Form, Skeleton, theme, Typography } from "antd";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";

import { ListAnnouncements } from "./_components/list-annoucements";
import { useYid } from "@/hooks/use-yid";

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const {yid}=useYid()
  const { juryId, departmentId, classId } = useParams();

  const [period, setPeriod] = useQueryState("period");

  const {
    data: department,
    isPending: isPendingDepartment,
    isError: isErrorDepartment,
  } = useQuery({
    queryKey: ["department", departmentId],
    queryFn: ({ queryKey }) => getDepartment(Number(queryKey[1])),
    enabled: !!departmentId,
  });

  const {
    data: classe,
    isPending: isPendingClass,
    isError: isErrorClass,
  } = useQuery({
    queryKey: ["class", classId],
    queryFn: ({ queryKey }) => getClassById(Number(queryKey[1])),
    enabled: !!classId,
  });

  const {
    data: periods,
    isPending: isPendingPeriods,
    isError: isErrorPeriods,
  } = useQuery({
    queryKey: ["periods", yid],
    queryFn: ({ queryKey }) => getPeriodsByYear(Number(queryKey[1])),
    enabled: !!yid,
  });

  const {
    data: jury,
    isPending: isPendingJury,
    isError,
  } = useQuery({
    queryKey: ["jury", juryId],
    queryFn: ({ queryKey }) => getJury(Number(queryKey[1])),
    enabled: !!juryId,
  });

  return (
    <Card
      variant="borderless"
      style={{ boxShadow: "none", borderRadius: 0 }}
      styles={{ body: { padding: 0 } }}
      title={
        !isPendingDepartment && !isPendingClass && !isPendingJury ? (
          <Typography.Title
            level={3}
            style={{ marginBottom: 0, textTransform: "uppercase" }}
            ellipsis={{}}
          >
            {classe?.acronym} {department?.name}
          </Typography.Title>
        ) : (
          <Form>
            <Skeleton.Input active />
          </Form>
        )
      }
      activeTabKey={period || undefined}
      onTabChange={(key) => {
        setPeriod(key);
      }}
    >
      <ListAnnouncements
        yearId={jury?.academic_year.id}
        department={department}
        classYear={classe}
        periods={periods}
      />
    </Card>
  );
}
