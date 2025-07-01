"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { getDepartmentsByFacultyId } from "@/lib/api";
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
import { Button, Dropdown, Input, Space, Table} from "antd";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
    const router =useRouter()
    const {facultyId}=useParams()

    const { data, isPending, isError } = useQuery({
    queryKey: ["departments", facultyId],
    queryFn: ({ queryKey }) =>
      getDepartmentsByFacultyId(Number(queryKey[1])),
    enabled: !!facultyId,
  });

   if (isPending) {
     return <DataFetchPendingSkeleton variant="table" />;
   }

   if (isError) {
     return <DataFetchErrorResult />;
   }

    return (
        <Table
            title={() => (
                <header className="flex pb-3">
                    <Space>
                        <Input.Search placeholder="Rechercher un département ..." />
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
            dataSource={data}
            columns={[
                {
                    title: "Nom du département",
                    dataIndex: "name",
                    key: "name",
                },
                // {
                //     title: "Programmes",
                //     dataIndex: "programs",
                //     key: "programs",
                // },
                // {
                //     title: "Etudiants",
                //     dataIndex: "students",
                //     key: "students",
                //     align: "end",
                // },
                {
                    title: "Actions",
                    key: "actions",
                    render: (_, record) => (
                        <Space>
                            <Button style={{ boxShadow: "none" }} onClick={()=>{router.push(`/app/department/1`)}}>Gérer</Button>
                            <Dropdown
                                menu={{
                                    items: [
                                        // { key: "1", label: "Modifier", icon: <EditOutlined /> },
                                        // {
                                        //     key: "2",
                                        //     label: "Supprimer",
                                        //     danger: true,
                                        //     icon: <DeleteOutlined />,
                                        // },
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
