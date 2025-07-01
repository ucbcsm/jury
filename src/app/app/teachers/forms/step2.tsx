"use client";
// import {
//   getCurrentDepartmentsAsOptions,
//   getCurrentFacultiesAsOptions,
// } from "@/lib/api";
import { 
  // Department, Faculty, 
  Step2TeacherFormDataType } from "@/types";
import { Button, Form, Input, Select, Space } from "antd";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { Options } from "nuqs";
import { FC, useEffect } from "react";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
  // faculties?: Faculty[];
  // departments?: Department[];
};

// const formSchema = z.object({
//   field_of_study: z.string().nonempty("Le domaine d'étude est requis"),
//   education_level: z.enum(["bachelor", "master", "phd"], {
//     required_error: "Le niveau d'éducation est requis",
//   }),
//   academic_title: z.string().nonempty("Le titre académique est requis"),
//   academic_grade: z.string().nonempty("Le grade académique est requis"),
//   assigned_faculties: z
//     .array(z.enum(["science", "arts", "engineering"]))
//     .nonempty("Au moins une faculté assignée est requise"),
//   assigned_departements: z
//     .array(z.enum(["math", "physics", "chemistry"]))
//     .nonempty("Au moins un département assigné est requis"),
//   other_responsabilities: z.string().optional(),
// });
// type FormSchemaType = z.infer<typeof formSchema>;

export const Step2: FC<Props> = ({ setStep,
  //  faculties, departments 
  }) => {
  const [form] = Form.useForm<Step2TeacherFormDataType>();

  useEffect(() => {
    const savedData = localStorage.getItem("dt2");
    if (typeof savedData === "string") {
      const raw = decompressFromEncodedURIComponent(savedData);
      const data = JSON.parse(raw);
      form.setFieldsValue({
        ...data,
      });
    }
  }, []);

  return (
    <Form
      form={form}
      onFinish={(values) => {
        const compressedData = compressToEncodedURIComponent(
          JSON.stringify(values)
        );
        localStorage.setItem("dt2", compressedData);
        setStep(2);
      }}
      style={{ maxWidth: 520, margin: "auto" }}
    >
      <Form.Item
        label="Niveau d'éducation"
        name="education_level"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Niveau d'éducation"
          options={[
            { value: "Licence", label: "Licence" },
            { value: "Master", label: "Master" },
            { value: "Doctorat", label: "Doctorat" },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Domaine d'étude"
        name="field_of_study"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Domaine d'étude"
          options={[
            { value: "Sciences humaines", label: "Sciences humaines" },
            {
              value: "Lettres et langues",
              label: "Lettres et langues",
            },
            { value: "Sciences sociales", label: "Sciences sociales" },
            { value: "Droit", label: "Droit" },
            {
              value: "Économie et gestion",
              label: "Économie et gestion",
            },
            { value: "Sciences exactes", label: "Sciences exactes" },
            { value: "Mathématiques", label: "Mathématiques" },
            { value: "Informatique", label: "Informatique" },
            {
              value: "Sciences de l’ingénieur",
              label: "Sciences de l’ingénieur",
            },
            { value: "Santé", label: "Santé" },
            { value: "Médecine", label: "Médecine" },
            { value: "Éducation", label: "Éducation" },
            { value: "Arts", label: "Arts" },
            { value: "Architecture", label: "Architecture" },
            {
              value: "Sciences de l’environnement",
              label: "Sciences de l’environnement",
            },
            { value: "Agronomie", label: "Agronomie" },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Titre académique"
        name="academic_title"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Titre académique"
          options={[
            { value: "Licence / Bachelor", label: "Licence / Bachelor" },
            {
              value: "Licence Professionnelle",
              label: "Licence Professionnelle",
            },
            { value: "Master", label: "Master" },
            { value: "Master Recherche", label: "Master Recherche" },
            { value: "Master Professionnel", label: "Master Professionnel" },
            { value: "Ingénieur diplômé", label: "Ingénieur diplômé" },
            {
              value: "Mastère Spécialisé (MS)",
              label: "Mastère Spécialisé (MS)",
            },
            {
              value: "MBA (Master of Business Administration)",
              label: "MBA (Master of Business Administration)",
            },
            { value: "Doctorat / PhD", label: "Doctorat / PhD" },
            {
              value: "Doctorat Professionnel",
              label: "Doctorat Professionnel",
            },
            {
              value: "Habilitation à diriger des recherches (HDR)",
              label: "Habilitation à diriger des recherches (HDR)",
            },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Grade académique"
        name="academic_grade"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Grade académique"
          options={[
            {
              value: "Assistant d’enseignement / Moniteur",
              label: "Assistant d’enseignement / Moniteur",
            },
            {
              value: "Assistant de recherche",
              label: "Assistant de recherche",
            },
            {
              value: "Chargé de cours / Chargé d’enseignement",
              label: "Chargé de cours / Chargé d’enseignement",
            },
            {
              value: "Attaché temporaire d’enseignement et de recherche (ATER)",
              label: "Attaché temporaire d’enseignement et de recherche (ATER)",
            },
            {
              value: "Maître de conférences",
              label: "Maître de conférences",
            },
            {
              value: "Professeur des universités",
              label: "Professeur des universités",
            },
            { value: "Professeur émérite", label: "Professeur émérite" },
            {
              value: "Chargé de recherche (CNRS, INRAE, etc.)",
              label: "Chargé de recherche (CNRS, INRAE, etc.)",
            },
            {
              value: "Directeur de recherche",
              label: "Directeur de recherche",
            },
            {
              value: "Doctorant / Doctorante",
              label: "Doctorant / Doctorante",
            },
            {
              value: "Postdoctorant / Postdoctorante",
              label: "Postdoctorant / Postdoctorante",
            },
            { value: "Professeur associé", label: "Professeur associé" },
          ]}
        />
      </Form.Item>
      {/* <Form.Item
        label="Facultés assignées"
        name="assigned_faculties"
        rules={[{ required: true }]}
      >
        <Select
          mode="multiple"
          placeholder="Facultés assignées"
          options={getCurrentFacultiesAsOptions(faculties)}
        />
      </Form.Item>
      <Form.Item
        label="Départements assignés"
        name="assigned_departements"
        rules={[{ required: true }]}
      >
        <Select
          mode="multiple"
          placeholder="Départements assignés"
          options={getCurrentDepartmentsAsOptions(departments)}
        />
      </Form.Item> */}
      <Form.Item
        label="Autres responsabilités/Charge administrative"
        name="other_responsabilities"
        rules={[]}
      >
        <Input.TextArea placeholder="Autres responsabilités/Charge administrative" />
      </Form.Item>
      <Form.Item
        style={{ display: "flex", justifyContent: "flex-end", paddingTop: 20 }}
      >
        <Space>
          <Button onClick={() => setStep(0)} style={{ boxShadow: "none" }}>
            Précédent
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{ boxShadow: "none" }}
          >
            Suivant
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
