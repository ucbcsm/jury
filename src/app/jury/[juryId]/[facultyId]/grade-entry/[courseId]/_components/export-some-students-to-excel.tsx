"use client";

import React, {
  Dispatch,
  FC,
  SetStateAction,
  useState,
} from "react";
import {
  Button,
  Drawer,
  message,
  Space,
  Typography,
  theme,
  Table,
  Flex,
  Modal,
  Alert,
} from "antd";
import {
  CloseOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { CourseEnrollment, TaughtCourse } from "@/types";
import { exportEmptyGradesToExcel } from "@/lib/api";

type ExportSomeStudentsToExcelFormProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  course?: TaughtCourse;
  enrollments?: CourseEnrollment[];
};

export const ExportSomeStudentsToExcelForm: FC<
  ExportSomeStudentsToExcelFormProps
> = ({
  open,
  setOpen,
  course,
  enrollments,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [openCancelForm, setOpenCancelForm] = useState<boolean>(false);

  const [selectedRows, setSelectedRows] = useState<CourseEnrollment[]>([]);

  const onClose = () => {
    setOpen(false);
    setSelectedRows([]);
  };

  return (
    <>
      {contextHolder}
      <Drawer
        open={open}
        title={
          <Flex align="center" gap={8}>
            <Typography.Title
              level={4}
              style={{ marginBottom: 0, color: "#fff" }}
            >
              Exportation vers excel
            </Typography.Title>
            <div className="flex-1" />
            <Typography.Title
              level={4}
              style={{
                marginBottom: 0,
                marginTop: 0,
                textTransform: "uppercase",
              }}
              type="success"
            >
              {course?.available_course.name}
            </Typography.Title>
            <Button
              onClick={() => setOpenCancelForm(true)}
              type="text"
              icon={<CloseOutlined />}
            />
          </Flex>
        }
        destroyOnHidden
        onClose={onClose}
        closable={false}
        maskClosable={false}
        width="60%"
        styles={{ header: { background: colorPrimary, color: "#fff" } }}
        footer={
          <Flex
            justify="space-between"
            style={{
              padding: "12px 24px",
            }}
          >
            <Typography.Title
              type="success"
              level={5}
              style={{ marginBottom: 0 }}
            >
              {selectedRows.length} étudiant(s) sélectionné(s)
            </Typography.Title>
            <Space>
              <Button
                onClick={() => setOpenCancelForm(true)}
                style={{ boxShadow: "none" }}
              >
                Annuler
              </Button>
              <Modal
                title="Annuler l'exportation"
                centered
                open={openCancelForm}
                destroyOnHidden
                cancelText="Retour"
                okText="Confirmer"
                onOk={() => {
                  setOpenCancelForm(false);
                  onClose();
                }}
                onCancel={() => setOpenCancelForm(false)}
                cancelButtonProps={{ style: { boxShadow: "none" } }}
                okButtonProps={{ style: { boxShadow: "none" }, danger: true }}
              >
                <Alert
                  message="Attention !"
                  description="Êtes-vous sûr de vouloir annuler l'exportation ?"
                  type="warning"
                  showIcon
                  style={{ border: 0, marginBottom: 16 }}
                />
              </Modal>
              <Button
                type="primary"
                onClick={() => {
                  if (course) {
                    exportEmptyGradesToExcel(selectedRows, course, {
                      sheetName: `Notes - ${course.available_course.name}`,
                      fileName: `${course.available_course.name}-notes-${course.available_course.code}.xlsx`,
                      onAfter: onClose,
                    });

                    messageApi.success(
                      "Fichier Excel des notes vides exporté avec succès !"
                    );
                  }
                }}
                style={{ boxShadow: "none" }}
                icon={<DownloadOutlined />}
                disabled={selectedRows.length === 0}
              >
                Exporter
              </Button>
            </Space>
          </Flex>
        }
      >
        <Table
          title={() => (
            <header className="flex pb-1 px-0">
              <Space>
                <Typography.Title
                  type="secondary"
                  level={5}
                  style={{
                    marginBottom: 0,
                    marginTop: 0,
                    textTransform: "uppercase",
                  }}
                >
                  Sélection les étudiants concernés
                </Typography.Title>
              </Space>
              <div className="flex-1" />
              <Space>
                <Typography.Text>
                  {selectedRows.length} séléctions
                </Typography.Text>
              </Space>
            </header>
          )}
          dataSource={enrollments}
          columns={[
            {
              key: "matricule",
              dataIndex: "matricule",
              title: "Matricule",
              render: (_, record) =>
                `${record.student?.year_enrollment.user.matricule.padStart(
                  6,
                  "0"
                )}`,
              width: 96,
              align: "center",
            },
            {
              key: "names",
              dataIndex: "names",
              title: "Noms",
              render: (_, record) =>
                `${record.student?.year_enrollment.user.surname} ${record.student?.year_enrollment.user.last_name} ${record.student?.year_enrollment.user.first_name}`,
            },
            {
              key: "promotion",
              dataIndex: "promotion",
              title: "Promotion",
              render: (_, record) =>
                `${record.student?.year_enrollment.class_year.acronym || ""} ${
                  record.student?.year_enrollment.departement.name || ""
                }`,
            },
          ]}
          size="small"
          pagination={false}
          scroll={{ y: "calc(100vh - 280px)" }}
          rootClassName="hover:cursor-pointer"
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectedRows.map((item) => item.id),
            onChange: (_, selectedRows) => {
              setSelectedRows(selectedRows);
            },
          }}
          onRow={(record) => ({
            onClick: () => {
              const exist = selectedRows.some((item) => item.id === record.id);
              if (exist) {
                setSelectedRows((prev) =>
                  prev.filter((item) => item.id !== record.id)
                );
              } else {
                setSelectedRows((prev) => [...prev, record]);
              }
            },
          })}
          rowKey="id"
        />
      </Drawer>
    </>
  );
};
