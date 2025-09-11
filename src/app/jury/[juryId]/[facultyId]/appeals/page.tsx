"use client";

import { Flex, Input, Select, Splitter, Tag, Typography } from "antd";
import { ListAppeals } from "./_components/list-appeals";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { AppealDetails } from "./_components/appeal-details";
import { SearchOutlined } from "@ant-design/icons";
import { getAppealStatusText } from "@/lib/api";

const appealsStatus = [
  "submitted",
  "in_progress",
  "processes",
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
          <Input
            style={{ borderRadius: 20 }}
            variant="filled"
            placeholder="Rechercher ..."
            prefix={<SearchOutlined />}
            onChange={(e) => {
              // handleSearch(e.target.value);
            }}
            allowClear
          />
          <Select />
          <Flex gap={4} wrap align="center" style={{ paddingTop: 16 }}>
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
        </div>
        <ListAppeals setAppealId={setAppealId} />
      </Splitter.Panel>
      <Splitter.Panel>
        <AppealDetails appealId={appealId} setAppealId={setAppealId} />
      </Splitter.Panel>
    </Splitter>
  );
}
