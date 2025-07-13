"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  message,
  Space,
  theme,
  Input,
  Radio,
  DatePicker,
  Select,
  Typography,
  Flex,
  Divider,
  Checkbox,
  InputNumber,
  Upload,
  Badge,
  Alert,
  Card,
  Layout,
  Result,
  Dropdown,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  FileOutlined,
  HourglassOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Application,
  Class,
  Cycle,
  Department,
  Faculty,
  Field,
  RequiredDocument,
  TestCourse,
} from "@/types";
import { Palette } from "@/components/palette";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  formatApplicationDocumentsForEdition,
  formatEnrollmentQuestionResponseForEdition,
  getApplicationStatusAlertType,
  getApplicationStatusAsOptions,
  getCurrentClassesAsOptions,
  getCurrentCyclesAsOptions,
  getCurrentDepartmentsAsOptions,
  getCurrentFacultiesAsOptions,
  getCurrentFieldsAsOptions,
  getTestCoursesByFacAsOptions,
  parseLanguages,
  updateApplication,
} from "@/lib/api";
import { countries } from "@/lib/data/countries";
import dayjs from "dayjs";
import { DeleteApplicationForm } from "./applications/forms/decisions/delete";
import { RejectApplicationForm } from "./applications/forms/decisions/reject";
import { ValidateApplicationForm } from "./applications/forms/decisions/validate";
import { Options } from "nuqs";
import { MarkAsPendingForm } from "./applications/forms/decisions/mark-as-pending";

