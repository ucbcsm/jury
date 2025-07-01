"use client";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Form, Input, message, Modal, Select } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateTeachingUnit,
  getCurrentCyclesAsOptions,
  getCurrentDepartmentsAsOptions,
} from "@/lib/api";
import { Cycle, Department, TeachingUnit } from "@/types";
import { filterOption } from "@/lib/utils";

type FormDataType = Omit<TeachingUnit, "id" | "departement" | "cycle"> & {
  department_id: number;
  cycle_id: number;
};

type EditTeachingUnitFormProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  teachingUnit: TeachingUnit | null;
  cycles?: Cycle[];
  departments?: Department[];
};

export const EditTeachingUnitForm: React.FC<EditTeachingUnitFormProps> = ({
  open,
  setOpen,
  teachingUnit,
  cycles,
  departments,
}) => {
  const [form] = Form.useForm<FormDataType>();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormDataType }) =>
      updateTeachingUnit(id, data),
  });

  useEffect(() => {
    if (open && teachingUnit) {
      form.setFieldsValue({
        name: teachingUnit.name,
        code: teachingUnit.code,
        category: teachingUnit.category,
        cycle_id: teachingUnit.cycle?.id,
        department_id: teachingUnit.departement?.id,
      });
    }
    if (!open) {
      form.resetFields();
    }
  }, [open, teachingUnit, form]);

  const onFinish = (values: FormDataType) => {
    if (!teachingUnit) return;
    mutateAsync(
      {
        id: teachingUnit.id,
        data: { ...values, credit_count: teachingUnit.credit_count },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["teaching-units"] });
          messageApi.success("Unité d'enseignement modifiée avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification de l'unité."
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
        title="Modifier l'unité d'enseignement"
        centered
        okText="Enregistrer"
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
            name="edit_teaching_unit_form"
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
