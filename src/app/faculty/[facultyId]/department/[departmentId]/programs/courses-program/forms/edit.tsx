"use client";
import { getCoursesAsOptionsWithDisabled } from "@/lib/api";
import { filterOption } from "@/lib/utils";
import { Course, CourseProgram } from "@/types";
import { Modal, Alert, Form, Select, Row, Col, InputNumber } from "antd";
import React, { Dispatch, FC, SetStateAction, useEffect } from "react";

type EditCourseProgramModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  courseProgram: Omit<CourseProgram, "id"> & { id?: number };
  index: number;
  currentsCoursesOfProgram?: Omit<CourseProgram, "id" & { id?: number }>[];
  courses?: Course[];
  editCourseRecord: (
    index: number,
    update: {
      theoretical_hours: number;
      practical_hours: number;
      credit_count: number;
      max_value: number;
      available_course_id: number;
    }
  ) => void;
};

export const EditCourseProgramForm: FC<EditCourseProgramModalProps> = ({
  open,
  courseProgram,
  index,
  currentsCoursesOfProgram,
  courses,
  setOpen,
  editCourseRecord,
}) => {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    editCourseRecord(index, {
      theoretical_hours: values.theoretical_hours,
      practical_hours: values.practical_hours,
      credit_count: values.credit_count,
      max_value: values.max_value,
      available_course_id: values.available_course_id,
    });
    setOpen(false);
  };
  // Remplir le formulaire à chaque ouverture ou changement de programme
  useEffect(() => {
    if (courseProgram && open) {
      form.setFieldsValue({
        ...courseProgram,
        available_course_id: courseProgram?.available_course?.id,
      });
    }
  }, [courseProgram, open, form]);
  console.log(courseProgram);
  return (
    <Modal
      title="Modifier le cours du programme"
      open={open}
      cancelText="Annuler"
      okButtonProps={{
        autoFocus: true,
        htmlType: "submit",
        style: { boxShadow: "none" },
      }}
      cancelButtonProps={{
        style: { boxShadow: "none" },
      }}
      onCancel={() => setOpen(false)}
      centered
      modalRender={(dom) => (
        <Form
          key="edit_course_in_program"
          layout="vertical"
          form={form}
          name="edit_course_in_program"
          // initialValues={{
          //   ...courseProgram,
          //   available_course_id: courseProgram?.available_course?.id,
          // }}
          onFinish={onFinish}
        >
          {dom}
        </Form>
      )}
    >
      <Alert
        style={{ marginBottom: 24 }}
        type="success"
        description={
          <>
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
                options={getCoursesAsOptionsWithDisabled(
                  courses,
                  currentsCoursesOfProgram
                )}
                allowClear
                showSearch
                filterOption={filterOption}
                placeholder="Sélectionnez le cours"
              />
            </Form.Item>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item name="credit_count" label="Nombre de crédits">
                  <InputNumber
                    type="number"
                    min={0}
                    placeholder="Nombre de crédits"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="max_value" label="Max">
                  <InputNumber
                    type="number"
                    min={0}
                    placeholder=""
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item name="theoretical_hours" label="Heures théoriques">
                  <InputNumber
                    type="number"
                    min={0}
                    suffix="H"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="practical_hours" label="Heures pratiques">
                  <InputNumber
                    type="number"
                    min={0}
                    suffix="H"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        }
      />
    </Modal>
  );
};
