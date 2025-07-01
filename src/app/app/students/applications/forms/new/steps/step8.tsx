"use client";

import { Palette } from "@/components/palette";
import { getEnrollmentQuestions } from "@/lib/api";
import { Step8ApplicationFormDataType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Space,
  Typography,
} from "antd";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { Options } from "nuqs";
import { FC, useEffect } from "react";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const Step8: FC<Props> = ({ setStep }) => {
  const [form] = Form.useForm<any>();

  const { data: enrollment_questions } = useQuery({
    queryKey: ["enrollment_questions"],
    queryFn: getEnrollmentQuestions,
  });

  const getEnrollementQAFromQuestions = () => {
    return enrollment_questions?.map((item) => ({
      registered_enrollment_question: item.id,
      response: null,
    }));
  };

  useEffect(() => {
    const savedData = localStorage.getItem("d8");
    if (typeof savedData === "string") {
      const raw = decompressFromEncodedURIComponent(savedData);
      const data = JSON.parse(raw) as Step8ApplicationFormDataType;

      form.setFieldsValue(data);
    } else {
      const initialValues = getEnrollementQAFromQuestions();
      form.setFieldsValue({ enrollment_q_a: initialValues });
    }
  }, [enrollment_questions]);

  console.log(enrollment_questions);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        // console.log("Form:", values);
        const compressedData = compressToEncodedURIComponent(
          JSON.stringify(values)
        );
        localStorage.setItem("d8", compressedData);
        setStep(8);
      }}
    >
      <Form.List name={["enrollment_q_a"]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <div className="" key={key}>
                
                <Form.Item
                  {...restField}
                  name={[name, "registered_enrollment_question"]}
                  hidden
                  label={enrollment_questions?.[index].question}
                  rules={[]}
                >
                  <InputNumber placeholder="" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "response"]}
                  label={
                    <Space>
                      <Badge color="lime" count={index + 1} />
                      <Typography.Text>
                        {enrollment_questions?.[index].question}
                      </Typography.Text>
                    </Space>
                  }
                  rules={[]}
                >
                  <Input.TextArea placeholder="" />
                </Form.Item>
              </div>
            ))}
          </>
        )}
      </Form.List>
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
            <Button onClick={() => setStep(6)} style={{ boxShadow: "none" }}>
              Précédent
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ boxShadow: "none" }}
            >
              Suivant
            </Button>
          </Space>
        </Form.Item>
      </Flex>
    </Form>
  );
};
