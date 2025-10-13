"use client";

import { getMomentText, getSessionText, switchAnnouncementStatus } from "@/lib/api";
import { getAnnoucements } from "@/lib/api";
import {
  CheckSquareOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  LineChartOutlined,
  MinusSquareOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Layout, message, Space, Switch, Table, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { NewAnnoucementWithAllForm } from "./new-announcement-with-all-form";
import { Announcement, Class, Department, Jury, Period } from "@/types";
import { parseAsBoolean, parseAsInteger, useQueryState } from "nuqs";
import { ListPeriodGrades } from "./list-period-grades";
import { DeleteAnnouncementForm } from "./delete-announcement-form";
import { NewAnnoucementWithSomeForm } from "./new-announcement-with-some-form";
import { ListYearGrades } from "./list-year-grades";
import { EditAnnouncementForm } from "./edit-anouncement-form";
import { PeriodResultPresentation } from "./periodResultPresentation";
import { YearResultPresentation } from "./yearResultPresentation";
import { PeriodDeliberationMinutes } from "./periodDeliberationMinutes";
import { set } from "zod";
import { useJury } from "@/hooks/useJury";
import { YearDeliberationMinutes } from "./yearDeliberationMinutes";


type ActionsBarProps = {
  announcement: Announcement;
  periods?: Period[];
  jury?:Jury
};
const ActionsBar: FC<ActionsBarProps> = ({ announcement, periods, jury }) => {
  const [announcementId, setAnnoucementId] = useQueryState(
    "grid",
    parseAsInteger
  );
  const [resultPresentationId, setResultPresentationId] = useQueryState(
    "result-presentation",
    parseAsInteger
  );
  const [deliberationMinutesId, setDeliberationMinutesId] = useQueryState(
    "deliberation-minutes",
    parseAsInteger
  );

  const [openDeleteAnnouncement, setOpenDeleteAnnouncement] =
    useState<boolean>(false);
  const [openEditAnnouncement, setOpenEditAnnouncement] =
    useState<boolean>(false);
  return (
    <>
      <ListPeriodGrades
        annoucement={announcement}
        announcementId={announcementId}
        setAnnoucementId={setAnnoucementId}
      />
      <PeriodDeliberationMinutes
        annoucement={announcement}
        announcementId={deliberationMinutesId}
        setAnnoucementId={setDeliberationMinutesId}
        jury={jury}
      />
      <PeriodResultPresentation
        annoucement={announcement}
        announcementId={resultPresentationId}
        setAnnoucementId={setResultPresentationId}
      />
      <EditAnnouncementForm
        open={openEditAnnouncement}
        setOpen={setOpenEditAnnouncement}
        announcement={announcement}
        periods={periods}
      />
      <DeleteAnnouncementForm
        open={openDeleteAnnouncement}
        setOpen={setOpenDeleteAnnouncement}
        announcement={announcement}
      />
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
                key: "deliberation-minutes",
                label: "Procès-verbal",
                icon: <FileTextOutlined />,
                onClick: () => {
                  setDeliberationMinutesId(announcement.id);
                },
              },
              // {
              //   key: "grade-report",
              //   label: "Relevé de notes",
              //   onClick: () => {},
              // },
              {
                key: "result-presentation",
                label: "Présentation des résultats",
                icon: <LineChartOutlined />,
                onClick: () => {
                  setResultPresentationId(announcement.id);
                },
              },
              {
                type: "divider",
              },
              {
                key: "edit",
                label: "Modifier",
                icon: <EditOutlined />,
                onClick: () => {
                  setOpenEditAnnouncement(true);
                },
              },
              {
                key: "delete",
                label: "Supprimer",
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
    </>
  );
};

type SwitchAnnouncementStatusProps={
  announcement: Announcement;
}
const SwitchAnnouncementStatus: FC<SwitchAnnouncementStatusProps> = ({announcement}) => {
  const [messageApi, contextHolder] = message.useMessage();
   const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: switchAnnouncementStatus,
    });

  return (
    <>
      {contextHolder}
      <Switch
        checkedChildren="Verrouillé"
        unCheckedChildren="Ouvert"
        value={announcement.status==="locked" ? true : false}
        onChange={(value) => {
          mutateAsync(
            {
              id: announcement.id,
              status: value ? "locked" : "unlocked",
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["announcements"] });
                messageApi.success("Statut modifiée avec succès !");
              },
              onError: (error: Error) => {
                messageApi.error(
                  error.message ||
                    "Une erreur s'est produite lors de la modification du statut."
                );
              },
            }
          );
        }}
        loading={isPending}
        disabled={isPending}
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
  const { facultyId, departmentId, classId, juryId } = useParams();
  const [openNewWithAll, setOpenNewWithAll] = useQueryState(
    "new-with-all",
    parseAsBoolean.withDefault(false)
  );
  const [openNewWithSome, setOpenNewWithSome] = useQueryState(
    "new-with-some",
    parseAsBoolean.withDefault(false)
  );

  const [openYearResultPresentation, setOpenYearResultPresentation] =
    useQueryState(
      "year-result-presentation",
      parseAsBoolean.withDefault(false)
    );

  const [openDeliberationMinutes, setOpenDeliberationMinutes] = useQueryState(
    "yearly-deliberation-minutes",
    parseAsBoolean.withDefault(false)
  );

    const { data: jury } = useJury(Number(juryId));

  const { data, isPending, isError } = useQuery({
    queryKey: ["announcements", yearId, facultyId, departmentId, classId],
    queryFn: () =>
      getAnnoucements({
        yearId: Number(yearId),
        facultyId: Number(facultyId),
        departmentId: Number(departmentId),
        classId: Number(classId),
      }),
    enabled: !!yearId && !!facultyId && !!departmentId && !!classId,
  });

  const getLastPeriodId = () => {
    if (!data || data.length === 0) return 0;
    // Trouver le plus grand order_number
    const maxOrderNumber = Math.max(...data.map(ann => ann.period.order_number));
    // Trouver la période correspondante
    if (maxOrderNumber % 2 === 0) {
      const lastPeriod = data.find(
        (ann) => ann.period.order_number === maxOrderNumber
      )?.period;
      return lastPeriod?.id || 0;
    } else {
      return 0;
    }
  }

  return (
    <Layout>
      <Layout.Content
        style={{ height: `calc(100vh - 165px)`, padding: 28, overflow: "auto" }}
      >
        <Table
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
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "all",
                        label: "Tous les étudiants",
                        icon: <CheckSquareOutlined />,
                      },
                      {
                        key: "some",
                        label: "Quelques étudiants",
                        icon: <MinusSquareOutlined />,
                      },
                    ],
                    onClick: ({ key }) => {
                      if (key === "all") {
                        setOpenNewWithAll(true);
                      } else if (key === "some") {
                        setOpenNewWithSome(true);
                      }
                    },
                  }}
                >
                  <Button
                    icon={<PlusOutlined />}
                    color="primary"
                    variant="solid"
                    style={{ boxShadow: "none" }}
                  >
                    Nouvelle publication
                  </Button>
                </Dropdown>
                <NewAnnoucementWithAllForm
                  department={department}
                  classYear={classYear}
                  yearId={yearId}
                  periods={periods}
                  open={openNewWithAll}
                  setOpen={setOpenNewWithAll}
                />
                <NewAnnoucementWithSomeForm
                  department={department}
                  classYear={classYear}
                  yearId={yearId}
                  periods={periods}
                  open={openNewWithSome}
                  setOpen={setOpenNewWithSome}
                />
                <ListYearGrades
                  department={department}
                  classYear={classYear}
                  lastPeriodId={getLastPeriodId()}
                />
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "deliberation-minutes",
                        label: "Procès-verbal annuel",
                        icon: <FileTextOutlined />,
                        onClick: () => {
                          setOpenDeliberationMinutes(true);
                        },
                        disabled: getLastPeriodId() === 0,
                      },
                      {
                        key: "result-presentation",
                        label: "Présentation des résultats annuelle",
                        icon: <LineChartOutlined />,
                        onClick: () => {
                          setOpenYearResultPresentation(true);
                        },
                        disabled: getLastPeriodId() === 0,
                      },
                    ],
                  }}
                >
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
                <YearResultPresentation
                  department={department}
                  classYear={classYear}
                  lastPeriodId={getLastPeriodId()}
                  open={openYearResultPresentation}
                  setOpen={setOpenYearResultPresentation}
                />
                <YearDeliberationMinutes
                  department={department}
                  classYear={classYear}
                  lastPeriodId={getLastPeriodId()}
                  open={openDeliberationMinutes}
                  setOpen={setOpenDeliberationMinutes}
                  jury={jury}
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
              minWidth: 100,
              fixed: "left",
            },
            {
              key: "session",
              dataIndex: "session",
              title: "Session",
              render: (_, record) => getSessionText(record.session),
              width: 120,
            },
            {
              key: "moment",
              dataIndex: "moment",
              title: "Moment",
              render: (_, record) => getMomentText(record.moment),
              width: 120,
            },
            {
              key: "graduated_students",
              dataIndex: "graduated_students",
              title: "Proclamés",
              width: 64,
              ellipsis: true,
              align: "center",
            },
            {
              key: "non_graduated_students",
              dataIndex: "non_graduated_students",
              title: "Non proclamés",
              width: 64,
              ellipsis: true,
              align: "center",
            },
            {
              key: "total_students",
              dataIndex: "total_students",
              title: "Total",
              width: 64,
              align: "center",
            },

            // {
            //   key: "mode",
            //   dataIndex: "mode",
            //   title: "Mode",
            //   render: (_, record) => record.mode === "all-students" ? "Tous les étudiants" : "Quelques étudiants",
            // },

            {
              key: "status",
              dataIndex: "status",
              title: "Statut",
              render: (_, record) => (
                <SwitchAnnouncementStatus announcement={record} />
              ),
              width: 120,
            },
            {
              key: "date_date_created",
              dataIndex: "date_created",
              title: "Création",
              render: (_, record) =>
                dayjs(record.date_created).format("DD/MM/YYYY"),
              width: 96,
            },
            // {
            //   key: "date_updated",
            //   dataIndex: "date_updated",
            //   title: "Mise à jour ",
            //   render: (_, record) =>
            //     dayjs(record.date_updated).format("DD/MM/YYYY HH:mm"),
            // },
            {
              key: "actions",
              dataIndex: "view",
              render: (_, record) => (
                <ActionsBar
                  announcement={record}
                  periods={periods}
                  jury={jury}
                />
              ),
              width: 188,
              fixed: "right",
            },
          ]}
          dataSource={data}
          rowKey="id"
          scroll={{ y: "calc(100vh - 320px)" }}
          size="small"
        />
      </Layout.Content>
    </Layout>
  );
};
