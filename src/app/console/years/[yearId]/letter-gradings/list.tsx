"use client";
import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { getLetterGradings } from "@/lib/api";
import { LetterGrading } from "@/types";
import {
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    MoreOutlined,
    PrinterOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Dropdown, Input, Space, Table, Tag, Typography } from "antd";
import { FC, useState } from "react";
import { NewLetterGradingForm } from "./forms/new";
import { DeleteLetterGradingForm } from "./forms/delete";
import { EditLetterGradingForm } from "./forms/edit";

type ActionsBarProps = {
    record: LetterGrading;
};

const ActionsBar: FC<ActionsBarProps> = ({ record }) => {
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);

    return (
        <Space size="middle">
            <EditLetterGradingForm
                letterGrading={record}
                open={openEdit}
                setOpen={setOpenEdit}
            />
            <DeleteLetterGradingForm
                letterGrading={record}
                open={openDelete}
                setOpen={setOpenDelete}
            />
            <Dropdown
                menu={{
                    items: [
                        {
                            key: "edit",
                            label: "Modifier",
                            icon: <EditOutlined />,
                        },
                        {
                            key: "delete",
                            label: "Supprimer",
                            icon: <DeleteOutlined />,
                            danger: true,
                        },
                    ],
                    onClick: ({ key }) => {
                        if (key === "edit") setOpenEdit(true);
                        else if (key === "delete") setOpenDelete(true);
                    },
                }}
            >
                <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
        </Space>
    );
};

export function LetterGradingsList() {

    const {
        data: letterGradings,
        isPending,
        isError,
    } = useQuery({
        queryKey: ["letter_gradings"],
        queryFn: getLetterGradings,
    });

    if (isPending) return <DataFetchPendingSkeleton />;
    if (isError) return <DataFetchErrorResult />;

    return (
        <Table
            title={() => (
                <header className="flex pb-3">
                    <Space>
                        <Typography.Title level={5} style={{marginBottom:0}}>Notations</Typography.Title>
                    </Space>
                    <div className="flex-1" />
                    <Space>
                        <NewLetterGradingForm />
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
            columns={[
                {
                    title: "Lettre",
                    dataIndex: "grade_letter",
                    key: "grade_letter",
                    render:(value)=><Typography.Text strong>{value}</Typography.Text>,
                    width:54,
                    align:"center"
                },
                {
                    title: "Appréciation",
                    dataIndex: "appreciation",
                    key: "appreciation",
                },
                {
                    title: "Description",
                    dataIndex: "description",
                    key: "description",
                    ellipsis: true,
                },
                {
                    title: "Seuil Min.",
                    dataIndex: "lower_bound",
                    key: "lower_bound",
                    render: (min: number) => min ?? "-",
                    align: "center",
                    width:82
                },
                {
                    title: "Seuil Max.",
                    dataIndex: "upper_bound",
                    key: "upper_bound",
                    render: (max: number) => max ?? "-",
                    align: "center",
                    width:82
                },
                {
                    dataIndex: "actions",
                    key: "actions",
                    render: (_, record) => <ActionsBar record={record} />,
                    width: 52,
                },
            ]}
            dataSource={letterGradings}
            rowKey="id"
            rowClassName={`bg-[#f5f5f5] odd:bg-white`}
            // rowSelection={{
            //     type: "checkbox",
            // }}
            size="small"
            pagination={{
                defaultPageSize: 25,
                pageSizeOptions: [25, 50, 75, 100],
                size: "small",
            }}
        />
    );
}
