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
import { useRouter } from "next/navigation";

export default function Page() {
    const router=useRouter()
    return (
        <Table
            title={() => (
                <header className="flex pb-3">
                    <Space>
                        <Input.Search placeholder="Rechercher une promotion ..." />
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
                    name: "L1",
                    department: "Informatique",
                    students: 120,
                    year: "2023-2024",
                    type: "Licence",
                },
                {
                    key: "2",
                    name: "M1",
                    department: "Informatique",
                    students: 80,
                    year: "2023-2024",
                    type: "Master",
                },
                {
                    key: "3",
                    name: "L2",
                    department: "Mathématiques",
                    students: 100,
                    year: "2023-2024",
                    type: "Licence",
                },
                {
                    key: "4",
                    name: "D1",
                    department: "Informatique",
                    students: 15,
                    year: "2023-2024",
                    type: "Doctorat",
                },
            ]}
            columns={[
                {
                    title: "Promotion",
                    dataIndex: "name",
                    key: "name",
                },
                {
                    title: "Etudiants",
                    dataIndex: "students",
                    key: "students",
                   
                },
                {
                    title: "Année",
                    dataIndex: "year",
                    key: "year",
                },
                {
                    title: "Cycle",
                    dataIndex: "type",
                    key: "type",
                    render: (type) => {
                        let color = type === "Licence" ? "blue" : type === "Master" ? "green" : "purple";
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
                            <Button style={{ boxShadow: "none" }} onClick={()=>{router.push(`/app/class/1`)}}>Voir détails</Button>
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
