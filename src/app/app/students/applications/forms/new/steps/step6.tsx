"use client";

import { Palette } from "@/components/palette";
import { Step6ApplicationFormDataType } from "@/types";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Badge, Button, Divider, Flex, Form, Input, Space, Typography } from "antd";
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

export const Step6: FC<Props> = ({ setStep }) => {
  const [form] = Form.useForm<Step6ApplicationFormDataType>();

  useEffect(() => {
    const savedData = localStorage.getItem("d6");
    if (typeof savedData === "string") {
      const raw = decompressFromEncodedURIComponent(savedData);
      const data = JSON.parse(raw);
      form.setFieldsValue({ ...data });
    }
  }, []);

  return (
    <Form
      form={form}
      // style={{ width: 500 }}
      onFinish={(values) => {
        const compressedData = compressToEncodedURIComponent(
          JSON.stringify(values)
        );
        localStorage.setItem("d6", compressedData);
        setStep(6);
      }}
    >
      <Form.Item
        label="Activités professionnelles"
        name="professional_activity"
        rules={[]}
      >
        <Input.TextArea placeholder="Activités professionnelles" />
      </Form.Item>

      <Divider orientation="left" orientationMargin={0}>
        <Typography.Title level={5}>
          Études universitaires précédentes
        </Typography.Title>
      </Divider>
      <Form.List name={["previous_university_studies"]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <div className="py-4" key={key}>
                <Badge count={index + 1} />
                <Form.Item
                  {...restField}
                  name={[name, "academic_year"]}
                  label="Année académique"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez entrer l'année académique",
                    },
                  ]}
                >
                  <Input placeholder="Année académique" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "institution"]}
                  rules={[
                    {
                      required: true,
                      message: "Veuillez entrer l'établissement",
                    },
                  ]}
                  label="Établissement"
                >
                  <Input placeholder="Établissement" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "study_year_and_faculty"]}
                  label="Faculté/Département"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input placeholder="Faculté/Departement" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "result"]}
                  label="Résultat"
                  rules={[
                    { required: true, message: "Veuillez entrer le résultat" },
                  ]}
                >
                  <Input placeholder="Résultat" />
                </Form.Item>
                <Button
                  danger
                  block
                  onClick={() => remove(name)}
                  icon={<DeleteOutlined />}
                  style={{ boxShadow: "none" }}
                >
                  Supprimer
                </Button>
              </div>
            ))}
            <Form.Item style={{ marginTop: 24 }}>
              <Button
                type="link"
                onClick={() => add()}
                icon={<PlusCircleOutlined />}
                block
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Ajouter une ligne
              </Button>
            </Form.Item>
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
          <Button onClick={() => setStep(4)} style={{ boxShadow: "none" }}>
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