type ViewEditApplicationFormProps = {
  application?: Application;
  courses?: TestCourse[];
  documents?: RequiredDocument[];
  cycles?: Cycle[];
  faculties?: Faculty[];
  fields?: Field[];
  departments?: Department[];
  classes?: Class[];
  setView: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const ViewEditApplicationForm: React.FC<
  ViewEditApplicationFormProps
> = ({
  application,
  courses,
  documents,
  cycles,
  faculties,
  fields,
  departments,
  classes,
  setView,
}) => {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [openMarkAsPending, setOpenMarkAsPending] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openReject, setOpenReject] = useState<boolean>(false);
  const [openValidate, setOpenValidate] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateApplication,
  });

  const onFinish = (
    values: Omit<
      Application,
      | "id"
      | "academic_year"
      | "cycle"
      | "faculty"
      | "field"
      | "departement"
      | "class_year"
    > & {
      year_id: number;
      cycle_id: number;
      faculty_id: number;
      field_id: number;
      department_id: number;
      class_id: number;
      spoken_languages: { language: string }[];
    }
  ) => {
    if (typeof application === "undefined") {
    } else {
      mutateAsync(
        {
          id: Number(application?.id),
          params: {
            ...values,
            year_id: application.academic_year.id,
            type_of_enrollment: application.type_of_enrollment,
            application_documents: formatApplicationDocumentsForEdition(
              values.application_documents
            ),
            enrollment_question_response:
              formatEnrollmentQuestionResponseForEdition(
                values.enrollment_question_response
              ),
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
            messageApi.success("Candidature mise à jour avec succès.");
          },
          onError: () => {
            messageApi.error(
              "Une erreur est survenue lors de la mise à jour de la candidature."
            );
          },
        }
      );
    }
  };

  const getInitialAdmissionResultFromTestCourses = () => {
    const testCourses = courses?.filter(
      (course) => course.faculty.id === application?.faculty.id
    );
    return testCourses?.map((item) => ({
      course_test: item.id,
      result: null,
    }));
  };

  const formatAdmissionResultFromApplication = () => {
    return application?.admission_test_result.map((item) => ({
      id: item.id,
      course_test: item.course_test.id,
      result: item.result,
    }));
  };

  useEffect(() => {
    if (application?.admission_test_result?.length === 0) {
      const admissionTestResult = getInitialAdmissionResultFromTestCourses();
      form.setFieldsValue({
        admission_test_result: admissionTestResult,
      });
    } else if (
      typeof application !== "undefined" &&
      application.admission_test_result.length > 0
    ) {
      const admissionTestResult = formatAdmissionResultFromApplication();
      form.setFieldsValue({
        admission_test_result: admissionTestResult,
      });
    }
  }, [application, courses]);

  const getInitialRequiredDocuments = () => {
    return documents?.map((item) => ({
      exist: false,
      file_url: null,
      status: "pending",
      required_document: item,
    }));
  };

  useEffect(() => {
    if (application?.application_documents.length === 0) {
      const requiredDocuments = getInitialRequiredDocuments();
      form.setFieldsValue({ application_documents: requiredDocuments });
    } else if (
      typeof application !== "undefined" &&
      application.application_documents.length > 0
    ) {
      form.setFieldsValue({
        application_documents: application?.application_documents,
      });
    }
  }, [application, documents]);

  useEffect(() => {
    if(application){
    form.setFieldsValue({
      ...application,
      date_of_birth: dayjs(application.date_of_birth),
      spoken_languages: parseLanguages(application.spoken_language),
      cycle_id: application.cycle.id,
      field_id: application.field.id,
      faculty_id: application.faculty.id,
      department_id: application.departement.id,
      class_id: application.class_year?.id,
      enrollment_question_response: application.enrollment_question_response,
      year_of_diploma_obtained: dayjs(
        `${application.year_of_diploma_obtained}`,
        "YYYY"
      ),
    });
    }
  }, [application, form]);

  if (typeof application === "undefined") {
    return (
      <div
        className="flex flex-col justify-center"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <Result
          status="404"
          title="Contenu introuvable"
          subTitle="Impossible d'afficher cette candidature. Veuillez réessayer ou sélectionner une autre candidature."
        />
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <Layout>
        <Layout.Header
          style={{
            background: colorBgContainer,
            display: "flex",
            paddingLeft: 0,
            paddingRight: 0,
            borderBottom: `1px solid ${colorBorderSecondary}`,
          }}
        >
          <Space>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              Vue candidature:
            </Typography.Title>
            <Typography.Title
              level={5}
              type="warning"
              style={{ marginBottom: 0, textTransform: "uppercase" }}
            >
              {application.first_name} {application.last_name}{" "}
              {application.surname}
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Typography.Text type="secondary">
              {new Intl.DateTimeFormat("FR", { dateStyle: "full" }).format(
                new Date(application.date_of_submission)
              )}
            </Typography.Text>
            <Button
              onClick={() => {
                setView(0);
              }}
              icon={<CloseOutlined />}
              type="text"
              disabled={isPending}
              title="Fermer cette candidature"
            />
          </Space>
        </Layout.Header>
        <Layout.Content
          style={{
            overflowY: "auto",
            height: "calc(100vh - 186px)",
            paddingTop: 28,
            paddingBottom: 28,
            // background:colorBgContainer
          }}
        >
          <Form
            form={form}
            name="form_in_drawer"
            initialValues={{
              // ...application,
              // date_of_birth: dayjs(application.date_of_birth),
              // spoken_languages: parseLanguages(application.spoken_language),
              // cycle_id: application.cycle.id,
              // field_id: application.field.id,
              // faculty_id: application.faculty.id,
              // department_id: application.departement.id,
              // class_id: application.class_year?.id,
              // enrollment_question_response:
              //   application.enrollment_question_response,
              // year_of_diploma_obtained: dayjs(
              //   `${application.year_of_diploma_obtained}`,
              //   "YYYY"
              // ),
            }}
            onFinish={onFinish}
            disabled={isPending || application.status !== "pending"}
            style={{ maxWidth: 520, margin: "auto" }}
          >
            {application.status === "pending" && (
              <Alert
                showIcon
                closable
                message="Veuillez examiner les informations avec soin."
                description="Tout formulaire qui contiendrait de faux renseignements ne doit pas étre validé!"
              />
            )}
            <Divider orientation="left" orientationMargin={0}>
              <Typography.Title level={3}>
                Informations personnelles
              </Typography.Title>
            </Divider>

            <Form.Item
              label="Nom"
              name="first_name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Nom" />
            </Form.Item>
            <Form.Item
              label="Postnom"
              name="last_name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Postnom" />
            </Form.Item>
            <Form.Item
              label="Prénom"
              name="surname"
              rules={[{ required: true }]}
            >
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
              <Select
                placeholder="Nationalité"
                options={countries}
                showSearch
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
              <Typography.Title level={3}>
                Informations sur les parents
              </Typography.Title>
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
              label="Êtes-vous étranger?"
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
              label="Adresse actuel"
              name="current_neighborhood"
              rules={[{ required: true }]}
            >
              <Input.TextArea placeholder="Quartier ou Avenue et No" />
            </Form.Item>
            <Divider orientation="left" orientationMargin={0}>
              <Typography.Title level={3}>
                Études secondaires faites
              </Typography.Title>
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
                placeholder="Année d'obtention du diplôme"
                mode="year"
                picker="year"
                format="YYYY"
              />
            </Form.Item>
            <Form.Item
              label="Numéro du diplôme"
              name="diploma_number"
              rules={[]}
            >
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
                min={0}
                max={100}
              />
            </Form.Item>
            <Form.Item label="Fichier du diplôme" name="diploma_file">
              <Upload>
                <Button icon={<UploadOutlined />}>
                  Télécharger le fichier
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item label="Autres documents" name="other_documents">
              <Upload>
                <Button icon={<UploadOutlined />}>
                  Télécharger les documents
                </Button>
              </Upload>
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
            <Divider orientation="left" orientationMargin={0}>
              <Typography.Title level={3}>Choix de filière</Typography.Title>
            </Divider>
            <Form.Item
              label="Cycle"
              name="cycle_id"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Radio.Group options={getCurrentCyclesAsOptions(cycles)} />
            </Form.Item>
            <Form.Item
              label="Domaine"
              name="field_id"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Select
                options={getCurrentFieldsAsOptions(fields)}
                disabled
                showSearch
                variant="borderless"
              />
            </Form.Item>
            <Form.Item
              label="Faculté"
              name="faculty_id"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Select
                options={getCurrentFacultiesAsOptions(faculties)}
                disabled
                showSearch
                variant="borderless"
              />
            </Form.Item>
            <Form.Item
              label="Département"
              name="department_id"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Select
                placeholder="Département"
                options={getCurrentDepartmentsAsOptions(departments)}
                onSelect={(value) => {
                  const selectedDep = departments?.find(
                    (dep) => dep.id === value
                  );
                  const facId = selectedDep?.faculty.id;
                  const selectedFac = faculties?.find(
                    (fac) => fac.id === facId
                  );
                  form.setFieldsValue({
                    faculty_id: facId,
                    field_id: selectedFac?.field.id,
                  });
                }}
                showSearch
              />
            </Form.Item>
            <Form.Item
              label="Promotion"
              name="class_id"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Select
                placeholder="Promotion ou classe"
                options={getCurrentClassesAsOptions(classes)}
                showSearch
              />
            </Form.Item>
            <Divider orientation="left" orientationMargin={0}>
              <Typography.Title level={3}>
                Autres questions importantes
              </Typography.Title>
            </Divider>
            <Form.List name={["enrollment_question_response"]}>
              {(fields, { add, remove }) => (
                <div className="b-4">
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div className="py-6" key={key}>
                      {/* <Typography.Text>{application.enrollment_question_response[index].registered_enrollment_question?.question}</Typography.Text> */}
                      <Form.Item
                        {...restField}
                        name={[name, "response"]}
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                        label={
                          <>
                            <Badge
                              color="lime"
                              count={`${index + 1}`}
                              style={{ marginRight: 6 }}
                            />
                            {
                              application.enrollment_question_response[index]
                                .registered_enrollment_question?.question
                            }
                          </>
                        }
                        layout="vertical"
                      >
                        <Input.TextArea />
                      </Form.Item>
                    </div>
                  ))}
                </div>
              )}
            </Form.List>

            <Divider
              orientation="left"
              orientationMargin={0}
              style={{ marginTop: 32 }}
            >
              <Typography.Title level={3}>Eléments du dossier</Typography.Title>
            </Divider>

            <Form.List name={["application_documents"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Card
                      title={
                        <Space>
                          <Badge color="blue" count=" " />
                          <FileOutlined />

                          <Typography.Title
                            level={5}
                            style={{ marginBottom: 0 }}
                          >
                            {application.application_documents?.length > 0
                              ? application.application_documents?.[index]
                                  .required_document?.title
                              : documents?.[index].title}
                          </Typography.Title>
                        </Space>
                      }
                      key={key}
                      style={{ marginBottom: 24 }}
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "exist"]}
                        label="Document physique"
                        rules={[]}
                        valuePropName="checked"
                        style={{ marginTop: 8 }}
                      >
                        <Checkbox />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "file_url"]}
                        label="Version électronique"
                        rules={[]}
                      >
                        <Upload>
                          <Button icon={<UploadOutlined />}>Téléverser</Button>
                        </Upload>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "status"]}
                        rules={[{}]}
                        label="Vérification"
                      >
                        <Select
                          options={[
                            { value: "pending", label: "En attente" },
                            { value: "rejected", label: "Rejeté" },
                            { value: "validated", label: "Validé" },
                          ]}
                        />
                      </Form.Item>
                    </Card>
                  ))}
                </>
              )}
            </Form.List>

            <Divider orientation="left" orientationMargin={0}>
              <Typography.Title level={3}>
                Resultats aux tests de sélection
              </Typography.Title>
            </Divider>

            <Form.List name={"admission_test_result"}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Flex
                      align="end"
                      key={key}
                      gap={16}
                      style={{ marginBottom: 20 }}
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "course_test"]}
                        // label="Matière"
                        rules={[{ required: true }]}
                        style={{ flex: 1 }}
                        layout="vertical"
                      >
                        <Select
                          placeholder="Matière"
                          options={getTestCoursesByFacAsOptions(
                            application.faculty.id,
                            courses
                          )}
                          disabled
                          variant="borderless"
                          suffixIcon=""
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "result"]}
                        // label="Resultat"
                        rules={[]}
                        layout="vertical"
                      >
                        <InputNumber
                          min={0}
                          max={
                            courses?.find(
                              (course) =>
                                course.id ===
                                form.getFieldValue([
                                  "admission_test_result",
                                  name,
                                  "course_test",
                                ])
                            )?.max_value
                          }
                          step={0.01}
                          placeholder="Resultat"
                          suffix={
                            <Typography.Text>
                              /
                              {
                                courses?.find(
                                  (course) =>
                                    course.id ===
                                    form.getFieldValue([
                                      "admission_test_result",
                                      name,
                                      "course_test",
                                    ])
                                )?.max_value
                              }
                            </Typography.Text>
                          }
                        />
                      </Form.Item>
                      {/* <Button
                      danger
                      type="text"
                      onClick={() => remove(name)}
                      icon={<CloseOutlined />}
                      style={{ boxShadow: "none", marginBottom: 0 }}
                    /> */}
                    </Flex>
                  ))}
                  {/* <Form.Item style={{ marginTop: 24 }}>
                  <Button
                    type="link"
                    onClick={() => add()}
                    icon={<PlusCircleOutlined />}
                    block
                  >
                    Ajouter un resultat de test
                  </Button>
                </Form.Item> */}
                </>
              )}
            </Form.List>

            <Alert
              showIcon
              message="Frais d'inscription"
              type={
                application.enrollment_fees === "paid" ? "success" : "error"
              }
              description={
                <Form.Item
                  name="enrollment_fees"
                  label="Observation"
                  rules={[{ required: true }]}
                  status="error"
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    options={[
                      { value: "paid", label: "Payé" },
                      { value: "unpaid", label: "Non payé" },
                    ]}
                    variant="filled"
                    style={{ width: 120 }}
                  />
                </Form.Item>
              }
              style={{ marginTop: 36 }}
            />

            <Alert
              showIcon
              message="Statut de la candidature"
              type={getApplicationStatusAlertType(application.status!)}
              description={
                <Form.Item
                  name="status"
                  label="Statut"
                  rules={[{ required: true }]}
                  status="error"
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    options={getApplicationStatusAsOptions}
                    variant="filled"
                    style={{ width: 120 }}
                    disabled
                  />
                </Form.Item>
              }
              style={{ marginTop: 36 }}
            />
          </Form>
        </Layout.Content>
        <Layout.Footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: colorBgContainer,
            // paddingBottom: 16,
            // paddingTop: 16,
            padding: "12px 0",
            borderTop: `1px solid ${colorBorderSecondary}`,
          }}
        >
          <Palette />

          {application.status === "pending" && (
            <Space>
              <Button
                type="primary"
                onClick={() => form.submit()}
                loading={isPending}
                style={{ boxShadow: "none" }}
                disabled={isPending}
              >
                Sauvegarder uniquement
              </Button>
              <Button
                // type="dashed"
                color="green"
                variant="dashed"
                style={{ boxShadow: "none" }}
                disabled={isPending}
                onClick={() => {
                  setOpenValidate(true);
                }}
                icon={<CheckOutlined />}
              >
                Valider
              </Button>
              <Button
                type="dashed"
                danger
                style={{ boxShadow: "none" }}
                disabled={isPending}
                onClick={() => setOpenReject(true)}
                icon={<CloseOutlined />}
              >
                Rejeter
              </Button>
            </Space>
          )}
          {application.status === "rejected" && (
            <Space>
              <Typography.Text type="danger">
                Cette candidature a été rejetée. Nous la gardons juste comme
                archive
              </Typography.Text>
            </Space>
          )}
          {application.status === "validated" && (
            <Space>
              <Typography.Text type="success">
                Cette candidature est valide. Vous pouvez la gérer complètement
                depuis depuis le menu étudiants. Ici nous la gardons juste comme
                une archive
              </Typography.Text>
            </Space>
          )}
          <Dropdown
            menu={{
              items: [
                application.status === "pending"
                  ? {
                      key: "validate",
                      label: "Accepter",
                      icon: <CheckOutlined />,
                    }
                  : null,
                application.status === "rejected"
                  ? {
                      key: "pending",
                      label: "Marquer comme en attente",
                      icon: <HourglassOutlined />,
                    }
                  : null,
                application.status === "pending"
                  ? {
                      key: "reject",
                      label: "Rejeter",
                      icon: <CloseOutlined />,
                    }
                  : null,
                {
                  key: "delete",
                  label: "Supprimer",
                  icon: <DeleteOutlined />,
                  danger: true,
                },
              ],
              onClick: ({ key }) => {
                if (key === "pending") {
                  setOpenMarkAsPending(true);
                } else if (key === "delete") {
                  setOpenDelete(true);
                } else if (key === "reject") {
                  setOpenReject(true);
                } else if (key === "validate") {
                  setOpenValidate(true);
                }
              },
            }}
          >
            <Button icon={<MoreOutlined />} type="text" />
          </Dropdown>
        </Layout.Footer>
      </Layout>

      <MarkAsPendingForm
        application={application}
        open={openMarkAsPending}
        setOpen={setOpenMarkAsPending}
      />
      <DeleteApplicationForm
        application={application}
        open={openDelete}
        setOpen={setOpenDelete}
        setView={setView}
      />
      <RejectApplicationForm
        application={application}
        open={openReject}
        setOpen={setOpenReject}
      />
      <ValidateApplicationForm
        application={application}
        open={openValidate}
        setOpen={setOpenValidate}
        editedApplication={null}
      />
    </>
  );
};
