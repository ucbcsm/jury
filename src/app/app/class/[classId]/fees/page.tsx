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
import { Button, Dropdown, Input, Space, Table } from "antd";

export default function Page() {
  return (
    <Table
      title={() => (
        <header className="flex pb-3">
          <Space>
            <Input.Search placeholder="Rechercher un frais ..." />
          </Space>
          <div className="flex-1" />
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              title="Ajouter un frais"
              style={{ boxShadow: "none" }}
            >
              Ajouter
            </Button>
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
                    title: "Exporter ver excel",
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
          name: "Frais d'inscription",
          description: "Frais pour l'inscription annuelle",
          amount: 50,
          classes: ["1ère année", "2ème année"],
        },
        {
          key: "2",
          name: "Frais de scolarité",
          description: "Frais pour le semestre en cours",
          amount: 200,
          classes: ["Toutes les années"],
        },
        {
          key: "3",
          name: "Frais de bibliothèque",
          description: "Frais pour l'accès à la bibliothèque",
          amount: 10,
          classes: ["1ère année", "3ème année"],
        },
        {
          key: "4",
          name: "Frais de laboratoire",
          description: "Frais pour l'utilisation des laboratoires",
          amount: 30,
          classes: ["2ème année", "3ème année"],
        },
      ]}
      columns={[
        {
          title: "Nom",
          dataIndex: "name",
          key: "name",
          render: (text) => text,
        },
        {
          title: "Description",
          dataIndex: "description",
          key: "description",
        },
        {
          title: "Montant",
          dataIndex: "amount",
          key: "amount",
          render: (value) =>
            new Intl.NumberFormat("FR", {
              style: "currency",
              currency: "USD",
            }).format(value),
          align: "end",
        },
        {
          title: "Classes",
          dataIndex: "classes",
          key: "classes",
          render: (classes) => classes.join(", "),
        },
        {
          title: "",
          key: "actions",
          render: (_, record) => (
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
