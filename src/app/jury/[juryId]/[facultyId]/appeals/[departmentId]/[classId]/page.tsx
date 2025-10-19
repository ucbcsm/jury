"use client";

import { Flex, Input, Select, Splitter, Tag, Typography } from "antd";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
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
import { ListAppeals } from "./_components/list-appeals";
import { AppealDetails } from "./_components/appeal-details";

const appealsStatus = [
  "submitted",
  "in_progress",
  "processed",
  "rejected",
  "archived",
];

export default function Page() {

  const [appealId, setAppealId] = useQueryState("view", parseAsInteger);
  const [status, setStatus] = useQueryState(
    "status",
    parseAsString.withDefault("all")
  );

  return (
    <Splitter style={{ height: `calc(100vh - 110px)` }}>
      <Splitter.Panel defaultSize={320} min={320} max={360}>
        <Flex
          style={{
            paddingLeft: 16,
            height: 64,
          }}
          align="center"
        >
          <Typography.Title level={3} style={{ marginBottom: 0 }} ellipsis={{}}>
            Recours
          </Typography.Title>
        </Flex>

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
              // handleSearch(e.target.value);
            }}
            allowClear
          />
        </div>
        <ListAppeals
          appealId={appealId}
          setAppealId={setAppealId}
          status={status}
        />
      </Splitter.Panel>
      <Splitter.Panel>
        <AppealDetails appealId={appealId} setAppealId={setAppealId} />
      </Splitter.Panel>
    </Splitter>
  );
}
