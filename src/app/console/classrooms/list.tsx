import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { getClassrooms, getClassroomTypeName } from "@/lib/api";
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
import { Button, Dropdown, Input, Space, Table, Tag } from "antd";
import { NewClassroomForm } from "./forms/new";
import { Classroom } from "@/types";
import { FC, useState } from "react";
import { DeleteClassroomForm } from "./forms/delete";
import { EditClassroomForm } from "./forms/edit";

type ActionsBarProps = {
  record: Classroom;
};

const ActionsBar: FC<ActionsBarProps> = ({ record }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space size="middle">
      <EditClassroomForm
        classroom={record}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <DeleteClassroomForm
        classroom={record}
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
            if (key === "edit") {
              setOpenEdit(true);
            } else if (key === "delete") {
              setOpenDelete(true);
            }
          },
        }}
      >
        <Button type="text" icon={<MoreOutlined />} />
      </Dropdown>
    </Space>
  );
};

export const ListClassrooms = () => {
  const {
    data: classrooms,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["classrooms"],
    queryFn: getClassrooms,
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
            <Input.Search placeholder="Rechercher une salle de classe ..." />
          </Space>
          <div className="flex-1" />
          <Space>
            <NewClassroomForm />
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
                    title: "Exporter vers excel",
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
          key: "name",
          dataIndex: "name",
          title: "Nom de la salle",
          ellipsis: true,
        },
        {
          key: "code",
          dataIndex: "code",
          title: "Code",
          width: 100,
        },
        {
          key: "room_type",
          dataIndex: "room_type",
          title: "Type",
          render: (value) => getClassroomTypeName(value),
          ellipsis: true,
        },
        {
          key: "capacity",
          dataIndex: "capacity",
          title: "Capacité",
          width: 100,
          align: "end",
        },

        {
          key: "status",
          dataIndex: "status",
          title: "Statut",
          render: (value) => (
            <Tag
              color={value === "unoccupied" ? "green" : "red"}
              style={{ border: 0 }}
            >
              {value === "unoccupied" ? "Disponible" : "Occupée"}
            </Tag>
          ),
        },
        {
          key: "actions",
          dataIndex: "actions",
          render: (_, record, __) => {
            return <ActionsBar record={record} />;
          },
          width:58
        },
      ]}
      dataSource={classrooms}
      rowKey="id"
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
      bordered={false}
    />
  );
};
