"use client";

import {
    AppstoreOutlined,
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    MoreOutlined,
    PrinterOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Input, Radio, Space, Table, Tag } from "antd";
import { useRouter } from "next/navigation";

export default function Page() {
    const router=useRouter()
    return (
      <Table
        title={() => (
          <header className="flex pb-3">
            <Space>
              <Input.Search placeholder="Rechercher un étudiant ..." />
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
              <Radio.Group>
                <Radio.Button value="grid">
                  <AppstoreOutlined />
                </Radio.Button>
                <Radio.Button value="list">
                  <UnorderedListOutlined />
                </Radio.Button>
              </Radio.Group>
            </Space>
          </header>
        )}
        dataSource={[
          {
            key: "1",
            avatar: "https://i.pravatar.cc/150?img=1",
            matricule: "2021001",
            name: "Kabasele Mwamba",
            department: "Informatique",
            promotion: "L3",
            status: "Actif",
          },
          {
            key: "2",
            avatar: "https://i.pravatar.cc/150?img=2",
            matricule: "2020002",
            name: "Mbuyi Tshibanda",
            department: "Mathématiques",
            promotion: "L2",
            status: "Actif",
          },
          {
            key: "3",
            avatar: "https://i.pravatar.cc/150?img=3",
            matricule: "2022003",
            name: "Nzinga Lunda",
            department: "Physique",
            promotion: "L1",
            status: "Actif",
          },
          {
            key: "4",
            avatar: "https://i.pravatar.cc/150?img=4",
            matricule: "2019004",
            name: "Ilunga Kalala",
            department: "Chimie",
            promotion: "L0",
            status: "Abandon",
          },
        ]}
        columns={[
          {
            title: "Avatar",
            dataIndex: "avatar",
            key: "avatar",
            render: (avatar) => <Avatar src={avatar} />,
            width: 50,
          },
          {
            title: "Matricule",
            dataIndex: "matricule",
            key: "matricule",
          },
          {
            title: "Nom",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Promotion",
            dataIndex: "promotion",
            key: "promotion",
          },
          {
            title: "Statut",
            dataIndex: "status",
            key: "status",
            render: (status) => (
              <Tag
                color={status === "Actif" ? "green" : "red"}
                bordered={false}
              >
                {status}
              </Tag>
            ),
            align: "start",
          },
          {
            title: "",
            key: "actions",
            render: (_, record) => (
              <Space>
                <Button
                  style={{ boxShadow: "none" }}
                  onClick={() => {
                    router.push(`/app/student/1`);
                  }}
                >
                  Gérer
                </Button>
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
