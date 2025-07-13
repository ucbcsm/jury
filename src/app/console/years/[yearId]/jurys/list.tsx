"use client";
import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { getAllTeachers, getFaculties, getJurys } from "@/lib/api";
import { getHSLColor } from "@/lib/utils";
import { Faculty, Jury, Teacher } from "@/types";
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
import { useQuery } from "@tanstack/react-query";
import { Button, Dropdown, Input, Space, Table, Tag, Typography } from "antd";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { NewJuryForm } from "./forms/new";
import { DeleteJuryForm } from "./forms/delete";
import { EditJuryForm } from "./forms/edit";

type ActionsBarProps = {
  record: Jury;
  faculties?: Faculty[];
  teachers?: Teacher[];
};

const ActionsBar: FC<ActionsBarProps> = ({ record, faculties, teachers }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space size="middle">
      <EditJuryForm
        faculties={faculties}
        jury={record}
        teachers={teachers}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <DeleteJuryForm jury={record} open={openDelete} setOpen={setOpenDelete} />
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

export function JurysList() {
  const { yearId } = useParams();
  const {
    data: jurys,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["jurys", yearId],
    queryFn: ({ queryKey }) => getJurys(Number(queryKey[1])),
    enabled: !!yearId,
  });

  const {
    data: faculties,
    isPending: isPendingFacalties,
    isError: isErrorFaculties,
  } = useQuery({
    queryKey: ["faculties"],
    queryFn: getFaculties,
  });

  const {
    data: teachers,
    isPending: isPendinfTeachers,
    isError: isErrorTeachers,
  } = useQuery({
    queryKey: ["all_teachers"],
    queryFn: getAllTeachers,
  });

  if (isPending) {
    return <DataFetchPendingSkeleton />;
  }

  if (isError) {
    return <DataFetchErrorResult />;
  }
  return (
    <Table
      title={() => (
        <header className="flex pb-3">
          <Space>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              Jurys
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <NewJuryForm teachers={teachers} faculties={faculties} />
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
          title: "Nom du jury",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Facultés",
          dataIndex: "faculties",
          key: "faculties",
          render: (_, record) => (
            <Space wrap>
              {record.faculties.map((fac, index) => (
                <Tag
                  key={index}
                  color={getHSLColor(fac.name)}
                  bordered={false}
                  style={{ borderRadius: 15 }}
                >
                  {fac.acronym}
                </Tag>
              ))}
            </Space>
          ),
          ellipsis: true,
          align: "match-parent",
        },
        {
          title: "Président",
          dataIndex: "president",
          key: "president",
          render: (_, record) =>
            `${record.chairperson.user?.first_name} ${record.chairperson.user?.last_name} ${record.chairperson.user?.surname}`,
          ellipsis: true,
        },
        {
          title: "Secrétaire",
          dataIndex: "secretary",
          key: "secretary",
          render: (_, record) =>
            `${record.secretary.user?.first_name} ${record.secretary.user?.last_name} ${record.secretary.user?.surname}`,
          ellipsis: true,
        },
        {
          title: "Autre (s) membre (s)",
          dataIndex: "members",
          key: "members",
          render: (_, record) => (
            <Space wrap>
              {record.members.map(
                (m) =>
                  `${m.user.first_name} ${m.user.last_name} ${m.user.surname}`
              )}
            </Space>
          ),
        },
        {
          dataIndex: "actions",
          key: "actions",
          render: (_, record) => (
            <ActionsBar
              record={record}
              faculties={faculties}
              teachers={teachers}
            />
          ),
          width: 52,
        },
      ]}
      dataSource={jurys}
      rowKey="id"
      rowClassName={`bg-[#f5f5f5] odd:bg-white`}
      // rowSelection={{
      //   type: "checkbox",
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
