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
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  List,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";

export default function Page() {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Typography.Title level={5} style={{ marginBottom: 16 }}>
          Frais à payer
        </Typography.Title>
        <Card>
          <List
            dataSource={[
              {
                key: "1",
                feeName: "Frais d'inscription",
                amount: 50,
              },
              {
                key: "2",
                feeName: "Frais de scolarité",
                amount: 200,
              },
              {
                key: "3",
                feeName: "Frais de bibliothèque",
                amount: 10,
              },
              {
                key: "4",
                feeName: "Frais de laboratoire",
                amount: 30,
              },
            ]}
            renderItem={(item,index) => (
              <List.Item
                key={item.key}
                extra={`${new Intl.NumberFormat("fr", {
                  style: "currency",
                  currency: "USD",
                }).format(item.amount)} / ${new Intl.NumberFormat("fr", {
                  style: "currency",
                  currency: "USD",
                }).format(item.amount)}`}
              >
                <List.Item.Meta
                  avatar={<Avatar>{index+1}</Avatar>}
                  title={item.feeName}
                  description={"Obligatoire"}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={24}>
        <Typography.Title level={5} style={{ marginBottom: 16 }}>
          Transactions des paiements
        </Typography.Title>
        <Card>
          <Table
            title={() => (
              <header className="flex pb-3">
                <Space>
                  <Input.Search placeholder="Rechercher une transaction ..." />
                  <Select options={[]} placeholder="Frais" />
                </Space>
                <div className="flex-1" />
                <Space>
                  <Button
                    icon={<PrinterOutlined />}
                    style={{ boxShadow: "none" }}
                  >
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
                    <Button
                      icon={<DownOutlined />}
                      style={{ boxShadow: "none" }}
                    >
                      Exporter
                    </Button>
                  </Dropdown>
                </Space>
              </header>
            )}
            dataSource={[
              {
                key: "1",
                transactionId: "TXN001",
                feeName: "Frais d'inscription",
                paymentDate: "2023-10-02",
                amount: 50,
                paymentMethod: "Carte bancaire",
                status: "Réussi",
              },
              {
                key: "2",
                transactionId: "TXN002",
                feeName: "Frais de scolarité",
                paymentDate: "2023-11-16",
                amount: 200,
                paymentMethod: "Espèces",
                status: "Échoué",
              },
              {
                key: "3",
                transactionId: "TXN003",
                feeName: "Frais de bibliothèque",
                paymentDate: "2023-12-02",
                amount: 10,
                paymentMethod: "Virement bancaire",
                status: "Réussi",
              },
            ]}
            columns={[
              {
                title: "ID",
                dataIndex: "transactionId",
                key: "transactionId",
              },
              {
                title: "Nom du frais",
                dataIndex: "feeName",
                key: "feeName",
              },
              {
                title: "Date",
                dataIndex: "paymentDate",
                key: "paymentDate",
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
                title: "Méthode de paiement",
                dataIndex: "paymentMethod",
                key: "paymentMethod",
              },
              {
                title: "Statut",
                dataIndex: "status",
                key: "status",
                render: (status) =>
                  status === "Réussi" ? (
                    <Tag color="green" bordered={false}>
                      Payé
                    </Tag>
                  ) : (
                    <Tag color="red" bordered={false}>
                      Non payé
                    </Tag>
                  ),
              },
              {
                title: "",
                key: "actions",
                render: (_, record) => (
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "1",
                          label: "Voir détails",
                          icon: <EditOutlined />,
                        },
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
            rowKey="key"
            rowClassName={`bg-[#f5f5f5] odd:bg-white`}
            rowSelection={{
              type: "checkbox",
            }}
            size="small"
            pagination={{
              defaultPageSize: 10,
              pageSizeOptions: [10, 25, 50],
              size: "small",
            }}
          />
        </Card>
      </Col>
    </Row>
  );
}
