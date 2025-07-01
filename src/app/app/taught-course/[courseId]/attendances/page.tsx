"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import {
  getAttendanceAbsentCount,
  getAttendanceJustifiedCount,
  getAttendancePresentCount,
  getAttendancesListByCourse,
  getCourseEnrollments,
  getCourseEnrollmentsByStatus,
  getTaughtCours,
} from "@/lib/api";
import { getHSLColor } from "@/lib/utils";
import { AttendanceList, TaughtCourse } from "@/types";
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
import {
  Avatar,
  Button,
  DatePicker,
  Dropdown,
  Space,
  Table,
} from "antd";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { DeleteAttendanceListForm } from "./forms/delete";
import { NewAttendanceListForm } from "./forms/new";
import { EditAttendanceListForm } from "./forms/edit";

type ActionsBarProps = {
  record: AttendanceList;
  course?: TaughtCourse;
};

const ActionsBar: FC<ActionsBarProps> = ({ record, course }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space size="middle">
      <EditAttendanceListForm
        attendanceList={record}
        course={course}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <DeleteAttendanceListForm
        attendanceList={record}
        open={openDelete}
        setOpen={setOpenDelete}
      />
      <Button
        type="dashed"
        style={{ boxShadow: "none" }}
        onClick={() => setOpenEdit(true)}
      >
        Gérer la liste
      </Button>
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
    queryKey: ["attendances-lists", courseId],
    queryFn: ({ queryKey }) => getAttendancesListByCourse(Number(queryKey[1])),
    enabled: !!courseId,
  });

  const { data: course } = useQuery({
    queryKey: ["taught_courses", courseId],
    queryFn: ({ queryKey }) => getTaughtCours(Number(queryKey[1])),
    enabled: !!courseId,
  });

  const { data: enrollments, isPending: isPendingEnrollments } = useQuery({
    queryKey: ["course_enrollments", courseId],
    queryFn: ({ queryKey }) => getCourseEnrollments(Number(queryKey[1])),
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
            <DatePicker placeholder="DD/MM/YYYY" format="DD/MM/YYYY" />
          </Space>
          <div className="flex-1" />
          <Space>
            <NewAttendanceListForm
              course={course}
              courseEnrollements={getCourseEnrollmentsByStatus(
                enrollments,
                "validated"
              )}
            />
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
          title: "Heure",
          dataIndex: "time",
          key: "time",
          render: (_, record, __) => record?.time.substring(0, 5),
        },
        {
          title: "Présences",
          dataIndex: "presence_count",
          key: "presence_count",
          render: (_, record, __) =>
            getAttendancePresentCount(record.student_attendance_status),
        },
        {
          title: "Absences",
          dataIndex: "absence_count",
          key: "absence_count",
          render: (_, record, __) =>
            getAttendanceAbsentCount(record.student_attendance_status),
        },
        {
          title: "Justifiées",
          dataIndex: "justified_count",
          key: "justified_count",
          render: (_, record, __) =>
            getAttendanceJustifiedCount(record.student_attendance_status),
        },
        {
          title: "Étudiants",
          dataIndex: "students",
          key: "students",
          render: (_, record, __) => record.student_attendance_status.length,
        },
        {
          title: "Opérateur",
          dataIndex: "operator",
          key: "operator",
          render: (_, record, __) => (
            <Space>
              {record.verified_by && (
                <Avatar
                  style={{
                    backgroundColor: getHSLColor(
                      `${record.verified_by.first_name} ${record.verified_by.last_name} ${record.verified_by.surname}`
                    ),
                  }}
                >
                  {record.verified_by.first_name?.charAt(0).toUpperCase()}
                  {record.verified_by.last_name?.charAt(0).toUpperCase()}
                </Avatar>
              )}{" "}
              {record.verified_by.surname}
            </Space>
          ),
        },
        {
          title: "",
          key: "actions",
          render: (_, record, __) => {
            return <ActionsBar record={record} course={course} />;
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
