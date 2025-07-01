"use client";

import { Palette } from "@/components/palette";
import { useYid } from "@/hooks/use-yid";
import {
  formatAdmissionTestResultsForEdition,
  formatApplicationDocumentsForEdition,
  formatEnrollmentQuestionResponseForEdition,
  parseLanguages,
  updateStudentInfo,
} from "@/lib/api";
import { countries } from "@/lib/data/countries";
import { Enrollment } from "@/types";
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Drawer,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Select,
  Space,
  theme,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { FC, useState } from "react";

type EditStudentProfileFormProps = {
  data?: Enrollment;
};

export const EditStudentProfileForm: FC<EditStudentProfileFormProps> = ({
  data,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [open, setOpen] = useState<boolean>(false);
  const { yid } = useYid();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [editMatricule, setEditMatricule] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateStudentInfo,
  });


  const onFinish = (values: any) => {
    if (!data) {
      messageApi.error("Aucune donnée disponible pour la mise à jour.");
    } else {
      mutateAsync(
        {
          id: Number(data?.common_enrollment_infos.id),
          params: {
            ...values,
            user: {
              id: data?.user.id,
              first_name: values.first_name,
              last_name: values.last_name,
              surname: values.surname,
              email: values.email,
              avatar: data?.user.avatar,
              matricule: values.matricule,
              pending_avatar: data?.user.pending_avatar,
              is_active:data.user.is_active,
              is_staff:data.user.is_staff,
              is_student:data.user.is_student,
              is_superuser:data.user.is_superuser,
              is_permanent_teacher:data.user.is_permanent_teacher
            },
            application_documents: formatApplicationDocumentsForEdition(
              data?.common_enrollment_infos.application_documents
            ),
            enrollment_question_response:
              formatEnrollmentQuestionResponseForEdition(
                data?.common_enrollment_infos.enrollment_question_response
              ),

            admission_test_result: formatAdmissionTestResultsForEdition(
              data?.common_enrollment_infos.admission_test_result
            ),
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["year_enrollments", `${yid}`],
            });
            queryClient.invalidateQueries({
              queryKey: ["enrollment", `${data.id}`],
            });
            messageApi.success("Profil étudiant mise à jour avec succès.");
            setEditMatricule(false);
            setOpen(false);
          },
          onError: () => {
            messageApi.error(
              "Une erreur est survenue lors de la mise à jour du profil étudiant."
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
            Info étudiant:{" "}
            <Typography.Text
              type="warning"
              style={{ textTransform: "uppercase" }}
            >
              {data?.user.first_name} {data?.user.last_name}{" "}
              {data?.user.surname}
            </Typography.Text>
          </div>
        }
        width="100%"
        closable={false}
        onClose={() => setOpen(false)}
        destroyOnClose
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
            ...data?.common_enrollment_infos,
            ...data?.user,
            date_of_birth: dayjs(data?.common_enrollment_infos.date_of_birth),
            spoken_languages: parseLanguages(
              data?.common_enrollment_infos.spoken_language!
            ),
            year_of_diploma_obtained: dayjs(
              `${data?.common_enrollment_infos.year_of_diploma_obtained}`,
              "YYYY"
            ),
          }}
          onFinish={onFinish}
          disabled={isPending}
          style={{ maxWidth: 520, margin: "auto" }}
        >
          <Alert
            showIcon
            message="Identifiant académique"
            type="info"
            description={
              <Form.Item
                name="matricule"
                label="Matricule"
                rules={[{ required: true }]}
                status="error"
                style={{ marginBottom: 0 }}
              >
                <Input variant="filled" style={{ width: 120 }} disabled />
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
            label="Nationalité"
            name="nationality"
            rules={[{ required: true }]}
          >
            <Select placeholder="Nationalité" options={countries} showSearch />
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
            label="Affiliation religieuse"
            name="religious_affiliation"
            rules={[{ required: true }]}
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
          <Typography.Text>Langues parlées</Typography.Text>
          <Form.List
            name={["spoken_languages"]}
            rules={[
              {
                validator(_, value) {
                  if (!value?.length) {
                    return Promise.reject(
                      new Error("Ajouter au moins une langue")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <div className="pt-2">
                {fields.map(({ key, name, ...restField }, index) => (
                  <div className="" key={key}>
                    <Flex gap={16}>
                      <Form.Item
                        {...restField}
                        name={[name, "language"]}
                        label={`Langue ${index + 1}`}
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                        style={{ flex: 1 }}
                      >
                        <Input placeholder={`Langue parlée ${index + 1}`} />
                      </Form.Item>

                      <Button
                        danger
                        type="text"
                        onClick={() => remove(name)}
                        icon={<CloseOutlined />}
                        style={{ boxShadow: "none" }}
                      />
                    </Flex>
                  </div>
                ))}
                {errors.map((Error) => (
                  <Typography.Text type="danger">{Error}</Typography.Text>
                ))}
                <Form.Item style={{}}>
                  <Button
                    type="link"
                    onClick={() => add()}
                    icon={<PlusCircleOutlined />}
                    block
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    Ajouter une langue parlée
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
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
            <Typography.Title level={3}>Parents</Typography.Title>
          </Divider>
          <Form.Item
            label="Nom du père"
            name="father_name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Nom du père" />
          </Form.Item>
          <Form.Item
            label="Nom de la mère"
            name="mother_name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Nom de la mère" />
          </Form.Item>
          <Form.Item
            label="Téléphone du père"
            name="father_phone_number"
            rules={[]}
          >
            <Input placeholder="Téléphone du père" />
          </Form.Item>
          <Form.Item
            label="Téléphone de la mère"
            name="mother_phone_number"
            rules={[]}
          >
            <Input placeholder="Téléphone de la mère" />
          </Form.Item>
          <Divider orientation="left" orientationMargin={0}>
            <Typography.Title level={3}>
              Origine de l&apos;étudiant
            </Typography.Title>
          </Divider>
          <Form.Item
            label="Pays d'origine"
            name="country_of_origin"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Pays d'origine"
              options={countries}
              showSearch
            />
          </Form.Item>
          <Form.Item
            label="Province d'origine"
            name="province_of_origin"
            rules={[{ required: true }]}
          >
            <Input placeholder="Province d'origine" />
          </Form.Item>
          <Form.Item
            label="Ville ou Territoire d'origine"
            name="territory_or_municipality_of_origin"
            rules={[{ required: true }]}
          >
            <Input placeholder="Ville ou Territoire d'origine" />
          </Form.Item>
          <Form.Item
            label="Est-il étranger?"
            name="is_foreign_registration"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>

          <Divider orientation="left" orientationMargin={0}>
            <Typography.Title level={3}>Adresse actuelle</Typography.Title>
          </Divider>
          <Form.Item
            label="Ville actuelle"
            name="current_city"
            rules={[{ required: true }]}
          >
            <Input placeholder="Ville actuelle" />
          </Form.Item>
          <Form.Item
            label="Municipalité actuelle"
            name="current_municipality"
            rules={[{ required: true }]}
          >
            <Input placeholder="Municipalité actuelle" />
          </Form.Item>
          <Form.Item
            label="Adresse actuelle"
            name="current_neighborhood"
            rules={[{ required: true }]}
          >
            <Input.TextArea placeholder="Quartier ou Avenue et No" />
          </Form.Item>

          <Divider orientation="left" orientationMargin={0}>
            <Typography.Title level={3}>Études secondaires</Typography.Title>
          </Divider>

          <Form.Item
            label="Nom de l'école secondaire"
            name="name_of_secondary_school"
            rules={[{ required: true }]}
          >
            <Input placeholder="Nom de l'école secondaire" />
          </Form.Item>
          <Form.Item
            label="Pays de l'école secondaire"
            name="country_of_secondary_school"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Pays de l'école secondaire"
              options={countries}
              showSearch
            />
          </Form.Item>
          <Form.Item
            label="Province de l'école secondaire"
            name="province_of_secondary_school"
            rules={[{ required: true }]}
          >
            <Input placeholder="Province de l'école secondaire" />
          </Form.Item>
          <Form.Item
            label="Ville ou Territoire de l'école"
            name="territory_or_municipality_of_school"
            rules={[{ required: true }]}
          >
            <Input placeholder="Territoire ou municipalité de l'école" />
          </Form.Item>
          <Form.Item
            label="Section ou option suivie aux humanités"
            name="section_followed"
            rules={[{ required: true }]}
          >
            <Input placeholder="Section suivie" />
          </Form.Item>
          <Form.Item
            label="Année d'obtention du diplôme"
            name="year_of_diploma_obtained"
            rules={[{ required: true }]}
          >
            <DatePicker
              placeholder="Année"
              mode="year"
              picker="year"
              format="YYYY"
            />
          </Form.Item>
          <Form.Item label="Numéro du diplôme" name="diploma_number" rules={[]}>
            <Input placeholder="Numéro du diplôme" />
          </Form.Item>
          <Form.Item
            label="Pourcentage obtenu au diplôme"
            name="diploma_percentage"
            rules={[{ required: true }]}
          >
            <InputNumber
              placeholder="Pourcentage obtenu au diplôme"
              step={0.01}
              suffix="%"
              min={50}
              max={100}
            />
          </Form.Item>

          <Divider orientation="left" orientationMargin={0}>
            <Typography.Title level={3}>
              Occupations après les humanités
            </Typography.Title>
          </Divider>
          <Form.Item
            label="Activités professionnelles"
            name="professional_activity"
            rules={[]}
          >
            <Input.TextArea placeholder="Activités professionnelles" />
          </Form.Item>

          <Divider orientation="left" orientationMargin={0}>
            <Typography.Title level={3}>
              Études universitaires précédentes
            </Typography.Title>
          </Divider>
          <Form.List name="previous_university_studies">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div className="py-4" key={key}>
                    <Badge count={index + 1} />
                    <Form.Item
                      {...restField}
                      name={[name, "academic_year"]}
                      label="Année académique"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez entrer l'année académique",
                        },
                      ]}
                    >
                      <Input placeholder="Année académique" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "institution"]}
                      rules={[
                        {
                          required: true,
                          message: "Veuillez entrer l'établissement",
                        },
                      ]}
                      label="Établissement"
                    >
                      <Input placeholder="Établissement" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "study_year_and_faculty"]}
                      label="Faculté/Département"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input placeholder="Faculté/Département" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "result"]}
                      label="Résultat"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez entrer le résultat",
                        },
                      ]}
                    >
                      <Input placeholder="Résultat" />
                    </Form.Item>
                    <Button
                      danger
                      block
                      onClick={() => remove(name)}
                      icon={<DeleteOutlined />}
                      style={{ boxShadow: "none" }}
                    >
                      Supprimer
                    </Button>
                  </div>
                ))}
                <Form.Item style={{ marginTop: 24 }}>
                  <Button
                    type="link"
                    onClick={() => add()}
                    icon={<PlusCircleOutlined />}
                    block
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    Ajouter une ligne
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Drawer>
    </>
  );
};
