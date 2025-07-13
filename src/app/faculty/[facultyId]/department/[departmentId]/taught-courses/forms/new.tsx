"use client";

import { FC, useState } from "react";
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
  Modal,
  Row,
  Select,
  Space,
  theme,
} from "antd";
import { parseAsBoolean, useQueryState } from "nuqs";

import { CloseOutlined, UserAddOutlined } from "@ant-design/icons";
import {
  Classroom,
  Course,
  Department,
  Faculty,
  Period,
  Teacher,
  TeachingUnit,
} from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTaughtCourse,
  getClassroomsAsOptionsWithDisabled,
  getCoursesAsOptions,
  getCurrentDepartmentsAsOptions,
  getCurrentFacultiesAsOptions,
  getCurrentPeriodsAsOptions,
  getTeachersAsOptions,
  getTeachingUnitsAsOptions,
} from "@/lib/api";
import { Palette } from "@/components/palette";
import { useYid } from "@/hooks/use-yid";
import { filterOption } from "@/lib/utils";

type NewTaughtCourseFormProps = {
  departments?: Department[];
  facultyId: number;
  courses?: Course[];
  teachers?: Teacher[];
  periods?: Period[];
  teachingUnits?: TeachingUnit[];
  classrooms?: Classroom[];
};

export const NewTaughtCourseForm: FC<NewTaughtCourseFormProps> = ({
  departments,
  facultyId,
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
  const [newTaughtCourse, setNewTaughtCourse] = useQueryState(
    "new",
    parseAsBoolean.withDefault(false)
  );
  const { yid } = useYid();
  const [cancel, setCancel] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const onClose = () => {
    setNewTaughtCourse(false);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createTaughtCourse,
  });

  const onFinish = (values: any) => {
    mutateAsync(
      { ...values, academic_year_id: yid, faculty_id: facultyId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["taught_courses"] });
          messageApi.success("Cours programmé avec succès !");
          setNewTaughtCourse(false);
          form.resetFields();
        },
        onError: (error) => {
          messageApi.error(
            "Une erreur s'est produite lors de la création du cours programmé."
          );
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Button
        icon={<UserAddOutlined />}
        type="primary"
        style={{ boxShadow: "none" }}
        variant="dashed"
        title="Programmer un nouveau cours"
        onClick={() => setNewTaughtCourse(true)}
      >
        Programmer un cours
      </Button>
      {/* </Dropdown> */}

      <Drawer
        styles={{ header: { background: colorPrimary, color: "#fff" } }}
        width={`100%`}
        title="Plannification d'un cours"
        onClose={onClose}
        open={newTaughtCourse}
        closable={false}
        extra={
          <Space>
            <Button
              style={{ boxShadow: "none", color: "#fff" }}
              onClick={() => {
                setCancel(true);
              }}
              icon={<CloseOutlined />}
              type="text"
            />
            <Modal
              title="Annuler l'enregistrement"
              open={cancel}
              onOk={() => {
                setNewTaughtCourse(false);
                form.resetFields();
                setCancel(false);
              }}
              okButtonProps={{ style: { boxShadow: "none" } }}
              cancelButtonProps={{ style: { boxShadow: "none" } }}
              onCancel={() => setCancel(false)}
              centered
            >
              <Alert
                message="Êtes-vous sûr de vouloir annuler la planification de ce cours ?"
                description="Toutes les informations saisies pour la programmation de ce cours seront perdues."
                type="warning"
                showIcon
                style={{ marginBottom: 16, border: 0 }}
              />
            </Modal>
          </Space>
        }
      >
        <Flex vertical gap={16} style={{ maxWidth: 520, margin: "auto" }}>
          <Alert
            type="info"
            message="Veuillez fournir toutes les informations nécessaires pour programmer un nouveau cours."
            description="Assurez-vous que les détails du cours (intitulé, horaires, enseignants, et étudiants concernés) sont complets et exacts avant de valider la planification."
            showIcon
            closable
          />
          <Card
            title=" Informations sur le cours à programmer"
            variant="borderless"
            style={{ boxShadow: "none" }}
          >
            <Form
              form={form}
              name="form_new-taught-course"
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
                rules={[]}
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
                    <InputNumber
                      type="number"
                      min={0}
                      // placeholder="Heures théoriques"
                      suffix="H"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="practical_hours" label="Heures pratiques">
                    <InputNumber
                      type="number"
                      min={0}
                      // placeholder="Heures pratiques"
                      suffix="H"
                    />
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
              <Alert
                message="Statut des inscriptions"
                description={
                  <Form.Item name="status">
                    <Select
                      options={[
                        { value: "pending", label: "En attente" },
                        {
                          value: "progress",
                          label: "En cours",
                        },
                        {
                          value: "finished",
                          label: "Terminé",
                        },
                        {
                          value: "suspended",
                          label: "Suspendu",
                        },
                      ]}
                    />
                  </Form.Item>
                }
              />

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
                      Programmer le cours
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
