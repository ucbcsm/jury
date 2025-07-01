"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal, Checkbox } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  formatApplicationDocumentsForEdition,
  formatEnrollmentQuestionResponseForEdition,
  validateApplication,
  validateEditedApplication,
} from "@/lib/api";
import {
  Application,
  ApplicationDocument,
  ApplicationEditFormDataType,
  EnrollmentQA,
} from "@/types";

type FormDataType = {
  confirmation: string;
  validated: boolean;
};

type ValidateStudentRegistrationFormProps = {
  application: Application;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  editedApplication:
    | (Omit<
        ApplicationEditFormDataType,
        "application_documents" | "enrollment_question_response"
      > & {
        application_documents: Array<ApplicationDocument>;
        enrollment_question_response: Array<EnrollmentQA>;
      })
    | null;
};

export const ValidateApplicationForm: FC<
  ValidateStudentRegistrationFormProps
> = ({ application, open, setOpen, editedApplication }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: validateApplication,
  });

  const {
    mutateAsync: mutateAsyncEditedApplication,
    isPending: isPendingEdited,
  } = useMutation({
    mutationFn: validateEditedApplication,
  });

  const onFinish = (values: FormDataType) => {
    if (!values.validated) {
      messageApi.error(
        "Vous devez cocher la case pour confirmer la validation."
      );
      return;
    }
   
      if (editedApplication) {
        mutateAsyncEditedApplication(
          {
            oldParams: application,
            newParams: {
              ...editedApplication,
              year_id: application.academic_year.id,
              type_of_enrollment: application.type_of_enrollment,
              application_documents: formatApplicationDocumentsForEdition(
                editedApplication.application_documents
              ),
              enrollment_question_response:
                formatEnrollmentQuestionResponseForEdition(
                  editedApplication.enrollment_question_response
                ),
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["applications"] });
              queryClient.invalidateQueries({ queryKey: ["year_enrollments"] });
              messageApi.success("Inscription validée avec succès !");
              setOpen(false);
            },
            onError: () => {
              messageApi.error(
                "Une erreur s'est produite lors de la validation de l'inscription."
              );
            },
          }
        );
      } else {
        mutateAsync(
          { ...application },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["applications"] });
              queryClient.invalidateQueries({ queryKey: ["year_enrollments"] });
              messageApi.success("Inscription validée avec succès !");
              setOpen(false);
            },
            onError: () => {
              messageApi.error(
                "Une erreur s'est produite lors de la validation de l'inscription."
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
        title="Validation de l'inscription"
        centered
        okText="Valider"
        cancelText="Annuler"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          disabled: isPending || isPendingEdited,
          loading: isPending || isPendingEdited,
          danger: false,
        }}
        cancelButtonProps={{
          style: { boxShadow: "none" },
          disabled: isPending || isPendingEdited,
        }}
        onCancel={() => setOpen(false)}
        // destroyOnClose
        closable={{ disabled: isPending || isPendingEdited }}
        maskClosable={!isPending || !isPendingEdited}
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            name="validate_student_registration_form"
            onFinish={onFinish}
            disabled={isPending || isPendingEdited}
            initialValues={{ validated: false }}
          >
            {dom}
          </Form>
        )}
      >
        <Alert
          message="Confirmation requise"
          description={`Êtes-vous sûr de vouloir valider l'inscription de "${application.name}" en ${application.class_year?.acronym} ${application.departement.name} ?`}
          type="info"
          showIcon
          style={{ border: 0 }}
        />
        <Form.Item
          name="validated"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error(
                        "Vous devez cocher la case pour confirmer la validation."
                      )
                    ),
            },
          ]}
          style={{ marginTop: 0 }}
        >
          <Checkbox>Je confirme la validation de cette inscription.</Checkbox>
        </Form.Item>
      </Modal>
    </>
  );
};
