import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { Enrollment } from "@/types";
import { getHSLColor, getMaritalStatusName, percentageFormatter } from "@/lib/utils";
import { Avatar, Descriptions, Flex, Image, Space, Typography } from "antd";
import { FC } from "react";
import { EditStudentProfileForm } from "./edit";

type ProfileDetailsProps = {
  data?: Enrollment;
  isError: boolean;
};

export const StudentProfileDetails: FC<ProfileDetailsProps> = ({ data, isError }) => {
  if (isError) {
    return <DataFetchErrorResult />;
  }

  if (data)
    return (
      <>
        <Flex
          justify="space-between"
          align="center"
          style={{ paddingLeft: 28, paddingRight: 28, paddingTop: 12 }}
        >
          <Typography.Title level={5} className="">
            Profile
          </Typography.Title>

          <EditStudentProfileForm data={data} />
        </Flex>

        <Space
          direction="vertical"
          size="middle"
          style={{
            padding: "40px 0 40px 28px",
            width: "100%",
            height: "calc(100vh - 108px)",
            overflowY: "auto",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            {data.user.avatar ? (
              <Image
                height={100}
                width={100}
                src={data?.user.avatar || ""}
                className=" bg-gray-400 object-cover rounded-full"
                style={{ marginBottom: 16 }}
              />
            ) : (
              <Avatar
                size={100}
                style={{
                  background: getHSLColor(
                    `${data.user.first_name} ${data.user.last_name} ${data.user.surname}`
                  ),
                  marginBottom: 16,
                }}
              >
                {`${data.user.first_name?.[0]}${data.user.last_name?.[0]}`}
              </Avatar>
            )}
            <Typography.Title
              level={4}
            >{`${data?.user.first_name} ${data?.user.last_name}`}</Typography.Title>
            <Typography.Text type="secondary">
              Matr. {data?.user.matricule.padStart(6, "0")}
            </Typography.Text>
          </div>
          <Descriptions
            title="Identité"
            column={1}
            items={[
              {
                key: "name",
                label: "Nom",
                children: data?.user.first_name || "",
              },
              {
                key: "postnom",
                label: "Postnom",
                children: data?.user.last_name || "",
              },
              {
                key: "prenom",
                label: "Prénom",
                children: data?.user.surname || "",
              },
              {
                key: "sex",
                label: "Sexe",
                children:
                  data?.common_enrollment_infos.gender === "M"
                    ? "Masculin"
                    : "Féminin",
              },
              {
                key: "lieu_naissance",
                label: "Lieu de naissance",
                children: data?.common_enrollment_infos.place_of_birth || "",
              },
              {
                key: "date_naissance",
                label: "Date de naissance",
                children: new Intl.DateTimeFormat("fr", {
                  dateStyle: "long",
                }).format(
                  new Date(`${data?.common_enrollment_infos.date_of_birth}`)
                ),
              },
              {
                key: "nationalite",
                label: "Nationalité",
                children: data?.common_enrollment_infos.nationality || "",
              },
              {
                key: "marital_status",
                label: "État civil",
                children: getMaritalStatusName(
                  `${data?.common_enrollment_infos.marital_status}`
                ),
              },
              {
                key: "physical_ability",
                label: "Aptitude physique",
                children:
                  data?.common_enrollment_infos.physical_ability === "normal"
                    ? "Normale"
                    : "Handicapé",
              },
              {
                key: "religious_affiliation",
                label: "Affiliation religieuse",
                children: data?.common_enrollment_infos.religious_affiliation,
              },
              {
                key: "spoken_language",
                label: "Langues parlées",
                children: data.common_enrollment_infos.spoken_language,
              },
            ]}
          />

          <Descriptions
            title="Contacts"
            column={1}
            items={[
              {
                key: "email",
                label: "Email",
                children: (
                  <a href={`mailto:${data?.user.email}`}>
                    {data?.user.email || ""}
                  </a>
                ),
              },
              {
                key: "telephone1",
                label: "Téléphone 1",
                children: (
                  <a
                    href={`tel:${data?.common_enrollment_infos.phone_number_1}`}
                  >
                    {data?.common_enrollment_infos.phone_number_1 || ""}
                  </a>
                ),
              },
              {
                key: "telephone2",
                label: "Téléphone 2",
                children: (
                  <a
                    href={`tel:${data?.common_enrollment_infos.phone_number_2}`}
                  >
                    {data?.common_enrollment_infos.phone_number_2 || ""}
                  </a>
                ),
              },
            ]}
          />

          <Descriptions
            title="Origine de l'étudiant"
            column={1}
            items={[
              {
                key: "country_origin",
                label: "Pays",
                children: data?.common_enrollment_infos.country_of_origin,
              },
              {
                key: "province_origin",
                label: "Province",
                children: data?.common_enrollment_infos.province_of_origin,
              },
              {
                key: "city",
                label: "Ville/Térritoire",
                children:
                  data?.common_enrollment_infos
                    .territory_or_municipality_of_origin,
              },
              {
                key: "stranger",
                label: "Etranger?",
                children: data?.common_enrollment_infos.is_foreign_registration
                  ? "Oui"
                  : "Non",
              },
            ]}
          />

          <Descriptions
            title="Adresse actuelle"
            column={1}
            items={[
              {
                key: "ville",
                label: "Ville",
                children: data?.common_enrollment_infos.current_city,
              },
              {
                key: "commune",
                label: "Commune",
                children: data?.common_enrollment_infos.current_municipality,
              },
              {
                key: "adresse",
                label: "Adresse",
                children: data?.common_enrollment_infos.current_neighborhood,
              },
            ]}
          />

          <Descriptions
            title="Parents"
            column={1}
            items={[
              {
                key: "nom_pere",
                label: "Nom du père",
                children: data?.common_enrollment_infos.father_name || "",
              },
              {
                key: "nom_mere",
                label: "Nom de la mère",
                children: data?.common_enrollment_infos.mother_name,
              },
              {
                key: "contact_pere",
                label: "Contact du père",
                children: (
                  <a
                    href={`tel:${data?.common_enrollment_infos.father_phone_number}`}
                  >
                    {data?.common_enrollment_infos.father_phone_number || ""}
                  </a>
                ),
              },
              {
                key: "contact_mere",
                label: "Contact de la mère",
                children: (
                  <a
                    href={`tel:${data?.common_enrollment_infos.mother_phone_number}`}
                  >
                    {data?.common_enrollment_infos.mother_phone_number || ""}
                  </a>
                ),
              },
            ]}
          />

          <Descriptions
            title="Études secondaires"
            column={1}
            items={[
              {
                key: "school",
                label: "Ecole",
                children:
                  data?.common_enrollment_infos.name_of_secondary_school || "",
              },
              {
                key: "option_section",
                label: "Option/Section",
                children: data?.common_enrollment_infos.section_followed || "",
              },
              {
                key: "year_of_diploma_obtained",
                label: "Année d'obtention du diplôme",
                children: data.common_enrollment_infos.year_of_diploma_obtained,
              },
              {
                key: "diploma_number",
                label: "Numèro du diplome",
                children: data?.common_enrollment_infos.diploma_number || "",
              },
              {
                key: "diploma_percent",
                label: "Pourcentage du diplome",
                children:  percentageFormatter(Number(data?.common_enrollment_infos.diploma_percentage)),
              },
              {
                key: "country",
                label: "Pays",
                children:
                  data?.common_enrollment_infos.country_of_secondary_school ||
                  "",
              },
              {
                key: "province",
                label: "Province",
                children:
                  data?.common_enrollment_infos.province_of_secondary_school,
              },
              {
                key: "city",
                label: "Ville/Térritoire",
                children:
                  data?.common_enrollment_infos
                    .territory_or_municipality_of_school,
              },
            ]}
          />

          <Descriptions
            title="Filières"
            column={1}
            items={[
              {
                key: "domaine",
                label: "Domaine",
                children: data?.field.name || "",
              },
              {
                key: "faculte",
                label: "Faculté",
                children: data?.faculty.name || "",
              },
              {
                key: "departement",
                label: "Département",
                children: data?.departement.name || "",
              },
            ]}
          />
        </Space>
      </>
    );

  return (
    <div className="p-6">
      <DataFetchPendingSkeleton />
    </div>
  );
};
