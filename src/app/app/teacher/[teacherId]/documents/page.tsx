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
                                Documents du dossier
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
                        key: "1",
                        name: "Diplôme de doctorat",
                        type: "PDF",
                        createdAt: "2023-01-15",
                        status: "Validé",
                    },
                    {
                        key: "2",
                        name: "Certificat de travail",
                        type: "PDF",
                        createdAt: "2023-02-10",
                        status: "En attente",
                    },
                    {
                        key: "3",
                        name: "Contrat de prestation",
                        type: "Word",
                        createdAt: "2023-03-05",
                        status: "Rejeté",
                    },
                ]}
                columns={[
                    {
                        title: "Nom du document",
                        dataIndex: "name",
                        key: "name",
                    },
                    {
                        title: "Type",
                        dataIndex: "type",
                        key: "type",
                        render:()=> <Checkbox  defaultChecked={true}/>,
                    },
                    {
                        title: "Date de création",
                        dataIndex: "createdAt",
                        key: "createdAt",
                    },
                    {
                        title: "Actions",
                        key: "actions",
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
                        width: 50,
                    },
                    {
                        key: "status",
                        dataIndex: "status",
                        title: "Statut du fichier",
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
                rowKey="id"
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
