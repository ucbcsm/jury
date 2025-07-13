"use client";

import { FC, useState } from "react";
import {
  Alert,
  Button,
  Drawer,
  Form,
  message,
  Modal,
  Space,
  Select,
  theme,
  Typography,
  Row,
  Col,
  Flex,
  Card,
  Statistic,
  Dropdown,
} from "antd";
import { parseAsBoolean, useQueryState } from "nuqs";
import {
  BulbOutlined,
  CloseOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Class,
  Department,
  Enrollment,
  Period,
  PeriodEnrollment,
} from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPeriodEnrollment, getCurrentPeriodsAsOptions } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { Palette } from "@/components/palette";
import { ListNewPeriodEnrollments } from "./list-new-enrollment";
import { ItemType } from "antd/es/menu/interface";

type NewPeriodEnrollmentFormProps = {
  periodsAsMenu?: ItemType[] | undefined;
  periods?: Period[];
  yearEnrollments?: Enrollment[]; // liste des étudiants non-inscrits à la période
  periodEnrollments?: PeriodEnrollment[]; // liste des étudiants déja inscrits à la période
  departments?: Department[];
  classes?: Class[]; // Promotions
};

export const NewPeriodEnrollmentForm: FC<NewPeriodEnrollmentFormProps> = ({
  periodsAsMenu,
  yearEnrollments,
  periodEnrollments,
  periods,
  departments,
  classes,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { facultyId, periodId } = useParams();
  const router = useRouter();
  const [openNewEnrollments, setOpenNewEnrollments] = useQueryState(
    "new_enrollments",
    parseAsBoolean.withDefault(false)
  );
  const [cancel, setCancel] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [departmentFilterValueId, setDepartmentFilterValueId] =
    useState<number>(0);
  const [classFilterValueId, setClassFilterValueId] = useState<number>(0);
  const queryClient = useQueryClient();

  const onClose = () => {
    setOpenNewEnrollments(false);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createPeriodEnrollment,
  });

  const getSelectedPeriod = (periodId: number) => {
    return periods?.find((p) => p.id === periodId);
  };

  const onFinish = (values: {
    period_id: number;
    status: "pending" | "validated" | "rejected";
  }) => {
    mutateAsync(
      {
        year_enrollments_ids: selectedRowKeys as number[],
        period_id: values.period_id,
        status: values.status,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["period_enrollments"],
          });
          messageApi.success("Étudiants inscrits à la période avec succès !");
          setSelectedRowKeys([]);
          setClassFilterValueId(0);
          setDepartmentFilterValueId(0);
          form.resetFields();
          setOpenNewEnrollments(false);
        },
        onError: () => {
          messageApi.error(
            "Erreur lors de l'inscription à la période. Veuillez réessayer."
          );
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Dropdown
        menu={{
          items: [...periodsAsMenu!],
          onClick: ({ key }) => {
            router.push(
              `/faculty/${facultyId}/students/${key}/?new_enrollments=true`
            );
          },
        }}
      >
        <Button
          //  title="Inscrire des étudiants à une période pédagogique"
          type="primary"
          icon={<UserAddOutlined />}
          style={{ boxShadow: "none" }}
        >
          Inscription périodique
        </Button>
      </Dropdown>

      <Drawer
        styles={{ header: { background: colorPrimary, color: "#fff" } }}
        width={`100%`}
        title={
          <Space>
            Formulaire d&apos;inscription à la période :{" "}
            <Typography.Title
              level={5}
              type="success"
              style={{ marginBottom: 0 }}
            >
              {getSelectedPeriod(Number(periodId))?.name ?? ""}
            </Typography.Title>
          </Space>
        }
        onClose={onClose}
        open={openNewEnrollments}
        closable={false}
        destroyOnHidden
        extra={
          <Space>
            <Button
              style={{ boxShadow: "none", color: "#fff" }}
              onClick={() => setCancel(true)}
              icon={<CloseOutlined />}
              type="text"
            />
            <Modal
              title="Annuler l'inscription"
              open={cancel}
              onOk={() => {
                setOpenNewEnrollments(false);
                form.resetFields();
                setCancel(false);
                setSelectedRowKeys([]);
                setClassFilterValueId(0);
                setDepartmentFilterValueId(0);
              }}
              okButtonProps={{ style: { boxShadow: "none" } }}
              cancelButtonProps={{ style: { boxShadow: "none" } }}
              onCancel={() => setCancel(false)}
              centered
            >
              <Alert
                message="Êtes-vous sûr de vouloir annuler cette inscription ?"
                description="Toutes les informations saisies seront perdues."
                type="warning"
                showIcon
                style={{ marginBottom: 16, border: 0 }}
              />
            </Modal>
          </Space>
        }
      >
        <div style={{ maxWidth: 1400, margin: "auto" }}>
          <Alert
            type="info"
            icon={<BulbOutlined />}
            message="Instructions d'inscription"
            description={
              <>
                <div>
                  Sélectionnez un ou plusieurs étudiants à inscrire à cette
                  période pédagogique.
                </div>
                <div style={{ marginTop: 8 }}>
                  Précisez également le <b>statut de l'inscription</b> pour
                  l&apos;ensemble de la sélection : <i>En attente</i>,{" "}
                  <i>Validé</i> ou <i>Réjeté</i>.
                </div>
              </>
            }
            showIcon
            closable
            style={{ marginBottom: 24 }}
          />
          <Row gutter={[24, 24]}>
            <Col span={16}>
              <Card>
                <ListNewPeriodEnrollments
                  yearEnrollments={yearEnrollments}
                  periodEnrollments={periodEnrollments}
                  departments={departments}
                  classes={classes}
                  selectedRowKeys={selectedRowKeys}
                  setSelectedRowKeys={setSelectedRowKeys}
                  departmentFilterValueId={departmentFilterValueId}
                  setDepartmentFilterValueId={setDepartmentFilterValueId}
                  classFilterValueId={classFilterValueId}
                  setClassFilterValueId={setClassFilterValueId}
                />
              </Card>
              <div
                style={{
                  display: "flex",
                  padding: "24px 0",
                }}
              >
                <Typography.Text type="secondary">
                  © {new Date().getFullYear()} CI-UCBC. Tous droits réservés.
                </Typography.Text>
                <div className="flex-1" />
                <Space>
                  <Palette />
                </Space>
              </div>
            </Col>
            <Col span={8}>
              <Flex vertical gap={16}>
                <Card>
                  <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                      label="Période"
                      name="period_id"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      initialValue={Number(periodId)}
                    >
                      <Select
                        showSearch
                        placeholder="Sélectionnez des périodes"
                        options={getCurrentPeriodsAsOptions(periods)}
                        disabled
                      />
                    </Form.Item>
                    <Form.Item
                      label="Statut de l'inscription"
                      name="status"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      initialValue={"validated"}
                    >
                      <Select
                        placeholder=""
                        disabled={isPending}
                        options={[
                          { value: "pending", label: "En attente" },
                          { value: "validated", label: "Validé" },
                          { value: "rejected", label: "Réjeté" },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isPending}
                        style={{ boxShadow: "none" }}
                        block
                        disabled={isPending || selectedRowKeys.length === 0}
                      >
                        Sauvegarder
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
                <Card>
                  <Statistic
                    loading={isPending}
                    title="Sélections"
                    value={selectedRowKeys?.length}
                  />
                </Card>
              </Flex>
            </Col>
          </Row>
        </div>
      </Drawer>
    </>
  );
};
