"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Col, DatePicker, Form, Input, message, Modal, Row, Select } from "antd";
import { Cycle, Period } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentCyclesAsOptions, getPeriodTypesAsOptions, updatePeriod } from "@/lib/api";
import dayjs from "dayjs";

type FormDataType = Omit<Period, "id" | "academic_year" | "cycle"> & {
  year_id: number;
  cycle_id: number;
};

interface EditPeriodFormProps {
  period: Period;
  cycles?: Cycle[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditPeriodForm: React.FC<EditPeriodFormProps> = ({
  period,
  cycles,
  open,
  setOpen,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updatePeriod,
  });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(
      { id: period.id, params: { ...values, year_id: period.academic_year.id } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["periods"] });
          messageApi.success("Période modifiée avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification de la période"
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
        title="Modifier la période"
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
        destroyOnClose
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            disabled={isPending}
            key="edit_period_form"
            layout="vertical"
            form={form}
            name="edit_period_form"
            initialValues={{
              ...period,
              cycle_id: period.cycle?.id,
              start_date: dayjs(period.start_date),
              end_date: dayjs(period.end_date),
            }}
            onFinish={onFinish}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="type_of_period"
          label="Type de période"
          rules={[
            {
              required: true,
            },
          ]}
          style={{ marginTop: 24 }}
        >
          <Select
            placeholder="Sélectionner un type de période"
            options={getPeriodTypesAsOptions}
          />
        </Form.Item>
        <Form.Item
          name="order_number"
          label="No d'ordre"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Exemple: 1, 2, ..."
            options={[
              { value: 1, label: "1" },
              { value: 2, label: "2" },
              { value: 3, label: "3" },
              { value: 4, label: "4" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="name"
          label="Nom de la période"
          rules={[{ required: true }]}
        >
          <Input placeholder="Nom de la période" />
        </Form.Item>
        <Form.Item
          name="acronym"
          label="Code de la période"
          rules={[{ required: true }]}
        >
          <Input placeholder="Ex: S1, S2, BS1, ..." style={{ width: 120 }} />
        </Form.Item>
        <Form.Item
          name="cycle_id"
          label="Cycle"
          rules={[
            { required: true, message: "Veuillez sélectionner un cycle" },
          ]}
        >
          <Select
            placeholder="Sélectionnez un cycle"
            options={getCurrentCyclesAsOptions(cycles)}
          />
        </Form.Item>
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
              />
            </Form.Item>
          </Col>
        </Row>
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
