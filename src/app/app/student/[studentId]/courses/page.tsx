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
                        <Input.Search placeholder="Rechercher un cours prévu ..." />
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
                                        title: "Exporter en PDF",
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
                    teacher: "Prof. Kabasele Mwamba",
                    credits: 3,
                    hours: 30,
                    room: "Salle A1",
                    type: "Obligatoire",
                },
                {
                    key: "2",
                    code: "PHYS201",
                    title: "Physique Appliquée",
                    teacher: "Prof. Mbuyi Tshibanda",
                    credits: 4,
                    hours: 40,
                    room: "Salle B2",
                    type: "Électif",
                },
                {
                    key: "3",
                    code: "HIST301",
                    title: "Histoire Moderne",
                    teacher: "Prof. Nzinga Lunda",
                    credits: 2,
                    hours: 20,
                    room: "Salle C3",
                    type: "Obligatoire",
                },
                {
                    key: "4",
                    code: "LITT401",
                    title: "Littérature Africaine",
                    teacher: "Prof. Ilunga Kalala",
                    credits: 3,
                    hours: 30,
                    room: "Salle D4",
                    type: "Électif",
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
                    title: "Type",
                    dataIndex: "type",
                    key: "type",
                    render: (type) => {
                        let color = type === "Obligatoire" ? "blue" : "green";
                        return (
                            <Tag color={color} bordered={false} style={{ borderRadius: 10 }}>
                                {type}
                            </Tag>
                        );
                    },
                },
                {
                    title: "Actions",
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
            rowKey="key"
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
