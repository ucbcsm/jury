"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Form, Modal, Select, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateClassPresident,
  getCurrentClassesAsOptions,
  getCurrentDepartmentsAsOptions,
  getYearEnrollementsAsOptions,
} from "@/lib/api";
import { Class, Department, Enrollment, ClassPresident } from "@/types";

type FormDataType = {
  class_year_id: number;
  department_id: number;
  student_id: number;
};

type EditClassPresidentFormProps = {
  classPresident: ClassPresident;
  classes?: Class[];
  departments?: Department[];
  students?: Enrollment[];
  open:boolean;
  setOpen:Dispatch<SetStateAction<boolean>>
};

export const EditClassPresidentForm: React.FC<EditClassPresidentFormProps> = ({
  classPresident,
  classes,
  departments,
  students,
  open,
  setOpen
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateClassPresident,
  });

  useEffect(() => {
    if ( classPresident) {
      form.setFieldsValue({
        class_year_id: classPresident.class_year.id,
        department_id: classPresident.departement.id,
        student_id: classPresident.student.id,
      });
    }
  }, [ classPresident, form]);

  const onFinish = (values: FormDataType) => {
    mutateAsync(
      { id: classPresident.id, data: { ...values } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["class_presidents"] });
          messageApi.success("Délégué de classe modifié avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification du délégué."
          );
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Button
        color="primary"
        variant="dashed"
        icon={<EditOutlined />}
        className="shadow-none"
        title="Modifier le délégué"
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Modifier
      </Button>
      <Modal
        open={open}
        title="Modifier le délégué de classe"
        centered
        okText="Enregistrer"
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
        // destroyOnHidden
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            disabled={isPending}
            key="edit_class_president"
            layout="vertical"
            form={form}
            name="edit_class_president"
            onFinish={onFinish}
            // clearOnDestroy
          >
            {dom}
          </Form>
        )}
      >
        
        <Form.Item
          name="department_id"
          label="Département"
          rules={[
            { required: true, message: "Veuillez sélectionner un département" },
          ]}
        >
          <Select
            placeholder="Sélectionnez un département"
            options={getCurrentDepartmentsAsOptions(departments)}
          />
        </Form.Item>
        <Form.Item
          name="class_year_id"
          label="Promotion"
          rules={[
            {
              required: true,
              message: "Veuillez sélectionner une année promotion",
            },
          ]}
        >
          <Select
            placeholder="Sélectionnez une année"
            options={getCurrentClassesAsOptions(classes)}
          />
        </Form.Item>
        <Form.Item
          name="student_id"
          label="Chef de promotion (CP)"
          rules={[
            { required: true, message: "Veuillez sélectionner un étudiant" },
          ]}
        >
          <Select
            placeholder="Sélectionnez un étudiant"
            options={getYearEnrollementsAsOptions(students)}
            showSearch
            filterOption={(input, option) =>
              (option?.label as string)
                ?.toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Form.Item>
      </Modal>
    </>
  );
};
