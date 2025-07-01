"use client";
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Options } from "nuqs";
import { FC, useEffect } from "react";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { Step5ApplicationFormDataType, Year } from "@/types";
import { countries } from "@/lib/data/countries";
import { Palette } from "@/components/palette";
import dayjs from "dayjs";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const Step5: FC<Props> = ({ setStep }) => {
  const [form] = Form.useForm<Step5ApplicationFormDataType>();

  useEffect(() => {
    const savedData = localStorage.getItem("d5");
    if (typeof savedData === "string") {
      const raw = decompressFromEncodedURIComponent(savedData);
      const data = JSON.parse(raw);
      form.setFieldsValue({ ...data, year_of_diploma_obtained:dayjs(`${data.year_of_diploma_obtained}`,"YYYY") });
    }
  }, []);

  return (
    <Form
      form={form}
      onFinish={(values) => {
        const compressedData = compressToEncodedURIComponent(
          JSON.stringify(values)
        );
        localStorage.setItem("d5", compressedData);
        setStep(5);
      }}
    >
      <Form.Item
        label="Nom de l'école secondaire"
        name="name_of_secondary_school"
        rules={[{ required: true }]}
      >
        <Input placeholder="Nom de l'école secondaire" />
      </Form.Item>
      <Form.Item
        label="Pays de l'école secondaire"
        name="country_of_secondary_school"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Pays de l'école secondaire"
          options={countries}
          showSearch
        />
      </Form.Item>
      <Form.Item
        label="Province de l'école secondaire"
        name="province_of_secondary_school"
        rules={[{ required: true }]}
      >
        <Input placeholder="Province de l'école secondaire" />
      </Form.Item>
      <Form.Item
        label="Ville ou Territoire de l'école"
        name="territory_or_municipality_of_school"
        rules={[{ required: true }]}
      >
        <Input placeholder="Territoire ou municipalité de l'école" />
      </Form.Item>
      <Form.Item
        label="Section ou option suivie aux humanités"
        name="section_followed"
        rules={[{ required: true }]}
      >
        <Input placeholder="Section suivie" />
      </Form.Item>
      <Form.Item
        label="Année d'obtention du diplôme"
        name="year_of_diploma_obtained"
        rules={[{ required: true }]}
      >
        <DatePicker
          placeholder="Année"
          mode="year"
          picker="year"
          format="YYYY"
        />
      </Form.Item>
      <Form.Item label="Numéro du diplôme" name="diploma_number" rules={[]}>
        <Input placeholder="Numéro du diplôme" />
      </Form.Item>
      <Form.Item
        label="Pourcentage obtenu au diplôme"
        name="diploma_percentage"
        rules={[{ required: true }]}
      >
        <InputNumber
          placeholder="Pourcentage obtenu au diplôme"
          step={0.01}
          suffix="%"
          min={50}
          max={100}
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
            <Button onClick={() => setStep(3)} style={{ boxShadow: "none" }}>
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
