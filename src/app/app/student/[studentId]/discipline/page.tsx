"use client";

import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Space, Table, Tag, Typography } from "antd";

export default function Page() {
  return (
    <Table
      title={() => (
        <header className="flex pb-3">
          <Space>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              Sanctions disciplinaires
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Button icon={<PlusOutlined />} style={{ boxShadow: "none" }}>
              Ajouter
            </Button>
          </Space>
          </header>
        )}
        dataSource={[
          {
            key: "1",
            type: "Avertissement",
            reason: "Retard répété en classe",
            academicYear: "2022-2023",
            startDate: "2023-02-10",
            status: "Actif",
          },
          {
            key: "2",
            type: "Exclusion temporaire",
            reason: "Comportement inapproprié",
            academicYear: "2022-2023",
            startDate: "2023-01-20",
            status: "Terminé",
          },
          {
            key: "3",
            type: "Blâme",
            reason: "Non-respect du règlement intérieur",
            academicYear: "2022-2023",
            startDate: "2023-03-15",
            status: "Actif",
          },
          {
            key: "4",
            type: "Avertissement verbal",
            reason: "Interruption fréquente en classe",
            academicYear: "2022-2023",
            startDate: "2023-04-05",
            status: "Actif",
          },
          {
            key: "5",
            type: "Exclusion définitive",
            reason: "Violence envers un camarade",
            academicYear: "2022-2023",
            startDate: "2023-05-12",
            status: "Terminé",
          },
          {
            key: "6",
            type: "Travaux d'intérêt général",
            reason: "Dégradation du matériel scolaire",
            academicYear: "2022-2023",
            startDate: "2023-06-18",
            status: "Actif",
          },
          {
            key: "7",
            type: "Mise à pied",
            reason: "Absence injustifiée prolongée",
            academicYear: "2022-2023",
            startDate: "2023-07-22",
            status: "Actif",
          },
          {
            key: "8",
            type: "Avertissement écrit",
            reason: "Utilisation du téléphone en classe",
            academicYear: "2022-2023",
            startDate: "2023-08-10",
            status: "Terminé",
          },
        ]}
        columns={[
          {
            title: "Type de sanction",
            dataIndex: "type",
            key: "type",
          },
          {
            title: "Motif",
            dataIndex: "reason",
            key: "reason",
          },
          {
            title: "Année académique",
            dataIndex: "academicYear",
            key: "academicYear",
          },
          {
            title: "Date de début",
            dataIndex: "startDate",
            key: "startDate",
          },
          {
            title: "Statut",
            key: "status",
            dataIndex: "status",
            render: (_, record) => {
            let color = "";
            switch (record.status) {
              case "Actif":
                color = "red";
                break;
              case "Terminé":
                color = "green";
                break;
              default:
                color = "default";
            }
            return (
              <Tag color={color} bordered={false} style={{ borderRadius: 10 }}>
                {record.status}
              </Tag>
            );
          },
        },
        {
          title: "Actions",
          key: "actions",
          render: (_, record) => (
            <Space>
              <Dropdown
                menu={{
                  items: [
                    { key: "1", label: "Modifier", icon: <EditOutlined /> },
                    {
                      key: "2",
                      label: "Supprimer",
                      danger: true,
                      icon: <DeleteOutlined />,
                    },
                  ],
                }}
              >
                <Button icon={<MoreOutlined />} style={{ boxShadow: "none" }} />
              </Dropdown>
            </Space>
          ),
        },
      ]}
      rowKey="key"
      rowClassName={`bg-[#f5f5f5] odd:bg-white`}
      size="small"
      pagination={{
        defaultPageSize: 10,
        pageSizeOptions: [10, 20, 50],
        size: "small",
      }}
    />
  );
}
