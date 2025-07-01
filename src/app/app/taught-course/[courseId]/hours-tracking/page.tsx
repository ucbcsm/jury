"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { getHoursTrackings, getHourTrackingActivityTypeName } from "@/lib/api";
import { HourTracking } from "@/types";
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
import { Button, DatePicker, Dropdown, Space, Switch, Table } from "antd";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { NewHourTrackingForm } from "./forms/new";
import { DeleteHourTrackingForm } from "./forms/delete";
import { EditHourTrackingForm } from "./forms/edit";

type ActionsBarProps = {
  record: HourTracking;
};

const ActionsBar: FC<ActionsBarProps> = ({ record }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space size="middle">
      <EditHourTrackingForm
        hourTracking={record}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <DeleteHourTrackingForm
        hourTracking={record}
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

export default function Page() {
  const { courseId } = useParams();
  const { data, isPending, isError } = useQuery({
    queryKey: ["course_hours_tracking", courseId],
    queryFn: ({ queryKey }) => getHoursTrackings(Number(queryKey[1])),
    enabled: !!courseId,
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
            <DatePicker placeholder="DD/MM/YYYY" format="DD/MM/YYYY"  />
          </Space>
          <div className="flex-1" />
          <Space>
            <NewHourTrackingForm />
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
          title: "Date",
          dataIndex: "date",
          key: "date",
          render: (_, record, __) =>
            record.date
              ? new Intl.DateTimeFormat("fr", { dateStyle: "long" }).format(
                  new Date(`${record.date}`)
                )
              : "",
        },
        {
          title: "Matière",
          dataIndex: "lesson",
          key: "lesson",
          render: (_, record, __) => record?.lesson,
        },
        {
          title: "Heure de début",
          dataIndex: "start_time",
          key: "start_time",
          render: (_, record, __) => record?.start_time.substring(0, 5),
        },
        {
          title: "Heure de fin",
          dataIndex: "end_time",
          key: "end_time",
          render: (_, record, __) => record?.end_time.substring(0, 5),
        },
        {
          title: "Type d'activité",
          dataIndex: "activity_type",
          key: "activity_type",
          render: (_, record, __) =>
            getHourTrackingActivityTypeName(record?.activity_type),
        },
        {
          title: "Heures prestées",
          dataIndex: "hours_completed",
          key: "hours_completed",
          render: (_, record, __) => record?.hours_completed,
        },
        {
          title: "Validation CP",
          dataIndex: "cp_validation",
          key: "cp_validation",
          render: (_, record, __) => (
            <Switch
              checked={record?.cp_validation}
              checkedChildren="Validé"
              unCheckedChildren="Non validé"
              disabled
            />
          ),
        },
        {
          title: "Validation enseignant",
          dataIndex: "teacher_validation",
          key: "teacher_validation",
          render: (_, record, __) => (
            <Switch
              checked={record?.teacher_validation}
              checkedChildren="Validé"
              unCheckedChildren="Non validé"
              disabled
            />
          ),
        },
        {
          title: "",
          key: "actions",
          render: (_, record, __) => {
            return <ActionsBar record={record} />;
          },
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
