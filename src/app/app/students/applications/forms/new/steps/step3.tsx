"use client";
import { Palette } from "@/components/palette";
import { countries } from "@/lib/data/countries";
import { Step3ApplicationFormDataType } from "@/types";
import { Button, Checkbox, Flex, Form, Input, Select, Space } from "antd";
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

export const Step3: FC<Props> = ({ setStep }) => {
  const [form] = Form.useForm<Step3ApplicationFormDataType>();

  useEffect(() => {
    const savedData = localStorage.getItem("d3");
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
        localStorage.setItem("d3", compressedData);
        setStep(3);
      }}
    >
      <Form.Item
        label="Pays d'origine"
        name="country_of_origin"
        rules={[{ required: true }]}
      >
        <Select placeholder="Pays d'origine" options={countries} showSearch />
      </Form.Item>
      <Form.Item
        label="Province d'origine"
        name="province_of_origin"
        rules={[{ required: true }]}
      >
        <Input placeholder="Province d'origine" />
      </Form.Item>
      <Form.Item
        label="Ville ou Territoire d'origine"
        name="territory_or_municipality_of_origin"
        rules={[{ required: true }]}
      >
        <Input placeholder="Ville ou Territoire d'origine" />
      </Form.Item>
      <Form.Item
        label="Êtes-vous étranger?"
        name="is_foreign_registration"
        valuePropName="checked"
      >
        <Checkbox />
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
            <Button onClick={() => setStep(1)} style={{ boxShadow: "none" }}>
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
