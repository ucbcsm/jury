"use client";

import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PlusOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Input, Space, Table, Tag } from "antd";

export default function Page() {
  return (
    <Table
      title={() => (
        <header className="flex pb-3">
          <Space>
            <Input.Search placeholder="Rechercher un enseignant ..." />
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
          avatar: "https://i.pravatar.cc/150?img=5",
          matricule: "T2021001",
          name: "Prof. Kabasele Mwamba",
          email: "kabasele.mwamba@example.com",
          phone: "+243 81 234 5678",
          courses: ["Mathématiques", "Physique"],
        },
        {
          key: "2",
          avatar: "https://i.pravatar.cc/150?img=6",
          matricule: "T2020002",
          name: "Prof. Mbuyi Tshibanda",
          email: "mbuyi.tshibanda@example.com",
          phone: "+243 99 876 5432",
          courses: ["Chimie", "Biologie"],
        },
        {
          key: "3",
          avatar: "https://i.pravatar.cc/150?img=7",
          matricule: "T2022003",
          name: "Prof. Nzinga Lunda",
          email: "nzinga.lunda@example.com",
          phone: "+243 85 112 3344",
          courses: ["Histoire", "Géographie"],
        },
        {
          key: "4",
          avatar: "https://i.pravatar.cc/150?img=8",
          matricule: "T2019004",
          name: "Prof. Ilunga Kalala",
          email: "ilunga.kalala@example.com",
          phone: "+243 97 556 7788",
          courses: ["Philosophie", "Littérature"],
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
          title: "Email",
          dataIndex: "email",
          key: "email",
        },
        {
          title: "Téléphone",
          dataIndex: "phone",
          key: "phone",
        },
        {
          title: "Cours",
          dataIndex: "courses",
          key: "courses",
          render: (_, record) => (
            <Space wrap>
              {record.courses.map((course, index) => (
                <Tag
                  color="blue"
                  key={index}
                  bordered={false}
                  style={{ borderRadius: 10 }}
                >
                  {course}
                </Tag>
              ))}
            </Space>
          ),
          align: "start",
        },
        {
          title: "",
          key: "actions",
          render: (_, record) => (
            <Space>
              <Button style={{ boxShadow: "none" }}>Gérer</Button>
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
