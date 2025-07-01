import { StudentInfo } from "@/types";
import api from "../fetcher";
import dayjs from "dayjs";
import { formatLanguages } from "./application";
import { updateUser } from "./user";

export async function updateStudentInfo({
  id,
  params,
}: {
  id: number;
  params: Omit<StudentInfo, "id" | "user" | "spoken_language"> & {
    spoken_languages: { language: string }[];
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      surname: string;
      matricule: string;
      avatar: string | null;
      pending_avatar: string | null;
      is_active:boolean,
      is_staff:boolean,
      is_student:boolean,
      is_superuser:boolean,
      is_permanent_teacher:boolean,
    };
  };
}) {
  const res = await api.put(`/apparitorat/common-enrollment-infos/${id}/`, {
    ...params,
    gender: params.gender,
    place_of_birth: params.place_of_birth,
    date_of_birth: dayjs(params.date_of_birth).format("YYYY-MM-DD"),
    nationality: params.nationality,
    marital_status: params.marital_status,
    religious_affiliation: params.religious_affiliation,
    phone_number_1: params.phone_number_1,
    phone_number_2: params.phone_number_2,
    name_of_secondary_school: params.name_of_secondary_school,
    country_of_secondary_school: params.country_of_secondary_school,
    province_of_secondary_school: params.province_of_secondary_school,
    territory_or_municipality_of_school:
      params.territory_or_municipality_of_school,
    section_followed: params.section_followed,
    father_name: params.father_name,
    father_phone_number: params.father_phone_number,
    mother_name: params.mother_name,
    mother_phone_number: params.mother_phone_number,
    current_city: params.current_city,
    current_municipality: params.current_municipality,
    current_neighborhood: params.current_neighborhood,
    country_of_origin: params.country_of_origin,
    province_of_origin: params.province_of_origin,
    territory_or_municipality_of_origin:
      params.territory_or_municipality_of_origin,
    physical_ability: params.physical_ability,
    professional_activity: params.professional_activity,
    spoken_language: formatLanguages(params.spoken_languages),
    year_of_diploma_obtained: dayjs(params.year_of_diploma_obtained).year(),
    diploma_number: params.diploma_number || "",
    diploma_percentage: params.diploma_percentage,
    is_foreign_registration: params.is_foreign_registration,
    former_matricule: "",
    // house: House.nullable(),
    application_documents: params.application_documents,
    previous_university_studies: params.previous_university_studies,
    enrollment_question_response: params.enrollment_question_response,
    admission_test_result: params.admission_test_result,
  });
  await updateUser({ id: params.user.id, params: { ...params.user } });
  return res.data;
}
