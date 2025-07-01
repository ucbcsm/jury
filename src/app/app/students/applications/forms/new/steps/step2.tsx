"use client";
import { Palette } from "@/components/palette";
import { Step2ApplicationFormDataType } from "@/types";
import { Button, Flex, Form, Input, Space } from "antd";
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

export const Step2: FC<Props> = ({ setStep }) => {
  const [form] = Form.useForm<Step2ApplicationFormDataType>();

  useEffect(() => {
    const savedData = localStorage.getItem("d2");
    if (typeof savedData === "string") {
      const raw = decompressFromEncodedURIComponent(savedData);
      const data = JSON.parse(raw);
      form.setFieldsValue({
        ...data,
      });
    }
  }, []);

  return (
    <Form
      form={form}
      onFinish={(values) => {
        const compressedData = compressToEncodedURIComponent(
          JSON.stringify(values)
        );
        localStorage.setItem("d2", compressedData);
        setStep(2);
      }}
    >
      <Form.Item
        label="Nom du père"
        name="father_name"
        rules={[{ required: true }]}
      >
        <Input placeholder="Nom du père" />
      </Form.Item>
      <Form.Item
        label="Nom de la mère"
        name="mother_name"
        rules={[{ required: true }]}
      >
        <Input placeholder="Nom de la mère" />
      </Form.Item>
      <Form.Item
        label="Téléphone du père"
        name="father_phone_number"
        rules={[]}
      >
        <Input placeholder="Téléphone du père" />
      </Form.Item>
      <Form.Item
        label="Téléphone de la mère"
        name="mother_phone_number"
        rules={[]}
      >
        <Input placeholder="Téléphone de la mère" />
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
            <Button onClick={() => setStep(0)} style={{ boxShadow: "none" }}>
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
