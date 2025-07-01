"use client";

import { FC, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Drawer,
  Flex,
  Form,
  message,
  Modal,
  Row,
  Space,
  theme,
  DatePicker,
  Descriptions,
  Tag,
  TimePicker,
  Statistic,
  Progress,
  Typography,
} from "antd";
import { parseAsBoolean, useQueryState } from "nuqs";
import { BulbOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { AttendanceListItem, Course, CourseEnrollment, TaughtCourse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAttendanceList,
  getAttendanceAbsentCount,
  getAttendanceAbsentPercentage,
  getAttendanceItemsFromCourseEnrollments,
  getAttendanceJustifiedCount,
  getAttendanceJustifiedPercentage,
  getAttendancePresentCount,
  getAttendancePresentPercentage,
  getCourseTypeName,
  getTeachingUnitCategoryName,
  getYearStatusName,
} from "@/lib/api";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import { ListAttendanceListItem } from "./list";
import { useSessionStore } from "@/store";
import { Palette } from "@/components/palette";

type NewAttendanceListFormProps = {
  course?: TaughtCourse;
  courseEnrollements?: CourseEnrollment[]
};

export const NewAttendanceListForm: FC<NewAttendanceListFormProps> = ({
  course,
  courseEnrollements
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { courseId } = useParams();
  const [newAttendance, setNewAttendance] = useQueryState(
    "new_attendance",
    parseAsBoolean.withDefault(false)
  );
  const [cancel, setCancel] = useState<boolean>(false);
  const [attendanceItems, setAttendanceItems] = useState<
    Omit<AttendanceListItem, "id" & { id?: number }>[]
  >([]);
  const queryClient = useQueryClient();

  const { user } = useSessionStore();

  const onClose = () => {
    setNewAttendance(false);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createAttendanceList,
  });

  const editAttendanceItemStatus = (
    status: "present" | "absent" | "justified",
    index: number
  ) => {
    const updatedItems = [...attendanceItems];
    const item = attendanceItems?.[index];
    if (course) {
      updatedItems[index] = {
        ...item,
        status: status,
      };
      setAttendanceItems(updatedItems);
    }
  };

  const onFinish = (values: any) => {
    mutateAsync(
      {
        ...values,
        course_id: Number(courseId),
        student_attendance_status: attendanceItems.map((item) => ({
          ...item,
          student: item.student.id,
        })),
        verified_by_user_id: user?.id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["attendances-lists", courseId],
          });
          messageApi.success("Liste de présence créée avec succès !");
          setNewAttendance(false);
          form.resetFields();
          setAttendanceItems(getAttendanceItemsFromCourseEnrollments(courseEnrollements!));
        },
        onError: () => {
          messageApi.error(
            "Erreur lors de la création de la liste de présence."
          );
        },
      }
    );
  };

  useEffect(() => {
    if (courseEnrollements && course) {
      setAttendanceItems(
        getAttendanceItemsFromCourseEnrollments(courseEnrollements!)
      );
    }
  }, [courseEnrollements, course, form]);


  return (
    <>
      {contextHolder}
      <Button
        icon={<PlusOutlined />}
        type="primary"
        style={{ boxShadow: "none" }}
        variant="dashed"
        title="Créer une nouvelle liste de présence"
        onClick={() => setNewAttendance(true)}
      >
        Nouvelle liste
      </Button>
      <Drawer
        styles={{ header: { background: colorPrimary, color: "#fff" } }}
        width={`100%`}
        title="Création d'une liste de présence"
        onClose={onClose}
        open={newAttendance}
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
              title="Annuler la création"
              open={cancel}
              onOk={() => {
                setNewAttendance(false);
                form.resetFields();
                setCancel(false);
                setAttendanceItems([]);
              }}
              okButtonProps={{ style: { boxShadow: "none" } }}
              cancelButtonProps={{ style: { boxShadow: "none" } }}
              onCancel={() => setCancel(false)}
              centered
            >
              <Alert
                message="Êtes-vous sûr de vouloir annuler la création de cette liste de présence ?"
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
            icon={<BulbOutlined/>}
            message="Instructions"
            description={<><div>Indiquez la date, l&apos;heure et marquez avec précision les étudiants présents et absents</div>
            </>}
            showIcon
            closable
            style={{ marginBottom: 24 }}
          />
          <Row gutter={[24, 24]}>
            <Col span={6}>
              <Descriptions
                title="Détails du cours"
                column={1}
                items={[
                  {
                    key: "name",
                    label: "Intitulé",
                    children: course?.available_course.name || "",
                  },
                  {
                    key: "code",
                    label: "Code du cours",
                    children: course?.available_course.code || "",
                  },
                  {
                    key: "category",
                    label: "Catégorie",
                    children:
                      getCourseTypeName(course?.available_course.code!) || "",
                  },
                  {
                    key: "credits",
                    label: "Crédits",
                    children: course?.credit_count || "",
                  },
                  {
                    key: "max",
                    label: "Note maximale",
                    children: course?.max_value || "",
                  },
                  {
                    key: "hours",
                    label: "Heures",
                    children:
                      course?.theoretical_hours! + course?.practical_hours! ||
                      "",
                  },
                  {
                    key: "theoretical_hours",
                    label: "Heures théoriques",
                    children: course?.theoretical_hours || "",
                  },
                  {
                    key: "practical_hours",
                    label: "Heures pratiques",
                    children: course?.practical_hours || "",
                  },
                  {
                    key: "teaching_unit",
                    label: "UE",
                    children: `${course?.teaching_unit?.name} ${
                      course?.teaching_unit?.code &&
                      `(${course?.teaching_unit?.code})`
                    }`,
                  },
                  {
                    key: "teaching_unit_category",
                    label: "Catgorie UE",
                    children: getTeachingUnitCategoryName(
                      course?.teaching_unit?.category!
                    ),
                  },
                  {
                    key: "start_date",
                    label: "Date de début",
                    children: course?.start_date
                      ? new Intl.DateTimeFormat("fr", {
                          dateStyle: "long",
                        }).format(new Date(`${course.start_date}`))
                      : "",
                  },
                  {
                    key: "end_date",
                    label: "Date de fin",
                    children: course?.end_date
                      ? new Intl.DateTimeFormat("fr", {
                          dateStyle: "long",
                        }).format(new Date(`${course.end_date}`))
                      : "",
                  },
                  {
                    key: "status",
                    label: "Statut",
                    children: (
                      <Tag bordered={false}>
                        {getYearStatusName(course?.status!)}
                      </Tag>
                    ),
                  },
                ]}
              />
            </Col>
            <Col span={12}>
              <Card>
                <ListAttendanceListItem
                   items={attendanceItems}
                  editRecordStatus={editAttendanceItemStatus}
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
            <Col span={6}>
              <Flex vertical gap={16}>
                <Card>
                  <Form
                    form={form}
                    name="form_new-attendance-list"
                    initialValues={{
                      date: dayjs(),
                    }}
                    onFinish={onFinish}
                    disabled={isPending}
                    layout="vertical"
                  >
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Form.Item
                          name="date"
                          label="Date de la séance"
                          rules={[
                            {
                              required: true,
                              message: "Veuillez renseigner la date.",
                            },
                          ]}
                        >
                          <DatePicker
                            format="DD/MM/YYYY"
                            placeholder="DD/MM/YYYY"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="time"
                          label="Heure"
                          rules={[
                            {
                              required: true,
                              message: "Veuillez renseigner l'heure.",
                            },
                          ]}
                        >
                          <TimePicker
                            format="HH:mm"
                            style={{ width: "100%" }}
                            placeholder="HH:mm"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isPending}
                        style={{ boxShadow: "none" }}
                        block
                      >
                        Sauvegarder
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
                <Card>
                  <Flex justify="space-between">
                    <Statistic
                      loading={isPending}
                      title="Présences"
                      value={getAttendancePresentCount(attendanceItems)}
                    />

                    <Progress
                      type="circle"
                      percent={getAttendancePresentPercentage(attendanceItems)}
                      size={58}
                      strokeColor="#52c41a"
                    />
                  </Flex>
                </Card>
                <Card>
                  <Flex justify="space-between">
                    <Statistic
                      loading={isPending}
                      title="Absences"
                      value={getAttendanceAbsentCount(attendanceItems)}
                    />

                    <Progress
                      type="circle"
                      percent={getAttendanceAbsentPercentage(attendanceItems)}
                      size={58}
                      strokeColor="#ff4d4f"
                    />
                  </Flex>
                </Card>
                <Card>
                  <Flex justify="space-between">
                    <Statistic
                      loading={isPending}
                      title="Justifications"
                      value={getAttendanceJustifiedCount(attendanceItems)}
                    />

                    <Progress
                      type="circle"
                      percent={getAttendanceJustifiedPercentage(
                        attendanceItems
                      )}
                      size={58}
                      strokeColor="#faad14"
                    />
                  </Flex>
                </Card>
              </Flex>
            </Col>
          </Row>
        </div>
      </Drawer>
    </>
  );
};
