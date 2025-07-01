"use client";

import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Dropdown,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";

export default function Page() {
  return (
    <div>
      {/* Documents Table */}
      <Table
        title={() => (
          <header className="flex pb-3">
            <Space>
              <Typography.Title level={5} style={{ marginBottom: 0 }}>
                Eléments du dossier
              </Typography.Title>
            </Space>
            <div className="flex-1" />
            <Space>
              <Button icon={<PlusOutlined />} style={{ boxShadow: "none" }}>
                Ajouter un document
              </Button>
            </Space>
          </header>
        )}
        dataSource={[
          {
            key: "2",
            name: "Attestation de nationalité",
            type: "PDF",
            createdAt: "2023-02-10",
            status: "En attente",
          },
          {
            key: "3",
            name: "Lettre de recommandation",
            type: "Word",
            createdAt: "2023-03-05",
            status: "Validé",
          },
        ]}
        columns={[
          {
            title: "Intitulé",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Doc physique",
            dataIndex: "Dépo",
            key: "type",
            render: () => <Checkbox />,
          },
          {
            title: "Fichier électronique",
            key: "file",
            render: (_, record) => {
              return (
                <Space>
                  <Button
                    icon={<EyeOutlined />}
                    style={{
                      boxShadow: "none",
                      display: record.status === "Validé" ? "block" : "none",
                    }}
                  />
                  {record.status === "Validé" ? (
                    <Button
                      icon={<DownloadOutlined />}
                      style={{ boxShadow: "none" }}
                    >
                      Télécharger
                    </Button>
                  ) : (
                    <Button
                      icon={<UploadOutlined />}
                      style={{ boxShadow: "none" }}
                    >
                      Téléverser
                    </Button>
                  )}
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
                    <Button
                      icon={<MoreOutlined />}
                      style={{
                        boxShadow: "none",
                        display: record.status === "Validé" ? "block" : "none",
                      }}
                    />
                  </Dropdown>
                </Space>
              );
            },
          },
          {
            key: "status",
            dataIndex: "status",
            title: "Statut de verification",
            ellipsis: true,
            render: (_, record) => {
              let color = "";
              switch (record.status) {
                case "Validé":
                  color = "green";
                  break;
                case "En attente":
                  color = "orange";
                  break;
                case "Rejeté":
                  color = "red";
                  break;
                default:
                  color = "default";
              }
              return (
                <Tag
                  color={color}
                  bordered={false}
                  style={{ borderRadius: 10 }}
                >
                  {record.status}
                </Tag>
              );
            },
          },
        ]}
        rowKey="key"
        rowClassName={`bg-[#f5f5f5] odd:bg-white`}
        rowSelection={{
          type: "checkbox",
        }}
        size="small"
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: [10, 20, 50],
          size: "small",
        }}
      />
    </div>
  );
}
