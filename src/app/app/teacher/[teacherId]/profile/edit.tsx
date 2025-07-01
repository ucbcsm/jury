"use client";

import { Palette } from "@/components/palette";
import {
  // getCurrentDepartmentsAsOptions,
  // getCurrentFacultiesAsOptions,
  updateTeacher,
} from "@/lib/api";
import { countries } from "@/lib/data/countries";

import {
  //  Department, Faculty, 
  Teacher } from "@/types";
import { CloseOutlined, EditOutlined, LockOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Radio,
  Select,
  Space,
  theme,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { FC, useState } from "react";

type EditTeacherProfileFormProps = {
  teacher?: Teacher;
  // departments?: Department[];
  // faculties?: Faculty[];
};

export const EditTeacherProfileForm: FC<EditTeacherProfileFormProps> = ({
  teacher,
  // faculties,
  // departments,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [open, setOpen] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const is_permanent_teacher = Form.useWatch("is_permanent_teacher", form);
  const [editMatricule, setEditMatricule] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateTeacher,
  });


  const onFinish = (values: any) => {
    if (!teacher) {
      messageApi.error("Aucune donnée disponible pour la mise à jour.");
    } else {
      mutateAsync(
        {
          id: Number(teacher.id),
          params: {
            ...values,
            date_of_birth: dayjs(values.date_of_birth).format("YYYY-MM-DD"),
            institution_of_origin: values.is_permanent_teacher
              ? ""
              : values.institution_of_origin,
            user: {
              id: teacher?.user.id,
              first_name: values.first_name,
              last_name: values.last_name,
              surname: values.surname,
              email: values.email,
              avatar: teacher?.user.avatar,
              matricule: values.matricule,
              pending_avatar: teacher?.user.pending_avatar || null,
              is_permanent_teacher: values.is_permanent_teacher,
              is_active: teacher.user.is_active,
              is_staff: teacher.user.is_staff,
              is_student: teacher.user.is_student,
              is_superuser: teacher.user.is_superuser,
            },
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
            queryClient.invalidateQueries({
              queryKey: ["teacher", `${teacher.id}`],
            });
            messageApi.success("Profil enseignant mise à jour avec succès.");
            setEditMatricule(false);
            setOpen(false);
          },
          onError: () => {
            messageApi.error(
              "Une erreur est survenue lors de la mise à jour du profil enseignant."
            );
          },
        }
      );
    }
  };

  return (
    <>
      {contextHolder}
      <Button
        type="link"
        icon={<EditOutlined />}
        title="Modifier le profile"
        onClick={() => {
          setOpen(true);
        }}
      >
        Modifier
      </Button>
      <Drawer
        open={open}
        title={
          <div className="text-white">
            Info enseignant:{" "}
            <Typography.Text
              type="warning"
              style={{ textTransform: "uppercase" }}
            >
              {teacher?.user.first_name} {teacher?.user.last_name}{" "}
              {teacher?.user.surname}
            </Typography.Text>
          </div>
        }
        width="100%"
        closable={false}
        onClose={() => setOpen(false)}
        destroyOnHidden
        styles={{ header: { background: colorPrimary } }}
        extra={
          <Space>
            <Button
              style={{ boxShadow: "none", color: "#fff" }}
              onClick={() => {
                setOpen(false);
              }}
              icon={<CloseOutlined />}
              type="text"
              disabled={isPending}
            />
          </Space>
        }
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 24px",
            }}
          >
            <Palette />

            <Space>
              <Button
                type="primary"
                onClick={() => form.submit()}
                loading={isPending}
                style={{ boxShadow: "none" }}
                disabled={isPending}
              >
                Sauvegarder
              </Button>
            </Space>
          </div>
        }
      >
        <Form
          form={form}
          name="form_in_drawer"
          initialValues={{
            ...teacher,
            ...teacher?.user,
            // assigned_departements: teacher?.assigned_departements?.map(
            //   (dept) => dept.id
            // ),
            // assigned_faculties: teacher?.assigned_faculties?.map(
            //   (fac) => fac.id
            // ),
            is_permanent_teacher: teacher?.user.is_permanent_teacher,
            date_of_birth: dayjs(`${teacher?.date_of_birth}`, "YYYY-MM-DD"),
          }}
          onFinish={onFinish}
          disabled={isPending}
          style={{ maxWidth: 520, margin: "auto" }}
        >
          <Alert
            showIcon
            message="Identifiant administratif"
            type="info"
            description={
              <Form.Item
                name="matricule"
                label="Matricule"
                rules={[{ required: true }]}
                status="error"
                style={{ marginBottom: 0 }}
              >
                <Input
                  variant="filled"
                  style={{ width: 120 }}
                  disabled={!editMatricule}
                />
              </Form.Item>
            }
            style={{ marginTop: 8 }}
            action={
              <Button
                type="link"
                icon={!editMatricule ? <EditOutlined /> : <LockOutlined />}
                onClick={() => setEditMatricule((prev) => !prev)}
              />
            }
          />
          <Form.Item
            label="Type de personnel"
            name="is_permanent_teacher"
            rules={[{ required: true }]}
            style={{ marginTop: 24 }}
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
              rules={[{ required: true }]}
            >
              <Input placeholder="Institution d'origine" />
            </Form.Item>
          )}
          <Divider orientation="left" orientationMargin={0}>
            <Typography.Title level={3}>Identité</Typography.Title>
          </Divider>

          <Form.Item label="Nom" name="first_name" rules={[{ required: true }]}>
            <Input placeholder="Nom" />
          </Form.Item>
          <Form.Item
            label="Postnom"
            name="last_name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Postnom" />
          </Form.Item>
          <Form.Item label="Prénom" name="surname" rules={[{ required: true }]}>
            <Input placeholder="Prénom" />
          </Form.Item>
          <Form.Item label="Sexe" name="gender" rules={[{ required: true }]}>
            <Radio.Group
              options={[
                { value: "M", label: "Homme" },
                { value: "F", label: "Femme" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Lieu de naissance"
            name="place_of_birth"
            rules={[{ required: true }]}
          >
            <Input placeholder="Lieu de naissance" />
          </Form.Item>
          <Form.Item
            label="Date de naissance"
            name="date_of_birth"
            rules={[{ required: true }]}
          >
            <DatePicker
              placeholder="DD/MM/YYYY"
              format={{ format: "DD/MM/YYYY" }}
              picker="date"
            />
          </Form.Item>
          <Form.Item
            label="État civil"
            name="marital_status"
            rules={[{ required: true }]}
          >
            <Radio.Group
              options={[
                { value: "single", label: "Célibataire" },
                { value: "married", label: "Marié(e)" },
                { value: "divorced", label: "Divorcé(e)" },
                { value: "widowed", label: "Veuf(ve)" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Est-il étranger?"
            name="is_foreign_country_teacher"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Nationalité"
            name="nationality"
            rules={[{ required: true }]}
          >
            <Select placeholder="Nationalité" options={countries} showSearch />
          </Form.Item>
          <Form.Item
            label="Ville ou Térritoire"
            name="city_or_territory"
            rules={[{ required: true }]}
          >
            <Input placeholder="Ville ou Térritoire" />
          </Form.Item>
          <Form.Item
            label="Adresse"
            name="address"
            rules={[{ required: true }]}
          >
            <Input.TextArea placeholder="Quartier ou Avenue et No" />
          </Form.Item>
          <Form.Item
            label="Affiliation religieuse"
            name="religious_affiliation"
            rules={[]}
          >
            <Input placeholder="Affiliation religieuse" />
          </Form.Item>
          <Form.Item
            label="Aptitude physique"
            name="physical_ability"
            rules={[{ required: true, message: "Ce champ est requis" }]}
          >
            <Radio.Group
              options={[
                { value: "normal", label: "Normale" },
                { value: "disabled", label: "Handicapé" },
              ]}
            />
          </Form.Item>

          <Divider orientation="left" orientationMargin={0}>
            <Typography.Title level={3}>Contacts</Typography.Title>
          </Divider>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true }, { type: "email" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Téléphone 1"
            name="phone_number_1"
            rules={[{ required: true }]}
          >
            <Input placeholder="Téléphone 1" />
          </Form.Item>
          <Form.Item
            label="Téléphone 2"
            name="phone_number_2"
            rules={[{ required: false }]}
          >
            <Input placeholder="Numéro de téléphone 2" />
          </Form.Item>

          <Divider orientation="left" orientationMargin={0}>
            <Typography.Title level={3}>
              Etudes et titres académiques
            </Typography.Title>
          </Divider>
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
                {
                  value: "Master Professionnel",
                  label: "Master Professionnel",
                },
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
                  value:
                    "Attaché temporaire d’enseignement et de recherche (ATER)",
                  label:
                    "Attaché temporaire d’enseignement et de recherche (ATER)",
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
            rules={[{ required: false }]}
          >
            <Input.TextArea placeholder="Autres responsabilités/Charge administrative" />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
