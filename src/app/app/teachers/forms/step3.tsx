"use client";

import { useTeacherStepsData } from "@/hooks/use-teacher-steps-data";
import { createTeacher } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Form,
  Space,
  Checkbox,
  Alert,
  Radio,
  Input,
  message,
} from "antd";
import dayjs from "dayjs";
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
  is_permanent_teacher: z.boolean(),
  certified: z.boolean().refine((val) => val === true, {
    message: "Vous devez certifier que les renseignements sont exacts.",
  }),
  institution_of_origin: z.string().refine((val) => val !== "", {
    message:
      "L'institution d'origine est requise pour les enseignants visiteurs.",
  }),
});

type FormSchemaType = z.infer<typeof formSchema>;

export const Step3: FC<Props> = ({ setStep }) => {
  const [form] = Form.useForm<FormSchemaType>();
  const [messageApi, contextHolder] = message.useMessage();
  const is_permanent_teacher = Form.useWatch("is_permanent_teacher", form);
  const [newTeacher, setNewTeacher] = useQueryState("new", parseAsBoolean);
  const { data: sdata, removeData } = useTeacherStepsData();

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createTeacher,
  });

  const onFinish = (values: FormSchemaType) => {
    console.log(sdata);
    if (sdata) {
      mutateAsync(
        {
          is_permanent_teacher: values.is_permanent_teacher,
          // assigned_faculties: sdata.assigned_faculties,
          // assigned_departements: sdata.assigned_departements,
          gender: sdata.gender,
          institution_of_origin: values.is_permanent_teacher
            ? ""
            : values.institution_of_origin,
          academic_title: sdata.academic_title,
          academic_grade: sdata.academic_grade,
          other_responsabilities: sdata.other_responsabilities || "",
          nationality: sdata.nationality,
          phone_number_1: sdata.phone_number_1,
          phone_number_2: sdata.phone_number_2,
          marital_status: sdata.marital_status,
          field_of_study: sdata.field_of_study,
          education_level: sdata.education_level,
          first_name: sdata.first_name,
          last_name: sdata.last_name,
          surname: sdata.surname,
          email: sdata.email,
          religious_affiliation: sdata.religious_affiliation || "",
          physical_ability: sdata.physical_ability,
          avatar: null,
          place_of_birth: sdata.place_of_birth || "",
          date_of_birth: sdata.date_of_birth
            ? dayjs(sdata.date_of_birth).format("YYYY-MM-DD")
            : null,
          city_or_territory: sdata.city_or_territory || "",
          address: sdata.address || "",
          is_foreign_country_teacher: sdata.is_foreign_country_teacher||false,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
            messageApi.success("Profil enseignant créé avec succès.");
            setNewTeacher(null);
            setStep(null);
            removeData();
          },
          onError: () => {
            messageApi.error(
              "Une erreur est survenue lors de la création du profil enseignant."
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
        form={form}
        onFinish={onFinish}
        style={{ maxWidth: 520, margin: "auto" }}
        disabled={isPending}
      >
        <Form.Item
          label="Type de personnel"
          name="is_permanent_teacher"
          rules={[{ required: true }]}
        >
          <Radio.Group
            options={[
              { value: true, label: "Permanent" },
              { value: false, label: "Visiteur" },
            ]}
          />
        </Form.Item>
        {is_permanent_teacher === false && (
          <Form.Item
            name="institution_of_origin"
            label="Origine"
            rules={[
              {
                required: true,
                message:
                  "L'institution d'origine est requise pour les enseignants visiteurs.",
              },
            ]}
          >
            <Input placeholder="Institution ou organisation d'origine" />
          </Form.Item>
        )}
        <Alert
          type="info"
          showIcon
          description="En soumettant ce formulaire, je confirme que les informations fournies sont exactes et complètes. Je m'engage également à respecter les règlements et les exigences de l'établissement en tant qu'enseignant."
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
        <Form.Item
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: 20,
          }}
        >
          <Space>
            <Button onClick={() => setStep(1)} style={{ boxShadow: "none" }}>
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
      </Form>
    </>
  );
};

