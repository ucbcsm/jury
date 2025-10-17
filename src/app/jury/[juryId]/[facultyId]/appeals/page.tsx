"use client";

import { Flex, Input, Select, Splitter, Tag, Typography } from "antd";
import { ListAppeals } from "./_components/list-appeals";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { AppealDetails } from "./_components/appeal-details";
import { SearchOutlined } from "@ant-design/icons";
import {
  getAppealStatusText,
  getClasses,
  getClassesYearsAsOptions,
  getCurrentDepartmentsAsOptions,
  getDepartmentsByFacultyId,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const appealsStatus = [
  "submitted",
  "in_progress",
  "processed",
  "rejected",
  "archived",
];

export default function Page() {
  const {facultyId } = useParams();
  const [appealId, setAppealId] = useQueryState("view", parseAsInteger);
  const [status, setStatus] = useQueryState(
    "status",
    parseAsString.withDefault("all")
  );
  const [classId, setClassId]=useQueryState("class", parseAsInteger.withDefault(0));
  const [departmentId, setDepartmentId] = useQueryState(
    "dep",
    parseAsInteger.withDefault(0)
  );


      const {
        data: departments,
        isPending: isPendingDepartments,
        isError: isErrorDepartments,
      } = useQuery({
        queryKey: ["departments", facultyId],
        queryFn: ({ queryKey }) =>
          getDepartmentsByFacultyId(Number(queryKey[1])),
        enabled: !!facultyId,
      });

  const {
    data: classes,
    isPending: isPendingClasses,
    isError: isErrorClasses,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });
 
  return (
    <Splitter style={{ height: `calc(100vh - 110px)` }}>
      <Splitter.Panel defaultSize="20%" min={320} max="25%">
        <Flex
          style={{
            paddingLeft: 16,
            height: 64,
            // borderBottom: `1px solid ${colorBorder}`,
          }}
          align="center"
        >
          <Typography.Title level={3} style={{ marginBottom: 0 }} ellipsis={{}}>
            Recours
          </Typography.Title>
        </Flex>

        <div className="px-4">
          <Flex gap={8} align="center" style={{}}>
            <Select
              prefix={
                <Typography.Text type="secondary">Mention:</Typography.Text>
              }
              variant="filled"
              value={departmentId}
              onChange={(value) => {
                setDepartmentId(value);
              }}
              style={{ flex: 1 }}
              options={[
                { value: 0, label: "Toutes" },
                ...(getCurrentDepartmentsAsOptions(departments) || []),
              ]}
              loading={isPendingDepartments}
              disabled={isPendingDepartments || isErrorDepartments}
            />
          </Flex>
          <Flex gap={8} align="center">
            <Select
              prefix={
                <Typography.Text type="secondary">Promotion:</Typography.Text>
              }
              variant="filled"
              styles={{ root: { borderRadius: 20 } }}
              style={{
                flex: 1,
                marginTop: 16,
                marginBottom: 16,
                borderRadius: 20,
              }}
              value={classId}
              options={[
                {
                  value: 0,
                  label: "Toutes promotions",
                },
                ...(getClassesYearsAsOptions({ classes }) || []),
              ]}
              loading={isPendingClasses}
              disabled={isPendingClasses || isErrorClasses}
              onChange={(value) => {
                setClassId(value);
              }}
            />
          </Flex>
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
              // handleSearch(e.target.value);
            }}
            allowClear
          />
        </div>
        <ListAppeals
          setAppealId={setAppealId}
          departmentId={departmentId}
          classId={classId}
          status={status}
        />
      </Splitter.Panel>
      <Splitter.Panel>
        <AppealDetails appealId={appealId} setAppealId={setAppealId} />
      </Splitter.Panel>
    </Splitter>
  );
}
