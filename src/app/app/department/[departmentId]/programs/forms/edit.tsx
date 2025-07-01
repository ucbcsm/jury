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
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Space,
  Table,
  theme,
} from "antd";
import { CloseOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { DepartmentProgram, Course, CourseProgram } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDepartmentProgram } from "@/lib/api";
import { Palette } from "@/components/palette";
import { CourseInProgramActionsBar } from "../courses-program/action-bar";
import { NewCourseProgramForm } from "../courses-program/forms/new";
import { ListCoursesProgram } from "../courses-program/list";

type EditDepartmentProgramFormProps = {
  departmentProgram: DepartmentProgram | null;
  courses?: Course[];
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const EditDepartmentProgramForm: FC<EditDepartmentProgramFormProps> = ({
  departmentProgram,
  courses,
  open,
  setOpen,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [formAddToProgram] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [cancel, setCancel] = useState<boolean>(false);
  const [openAddCourse, setOpenAddCourse] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const [coursesOfProgram, setCoursesOfProgram] = useState<
    Omit<CourseProgram, "id" & { id?: number }>[]
  >([]);

  const onClose = () => {
    setOpen(false);
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateDepartmentProgram,
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
    if (!departmentProgram) return;
    console.log(
      "New courses:",
      coursesOfProgram.map((c) => ({
        ...c,
        available_course: c.available_course?.id!,
      }))
    );
    mutateAsync(
      {
        id: departmentProgram.id,
        data: {
          ...values,
          department_id: departmentProgram.departement.id,
          courses_of_program: coursesOfProgram.map((c) => ({
            ...c,
            available_course: c.available_course?.id!,
          })),
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["programs"] });
          messageApi.success("Programme modifié avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error("Erreur lors de la modification du programme.");
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

  // Remplir le formulaire à chaque ouverture ou changement de programme
  useEffect(() => {
    if (departmentProgram && open) {
      form.setFieldsValue({
        name: departmentProgram.name,
        credit_count: departmentProgram.credit_count ?? undefined,
        description: departmentProgram.description ?? "",
        duration: departmentProgram.duration ?? undefined,
      });
      setCoursesOfProgram(departmentProgram.courses_of_program);
    }
  }, [departmentProgram, open, form]);

  if (!departmentProgram) return null;

  return (
    <>
      {contextHolder}
      <Drawer
        styles={{ header: { background: colorPrimary, color: "#fff" } }}
        width={`100%`}
        title="Modification du programme du département"
        onClose={onClose}
        open={open}
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
              title="Annuler la modification"
              open={cancel}
              onOk={() => {
                setOpen(false);
                setCancel(false);
              }}
              okButtonProps={{ style: { boxShadow: "none" } }}
              cancelButtonProps={{ style: { boxShadow: "none" } }}
              onCancel={() => setCancel(false)}
              centered
            >
              <Alert
                message="Êtes-vous sûr de vouloir annuler la modification ?"
                description="Toutes les modifications en cours seront perdues."
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
            message="Modification du programme académique"
            description={
              <>
                Veuillez compléter ou ajuster toutes les informations
                nécessaires concernant le programme académique du département.
                <br />
                <strong>
                  N'oubliez pas de sauvegarder vos modifications après chaque
                  changement afin de garantir leur prise en compte.
                </strong>
              </>
            }
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
              <Flex vertical gap={16} style={{ maxWidth: 520, margin: "auto" }}>
                <Card
                  title="Informations sur le programme"
                  style={{ boxShadow: "none" }}
                >
                  <Form
                    form={form}
                    name="form_edit-department-program"
                    initialValues={{}}
                    onFinish={onFinish}
                    disabled={isPending}
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
                            style={{ width: "100%" }}
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
                            style={{ width: "100%" }}
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
