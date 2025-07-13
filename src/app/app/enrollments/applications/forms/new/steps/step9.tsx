"use client";

import { Palette } from "@/components/palette";
import { getRequiredDocuments } from "@/lib/api";
import { Step9ApplicationFormDataType } from "@/types";
import { FileOutlined, UploadOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Flex,
  Form,
  InputNumber,
  Select,
  Space,
  Typography,
  Upload,
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

export const Step9: FC<Props> = ({ setStep }) => {
  const [form] = Form.useForm<any>();

  const { data: required_documents } = useQuery({
    queryKey: ["required_documents"],
    queryFn: getRequiredDocuments,
  });

  const getApplicationDocsFromRequiredDocs = () => {
    return required_documents?.map((item) => ({
      exist: false,
      status: "pending",
      file_url: null,
      required_document: item.id,
    }));
  };

  useEffect(() => {
    const savedData = localStorage.getItem("d9");
    if (typeof savedData === "string") {
      const raw = decompressFromEncodedURIComponent(savedData);
      const data = JSON.parse(raw) as {
        application_documents: Step9ApplicationFormDataType;
      };
      form.setFieldsValue(data);
    } else {
      const initialValues = getApplicationDocsFromRequiredDocs();
      form.setFieldsValue({ application_documents: initialValues });
    }
  }, [required_documents]);

  return (
    <Form
      form={form}
      layout="horizontal"
      onFinish={(values) => {
        // console.log(values)
        const compressedData = compressToEncodedURIComponent(
          JSON.stringify(values)
        );
        localStorage.setItem("d9", compressedData);
        setStep(9);
      }}
    >
      <Form.List name={["application_documents"]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <Card
                title={
                  <Space>
                    <Badge count=" " />
                    <FileOutlined />
                    <Typography.Title level={5} style={{ marginBottom: 0 }}>
                      {required_documents?.[index].title}
                    </Typography.Title>
                  </Space>
                }
                key={key}
                style={{ marginBottom: 24 }}
              >
                <Form.Item
                  {...restField}
                  name={[name, "exist"]}
                  label="Document physique"
                  rules={[{ required: required_documents?.[index].required }]}
                  valuePropName="checked"
                  style={{ marginTop: 8 }}
                >
                  <Checkbox />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "file_url"]}
                  label="Version électronique"
                  rules={[]}
                >
                  <Upload>
                    <Button icon={<UploadOutlined />}>Téléverser</Button>
                  </Upload>
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "status"]}
                  rules={[{}]}
                  label="Vérification"
                >
                  <Select
                    options={[
                      { value: "pending", label: "En attente" },
                      { value: "rejected", label: "Rejeté" },
                      { value: "validated", label: "Validé" },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  {...restField}
                  hidden
                  name={[name, "required_document"]}
                  label="Document"
                  rules={[{ required: true }]}
                >
                  <InputNumber />
                </Form.Item>
              </Card>
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
            <Button onClick={() => setStep(7)} style={{ boxShadow: "none" }}>
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
