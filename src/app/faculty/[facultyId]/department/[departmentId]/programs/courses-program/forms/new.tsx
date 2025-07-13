"use client";

import { getCoursesAsOptionsWithDisabled } from "@/lib/api";
import { filterOption } from "@/lib/utils";
import { Course, CourseProgram } from "@/types";
import {
  Alert,
  Button,
  Col,
  Flex,
  Form,
  FormInstance,
  InputNumber,
  Row,
  Select,
} from "antd";
import { Dispatch, FC, SetStateAction } from "react";

type NewCourseProgramFormProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  courses?: Course[];
  currentsCoursesOfProgram?: Omit<CourseProgram, "id" & { id?: number }>[];
  formAddToProgram: FormInstance<any>;
  onFinishAddCourse: (values: {
    theoretical_hours: number;
    practical_hours: number;
    credit_count: number;
    max_value: number;
    available_course_id: number;
  }) => void;
};

export const NewCourseProgramForm: FC<NewCourseProgramFormProps> = ({
  open,
  setOpen,
  courses,
  formAddToProgram,
  onFinishAddCourse,
  currentsCoursesOfProgram
}) => {
  if (!open) {
    return;
  }
  return (
    <Form
      key="add_new_course_to_program"
      form={formAddToProgram}
      name="add_new_course_to_program"
      initialValues={{}}
      onFinish={onFinishAddCourse}
      // layout="vertical"
    >
      <Alert
        message="Ajouter un cour au programme"
        style={{ marginBottom: 24 }}
        type="success"
        closable
        onClose={() => setOpen(false)}
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
                options={getCoursesAsOptionsWithDisabled(courses,currentsCoursesOfProgram)}
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
            <Flex>
              <div className="flex-1" />
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ boxShadow: "none" }}
                >
                  OK
                </Button>
              </Form.Item>
            </Flex>
          </>
        }
      />
    </Form>
  );
};
