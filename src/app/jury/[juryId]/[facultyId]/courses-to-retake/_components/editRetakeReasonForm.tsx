"use client";

import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { Alert, Form, message, Modal, Select } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Class, Course, RetakeCourseReason } from "@/types";
import {
    updateRetakeReason,
} from "@/lib/api/retake-course";
import { BulbOutlined } from "@ant-design/icons";
import { filterOption } from "@/lib/utils";
import {
    getCurrentClassesAsOptions,
    getYearEnrollments,
    getYearsAsOptions,
} from "@/lib/api";

type FormDataType = {
    courseId: number;
    reason: "low_attendance" | "missing_course" | "failed_course";
    classId: number;
    yearId: number;
};

type EditRetakeReasonFormProps = {
  courses?: Course[];
  classes?: Class[];
  currentRetakeCourseReason: RetakeCourseReason[];
  currentDoneRetakeCourseReason: RetakeCourseReason[];
  staticData: {
    matricule: string;
    studentName: string;
    facultyId: number;
    departmentId: number;
  };
  retakeCourseReasonToEdit: RetakeCourseReason;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditRetakeReasonForm: FC<EditRetakeReasonFormProps> = ({
    courses,
    classes,
    staticData,
    retakeCourseReasonToEdit,
    setOpen,
    open,
    currentDoneRetakeCourseReason,
    currentRetakeCourseReason,
}) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: updateRetakeReason,
    });

    const {
        data: enrollments,
        isPending: isPendingEnrollememts,
        isError,
    } = useQuery({
        queryKey: [
            "year_enrollments",
            staticData.facultyId,
            staticData.departmentId,
            staticData.matricule,
        ],
        queryFn: ({ queryKey }) =>
            getYearEnrollments({
                facultyId: Number(queryKey[2]),
                departmentId: Number(staticData.departmentId),
                search: staticData.matricule,
            }),
        enabled: !!staticData,
    });

    const getYearsFromEnrollement = () => {
        const years = enrollments?.results.map(
            (enrollment) => enrollment.academic_year
        );
        return years;
    };

    useEffect(() => {
        if (retakeCourseReasonToEdit) {
          form.setFieldsValue({
            courseId: retakeCourseReasonToEdit.available_course.id,
            reason: retakeCourseReasonToEdit.reason,
            yearId: retakeCourseReasonToEdit.academic_year.id,
            classId: retakeCourseReasonToEdit.class_year.id,
          });
        }
    }, [form]);

    const onCancel = () => {
        setOpen(false);
    };

    const onFinish = (values: FormDataType) => {
        mutateAsync(
          {
            id: retakeCourseReasonToEdit.id,
            courseId: values.courseId,
            reason: values.reason,
            yearId: values.yearId,
            classId: values.classId,
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["retake-courses"] });
              messageApi.success("Modifiée avec succès !");
              setOpen(false);
            },
            onError: (error) => {
              if ((error as any).status === 403) {
                messageApi.error(
                  `Vous n'avez pas la permission d'effectuer cette action`
                );
              } else if ((error as any).status === 401) {
                messageApi.error(
                  "Vous devez être connecté pour effectuer cette action."
                );
              } else {
                messageApi.error(
                  (error as any)?.response?.data?.message ||
                    "Erreur lors de la modification."
                );
              }
            },
          }
        );
    };

    return (
      <>
        {contextHolder}
        <Modal
          open={open}
          title={`Modifier le cours à reprendre - ${staticData.studentName}`}
          centered
          okText="Modifier"
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
              name="edit_retake_reason_form"
              onFinish={onFinish}
              disabled={isPending}
            >
              {dom}
            </Form>
          )}
        >
          <Alert
            // message={"Modifier un cours à reprendre"}
            description="Modifiez si nécessaire le cours à reprendre, la raison, l'année académique et la promotion durant laquelle l'étudiant avait manqué ou échoué ce cours."
            type="info"
            showIcon
            icon={<BulbOutlined />}
            style={{ border: 0 }}
            closable
          />
          <Form.Item
            name="courseId"
            label={"Cours à reprendre"}
            rules={[
              { required: true, message: "Veuillez sélectionner un cours." },
            ]}
            style={{ marginTop: 24 }}
          >
            <Select
              placeholder="Sélectionnez un cours"
              options={courses?.map((c) => ({
                label: `${c.name} (${c.code})`,
                value: c.id,
                disabled:
                  currentRetakeCourseReason.some(
                    (r) => r.available_course.id === c.id
                  ) ||
                  (currentDoneRetakeCourseReason.some(
                    (r) => r.available_course.id === c.id
                  ) &&
                    c.id !== retakeCourseReasonToEdit.available_course.id),
              }))}
              showSearch
              filterOption={filterOption}
            />
          </Form.Item>
          <Form.Item
            name="reason"
            label="Raison de la reprise"
            rules={[
              { required: true, message: "Veuillez indiquer la raison." },
            ]}
          >
            <Select
              placeholder="Sélectionnez une raison"
              options={[
                { value: "low_attendance", label: "Faible assiduité" },
                { value: "missing_course", label: "Cours manquant" },
                { value: "failed_course", label: "Échec au cours" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="yearId"
            label="Année académique"
            rules={[{ required: true, message: "" }]}
            tooltip="Sélectionnez l'année académique durant laquelle l'étudiant avait manqué ou échoué ce cours."
          >
            <Select
              loading={isPendingEnrollememts}
              options={getYearsAsOptions(getYearsFromEnrollement())}
              onChange={(value) => {
                const enrollment = enrollments?.results.find(
                  (enroll) => enroll.academic_year.id === value
                );
                form.setFieldValue("classId", enrollment?.class_year.id);
              }}
            />
          </Form.Item>
          <Form.Item
            name="classId"
            label="Promotion"
            rules={[{ required: true, message: "" }]}
            tooltip="Sélectionnez la promotion durant laquelle l'étudiant avait manqué ou échoué ce cours."
          >
            <Select options={getCurrentClassesAsOptions(classes)} />
          </Form.Item>
        </Modal>
      </>
    );
};
