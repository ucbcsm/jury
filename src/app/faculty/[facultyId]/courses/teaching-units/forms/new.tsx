"use client";
import React, { useState } from "react";
import { Button, Form, Input, message, Modal, Select } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTeachingUnit,
  getCurrentCyclesAsOptions,
  getCurrentDepartmentsAsOptions,
} from "@/lib/api";
import { Cycle, Department, TeachingUnit } from "@/types";
import { filterOption } from "@/lib/utils";

type FormDataType = Omit<TeachingUnit, "id" | "departement" | "cycle"> & {
  department_id: number;
  cycle_id: number;
};

type NewTeachingUnitFormProps = {
  cycles?: Cycle[];
  departments?: Department[];
};

export const NewTeachingUnitForm: React.FC<NewTeachingUnitFormProps> = ({
  cycles,
  departments,
}) => {
  const [form] = Form.useForm<FormDataType>();
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createTeachingUnit,
  });

  const onFinish = (values: FormDataType) => {
    mutateAsync(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["teaching-units"] });
        messageApi.success("Unité d'enseignement créée avec succès !");
        setOpen(false);
      },
      onError: () => {
        messageApi.error(
          "Une erreur s'est produite lors de la création de l'unité."
        );
      },
    });
  };

  return (
    <>
      {contextHolder}
      <Button
        type="link"
        icon={<PlusCircleOutlined />}
        title="Ajouter une unité d'enseignement"
        onClick={() => setOpen(true)}
      >
        Ajouter
      </Button>
      <Modal
        open={open}
        title="Nouvelle unité d'enseignement"
        centered
        okText="Créer"
        cancelText="Annuler"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          disabled: isPending,
          loading:isPending,
        }}
        cancelButtonProps={{
          style: { boxShadow: "none" },
          disabled: isPending,
        }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            form={form}
            labelCol={{ span: 8 }}
            name="create_teaching_unit_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={{}}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="name"
          label="Nom de l'unité"
          rules={[
            { required: true, message: "Veuillez entrer le nom de l'unité" },
          ]}
        >
          <Input placeholder="Nom de l'unité d'enseignement" />
        </Form.Item>

        <Form.Item
          name="code"
          label="Code"
          rules={[
            { required: true, message: "Veuillez entrer le code de l'unité" },
          ]}
        >
          <Input placeholder="Code de l'unité" />
        </Form.Item>
        <Form.Item
          name="category"
          label="Catégorie"
          rules={[
            { required: true, message: "Veuillez sélectionner la catégorie" },
          ]}
        >
          <Select
            placeholder="Catégorie"
            options={[
              { value: "required", label: "Obligatoire" },
              { value: "optional", label: "Optionnelle" },
              { value: "free", label: "Libre" },
              { value: "transversal", label: "Transversale" },
            ]}
          />
        </Form.Item>
        <Form.Item name="cycle_id" label="Cycle" rules={[{ required: true }]}>
          <Select
            options={getCurrentCyclesAsOptions(cycles)}
            showSearch
            filterOption={filterOption}
          />
        </Form.Item>
        <Form.Item
          name="department_id"
          label="Département"
          rules={[{ required: true }]}
        >
          <Select
            options={getCurrentDepartmentsAsOptions(departments)}
            showSearch
            filterOption={filterOption}
          />
        </Form.Item>
      </Modal>
    </>
  );
};
