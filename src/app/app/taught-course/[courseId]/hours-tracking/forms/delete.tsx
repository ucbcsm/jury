"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteHourTracking } from "@/lib/api";
import { HourTracking } from "@/types";

type FormDataType = {
  validate: string;
};

type DeleteHourTrackingFormProps = {
  hourTracking: HourTracking;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteHourTrackingForm: FC<DeleteHourTrackingFormProps> = ({
  hourTracking,
  open,
  setOpen,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteHourTracking,
  });

  const onFinish = (values: FormDataType) => {
    
    const dateStr =
      typeof hourTracking.date === "string" ? hourTracking.date : "";

    if (values.validate === dateStr) {
      mutateAsync(hourTracking.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["course_hours_tracking"] });
          messageApi.success("Suivi d'heures supprimé avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la suppression du suivi d'heures."
          );
        },
      });
    } else {
      messageApi.error(
        "La date saisie ne correspond pas à celle du suivi sélectionné."
      );
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title="Suppression"
        centered
        okText="Supprimer"
        cancelText="Annuler"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          disabled: isPending,
          loading: isPending,
          danger: true,
        }}
        cancelButtonProps={{
          style: { boxShadow: "none" },
          disabled: isPending,
        }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        closable={{ disabled: isPending }}
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            name="delete_hour_tracking_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={{ enabled: true }}
          >
            {dom}
          </Form>
        )}
      >
        <Alert
          message="Attention"
          description={
            <>
              Êtes-vous sûr de vouloir supprimer le suivi d'heures du{" "}
              <b>{`${hourTracking.date}`}</b> pour le cours{" "}
              <b>
                {hourTracking.course?.available_course.name || ""}
              </b>
              ? Cette action est irréversible.
            </>
          }
          type="warning"
          showIcon
          style={{ border: 0 }}
        />
        <Form.Item
          name="validate"
          label={`Veuillez saisir la date du suivi (YYYY-MM-DD) pour confirmer.`}
          rules={[{ required: true }]}
          style={{ marginTop: 24 }}
        >
          <Input placeholder={`${hourTracking.date}`} />
        </Form.Item>
      </Modal>
    </>
  );
};
