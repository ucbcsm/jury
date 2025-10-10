"use client";

import {
  getCurrentPeriodsAsOptions,
  getPeriodEnrollmentsWithAll,
} from "@/lib/api";
import { createAnnoucementWithSome } from "@/lib/api";
import { getHSLColor } from "@/lib/utils";
import { Class, Department, Period, PeriodEnrollment } from "@/types";
import {
  BulbOutlined,
  CloseOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Empty,
  Flex,
  Form,
  message,
  Row,
  Select,
  Space,
  Spin,
  Table,
  theme,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import { Options, useQueryState } from "nuqs";
import { FC, useState } from "react";

type NewAnnoucementWithSomeFormProps = {
  department?: Department;
  classYear?: Class;
  yearId?: number;
  periods?: Period[];
  open: boolean;
  setOpen: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

type FormDataType = {
  session: "main_session" | "retake_session";
  moment: "before_appeal" | "after_appeal";
  status: "locked" | "unlocked";
  period_id: number;
};

export const NewAnnoucementWithSomeForm: FC<
  NewAnnoucementWithSomeFormProps
> = ({ department, classYear, yearId, periods, open, setOpen }) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const { juryId, facultyId, departmentId, classId } = useParams();
  const [periodId, setPeriodId] = useQueryState("period");
  const [selectedRows, setSelectedRows] = useState<PeriodEnrollment[]>([]);

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createAnnoucementWithSome,
  });

  const onClose = () => {
    setSelectedRows([]);
    setPeriodId(null);
    form.resetFields();
    setOpen(false);
  };

  const {
    data: periodEnrollments,
    isPending: isPendingPeriodEnrollments,
    isError: isErrorPeriodEnrollments,
  } = useQuery({
    queryKey: [
      "period_enrollments",
      yearId,
      facultyId,
      departmentId,
      classId,
      periodId,
      "validated",
    ],
    queryFn: ({ queryKey }) =>
      getPeriodEnrollmentsWithAll({
        yearId: Number(yearId),
        facultyId: Number(facultyId),
        periodId: Number(periodId),
        departmentId: Number(departmentId),
        classId: Number(classId),
        status: "validated",
      }),
    enabled:
      !!yearId &&
      !!facultyId &&
      !!departmentId &&
      !!classId &&
      !!(periodId !== null),
  });

  const onFinish = (values: FormDataType) => {
    if (selectedRows.length === 0) {
      messageApi.error("Veuillez sélectionner au moins un étudiant.");
    } else {
      const selectedPeriodEnrollmentIds = selectedRows.map((item) => item.id);
      mutateAsync(
        {
          selectedPeriodEnrollmentIds: selectedPeriodEnrollmentIds,
          jury: Number(juryId),
          period: Number(periodId),
          academic_year: Number(yearId),
          faculty: Number(facultyId),
          departement: Number(departmentId),
          class_year: Number(classId),
          session: values.session,
          moment: values.moment,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["announcements"],
            });
            messageApi.success("Publication Créée avec succès !");
            setOpen(false);
          },
          onError: (error: Error) => {
            messageApi.error(
              (error as any)?.response?.data?.message ||
                "Une erreur s'est produite lors de la création de la publication."
            );
          },
        }
      );
    }
  };

  const SelectedPeriod = ({
    variant,
  }: {
    variant?: "filled" | "outlined" | "borderless";
  }) => {
    return (
      <Select
        placeholder="Sélectionnner une période"
        variant={variant || "filled"}
        options={getCurrentPeriodsAsOptions(periods)}
        onChange={(value) => {
          setSelectedRows([]);
          setPeriodId(value.toString());
        }}
        value={periodId !== null ? Number(periodId) : undefined}
        allowClear
        onClear={() => {
          setPeriodId(null);
        }}
      />
    );
  };

  return (
    <>
      {contextHolder}
      <Drawer
        title="Nouvelle publication"
        extra={
          <Button
            icon={<CloseOutlined />}
            type="text"
            onClick={onClose}
            disabled={isPending}
          />
        }
        open={open}
        onClose={onClose}
        closable={false}
        maskClosable={false}
        destroyOnHidden
        footer={
          <Flex justify="space-between" gap={8}>
            <Typography.Title
              type="success"
              level={5}
              style={{ marginBottom: 0 }}
            >
              {selectedRows.length} étudiant(s) sélectionné(s)
            </Typography.Title>
            <Space>
              <Button
                onClick={onClose}
                style={{ boxShadow: "none" }}
                disabled={isPending}
              >
                Annuler
              </Button>
              <Button
                type="primary"
                disabled={isPending || selectedRows.length === 0}
                loading={isPending}
                onClick={() => {
                  form.submit();
                }}
                style={{ boxShadow: "none" }}
              >
                Démarrer
              </Button>
            </Space>
          </Flex>
        }
        styles={{ header: { background: colorPrimary, color: "#fff" } }}
        width={"100%"}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "auto",
            display: !isPending ? "block" : "none",
          }}
        >
          <Row gutter={[24, 24]}>
            <Col span={6}>
              <Alert
                type="info"
                icon={<BulbOutlined />}
                message="Instructions"
                description={
                  <>
                    <div>
                      Commencez par sélectionner la période pour charger les
                      étudiants, puis sélectionnez les étudiants concernés.
                      Enfin, cliquez sur "Démarrer".
                    </div>
                  </>
                }
                showIcon
                // closable
                style={{ marginBottom: 24 }}
              />
            </Col>
            <Col span={12}>
              <Card>
                <Table
                  title={() => (
                    <header className="flex pb-3">
                      <Space>
                        <Typography.Title level={5} style={{ marginBottom: 0 }}>
                          Étudiants
                        </Typography.Title>
                      </Space>
                      <div className="flex-1" />
                      <Space>
                        <Typography.Text>Période:</Typography.Text>
                        <SelectedPeriod />
                      </Space>
                    </header>
                  )}
                  dataSource={periodEnrollments}
                  loading={isPendingPeriodEnrollments && periodId !== null}
                  pagination={false}
                  columns={[
                    {
                      title: "Photo",
                      dataIndex: "avatar",
                      key: "avatar",
                      render: (_, record) => (
                        <Avatar
                          src={record.year_enrollment.user.avatar || null}
                          style={{
                            backgroundColor: getHSLColor(
                              `${record.year_enrollment.user.first_name} ${record.year_enrollment.user.last_name} ${record.year_enrollment.user.surname}`
                            ),
                          }}
                        >
                          {record.year_enrollment.user.first_name
                            ?.charAt(0)
                            .toUpperCase()}
                          {record.year_enrollment.user.last_name
                            ?.charAt(0)
                            .toUpperCase()}
                        </Avatar>
                      ),
                      width: 56,
                    },
                    {
                      title: "Matricule",
                      dataIndex: "matricule",
                      key: "matricule",
                      render: (_, record) =>
                        `${record.year_enrollment.user.matricule}`,
                      width: 80,
                      align: "right",
                    },
                    {
                      title: "Noms",
                      dataIndex: "name",
                      key: "name",
                      render: (_, record) =>
                        `${record.year_enrollment.user.first_name} ${record.year_enrollment.user.last_name} ${record.year_enrollment.user.surname}`,
                      ellipsis: true,
                    },
                    {
                      title: "Promotion",
                      dataIndex: "promotion",
                      render: (_, record, __) =>
                        `${record.year_enrollment.class_year.acronym} ${record.year_enrollment.departement.name}`,
                      key: "class",
                    },
                    {
                      title: "Période",
                      dataIndex: "period",
                      key: "period",
                      render: (_, record, __) =>
                        `${record.period.acronym} (${record.period.name})`,
                      ellipsis: true,
                    },
                  ]}
                  size="small"
                  rowKey="id"
                  scroll={{ y: "calc(100vh - 312px)" }}
                  rowClassName="hover:cursor-pointer"
                  rowSelection={{
                    type: "checkbox",
                    selectedRowKeys: selectedRows.map((item) => item.id),
                    onChange: (_, selectedRows) => {
                      setSelectedRows(selectedRows);
                    },
                  }}
                  onRow={(record) => ({
                    onClick: () => {
                      const exist = selectedRows.some(
                        (item) => item.id === record.id
                      );
                      if (exist) {
                        setSelectedRows((prev) =>
                          prev.filter((item) => item.id !== record.id)
                        );
                      } else {
                        setSelectedRows((prev) => [...prev, record]);
                      }
                    },
                  })}
                  locale={{
                    emptyText:
                      periodId === null ? (
                        <div className="px-7 py-20">
                          <SelectedPeriod variant="filled" />
                        </div>
                      ) : isErrorPeriodEnrollments ? (
                        <div className="px-7 py-20">
                          <Typography.Text>
                            Erreur de chargement des étudiants.
                          </Typography.Text>
                        </div>
                      ) : undefined,
                  }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Form form={form} onFinish={onFinish}>
                <Descriptions
                  title="Détails"
                  bordered
                  size="small"
                  column={1}
                  items={[
                    {
                      key: "faculty",
                      label: "Filière",
                      children: department?.faculty.name || "",
                    },
                    {
                      key: "department",
                      label: "Mention",
                      children: department?.name || "",
                    },
                    {
                      key: "class",
                      label: "Promotion",
                      children: classYear?.acronym,
                    },
                    {
                      key: "selected_students",
                      label: "Étudiants sélectionnés",
                      children: selectedRows.length,
                    },
                  ]}
                />

                <div className="mt-6">
                  <Form.Item
                    name="session"
                    label="Session"
                    rules={[{ required: true }]}
                  >
                    <Select
                      variant="filled"
                      placeholder="Session"
                      options={[
                        { value: "main_session", label: "Principale" },
                        { value: "retake_session", label: "Rattrapage" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    name="moment"
                    label="Moment"
                    rules={[{ required: true }]}
                  >
                    <Select
                      variant="filled"
                      placeholder="Moment"
                      options={[
                        { value: "before_appeal", label: "Avant recours" },
                        { value: "after_appeal", label: "Après recours" },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    name="status"
                    label="Statut"
                    rules={[{ required: true }]}
                    initialValue="locked"
                  >
                    <Select
                      variant="filled"
                      placeholder="Statut"
                      options={[
                        { value: "locked", label: "Verrouillé" },
                        { value: "unlocked", label: "Ouvert" },
                      ]}
                    />
                  </Form.Item>
                </div>
              </Form>
            </Col>
          </Row>
        </div>
        <div
          className="h-[calc(100vh-196px)] flex-col justify-center items-center"
          style={{ display: !isPending ? "none" : "flex" }}
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <Typography.Title
            type="secondary"
            level={3}
            style={{ marginTop: 10 }}
          >
            Calcul en cours ...
          </Typography.Title>
          <Typography.Text type="secondary">
            Cette opération peut prendre plus de temps selon les cas.
          </Typography.Text>
          <Typography.Text type="secondary">
            Veuillez donc patienter!
          </Typography.Text>
        </div>
      </Drawer>
    </>
  );
};
