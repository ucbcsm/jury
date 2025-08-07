"use client";

import { TeamOutlined } from "@ant-design/icons";
import { Layout, Result } from "antd";

export default function Page() {
  return (
    <Layout>
      <Layout.Content style={{ height: `calc(100vh - 110px)` }}>
        <div
          className="flex flex-col justify-center"
          style={{ height: "100%" }}
        >
          <Result
            status="info"
            title="Aucune promotion sélectionnée"
            subTitle="Veuillez sélectionner une promotion dans la liste pour démarrer le processus de délibération et proclamation."
            icon={<TeamOutlined style={{ color: "GrayText" }} />}
          />
        </div>
      </Layout.Content>
    </Layout>
  );
}
