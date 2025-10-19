"use client";

import { Flex, Splitter, Typography } from "antd";
import { parseAsInteger, useQueryState } from "nuqs";
import { ListAppeals } from "./_components/list-appeals";
import { AppealDetails } from "./_components/appeal-details";



export default function Page() {

  const [appealId, setAppealId] = useQueryState("view", parseAsInteger);
  

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

        <ListAppeals appealId={appealId} setAppealId={setAppealId} />
      </Splitter.Panel>
      <Splitter.Panel>
        <AppealDetails appealId={appealId} setAppealId={setAppealId} />
      </Splitter.Panel>
    </Splitter>
  );
}
