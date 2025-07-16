"use client";

import { BookOutlined, ReadOutlined } from "@ant-design/icons";
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
            title="Aucun cours sélectionné"
            subTitle="Veuillez sélectionner un cours dans la liste pour saisir les notes."
            icon={<BookOutlined style={{ color: "GrayText" }} />}
          />
        </div>
      </Layout.Content>
    </Layout>
  );
}
