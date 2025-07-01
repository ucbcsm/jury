"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CourseEnrollment } from "@/types";
import { updateSingleCourseEnrollment } from "@/lib/api";
import { ClockCircleOutlined } from "@ant-design/icons";

type PendingSingleCourseEnrollmentFormProps = {
  enrollment: CourseEnrollment;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const PendingSingleCourseEnrollmentForm: FC<
  PendingSingleCourseEnrollmentFormProps
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
          status: "pending",
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["course_enrollments"],
            });
            messageApi.success("Inscription au cours marquée comme en attente !");
            setOpen(false);
          },
          onError: () => {
            messageApi.error(
              "Une erreur s'est produite lors du changement de statut de l'inscription au cours."
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
        title="Marquer l'inscription au cours en attente"
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
              <ClockCircleOutlined style={{ color: "#faad14", marginRight: 8 }} />
              Confirmation requise
            </span>
          }
          description={
            <p>
              Êtes-vous sûr de vouloir <b>marquer</b> l&apos;inscription de{" "}
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