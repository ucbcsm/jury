"use client";

import { UserOutlined } from "@ant-design/icons";
import { Result } from "antd";

export default function Page() {
  return (
    <div
      className="flex flex-col justify-center"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <Result
        status="info"
        title="Aucun étudiant sélectionné"
        subTitle="Veuillez sélectionner un étudiant dans la liste pour afficher les détails."
        icon={<UserOutlined style={{ color: "GrayText" }} />}
      />
    </div>
  );
}
