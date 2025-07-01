"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CourseEnrollment } from "@/types";
import { updateSingleCourseEnrollment } from "@/lib/api";

type ValidateSingleCourseEnrollmentFormProps = {
  enrollment: CourseEnrollment;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const ValidateSingleCourseEnrollmentForm: FC<
  ValidateSingleCourseEnrollmentFormProps
> = ({ enrollment, open, setOpen }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateSingleCourseEnrollment,
  });

  const onFinish = () => {
    if (enrollment) {
      mutateAsync(
        {
          id: enrollment.id,
          student_id: enrollment.student.id,
          course_id: enrollment.course.id,
          status: "validated",
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["course_enrollments"],
            });
            messageApi.success("Inscription au cours validée avec succès !");
            setOpen(false);
          },
          onError: () => {
            messageApi.error(
              "Une erreur s'est produite lors de la validation de l'inscription au cours."
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
        title="Valider l'inscription au cours"
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
          message="Confirmation requise"
          description={
            <p>
              Êtes-vous sûr de vouloir <b>valider</b> l&apos;inscription de{" "}
              <b>
                {enrollment.student.year_enrollment.user.first_name}{" "}
                {enrollment.student.year_enrollment.user.last_name}{" "}
                {enrollment.student.year_enrollment.user.surname}
              </b>{" "}
              au cours :{" "}
              <b>
                {enrollment.course.available_course.name} (
                {enrollment.course.available_course.code})
              </b>{" "}
              ?
            </p>
          }
          type="success"
          showIcon
        />
      </Modal>
    </>
  );
};
