"use client";

import React, { useState } from "react";
import { Button, Form, Input, InputNumber, message, Modal, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Class, Cycle } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClass, getCurrentCyclesAsOptions } from "@/lib/api";
import {
  getClass,
  getClassesAsOptionsWithDisabled,
  getClassesByCycleAsOptionsWithDisabled,
} from "@/lib/data/classes";

type FormDataType = Omit<Class, "id" | "cycle"> & { cycle_id: number };

type NewClassFormProps = {
  classes?: Class[];
  cycles?: Cycle[];
};

export const NewClassForm: React.FC<NewClassFormProps> = ({
  classes,
  cycles,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [classNamesAsOptions, setClassNamesAsOptions] = useState<{}[]>([]);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createClass,
  });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        messageApi.success("Promotion créée avec succès !");
        setOpen(false);
      },
      onError: () => {
        messageApi.error(
          "Une erreur s'est produite lors de la création de la promotion."
        );
      },
    });
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className="shadow-none"
        title="Ajouter une promotion"
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Ajouter
      </Button>
      <Modal
        open={open}
        title="Nouvelle promotion"
        centered
        okText="Créer"
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
            key="create_new_class"
            layout="vertical"
            form={form}
            name="create_new_class"
            onFinish={onFinish}
            clearOnDestroy
          >
            {dom}
          </Form>
        )}
      >
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
            onSelect={(_, option) => {
              const selectedCycle = getClassesByCycleAsOptionsWithDisabled(
                option.label,
                classes
              );
              setClassNamesAsOptions(selectedCycle);
            }}
          />
        </Form.Item>
        <Form.Item
          name="name"
          label="Nom ou niveau"
          rules={[{ required: true, message: "Veuillez sélectionner un nom" }]}
        >
          <Select
            placeholder="Sélectionnez un nom"
            options={classNamesAsOptions}
            onSelect={(value) => {
              const selectedClasse = getClass(value);
              form.setFieldsValue(selectedClasse);
            }}
          />
        </Form.Item>
        <Form.Item
          name="acronym"
          label="Acronyme"
          rules={[{ required: true, message: "Veuillez entrer un acronyme" }]}
        >
          <Input placeholder="Entrez un acronyme" disabled />
        </Form.Item>
        <Form.Item
          name="order_number"
          label="Numéro d'ordre"
          rules={[
            { required: true, message: "Veuillez entrer un numéro d'ordre" },
          ]}
        >
          <InputNumber
            type="number"
            placeholder="Entrez un numéro d'ordre"
            disabled
          />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="Entrez une description" />
        </Form.Item>
      </Modal>
    </>
  );
};
