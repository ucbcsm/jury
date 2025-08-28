"use client";

import {
  getClassById,
  getCurrentPeriodsAsOptions,
  getDepartment,
  getJury,
  getPeriodsByYear,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Form,
  Layout,
  Select,
  Skeleton,
  Space,
  Switch,
  theme,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import { parseAsInteger, parseAsStringEnum, useQueryState } from "nuqs";
import { NoSelectedPeriodToview } from "./_components/no-selected-period";
import { ListGrades } from "./_components/list-grades";
import { ListAnnouncements } from "./_components/list-annoucements";

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { juryId, departmentId, classId } = useParams();

  const [period, setPeriod] = useQueryState("period");

  const [session, setSession] = useQueryState(
    "session",
    parseAsStringEnum(["main_session", "retake_session"]).withDefault(
      "main_session"
    )
  );
  const [moment, setMoment] = useQueryState(
    "moment",
    parseAsStringEnum(["before_appeal", "after_appeal"]).withDefault(
      "before_appeal"
    )
  );

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
    queryKey: ["periods", juryId],
    queryFn: ({ queryKey }) => getPeriodsByYear(Number(queryKey[1])),
    enabled: !!juryId,
  });

  const {
    data: jury,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["jury", juryId],
    queryFn: ({ queryKey }) => getJury(Number(queryKey[1])),
    enabled: !!juryId,
  });

  // const getPeriodsAsTabs = () => {
  //   return periods?.map((period) => ({
  //     key: `${period.id}`,
  //     label: `${period.name} (${period.acronym})`,
  //   }));
  // };

  return (
    <Card
      variant="borderless"
      style={{ boxShadow: "none", borderRadius: 0 }}
      styles={{ body: { padding: 0 } }}
      title={
        !isPendingDepartment && !isPendingClass ? (
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
      // extra={
      //   <Space>
      //     <Typography.Text type="secondary">Session: </Typography.Text>
      //     <Select
      //       variant="filled"
      //       placeholder="Session"
      //       value={session}
      //       options={[
      //         { value: "main_session", label: "Principale" },
      //         { value: "retake_session", label: "Rattrapage" },
      //       ]}
      //       style={{ width: 180 }}
      //       onSelect={(value) => {
      //         setSession(value as "main_session" | "retake_session");
      //       }}
      //     />
      //     <Typography.Text type="secondary">Moment: </Typography.Text>
      //     <Select
      //       variant="filled"
      //       placeholder="Moment"
      //       value={moment}
      //       options={[
      //         { value: "before_appeal", label: "Avant recours" },
      //         { value: "after_appeal", label: "Après recours" },
      //       ]}
      //       style={{ width: 150 }}
      //       onSelect={(value) => {
      //         setMoment(value as "before_appeal" | "after_appeal");
      //       }}
      //     />
      //     <Typography.Text type="secondary">Statut: </Typography.Text>
      //     <Switch
      //       checkedChildren="Verrouillé"
      //       unCheckedChildren="Déverrouillé"
      //     />
      //   </Space>
      // }
    >
      {/* {period && period.length !== 0 ? ( */}
        <ListAnnouncements yearId={jury?.academic_year.id} department={department} classYear={classe} periods={periods}  />
      {/* ) : (
        <NoSelectedPeriodToview
          period={period}
          setPeriod={setPeriod}
          periods={periods}
        />
      )} */}
      
    </Card>
  );
}
