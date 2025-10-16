"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal, Typography } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Course } from "@/types";
import { invalidateRetakeCourse } from "@/lib/api/retake-course";
import { error } from "console";
import { on } from "events";

type FormDataType = {
  invalidate: string;
};

type InvalidateRetakeCourseFormProps = {
  course: Course;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  staticData: {
    userRetakeId: number;
    facultyId: number;
    departmentId: number;
    userId: number;
    studentName: string;
  };
};

export const InvalidateRetakeCourseForm: FC<
  InvalidateRetakeCourseFormProps
> = ({ course, open, setOpen, staticData }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: invalidateRetakeCourse,
  });

   const onCancel=()=>{
     setOpen(false)
     form.resetFields();
  }

  const onFinish = (values: FormDataType) => {
    if (values.invalidate === course.code) {
      mutateAsync(
        {
          userRetakeId: staticData.userRetakeId,
          retake_courseId_not_done_list: [course.id],
          userId: staticData.userId,
          facultyId: staticData.facultyId,
          departmentId: staticData.departmentId,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["retake-courses"],
            });
            messageApi.success("Cours invalidé comme repris et acquis !");
            setOpen(false);
          },
          onError: (error) => {
            messageApi.error(
              (error as any)?.response?.data?.message ||
                "Une erreur s'est produite lors de l'invalidation du cours."
            );
          },
        }
      );
    } else {
      messageApi.error("Le code saisi ne correspond pas au cours.");
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title="Invalidation du cours repris et acquis"
        centered
        okText="Invalider"
        cancelText="Annuler"
        styles={{ body: { paddingTop: 16, paddingBottom: "24px" } }}
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
        onCancel={onCancel}
        destroyOnHidden
        closable={{ disabled: isPending }}
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            name="invalidate_retake_course_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={{ enabled: true }}
          >
            {dom}
          </Form>
        )}
      >
        <Alert
          message="Confirmation importante"
          description={
            <div>
              Vous êtes sur le point d'invalider le cours{" "}
              <Typography.Text strong italic>
                "{course.name}" ({course.code})
              </Typography.Text>{" "}
              comme repris et acquis pour l'étudiant{" "}
              <Typography.Text strong italic>
                {staticData.studentName}
              </Typography.Text>
              . Veuillez vous assurer que l'étudiant n'a pas finalisé ce cours
              ou qu'une erreur a été commise.
            </div>
          }
          type="warning"
          showIcon
          style={{ border: 0 }}
        />
        <Form.Item
          name="invalidate"
          label={`Veuillez saisir le code (${course.code}) du cours pour confirmer l'invalidation.`}
          rules={[
            {
              required: true,
              message: `Ce champ est requis. Veuillez saisir le code (${course.code}) du cours pour confirmer l'invalidation.`,
            },
          ]}
          style={{ marginTop: 24 }}
        >
          <Input placeholder={course.code} />
        </Form.Item>
      </Modal>
    </>
  );
};
