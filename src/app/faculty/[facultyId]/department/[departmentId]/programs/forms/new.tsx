"use client";

import { FC, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Drawer,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Space,
  Table,
  theme,
} from "antd";
import { parseAsBoolean, useQueryState } from "nuqs";
import {
  CloseOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Department, Course, CourseProgram } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDepartmentProgram } from "@/lib/api";
import { Palette } from "@/components/palette";
import { useParams } from "next/navigation";
import { CourseInProgramActionsBar } from "../courses-program/action-bar";
import { NewCourseProgramForm } from "../courses-program/forms/new";
import { ListCoursesProgram } from "../courses-program/list";

type NewDepartmentProgramFormProps = {
  departments?: Department[];
  courses?: Course[];
};

export const NewDepartmentProgramForm: FC<NewDepartmentProgramFormProps> = ({
  courses,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [formAddToProgram] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { departmentId } = useParams();
  const [newProgram, setNewProgram] = useQueryState(
    "new_program",
    parseAsBoolean.withDefault(false)
  );
  const [cancel, setCancel] = useState<boolean>(false);
  const [openAddCourse, setOpenAddCourse] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const [coursesOfProgram, setCoursesOfProgram] = useState<
    Omit<CourseProgram, "id" & { id?: number }>[]
  >([]);

  const onClose = () => {
    setNewProgram(false);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createDepartmentProgram,
  });

  const removeCourseRecord = (availableCourseId: number) => {
    const records = coursesOfProgram.filter(
      (c) => c.available_course?.id !== availableCourseId
    );
    setCoursesOfProgram((prev) => [...records]);
  };

  const editCourseRecord = (
    index: number,
    update: {
      theoretical_hours: number;
      practical_hours: number;
      credit_count: number;
      max_value: number;
      available_course_id: number;
    }
  ) => {
    const updatedCourses = [...coursesOfProgram];
    const course = courses?.find((c) => c.id === update.available_course_id);
    if (course) {
      updatedCourses[index] = {
        ...updatedCourses[index],
        available_course: course,
        max_value: update.max_value || 20,
        credit_count: update.credit_count || null,
        theoretical_hours: update.theoretical_hours || null,
        practical_hours: update.practical_hours || null,
      };
      setCoursesOfProgram(updatedCourses);
    }
  };

  const onFinish = (values: any) => {
    mutateAsync(
      {
        ...values,
        department_id: Number(departmentId),
        courses_of_program: coursesOfProgram.map((c) => ({
          ...c,
          available_course: c.available_course?.id!,
        })),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["programs"] });
          messageApi.success("Programme créé avec succès !");
          setNewProgram(false);
          form.resetFields();
          setCoursesOfProgram([]);
        },
        onError: () => {
          messageApi.error("Erreur lors de la création du programme.");
        },
      }
    );
  };

  const onFinishAddCourse = (values: {
    theoretical_hours: number;
    practical_hours: number;
    credit_count: number;
    max_value: number;
    available_course_id: number;
  }) => {
    const course = courses?.find((c) => c.id === values.available_course_id);
    setCoursesOfProgram((prev) => [
      {
        available_course: course!,
        max_value: values.max_value || 20,
        credit_count: values.credit_count || null,
        theoretical_hours: values.theoretical_hours || null,
        practical_hours: values.practical_hours || null,
      },
      ...prev,
    ]);
    setOpenAddCourse(false);
    formAddToProgram.resetFields();
  };

  return (
    <>
      {contextHolder}
      <Button
        icon={<PlusOutlined />}
        type="primary"
        style={{ boxShadow: "none" }}
        variant="dashed"
        title="Créer un nouveau programme"
        onClick={() => setNewProgram(true)}
      >
        Nouveau programme
      </Button>

      <Drawer
        styles={{ header: { background: colorPrimary, color: "#fff" } }}
        width={`100%`}
        title="Création d'un programme de département par semestre"
        onClose={onClose}
        open={newProgram}
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
                setNewProgram(false);
                form.resetFields();
                setCancel(false);
                setCoursesOfProgram([]);
              }}
              okButtonProps={{ style: { boxShadow: "none" } }}
              cancelButtonProps={{ style: { boxShadow: "none" } }}
              onCancel={() => setCancel(false)}
              centered
            >
              <Alert
                message="Êtes-vous sûr de vouloir annuler la création de ce programme ?"
                description="Toutes les informations saisies seront perdues."
                type="warning"
                showIcon
                style={{ marginBottom: 16, border: 0 }}
              />
            </Modal>
          </Space>
        }
      >
        <div style={{ maxWidth: 1300, margin: "auto" }}>
          <Alert
            type="info"
            message="Veuillez renseigner le programme académique du département par semestre."
            description="Renseignez toutes les informations nécessaires à la création du programme (nom, département, cours, crédits, durée, description)."
            showIcon
            closable
            style={{ marginBottom: 24 }}
          />
          <Row gutter={[24, 24]}>
            <Col span={16}>
              <Card
                title="Cours du programme"
                extra={
                  !openAddCourse && (
                    <Button
                      icon={<PlusCircleOutlined />}
                      type="link"
                      title="Ajouter un cours au programme"
                      onClick={() => setOpenAddCourse(true)}
                      className="shadow-none"
                    >
                      Ajouter un cours
                    </Button>
                  )
                }
              >
                <NewCourseProgramForm
                  open={openAddCourse}
                  setOpen={setOpenAddCourse}
                  courses={courses}
                  formAddToProgram={formAddToProgram}
                  onFinishAddCourse={onFinishAddCourse}
                  currentsCoursesOfProgram={coursesOfProgram}
                />

                <ListCoursesProgram
                  coursesOfProgram={coursesOfProgram}
                  removerCourseRecord={removeCourseRecord}
                  editCourseRecord={editCourseRecord}
                  courses={courses}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Flex vertical gap={16} style={{}}>
                <Card title="Informations sur le programme">
                  <Form
                    form={form}
                    name="form_new-department-program"
                    initialValues={{}}
                    onFinish={onFinish}
                    disabled={isPending}
                    //   layout="vertical"
                  >
                    <Form.Item
                      name="name"
                      label="Nom du programme"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez renseigner le nom du programme.",
                        },
                      ]}
                    >
                      <Input placeholder="Nom du programme" />
                    </Form.Item>

                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        <Form.Item
                          name="credit_count"
                          label="Nombre de crédits"
                        >
                          <InputNumber
                            type="number"
                            min={0}
                            placeholder="Nombre de crédits"
                            style={{ width: "100%", textAlign: "right" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="duration" label="Durée">
                          <InputNumber
                            type="number"
                            min={0}
                            suffix="Heures"
                            placeholder="Durée du programme"
                            style={{ width: "100%", textAlign: "right" }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item name="description" label="Description">
                      <Input.TextArea
                        placeholder="Description du programme"
                        autoSize={{ minRows: 3, maxRows: 6 }}
                      />
                    </Form.Item>
                    <Flex justify="space-between" align="center">
                      <Palette />
                      <div />
                      <Form.Item
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Space>
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={isPending}
                            style={{ boxShadow: "none" }}
                          >
                            Sauvegarder
                          </Button>
                        </Space>
                      </Form.Item>
                    </Flex>
                  </Form>
                </Card>
              </Flex>
            </Col>
          </Row>
        </div>
      </Drawer>
    </>
  );
};
