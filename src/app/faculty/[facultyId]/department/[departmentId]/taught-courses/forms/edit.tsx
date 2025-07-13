"use client";

import { FC, useEffect } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Flex,
  Form,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  theme,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import {
  Course,
  Department,
  Period,
  Teacher,
  TeachingUnit,
  TaughtCourse,
  Classroom,
} from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateTaughtCourse,
  getCoursesAsOptions,
  getCurrentDepartmentsAsOptions,
  getCurrentFacultiesAsOptions,
  getCurrentPeriodsAsOptions,
  getTeachersAsOptions,
  getTeachingUnitsAsOptions,
  getClassroomsAsOptionsWithDisabled,
} from "@/lib/api";
import { Palette } from "@/components/palette";
import dayjs from "dayjs";
import { useYid } from "@/hooks/use-yid";
import { filterOption } from "@/lib/utils";

type EditTaughtCourseFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  taughtCourse: TaughtCourse | null;
  departments?: Department[];
  courses?: Course[];
  teachers?: Teacher[];
  periods?: Period[];
  teachingUnits?: TeachingUnit[];
  classrooms?: Classroom[];
};

export const EditTaughtCourseForm: FC<EditTaughtCourseFormProps> = ({
  open,
  setOpen,
  taughtCourse,
  departments,
  courses,
  teachers,
  periods,
  teachingUnits,
  classrooms,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { yid } = useYid();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateTaughtCourse(id, data),
  });

  useEffect(() => {
    if (open && taughtCourse) {
      form.setFieldsValue({
        available_course_id: taughtCourse.available_course?.id,
        teaching_unit_id: taughtCourse.teaching_unit?.id,
        credit_count: taughtCourse.credit_count,
        max_value: taughtCourse.max_value,
        theoretical_hours: taughtCourse.theoretical_hours,
        practical_hours: taughtCourse.practical_hours,
        period_id: taughtCourse.period?.id,
        faculty_id: taughtCourse.faculty?.id,
        departments_ids: taughtCourse.departements.map(dep=>dep.id),
        start_date: taughtCourse.start_date
          ? dayjs(taughtCourse.start_date)
          : null,
        end_date: taughtCourse.end_date ? dayjs(taughtCourse.end_date) : null,
        teacher_id: taughtCourse.teacher?.id,
        status: taughtCourse.status,
        assistants: taughtCourse.assistants?.map((a) => a.id),
        class_room_id: taughtCourse.class_room?.id,
      });
    } else {
      form.resetFields();
    }
  }, [open, taughtCourse, form]);

  const onClose = () => {
    setOpen(false);
  };

  const onFinish = (values: any) => {
    if (!taughtCourse) return;
    mutateAsync(
      { id: taughtCourse.id, data: { ...values, academic_year_id: yid, faculty_id:taughtCourse.faculty.id } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["taught_courses"] });
          messageApi.success("Cours programmé modifié avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification du cours programmé."
          );
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Drawer
        styles={{ header: { background: colorPrimary, color: "#fff" } }}
        width={`100%`}
        title="Modification d'un cours programmé"
        onClose={onClose}
        open={open}
        closable={false}
        extra={
          <Space>
            <Button
              style={{ boxShadow: "none", color: "#fff" }}
              onClick={onClose}
              icon={<CloseOutlined />}
              type="text"
            />
          </Space>
        }
      >
        <Flex vertical gap={16} style={{ maxWidth: 520, margin: "auto" }}>
          <Alert
            type="info"
            message="Vous pouvez modifier les informations du cours programmé."
            description="Mettez à jour les champs nécessaires puis cliquez sur « Enregistrer » pour valider les modifications."
            showIcon
            closable
          />
          <Card
            title="Informations sur le cours programmé"
            variant="borderless"
            style={{ boxShadow: "none" }}
          >
            <Form
              form={form}
              name="form_edit-taught-course"
              initialValues={{}}
              onFinish={onFinish}
              disabled={isPending}
            >
              <Form.Item
                name="available_course_id"
                label="Cours"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner un cours.",
                  },
                ]}
              >
                <Select
                  options={getCoursesAsOptions(courses)}
                  allowClear
                  showSearch
                  filterOption={filterOption}
                />
              </Form.Item>
              <Form.Item
                name="teaching_unit_id"
                label="Unité d'enseignement"
                rules={[
                  // {
                  //   required: true,
                  //   message: "Veuillez sélectionner une unité d'enseignement.",
                  // },
                ]}
              >
                <Select
                  options={getTeachingUnitsAsOptions(teachingUnits)}
                  allowClear
                  showSearch
                  filterOption={filterOption}
                />
              </Form.Item>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item name="credit_count" label="Nombre de crédits">
                    <InputNumber
                      type="number"
                      min={0}
                      placeholder="Nombre de crédits"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="max_value" label="Max">
                    <InputNumber type="number" min={0} placeholder="" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item name="theoretical_hours" label="Heures théoriques">
                    <InputNumber type="number" min={0} suffix="H" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="practical_hours" label="Heures pratiques">
                    <InputNumber type="number" min={0} suffix="H" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="period_id"
                label="Période"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner une période.",
                  },
                ]}
              >
                <Select
                  options={getCurrentPeriodsAsOptions(periods)}
                  allowClear
                  showSearch
                  filterOption={filterOption}
                />
              </Form.Item>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name="departments_ids"
                    label="Départements"
                    rules={[
                      {
                        required: true,
                        message: "Veuillez sélectionner les départements.",
                      },
                    ]}
                  >
                    <Select
                      options={getCurrentDepartmentsAsOptions(departments)}
                      allowClear
                      showSearch
                      mode="multiple"
                      filterOption={filterOption}
                      // onChange={(value) => {
                      //   const selectedDepartment = departments?.find(
                      //     (department) => department.id === value
                      //   );
                      //   form.setFieldValue(
                      //     "faculty_id",
                      //     selectedDepartment?.faculty.id
                      //   );
                      // }}
                    />
                  </Form.Item>
                </Col>
                {/* <Col span={12}>
                  <Form.Item
                    name="faculty_id"
                    label="Faculté"
                    rules={[
                      {
                        required: true,
                        message: "Veuillez sélectionner une faculté.",
                      },
                    ]}
                  >
                    <Select
                      options={getCurrentFacultiesAsOptions(faculties)}
                      allowClear
                      showSearch
                      filterOption={filterOption}
                      disabled
                    />
                  </Form.Item>
                </Col> */}
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item name="start_date" label="Date de début">
                    <DatePicker type="date" format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="end_date" label="Date de fin">
                    <DatePicker type="date" format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="teacher_id" label="Enseignant" rules={[]}>
                <Select
                  options={getTeachersAsOptions(teachers)}
                  allowClear
                  showSearch
                  filterOption={filterOption}
                />
              </Form.Item>
              <Form.Item name="assistants" label="Assistants" rules={[]}>
                <Select
                  options={getTeachersAsOptions(teachers)}
                  showSearch
                  filterOption={filterOption}
                  mode="multiple"
                />
              </Form.Item>
              <Form.Item
                name="class_room_id"
                label="Salle de classe"
                rules={[]}
              >
                <Select
                  options={getClassroomsAsOptionsWithDisabled(classrooms)}
                  showSearch
                  filterOption={filterOption}
                  allowClear
                />
              </Form.Item>
              <Form.Item name="status" label="Statut des inscriptions">
                <Select
                  options={[
                    { value: "pending", label: "En attente" },
                    { value: "progress", label: "En cours" },
                    { value: "finished", label: "Terminé" },
                    { value: "suspended", label: "Suspendu" },
                  ]}
                />
              </Form.Item>
              <Flex justify="space-between" align="center">
                <Palette />
                <Form.Item
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingTop: 20,
                  }}
                >
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isPending}
                      style={{ boxShadow: "none" }}
                    >
                      Enregistrer
                    </Button>
                  </Space>
                </Form.Item>
              </Flex>
            </Form>
          </Card>
        </Flex>
      </Drawer>
    </>
  );
};
