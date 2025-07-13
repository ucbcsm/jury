"use client";

import { Palette } from "@/components/palette";
import { countries } from "@/lib/data/countries";
import { Step1ApplicationFormDataType } from "@/types";
import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  Radio,
  Select,
  Typography,
} from "antd";
import dayjs from "dayjs";
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

export const Step1: FC<Props> = ({ setStep }) => {
  const [form] = Form.useForm<Step1ApplicationFormDataType>();

  useEffect(() => {
    const savedData = localStorage.getItem("d1");
    if (typeof savedData === "string") {
      const raw = decompressFromEncodedURIComponent(savedData);
      const data = JSON.parse(raw);
      form.setFieldsValue({
        ...data,
        date_of_birth: dayjs(data.date_of_birth, "YYYY-MM-DD"),
      });
    }
  }, []);

  return (
    <Form
      form={form}
      name="step1"
      onFinish={(values) => {
        const compressedData = compressToEncodedURIComponent(
          JSON.stringify(values)
        );
        localStorage.setItem("d1", compressedData);
        setStep(1);
      }}
    >
      <Form.Item label="Nom" name="first_name" rules={[{ required: true }]}>
        <Input placeholder="Nom" />
      </Form.Item>
      <Form.Item label="Postnom" name="last_name" rules={[{ required: true }]}>
        <Input placeholder="Postnom" />
      </Form.Item>
      <Form.Item label="Prénom" name="surname" rules={[{ required: true }]}>
        <Input placeholder="Prénom" />
      </Form.Item>
      <Form.Item label="Sexe" name="gender" rules={[{ required: true }]}>
        <Radio.Group
          options={[
            { value: "M", label: "Homme" },
            { value: "F", label: "Femme" },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Lieu de naissance"
        name="place_of_birth"
        rules={[{ required: true }]}
      >
        <Input placeholder="Lieu de naissance" />
      </Form.Item>
      <Form.Item
        label="Date de naissance"
        name="date_of_birth"
        rules={[{ required: true }]}
      >
        <DatePicker
          placeholder="DD/MM/YYYY"
          format={{ format: "DD/MM/YYYY" }}
          picker="date"
        />
      </Form.Item>
      <Form.Item
        label="Nationalité"
        name="nationality"
        rules={[{ required: true }]}
      >
        <Select placeholder="Nationalité" options={countries} showSearch />
      </Form.Item>
      <Form.Item
        label="État civil"
        name="marital_status"
        rules={[{ required: true }]}
      >
        <Radio.Group
          options={[
            { value: "single", label: "Célibataire" },
            { value: "married", label: "Marié(e)" },
            { value: "divorced", label: "Divorcé(e)" },
            { value: "widowed", label: "Veuf(ve)" },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Affiliation religieuse"
        name="religious_affiliation"
        rules={[{ required: true }]}
      >
        <Input placeholder="Affiliation religieuse" />
      </Form.Item>
      <Form.Item
        label="Aptitude physique"
        name="physical_ability"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Radio.Group
          options={[
            { value: "normal", label: "Normale" },
            { value: "disabled", label: "Handicapé" },
          ]}
        />
      </Form.Item>
      <Typography.Text>Langues parlées</Typography.Text>
      <Form.List
        name={["spoken_languages"]}
        rules={[
          {
            validator(_, value) {
              if (!value?.length) {
                return Promise.reject(new Error("Ajouter au moins une langue"));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <div className="pt-2">
            {fields.map(({ key, name, ...restField }, index) => (
              <div className="" key={key}>
                <Flex gap={16}>
                  <Form.Item
                    {...restField}
                    name={[name, "language"]}
                    label={`Langue ${index + 1}`}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{ flex: 1 }}
                  >
                    <Input placeholder={`Langue parlée ${index + 1}`} />
                  </Form.Item>

                  <Button
                    danger
                    type="text"
                    onClick={() => remove(name)}
                    icon={<CloseOutlined />}
                    style={{ boxShadow: "none" }}
                  />
                </Flex>
              </div>
            ))}
            {errors.map((Error) => (
              <Typography.Text type="danger">{Error}</Typography.Text>
            ))}
            <Form.Item style={{}}>
              <Button
                type="link"
                onClick={() => add()}
                icon="+"
                block
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Ajouter une langue parlée
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true }, { type: "email" }]}
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
        label="Téléphone 1"
        name="phone_number_1"
        rules={[{ required: true }]}
      >
        <Input placeholder="Téléphone 1" />
      </Form.Item>
      <Form.Item
        label="Téléphone 2"
        name="phone_number_2"
        rules={[{ required: false }]}
      >
        <Input placeholder="Numéro de téléphone 2" />
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
          <Button
            type="primary"
            htmlType="submit"
            style={{ boxShadow: "none" }}
          >
            Suivant
          </Button>
        </Form.Item>
      </Flex>
    </Form>
  );
};
