"use client";

import { MailOutlined } from "@ant-design/icons";
import { Layout, Result } from "antd";

export const NoSelectedAppeal=()=> {
  return (
    <Layout>
      <Layout.Content
        style={{
          height: `calc(100vh - 110px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Result
          status="info"
          title="Aucun recours sélectionné"
          subTitle="Veuillez sélectionner un recours dans la liste pour consulter ses détails."
          icon={<MailOutlined style={{ color: "GrayText" }} />}
        />
      </Layout.Content>
    </Layout>
  );
};
