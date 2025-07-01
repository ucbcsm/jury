import React, { useEffect, Dispatch, SetStateAction } from "react";
import { Button, Form, Input, InputNumber, message, Modal, Select } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCycle } from "@/lib/api";
import { Cycle } from "@/types";
import {
  getCycleLMD,
  getCyclesLMDAsOptionsWithDisabled,
} from "@/lib/data/cycles";

type FormDataType = Omit<Cycle, "id">;

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  cycle: Cycle;
  cycles?: Cycle[];
};

export const EditCycleForm: React.FC<Props> = ({
  open,
  setOpen,
  cycle,
  cycles,
}) => {
  const [form] = Form.useForm<FormDataType>();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateCycle,
  });

  useEffect(() => {
    if (open) {
      form.setFieldsValue(cycle);
    }
  }, [open, cycle, form]);

  const onFinish = (values: FormDataType) => {
    mutateAsync(
      { params: values, id: cycle.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["cycles"] });
          messageApi.success("Cycle modifié avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification du cycle."
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
        title="Modifier le cycle"
        centered
        okText="Enregistrer"
        cancelText="Annuler"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          disabled: isPending,
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
            name="edit_cycle_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={cycle}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="name"
          label="Nom du cycle"
          rules={[
            { required: true, message: "Veuillez entrer le nom du cycle" },
          ]}
        >
          <Select
            options={getCyclesLMDAsOptionsWithDisabled(cycles)}
            placeholder="Nom du cycle"
            onSelect={(value) => {
              const selectedCycle = getCycleLMD(value);
              form.setFieldsValue({ ...selectedCycle });
            }}
          />
        </Form.Item>

        <Form.Item
          name="symbol"
          label="Symbole"
          rules={[
            {
              required: true,
              message: "Veuillez entrer le symbole du cycle",
            },
          ]}
        >
          <Input placeholder="" disabled variant="borderless" />
        </Form.Item>
        <Form.Item
          name="order_number"
          label="Numéro d'ordre"
          rules={[
            { required: true, message: "Veuillez entrer le numéro d'ordre" },
          ]}
        >
          <InputNumber
            placeholder="Numéro d'ordre"
            disabled
            variant="borderless"
          />
        </Form.Item>
        <Form.Item name="planned_credits" label="Crédits prévus" rules={[]}>
          <InputNumber placeholder="Nombre de crédits prévus" />
        </Form.Item>
        <Form.Item name="planned_years" label="Années prévues" rules={[]}>
          <InputNumber type="number" placeholder="Nombre d'années prévues" />
        </Form.Item>
        <Form.Item name="planned_semester" label="Semestres prévus" rules={[]}>
          <InputNumber type="number" placeholder="Nombre de semestres prévus" />
        </Form.Item>
        <Form.Item name="purpose" label="Objectif (Description)" rules={[]}>
          <Input.TextArea placeholder="Objectif du cycle" rows={4} />
        </Form.Item>
      </Modal>
    </>
  );
};
