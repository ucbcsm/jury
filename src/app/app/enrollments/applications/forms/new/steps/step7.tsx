"use client";
import { useYid } from "@/hooks/use-yid";
import { Step7ApplicationFormDataType } from "@/types";
import {
  getClasses,
  getCurrentClassesAsOptions,
  getCurrentCyclesAsOptions,
  getCurrentDepartmentsAsOptions,
  getCurrentFacultiesAsOptions,
  getCurrentFieldsAsOptions,
  getCycles,
  getDepartments,
  getFaculties,
  getFields,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Form,
  Select,
  Space,
  Radio,
  Flex,
} from "antd";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { Options } from "nuqs";
import { FC, useEffect } from "react";
import { Palette } from "@/components/palette";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const Step7: FC<Props> = ({ setStep }) => {
  const [form] = Form.useForm<Step7ApplicationFormDataType>();
  const { yid } = useYid();

  const { data: cycles } = useQuery({
    queryKey: ["cycles"],
    queryFn: getCycles,
  });

  const { data: faculties } = useQuery({
    queryKey: ["faculties"],
    queryFn: getFaculties,
  });

  const { data: fields } = useQuery({
    queryKey: ["fields"],
    queryFn: getFields,
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });


  useEffect(() => {
    const savedData = localStorage.getItem("d7");
    if (typeof savedData === "string") {
      const raw = decompressFromEncodedURIComponent(savedData);
      const data = JSON.parse(raw);
      form.setFieldsValue({ ...data });
    }
  }, [yid]);
  return (
    <Form
      form={form}
      onFinish={(values) => {
        const compressedData = compressToEncodedURIComponent(
          JSON.stringify({ ...values, year_id: yid })
        );
        localStorage.setItem("d7", compressedData);
        setStep(7);
      }}
    >
      <Form.Item
        label="Cycle"
        name="cycle_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Radio.Group options={getCurrentCyclesAsOptions(cycles)} />
      </Form.Item>
      <Form.Item
        label="Département"
        name="department_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select
          placeholder="Département"
          options={getCurrentDepartmentsAsOptions(departments)}
          onSelect={(value) => {
            const selectedDep = departments?.find((dep) => dep.id === value);
            const facId = selectedDep?.faculty.id;
            const selectedFac = faculties?.find((fac) => fac.id === facId);
            form.setFieldsValue({
              faculty_id: facId,
              field_id: selectedFac?.field.id,
            });
          }}
          showSearch
        />
      </Form.Item>
      <Form.Item
        label="Filière ou Domaine"
        name="field_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select
          options={getCurrentFieldsAsOptions(fields)}
          disabled
          showSearch
          variant="borderless"
        />
      </Form.Item>
      <Form.Item
        label="Faculté"
        name="faculty_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select
          options={getCurrentFacultiesAsOptions(faculties)}
          disabled
          showSearch
          variant="borderless"
        />
      </Form.Item>
      
      <Form.Item
        label="Promotion"
        name="class_id"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Select
          placeholder="Promotion ou classe"
          options={getCurrentClassesAsOptions(classes)}
          showSearch
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
            <Button onClick={() => setStep(5)} style={{ boxShadow: "none" }}>
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
