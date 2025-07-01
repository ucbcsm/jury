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
} from "antd";
import { parseAsBoolean, useQueryState } from "nuqs";
import {
  BulbOutlined,
  CloseOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Class, CourseEnrollment, Department, PeriodEnrollment, TaughtCourse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourseEnrollment, getTaughtCoursAsOptions } from "@/lib/api";
import { useParams } from "next/navigation";
import { ListNewCourseEnrollments } from "./list-new-enrollments";
import { Palette } from "@/components/palette";
import { filterOption } from "@/lib/utils";

type NewCourseEnrollmentFormProps = {
  course?: TaughtCourse;
  periodEnrollments?: PeriodEnrollment[];
  courseEnrollments?:CourseEnrollment[]
  departments?: Department[];
    classes?: Class[]; // Promotions
};

export const NewCourseEnrollmentForm: FC<NewCourseEnrollmentFormProps> = ({
  course,
  periodEnrollments,
  courseEnrollments,
  departments,
  classes
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { courseId } = useParams();
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
    mutationFn: createCourseEnrollment,
  });

  const onFinish = (values: {
    course_id: number;
    status: "pending" | "validated" | "rejected";
  }) => {
    const data = selectedRowKeys.map((key) => ({
      student: key as number,
      courses: [values.course_id],
      status: values.status,
    }));
    mutateAsync(
      {
        payload: data,
      },
      {
        onSuccess: () => {
          messageApi.success("Étudiants inscrits au cours avec succès !");
          queryClient.invalidateQueries({
            queryKey: ["course_enrollments", courseId],
          });
          setSelectedRowKeys([]);
          setClassFilterValueId(0);
          setDepartmentFilterValueId(0);
          form.resetFields();
          setOpenNewEnrollments(false);
        },
        onError: () => {
          messageApi.error("Erreur lors de l'inscription. Veuillez réessayer.");
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Button
        title="Inscrire les étudiants à ce cours"
        type="primary"
        icon={<UserAddOutlined />}
        style={{ boxShadow: "none" }}
        onClick={() => setOpenNewEnrollments(true)}
      >
        Inscrire
      </Button>
      <Drawer
        styles={{ header: { background: colorPrimary, color: "#fff" } }}
        width={`100%`}
        title={
          <Space>
            Formulaire d&apos;inscription au cours :{" "}
            <Typography.Title
              level={5}
              type="success"
              style={{ marginBottom: 0 }}
            >
              {course?.available_course.name ?? ""}
            </Typography.Title>
          </Space>
        }
        onClose={onClose}
        open={openNewEnrollments}
        closable={false}
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
                message="Êtes-vous sûr de vouloir annuler cette inscription ?"
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
                  Sélectionnez un ou plusieurs étudiants à inscrire à ce cours.
                </div>
                <div>
                  <b>Remarque&nbsp;:</b> seuls les étudiants déjà inscrits à la
                  période dans laquelle ce cours est programmé peuvent être
                  ajoutés.
                </div>
                <div style={{ marginTop: 8 }}>
                  Précisez également le <b>statut de l'inscription</b> pour
                  l'ensemble de la sélection : <i>En attente</i>, <i>Validé</i>{" "}
                  ou <i>Réjeté</i>.
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
                <ListNewCourseEnrollments
                  periodEnrollments={periodEnrollments}
                  courseEnrollements={courseEnrollments}
                  selectedRowKeys={selectedRowKeys}
                  setSelectedRowKeys={setSelectedRowKeys}
                  departmentFilterValueId={departmentFilterValueId}
                  setDepartmentFilterValueId={setDepartmentFilterValueId}
                  classFilterValueId={classFilterValueId}
                  setClassFilterValueId={setClassFilterValueId}
                  departments={departments}
                  classes={classes}
                />
              </Card>

              <div
                style={{
                  display: "flex",
                  // background: colorBgContainer,
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
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                  >
                    <Form.Item
                      label="Cours"
                      name="course_id"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      initialValue={course?.id}
                    >
                      <Select
                        showSearch
                        placeholder=""
                        disabled
                        options={course&&getTaughtCoursAsOptions([{...course}])}
                        filterOption={filterOption}
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
                    title="Séléctions"
                    value={selectedRowKeys.length}
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
