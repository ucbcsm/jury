"use client";
import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { getHSLColor, getMaritalStatusName } from "@/lib/utils";
import {
  //  Department, Faculty,
   Teacher } from "@/types";
import {
  Avatar,
  // Button,
  Descriptions,
  Flex,
  Image,
  Space,
  Typography,
} from "antd";
import { FC } from "react";
import { EditTeacherProfileForm } from "./edit";

type TeacherProfileDetailsProps = {
  data?: Teacher;
  isPending: boolean;
  isError: boolean;
  // faculties?: Faculty[];
  // departments?: Department[];
};
export const TeacherProfileDetails: FC<TeacherProfileDetailsProps> = ({
  data,
  isError,
  isPending,
  // departments,
  // faculties,
}) => {
  if (isError) {
    return <DataFetchErrorResult />;
  }

  if (data) {
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
          <EditTeacherProfileForm
            teacher={data}
            // departments={departments}
            // faculties={faculties}
          />
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
          {/* Avatar */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            {data?.user.avatar ? (
              <Image
                height={100}
                width={100}
                src={data?.user.avatar || ""}
                alt="Avatar de l'enseignant"
                style={{
                  marginBottom: 28,
                  objectFit: "cover",
                }}
                className="rounded-full"
              />
            ) : (
              <Avatar
                size={100}
                style={{
                  background: getHSLColor(
                    `${data?.user.first_name} ${data?.user.last_name} ${data?.user.surname}`
                  ),
                  marginBottom: 16,
                }}
              >
                {`${data?.user.first_name?.[0]}${data?.user.last_name?.[0]}`}
              </Avatar>
            )}
            <Typography.Title level={4}>
              {data?.user.first_name} {data?.user.last_name}
            </Typography.Title>
            <Typography.Text type="secondary">
              ID: {data?.user.matricule.padStart(6, "0")}
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
                label: "Genre",
                children: data?.gender === "M" ? "Homme" : "Femme",
              },
              {
                key: "nationalite",
                label: "Nationalité",
                children: data?.nationality,
              },
              {
                key: "stranger",
                label: "Etranger?",
                children: data?.is_foreign_country_teacher ? "Oui" : "Non",
              },
              {
                key: "marital_status",
                label: "État civil",
                children: getMaritalStatusName(`${data?.marital_status}`),
              },
              {
                key: "physical_ability",
                label: "Aptitude physique",
                children:
                  data?.physical_ability === "disabled"
                    ? "Handicapé"
                    : "Normal",
              },
              {
                key: "religious_affiliation",
                label: "Affiliation religieuse",
                children: data?.religious_affiliation || "",
              },
              {
                key: "place_of_birth",
                label: "Lieu de naissance",
                children: data?.place_of_birth || "",
              },
              {
                key: "date_naissance",
                label: "Date de naissance",
                children:
                  data?.date_of_birth &&
                  new Intl.DateTimeFormat("fr", {
                    dateStyle: "long",
                  }).format(new Date(`${data?.date_of_birth}`)),
              },

              {
                key: "city",
                label: "Ville",
                children: data?.city_or_territory || "",
              },
              {
                key: "address",
                label: "Adresse",
                children: data?.address || "",
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
                  <a href={`mailto:${data?.user.email}`}>{data?.user.email}</a>
                ),
              },
              {
                key: "phone_number_1",
                label: "Téléphone 1",
                children: (
                  <a href={`tel:${data?.phone_number_1}`}>
                    {data?.phone_number_1}
                  </a>
                ),
              },
              {
                key: "phone_number_2",
                label: "Téléphone 2",
                children: (
                  <a href={`tel:${data?.phone_number_2}`}>
                    {data?.phone_number_2}
                  </a>
                ),
              },
            ]}
          />
        </Space>
      </>
    );
  }
  return (
    <div className="p-6">
      <DataFetchPendingSkeleton />
    </div>
  );
};
