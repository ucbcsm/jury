"use client";

import { getMomentText, getSessionText } from "@/lib/api";
import { getAnnoucements } from "@/lib/api/annoucement";
import { DeleteOutlined, EyeOutlined, LockOutlined, MoreOutlined, UnlockOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Dropdown, Layout, Space, Table, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { NewAnnoucementForm } from "./new-announcement-form";
import { Announcement, Class, Department, Period } from "@/types";
import { parseAsInteger, useQueryState } from "nuqs";
import { ListGrades } from "./list-grades";
import { DeleteAnnouncementForm } from "./delete-announcement-form";

type ActionsBarProps = {
  announcement: Announcement;
};
const ActionsBar: FC<ActionsBarProps> = ({ announcement }) => {
  const [anouncementId, setAnnoucementId] = useQueryState(
    "grid",
    parseAsInteger
  );
  const [openDeleteAnnouncement, setOpenDeleteAnnouncement] =
    useState<boolean>(false);
  return (
    <>
      <Space>
        <Button
          icon={<EyeOutlined />}
          color="primary"
          variant="dashed"
          style={{ boxShadow: "none" }}
          block
          onClick={() => {
            setAnnoucementId(announcement.id);
          }}
        >
          Voir la grille
        </Button>
        <Dropdown
          menu={{
            items: [
              {
                key: "delete",
                label: "Supprimer la publication",
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => setOpenDeleteAnnouncement(true),
              },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      </Space>
      <ListGrades
        annoucement={announcement}
        anouncementId={anouncementId}
        setAnnoucementId={setAnnoucementId}
      />
      <DeleteAnnouncementForm
        open={openDeleteAnnouncement}
        setOpen={setOpenDeleteAnnouncement}
        announcement={announcement}
      />
    </>
  );
};

type ListAnnouncementsProps = {
  yearId?: number;
  department?: Department;
  classYear?: Class;
  periods?: Period[];
};
export const ListAnnouncements: FC<ListAnnouncementsProps> = ({
  yearId,
  department,
  classYear,
  periods,
}) => {
  const { facultyId, departmentId, classId } = useParams();

  const { data, isPending, isError } = useQuery({
    queryKey: ["annoucements", facultyId, departmentId, classId],
    queryFn: () =>
      getAnnoucements({
        yearId: Number(yearId),
        facultyId: Number(facultyId),
        departmentId: Number(departmentId),
        classId: Number(classId),
      }),
    enabled: !!yearId && !!facultyId && !!departmentId && !!classId,
  });

  return (
    <Layout>
      <Layout.Content
        style={{ height: `calc(100vh - 213px)`, padding: 28, overflow: "auto" }}
      >
        <Table
          //   size="small"
          loading={isPending}
          title={() => (
            <header className="flex">
              <Space>
                <Typography.Title level={5} style={{ marginBottom: 0 }}>
                  Liste des publications
                </Typography.Title>
              </Space>
              <div className="flex-1" />
              <Space>
                <NewAnnoucementForm
                  department={department}
                  classYear={classYear}
                  yearId={yearId}
                  periods={periods}
                />
              </Space>
            </header>
          )}
          columns={[
            {
              key: "period",
              dataIndex: "period",
              title: "Période",
              render: (_, record) =>
                `${record.period.acronym} (${record.period.name})`,
            },
            // {
            //   key: "total_students",
            //   dataIndex: "total_students",
            //   title: "Total",
            //   width: 64,
            // },
            // {
            //   key: "graduated_students",
            //   dataIndex: "graduated_students",
            //   title: "Proclamés",
            //   width: 64,
            //   ellipsis: true,
            // },
            // {
            //   key: "non_graduated_students",
            //   dataIndex: "non_graduated_students",
            //   title: "Non proclamés",
            //   width: 64,
            //   ellipsis: true,
            // },
            {
              key: "session",
              dataIndex: "session",
              title: "Session",
              render: (_, record) => getSessionText(record.session),
            },
            {
              key: "moment",
              dataIndex: "moment",
              title: "Moment",
              render: (_, record) => getMomentText(record.moment),
            },
            {
              key: "status",
              dataIndex: "status",
              title: "Statut",
              render: (_, record) => (
                <Tag
                  bordered={false}
                  color={record.status === "locked" ? "error" : "green"}
                  style={{ marginRight: 0, width: "100%" }}
                  icon={
                    record.status === "locked" ? (
                      <LockOutlined />
                    ) : (
                      <UnlockOutlined />
                    )
                  }
                >
                  {record.status === "locked" ? "Verrouillé" : "Ouvert"}
                </Tag>
              ),
            },
            {
              key: "date_date_created",
              dataIndex: "date_created",
              title: "Création",
              render: (_, record) =>
                dayjs(record.date_created).format("DD/MM/YYYY HH:mm"),
            },
            {
              key: "date_updated",
              dataIndex: "date_updated",
              title: "Mise à jour ",
              render: (_, record) =>
                dayjs(record.date_updated).format("DD/MM/YYYY HH:mm"),
            },
            {
              key: "actions",
              dataIndex: "view",
              render: (_, record) => <ActionsBar announcement={record} />,
              width:120
            },
          ]}
          dataSource={data}
        />
      </Layout.Content>
    </Layout>
  );
};
