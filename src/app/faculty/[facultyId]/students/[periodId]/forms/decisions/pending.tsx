"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PeriodEnrollment } from "@/types";
import { updateSinglePeriodEnrollment } from "@/lib/api";

type PendingSinglePeriodEnrollmentFormProps = {
  enrollment: PeriodEnrollment;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const PendingSinglePeriodEnrollmentForm: FC<
  PendingSinglePeriodEnrollmentFormProps
> = ({ enrollment, open, setOpen }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateSinglePeriodEnrollment,
  });

  const onFinish = () => {
    if (enrollment) {
      mutateAsync(
        {
          id: enrollment.id,
          year_enrollment_id: enrollment.year_enrollment.id,
          period_id: enrollment.period.id,
          status: "pending",
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["period_enrollments"],
            });
            messageApi.success("Inscription marquée comme en attente !");
            setOpen(false);
          },
          onError: () => {
            messageApi.error(
              "Une erreur s'est produite lors du changement de statut de l'inscription."
            );
          },
        }
      );
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title="Marquer l'inscription en attente"
        centered
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          disabled: isPending,
          loading: isPending,
        }}
        cancelButtonProps={{
          style: { boxShadow: "none" },
          disabled: isPending,
        }}
        onCancel={() => setOpen(false)}
        onOk={onFinish}
        destroyOnClose
        closable={{ disabled: isPending }}
        maskClosable={!isPending}
      >
        <Alert
          message={
            <span>
              Confirmation requise
            </span>
          }
          description={
            <p>
              Êtes-vous sûr de vouloir marquer l&apos;inscription de{" "}
              <b>
                {enrollment.year_enrollment.user.first_name}{" "}
                {enrollment.year_enrollment.user.last_name}{" "}
                {enrollment.year_enrollment.user.surname}
              </b>{" "}
              à la période :{" "}
              <b>
                {enrollment.period.name} ({enrollment.period.acronym})
              </b>{" "}
              <b>en attente</b> ?
            </p>
          }
          type="warning"
          showIcon
          
        />
      </Modal>
    </>
  );
};