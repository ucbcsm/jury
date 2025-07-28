import React, { Dispatch, FC, SetStateAction, useState } from "react";
import {
  Button,
  Drawer,
  Form,
  Select,
  message,
  Space,
  Typography,
  theme,
  Table,
  Checkbox,
  Flex,
  Upload,
  Dropdown,
  Tag,
} from "antd";
import {
  UploadOutlined,
  CheckCircleOutlined,
  HourglassOutlined,
} from "@ant-design/icons";
import Papa from "papaparse";
import { InputGrade } from "./input-grade";
import { CourseEnrollment, NewGradeClass, TaughtCourse } from "@/types";
import {
  importGradesFromExcel,
  matchImportedGradesWithEnrollments,
} from "@/lib/api";
import { DeleteSingleGradeButton } from "../delete-single-grade-button";

type FileGradeSubmissionFormProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  enrollments?: CourseEnrollment[];
  course?: TaughtCourse;
};

export const ImportFileGradeSubmissionForm: FC<
  FileGradeSubmissionFormProps
> = ({
  open,
  setOpen,
  enrollments,
  // setNewGradeClassItems,
  course,
}) => {
  const {
    token: { colorPrimary, colorSuccess, colorWarning },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [newMatchedGradeClassItems, setNewMatchedGradeClassItems] = useState<
    NewGradeClass[] | undefined
  >();

  const onClose = () => {
    setOpen(false);
    setNewMatchedGradeClassItems(undefined);
    form.resetFields()
  };

  // Handler for file upload
  const handleFileUpload = async (file: File) => {
    const impotedData = await importGradesFromExcel(file);
    if (enrollments) {
      const matchedData = matchImportedGradesWithEnrollments(
        impotedData,
        enrollments
      );
      setNewMatchedGradeClassItems(matchedData);
      console.log(matchedData);
      messageApi.success("Fichier importé avec succès !");
    }
    // Papa.parse(file, {
    //     header: true,
    //     delimiter:";",
    //     skipEmptyLines: true,
    //     complete: (results) => {
    //         // Adapt this mapping to your CSV structure
    //         const parsed: NewGradeClass[] = results.data.map((row: any) => ({
    //             // student: {
    //             //     id: row["student_id"],
    //             //     year_enrollment: {
    //             //         user: {
    //             //             matricule: row["matricule"],
    //             //             first_name: row["first_name"],
    //             //             last_name: row["last_name"],
    //             //             surname: row["surname"],
    //             //         },
    //             //     },
    //             // },
    //             matricule: row["matricule"],
    //             student: row["student"],
    //             continuous_assessment: Number(row["continuous_assessment"]),
    //             exam: Number(row["exam"]),
    //             // status: row["status"] as "validated" | "pending",
    //             // is_retaken: row["is_retaken"] === "true",
    //         }));
    //         console.log(parsed);
    //         messageApi.success("Fichier importé avec succès !");
    //     },
    //     error: () => {
    //         messageApi.error("Erreur lors de l'import du fichier.");
    //     },
    // });
    // return false; // Prevent upload
  };

  return (
    <>
      {contextHolder}
      <Drawer
        open={open}
        title={
          <Flex justify="space-between" align="center">
            <Typography.Title
              level={4}
              style={{ marginBottom: 0, color: "#fff" }}
            >
              Import de notes depuis un fichier .xlsx
            </Typography.Title>
            <Typography.Title
              level={4}
              style={{
                marginBottom: 0,
                marginTop: 0,
                textTransform: "uppercase",
              }}
              type="warning"
            >
              {course?.available_course.name}
            </Typography.Title>
          </Flex>
        }
        destroyOnHidden
        onClose={onClose}
        closable
        maskClosable
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
              type="secondary"
              level={5}
              style={{ marginBottom: 0 }}
            >
              {/* Saisie des notes */}
            </Typography.Title>
            <Space>
              <Button onClick={onClose} style={{ boxShadow: "none" }}>
                Annuler
              </Button>
              <Button
                type="primary"
                onClick={() => form.submit()}
                style={{ boxShadow: "none" }}
                icon={<CheckCircleOutlined />}
              >
                Sauvegarder
              </Button>
            </Space>
          </Flex>
        }
      >
        <Form
          key="bulk_grade_submission_form"
          form={form}
          name="bulk_grade_submission_form"
          onFinish={async (values: any) => {
            try {
              messageApi.success("Soumission en masse réussie !");
              setOpen(false);
            } catch {
              messageApi.error("Erreur lors de la soumission en masse.");
            }
          }}
          layout="vertical"
        >
          <Form.Item>
            <Upload.Dragger
              accept=".xlsx"
              beforeUpload={handleFileUpload}
              showUploadList={false}
              maxCount={1}
              style={{ padding: 12 }}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ fontSize: 32, color: "GrayText" }} />
              </p>
              <p className="ant-upload-text">
                Cliquez ou glissez-déposez un fichier XLSX ici pour l'importer
              </p>
              <p className="ant-upload-hint">
                Seuls les fichiers .xlsx sont acceptés.
              </p>
            </Upload.Dragger>
          </Form.Item>
          {newMatchedGradeClassItems && (
            <Table
              title={() => (
                <header className="flex pb-1 px-2">
                  <Space>
                    <Typography.Title
                      type="secondary"
                      level={5}
                      style={{ marginBottom: 0, textTransform: "uppercase" }}
                    >
                      Aperçu de notes
                    </Typography.Title>
                  </Space>
                  <div className="flex-1" />
                  <Space>
                    <Form.Item
                      name="session"
                      label="Session"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez sélectionner la session",
                        },
                      ]}
                      layout="horizontal"
                      style={{marginBottom:0}}
                    >
                      <Select
                        variant="filled"
                        placeholder="Session"
                        options={[
                          { value: "main_session", label: "Principale" },
                          { value: "retake_session", label: "Rattrapage" },
                        ]}
                        style={{ width: 110 }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="moment"
                      label="Moment"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez sélectionner le moment",
                        },
                      ]}
                      layout="horizontal"
                       style={{marginBottom:0}}
                    >
                      <Select
                        variant="filled"
                        placeholder="Moment"
                        options={[
                          { value: "before_appeal", label: "Avant recours" },
                          { value: "after_appeal", label: "Après recours" },
                        ]}
                        style={{ width: 128 }}
                      />
                    </Form.Item>
                    {/* <Button
                      icon={
                        !isLoadingGradeClasses ? (
                          <ReloadOutlined />
                        ) : (
                          <LoadingOutlined />
                        )
                      }
                      title="Rafraichir les notes"
                      onClick={async () => await refetchGradeClasses()}
                      type="text"
                    /> */}
                  </Space>
                </header>
              )}
              dataSource={newMatchedGradeClassItems}
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
                    `${record.student?.year_enrollment.user.first_name} ${record.student?.year_enrollment.user.last_name} ${record.student?.year_enrollment.user.surname}`,
                  ellipsis: true,
                },
                {
                  key: "cc",
                  dataIndex: "cc",
                  title: "C. continu",
                  render: (_, record) => (
                    <InputGrade
                      value={record.continuous_assessment}
                      onChange={(value) => {
                        const updatedItems = [
                          ...(newMatchedGradeClassItems ?? []),
                        ];
                        const index = updatedItems.findIndex(
                          (item) => item.student?.id === record.student?.id
                        );
                        if (index !== -1) {
                          updatedItems[index] = {
                            ...updatedItems[index],
                            continuous_assessment: value,
                          };
                          setNewMatchedGradeClassItems(updatedItems);
                        }
                      }}
                      disabled={!record.student}
                    />
                  ),
                  width: 90,
                },
                {
                  key: "exam",
                  dataIndex: "exam",
                  title: "Examen",
                  render: (_, record) => (
                    <InputGrade
                      value={record.exam}
                      onChange={(value) => {
                        const updatedItems = [
                          ...(newMatchedGradeClassItems ?? []),
                        ];
                        const index = updatedItems.findIndex(
                          (item) => item.student?.id === record.student?.id
                        );
                        if (index !== -1) {
                          updatedItems[index] = {
                            ...updatedItems[index],
                            exam: value,
                          };
                          setNewMatchedGradeClassItems(updatedItems);
                        }
                      }}
                      disabled={!record.student}
                    />
                  ),
                  width: 90,
                },
                {
                  key: "total",
                  dataIndex: "total",
                  title: "Total",
                  render: (_, record) => (
                    <Typography.Text strong>
                      {typeof record.continuous_assessment === "number" &&
                      typeof record.exam === "number"
                        ? `${Number(
                            record.continuous_assessment + record.exam
                          ).toFixed(2)}`
                        : ""}
                    </Typography.Text>
                  ),
                  width: 52,
                  align: "right",
                },
                {
                  key: "is_retaken",
                  dataIndex: "is_retaken",
                  title: "Retake?",
                  render: (_, record) => (
                    <Checkbox
                      checked={record.is_retaken}
                      onChange={(e) => {
                        const updatedItems = [
                          ...(newMatchedGradeClassItems ?? []),
                        ];
                        const index = updatedItems.findIndex(
                          (item) => item.student?.id === record.student?.id
                        );
                        if (index !== -1) {
                          updatedItems[index] = {
                            ...updatedItems[index],
                            is_retaken: e.target.checked,
                          };
                          setNewMatchedGradeClassItems(updatedItems);
                        }
                      }}
                    />
                  ),
                  width: 68,
                  align: "center",
                },
                {
                  key: "status",
                  dataIndex: "status",
                  title: "Statut",
                  render: (_, record) => (
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "validated",
                            label: "Validée",
                            icon: <CheckCircleOutlined />,
                            style: { color: colorSuccess },
                          },
                          {
                            key: "pending",
                            label: "En attente",
                            icon: <HourglassOutlined />,
                            style: { color: colorWarning },
                          },
                        ],
                        onClick: ({ key }) => {
                          const updatedItems = [
                            ...(newMatchedGradeClassItems ?? []),
                          ];
                          const index = updatedItems.findIndex(
                            (item) => item.student?.id === record.student?.id
                          );
                          if (index !== -1) {
                            updatedItems[index] = {
                              ...updatedItems[index],
                              status: key as "validated" | "pending",
                            };
                            setNewMatchedGradeClassItems(updatedItems);
                          }
                        },
                      }}
                      arrow
                    >
                      <Tag
                        color={
                          record.status === "validated" ? "success" : "warning"
                        }
                        bordered={false}
                        style={{ width: "100%", padding: "4px 8px" }}
                        icon={
                          record.status === "validated" ? (
                            <CheckCircleOutlined
                              style={{ color: colorSuccess }}
                            />
                          ) : (
                            <HourglassOutlined />
                          )
                        }
                      >
                        {record.status === "validated"
                          ? "Validée"
                          : "En attente"}
                      </Tag>
                    </Dropdown>
                  ),
                  width: 128,
                },
                {
                  key: "actions",
                  dataIndex: "actions",
                  title: "",
                  render: (_, record) => (
                    <DeleteSingleGradeButton
                      onDelete={() => {
                        const updatedItems = [
                          ...(newMatchedGradeClassItems ?? []),
                        ];
                        const index = updatedItems.findIndex(
                          (item) => item.student?.id === record.student?.id
                        );
                        if (index !== -1) {
                          updatedItems.splice(index, 1);
                          setNewMatchedGradeClassItems(updatedItems);
                        }
                      }}
                    />
                  ),
                  width: 48,
                },
              ]}
              size="small"
              pagination={false}
            />
          )}
        </Form>
      </Drawer>
    </>
  );
};
