"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { Form, Input, InputNumber, message, Modal, Select } from "antd";
import { Class, Cycle } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentCyclesAsOptions, updateClass } from "@/lib/api";
import {
  getClass,
  getClassesByCycleAsOptionsWithDisabled,
} from "@/lib/data/classes";

type FormDataType = Omit<Class, "id" | "cycle"> & { cycle_id: number };

interface EditClassFormProps {
  classe: Class;
  classes?: Class[];
  cycles?: Cycle[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditClassForm: React.FC<EditClassFormProps> = ({
  classe,
  classes,
  cycles,
  open,
  setOpen,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [classNamesAsOptions, setClassNamesAsOptions] = useState<{}[]>([]);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateClass,
  });

  const onFinish = (values: FormDataType) => {
    console.log("Received values of form: ", values);

    mutateAsync(
      { id: classe.id, params: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["classes"] });
          messageApi.success("Promotion modifiée avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification de la promotion"
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
        title="Modifier la promotion"
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
            key="edit_class_form"
            layout="vertical"
            form={form}
            name="edit_field_form"
            initialValues={{ cycle_id: classe.cycle?.id, ...classe }}
            onFinish={onFinish}
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
