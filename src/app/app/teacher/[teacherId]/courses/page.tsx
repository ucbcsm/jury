"use client";

import {
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    MoreOutlined,
    PrinterOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Input, Space, Table, Tag } from "antd";

export default function Page() {
    return (
        <Table
            title={() => (
                <header className="flex pb-3">
                    <Space>
                        <Input.Search placeholder="Rechercher un cours ..." />
                    </Space>
                    <div className="flex-1" />
                    <Space>
                        <Button icon={<PrinterOutlined />} style={{ boxShadow: "none" }}>
                            Imprimer
                        </Button>
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: "pdf",
                                        label: "PDF",
                                        icon: <FilePdfOutlined />,
                                        title: "Exporter en pdf",
                                    },
                                    {
                                        key: "excel",
                                        label: "EXCEL",
                                        icon: <FileExcelOutlined />,
                                        title: "Exporter vers Excel",
                                    },
                                ],
                            }}
                        >
                            <Button icon={<DownOutlined />} style={{ boxShadow: "none" }}>
                                Exporter
                            </Button>
                        </Dropdown>
                    </Space>
                    </header>
                )}
                dataSource={[
                    {
                        key: "1",
                        code: "MATH101",
                        title: "Mathématiques Générales",
                        promotion: "L1 Génie informatique",
                        credits: 3,
                        hours: 30,
                        room: "Salle A1",
                        status: "En attente",
                        students: 25,
                        period: "Semester 1",
                    },
                    {
                        key: "2",
                        code: "PHYS201",
                        title: "Physique Appliquée",
                        promotion: "L1 Génie informatique",
                        credits: 4,
                        hours: 40,
                        room: "Salle B2",
                        status: "En cours",
                        students: 30,
                        period: "Semester 2",
                    },
                    {
                        key: "3",
                        code: "HIST301",
                        title: "Histoire Moderne",
                        promotion: "L1 Génie informatique",
                        credits: 2,
                        hours: 20,
                        room: "Salle C3",
                        status: "Terminé",
                        students: 20,
                        period: "Semester 1",
                    },
                    {
                        key: "4",
                        code: "LITT401",
                        title: "Littérature Africaine",
                        promotion: "L1 Génie informatique",
                        credits: 3,
                        hours: 30,
                        room: "Salle D4",
                        status: "En attente",
                        students: 15,
                        period: "Semester 2",
                    },
                ]}
                columns={[
                    {
                        title: "Code",
                        dataIndex: "code",
                        key: "code",
                    },
                    {
                        title: "Titre du cours",
                        dataIndex: "title",
                        key: "title",
                    },
                    {
                        title: "Promotion",
                        dataIndex: "promotion",
                        key: "promotion",
                    },
                    {
                        title: "Crédits",
                        dataIndex: "credits",
                        key: "credits",
                        align: "center",
                    },
                    {
                        title: "Heures",
                        dataIndex: "hours",
                        key: "hours",
                        align: "center",
                    },
                    {
                        title: "Salle",
                        dataIndex: "room",
                        key: "room",
                    },
                    {
                        title: "Statut",
                        dataIndex: "status",
                        key: "status",
                        render: (status) => {
                        let color = "";
                        switch (status) {
                            case "En attente":
                                color = "orange";
                                break;
                            case "En cours":
                                color = "blue";
                                break;
                            case "Terminé":
                                color = "green";
                                break;
                            default:
                                color = "default";
                        }
                        return (
                            <Tag color={color} bordered={false} style={{ borderRadius: 10 }}>
                                {status}
                            </Tag>
                        );
                    },
                },
                {
                    title: "Etudiants",
                    dataIndex: "students",
                    key: "students",
                    align: "center",
                },
                {
                    title: "Période",
                    dataIndex: "period",
                    key: "period",
                },
                {
                    title: "",
                    key: "actions",
                    render: (_, record) => (
                        <Space>
                            <Button style={{ boxShadow: "none" }}>Détails</Button>
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
                                <Button icon={<MoreOutlined />} type="text" />
                            </Dropdown>
                        </Space>
                    ),
                    width: 50,
                },
            ]}
            rowKey="id"
            rowClassName={`bg-[#f5f5f5] odd:bg-white`}
            rowSelection={{
                type: "checkbox",
            }}
            size="small"
            pagination={{
                defaultPageSize: 25,
                pageSizeOptions: [25, 50, 75, 100],
                size: "small",
            }}
        />
    );
}

