import React, { useState } from "react";
import { Button, Form, Input, InputNumber, message, Modal, Select } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCycle } from "@/lib/api";
import { Cycle } from "@/types";
import { getCycleLMD, getCyclesLMDAsOptions, getCyclesLMDAsOptionsWithDisabled } from "@/lib/data/cycles";

type FormDataType = Omit<Cycle, "id">;

type Props = {
  cycles?: Cycle[];
};

export const NewCycleForm: React.FC<Props> = ({ cycles }) => {
  const [form] = Form.useForm<FormDataType>();
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createCycle,
  });

  const onFinish = (values: FormDataType) => {
    mutateAsync(values, {
      onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycles"] });
      messageApi.success("Cycle créé avec succès !");
      setOpen(false);
      },
      onError: () => {
      messageApi.error("Une erreur s'est produite lors de la création du cycle.");
      },
    });
  };

  return (
    <>
      {contextHolder}
      <Button
        type="link"
        icon={<PlusCircleOutlined />}
        title="Ajouter un cycle"
        disabled={Number(cycles?.length) >= 3}
        onClick={() => setOpen(true)}
      >
        Ajouter
      </Button>
      <Modal
        open={open}
        title="Nouveau cycle"
        centered
        okText="Créer"
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
            // layout="vertical"
            labelCol={{ span: 8 }}
            name="create_cycle_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={{}}
            clearOnDestroy
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
          <Select options={getCyclesLMDAsOptionsWithDisabled(cycles)} placeholder="Nom du cycle" onSelect={(value)=>{
            const selectedCycle= getCycleLMD(value)
            form.setFieldsValue({...selectedCycle})
          }} />
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
          <Input placeholder="" disabled variant="borderless"  />
        </Form.Item>
        <Form.Item
          name="order_number"
          label="Numéro d'ordre"
          rules={[
            { required: true, message: "Veuillez entrer le numéro d'ordre" },
          ]}
        >
          <InputNumber placeholder="Numéro d'ordre" disabled variant="borderless" />
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
