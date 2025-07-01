"use client";

import React, { Dispatch, FC, SetStateAction, useState } from "react";
import {
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
} from "antd";
import { Year } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateYear } from "@/lib/api";
import dayjs from "dayjs";

type EditYearFormProps = {
  year: Year;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

type FormDataType = Omit<Year, "id">;

export const EditYearForm: FC<EditYearFormProps> = ({
  year,
  open,
  setOpen,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [yearName, setYearName] = useState<string | undefined>(year.name);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateYear,
  });

  const onFinish = (values: FormDataType) => {
    mutateAsync(
      { id: year.id, params: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["years"] });
          queryClient.invalidateQueries({
            queryKey: ["year", String(year.id)],
          });
          messageApi.success("Année académique mise à jour avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la mise à jour de l'année académique."
          );
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title="Modifier l'année"
        centered
        okText="Mettre à jour"
        cancelText="Annuler"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          loading: isPending,
        }}
        cancelButtonProps={{
          style: { boxShadow: "none" },
        }}
        onCancel={() => setOpen(false)}
        destroyOnHidden
        closable={!isPending}
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            disabled={isPending}
            key="edit_academic_year"
            layout="vertical"
            form={form}
            name="edit_academic_year"
            initialValues={{
              name: year.name,
              start_date: dayjs(year.start_date),
              end_date: dayjs(year.end_date),
              status: year.status,
            }}
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
          />
        </Form.Item>
      </Modal>
    </>
  );
};
