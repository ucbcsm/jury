import {
  DownOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FilterOutlined,
  PlusOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Input,
  Space,
  Table,
  TableColumnType,
  Tag,
} from "antd";

type InvoiceType = {
  id: string | number;
  key: string;
  number: string;
  date: string;
  amount: number;
  student: string;
  matricule: string;
  status: "paid" | "pending" | "canceled";
};

const columns: TableColumnType<InvoiceType>[] = [
  {
    title: "No",
    dataIndex: "number",
    key: "matricule",
    width: 92,
    render: (value) => value,
    align: "start",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "name",
    render: (value, record) => `${record.date}`,
    width: 100,
  },
  {
    title: "Montant",
    dataIndex: "amount",
    key: "amount",
    width: 100,
    render: (_, record) =>
      `${new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "USD",
      }).format(record.amount)}`,
    align: "end",
  },
  {
    title: "Etudiant",
    dataIndex: "student",
    key: "name",
    render: (value) => `${value}`,
    ellipsis: true,
  },
  {
    title: "Matricule",
    dataIndex: "matricule",
    key: "matricule",
    width: 90,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "name",
    render: (value) => `${value}`,
    width: 100,
  },
];

const data: InvoiceType[] = Array.from({ length: 100 }, (_, index) => {
  const id = (index + 1).toString();
  return {
    id,
    key: id,
    status: "paid",
    number: `INV00-${id}`,
    date: new Date().toLocaleDateString(),
    amount: Math.floor(Math.random() * 1000),
    student: `Etudiant ${id}`,
    matricule: `00024${id}`,
  };
});

export function StaffList() {
  return (
    <Table
      title={() => (
        <header className="flex  pb-3">
          <Space>
            <Input.Search placeholder="Rechercher ..." />
            <Button icon={<FilterOutlined />} style={{ boxShadow: "none" }}>
              Filtrer
            </Button>
          </Space>
          <div className="flex-1" />
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              style={{ boxShadow: "none" }}
              variant="dashed"
            >
              Nouvelle facture
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
      columns={columns}
      dataSource={data}
      rowClassName={`bg-[#f5f5f5] odd:bg-white hover:cursor-pointer`}
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
