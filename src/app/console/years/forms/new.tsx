'use client'

import React, { useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Year } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createYear } from "@/lib/api";

type FormDataType = Omit<Year, "id">
type NewYearFormProps={
  buttonType?:"link" | "text" | "default" | "dashed" | "primary"
}
export const NewYearForm: React.FC<NewYearFormProps> = ({buttonType="primary"}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [yearName, setYearName] = useState<string | undefined>();

  const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
      mutationFn: createYear,
    });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["years"] });
        messageApi.success("Année académique créée avec succès !");
        setOpen(false);
      },
      onError: () => {
        messageApi.error("Une erreur s'est produite lors de la création de l'année académique.");
      },
    });
  };

  return (
    <>
    {contextHolder}
      <Button
        type={buttonType}
        icon={<PlusOutlined />}
        className="shadow-none"
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Nouvelle année
      </Button>
      <Modal
        open={open}
        title="Nouvelle année"
        centered
        okText="Créer"
        cancelText="Annuler"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          loading:isPending
        }}
        cancelButtonProps={{
          style: { boxShadow: "none" },
        }}
        onCancel={() => setOpen(false)}
        destroyOnHidden
        closable={{disabled:isPending}}
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            disabled={isPending}
            key="create_new_academic_year"
            layout="vertical"
            form={form}
            name="create_new_academic_year"
            initialValues={{ status: "progress" }}
            clearOnDestroy
            onFinish={onFinish}
          >
            {dom}
          </Form>
        )}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="start_date"
              label="Date de début"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer la date de début",
                },
              ]}
            >
              <DatePicker
                placeholder="DD/MM/YYYY"
                format={{ format: "DD/MM/YYYY", type: "mask" }}
                style={{ width: "100%" }}
                onChange={(date) => {
                  const oldValue = yearName?.split("-");
                  if (oldValue) {
                    form.setFieldValue(
                      "name",
                      `${date?.year()}-${oldValue[1]}`
                    );
                    setYearName(`${date?.year()}-${oldValue[1]}`);
                  } else {
                    form.setFieldValue("name", `${date?.year()}-`);
                    setYearName(`${date?.year()}-`);
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="end_date"
              label="Date de fin"
              rules={[
                { required: true, message: "Veuillez entrer la date de fin" },
              ]}
            >
              <DatePicker
                placeholder="DD/MM/YYYY"
                format={{ format: "DD/MM/YYYY", type: "mask" }}
                style={{ width: "100%" }}
                onChange={(date) => {
                  const oldValue = yearName?.split("-");
                  if (oldValue) {
                    form.setFieldValue(
                      "name",
                      `${oldValue[0]}-${date?.year()}`
                    );
                    setYearName(`${oldValue[0]}-${date?.year()}`);
                  } else {
                    form.setFieldValue("name", `-${date?.year()}`);
                    setYearName(`-${date?.year()}`);
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="name"
          label="Nom de l'année"
          rules={[
            { required: true, message: "Veuillez entrer le nom de l'année" },
          ]}
        >
          <Input placeholder="YYYY-YYYY" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Statut des inscriptions"
          rules={[
            { required: true, message: "Veuillez sélectionner un statut" },
          ]}
        >
          <Select
            placeholder="Sélectionnez un statut"
            options={[
              { value: "pending", label: "En attente" },
              { value: "progress", label: "En cours" },
              { value: "finished", label: "Terminé" },
              { value: "suspended", label: "Suspendu" },
            ]}
            defaultValue="progress"
          />
           
        </Form.Item>
      </Modal>
    </>
  );
};
