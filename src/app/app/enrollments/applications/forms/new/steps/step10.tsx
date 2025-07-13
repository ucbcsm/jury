"use client";
import { Palette } from "@/components/palette";
import { useApplicationStepsData } from "@/hooks/use-application-steps-data";
import { createApplication } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Space, Checkbox, Alert, message, Flex } from "antd";
import { Options, parseAsBoolean, useQueryState } from "nuqs";
import { FC } from "react";
import { z } from "zod";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

const formSchema = z.object({
  certified: z.boolean().refine((val) => val === true, {
    message: "Vous devez certifier que les renseignements sont exacts.",
  }),
});

type FormSchemaType = z.infer<typeof formSchema>;

export const Step10: FC<Props> = ({ setStep }) => {
  const [form] = Form.useForm<FormSchemaType>();
  const [messageApi, contextHolder] = message.useMessage();
  const [newApplication, setNewApplication] = useQueryState(
    "new",
    parseAsBoolean
  );
  const { data: sdata, removeData } = useApplicationStepsData();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, } = useMutation({
    mutationFn: createApplication,
  });

  const onFinish = (values: FormSchemaType) => {

    if (sdata) {
      mutateAsync(
        {
          year_id: sdata.year_id,
          cycle_id: sdata.cycle_id,
          faculty_id: sdata.faculty_id,
          field_id: sdata.field_id,
          department_id: sdata.department_id,
          class_id: sdata.class_id,
          student_previous_studies: sdata.previous_university_studies,
          enrollment_q_a: sdata.enrollment_q_a,
          test_result: [],
          gender: sdata.gender,
          place_of_birth: sdata.place_of_birth,
          date_of_birth: sdata.date_of_birth,
          nationality: sdata.nationality,
          marital_status: sdata.marital_status,
          religious_affiliation: sdata.religious_affiliation,
          phone_number_1: sdata.phone_number_1,
          phone_number_2: sdata.phone_number_2,
          name_of_secondary_school: sdata.name_of_secondary_school,
          country_of_secondary_school: sdata.country_of_secondary_school,
          province_of_secondary_school: sdata.province_of_secondary_school,
          territory_or_municipality_of_school:
            sdata.territory_or_municipality_of_school,
          section_followed: sdata.section_followed,
          father_name: sdata.father_name,
          father_phone_number: sdata.father_phone_number || null,
          mother_name: sdata.mother_name,
          mother_phone_number: sdata.mother_phone_number || null,
          current_city: sdata.current_city,
          current_municipality: sdata.current_municipality,
          current_neighborhood: sdata.current_neighborhood,
          country_of_origin: sdata.country_of_origin,
          province_of_origin: sdata.province_of_origin,
          territory_or_municipality_of_origin:
            sdata.territory_or_municipality_of_origin,
          physical_ability: sdata.physical_ability,
          professional_activity: sdata.professional_activity,
          spoken_languages: sdata.spoken_languages,
          year_of_diploma_obtained: sdata.year_of_diploma_obtained,
          diploma_number: sdata.diploma_number,
          diploma_percentage: sdata.diploma_percentage,
          is_foreign_registration: sdata.is_foreign_registration || null,
          former_matricule: null,
          type_of_enrollment: "new_application",
          surname: sdata.surname,
          last_name: sdata.last_name,
          first_name: sdata.first_name,
          email: sdata.email,
          avatar: "",
          is_former_student: false,
          status: "pending",
          enrollment_fees: "unpaid",
          application_documents:sdata.application_documents
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
            removeData();
            setStep(null);
            setNewApplication(null);
            messageApi.success(
              "Votre candidature a été soumise avec succès. Vous serez contacté après examen de votre dossier."
            );
          },
          onError: () => {
            messageApi.error(
              "Une erreur s'est produite lors de la soumission de votre candidature. Veuillez réessayer."
            );
          },
        }
      );
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        disabled={isPending}
        form={form}
        onFinish={onFinish}
      >
        <Alert
          type="info"
          showIcon
          description="L'Univertisté Chrétienne Bilingue du Congo est engagée et déterminée à poursuivre l'excellence dans la formation de la jeunesse congolaise pour la formtion intégrale. Ainsi des pratiques telles que la tricherie, le plagiat, la corruption, le vol, la débauche, l'ivrognerie, la promiscuité, le dérèglement social, l'accoutrement indécent, etc. sont strictement interdites et sévèrement sanctionnées. Ainsi, JE M'ENGAGE FERMEMENT à me soumettre à toutes les exigences de l'université et au code de conduite de l'étudiant tel que repris dans le manuel de l'étudiant en cas de mon admission à l'UCBC"
          style={{ border: 0 }}
        />
        <Form.Item
          name="certified"
          valuePropName="checked"
          rules={[
            { required: true, message: "Vous devez certifier cette case." },
          ]}
          style={{ marginTop: 16 }}
        >
          <Checkbox>
            Je certifie sur honneur que les renseignements ci-haut fournis sont
            exacts
          </Checkbox>
        </Form.Item>
        <Flex justify="space-between" align="center">
        <Palette />
        <Form.Item
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: 20,
          }}
        >
          <Space>
            <Button onClick={() => setStep(8)} style={{ boxShadow: "none" }}>
              Précédent
            </Button>
            <Button
              loading={isPending}
              type="primary"
              htmlType="submit"
              style={{ boxShadow: "none" }}
            >
              Soumettre maintenant
            </Button>
          </Space>
        </Form.Item>
        </Flex>
      </Form>
    </>
  );
};
