"use client";

import {
    DeleteOutlined,
    EditOutlined,
    MoreOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Space, Table, Tag, Typography } from "antd";

export default function Page() {
     {/* Health Records Table */}
    return (
            <Table
                title={() => (
                    <header className="flex pb-3">
                        <Space>
                            <Typography.Title level={5} style={{ marginBottom: 0 }}>
                                Informations de santé
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
                        recordType: "Vaccination",
                        description: "Vaccin contre la grippe",
                        date: "2023-01-15",
                        status: "À jour",
                    },
                    {
                        key: "2",
                        recordType: "Allergie",
                        description: "Allergie aux arachides",
                        date: "2022-05-10",
                        status: "Critique",
                    },
                    {
                        key: "3",
                        recordType: "Visite médicale",
                        description: "Examen annuel",
                        date: "2023-03-20",
                        status: "Complété",
                    },
                ]}
                columns={[
                    {
                        title: "Type d'enregistrement",
                        dataIndex: "recordType",
                        key: "recordType",
                    },
                    {
                        title: "Description",
                        dataIndex: "description",
                        key: "description",
                    },
                    {
                        title: "Date",
                        dataIndex: "date",
                        key: "date",
                    },
                    {
                        title: "Statut",
                        key: "status",
                        dataIndex: "status",
                        render: (_, record) => {
                            let color = "";
                            switch (record.status) {
                                case "À jour":
                                    color = "green";
                                    break;
                                case "Critique":
                                    color = "red";
                                    break;
                                case "Complété":
                                    color = "blue";
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
