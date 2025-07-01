import api from "@/lib/fetcher";
import { Institute } from "@/types";
import axios from "axios";

/**
 * Checks whether an institution exists by making an API call to the server.
 *
 * @returns {Promise<boolean>} A promise that resolves to `true` if the institution exists, otherwise `false`.
 *
 * @throws {Error} Throws an error if the server responds with an error or if an unexpected error occurs.
 *
 * - If the error is an Axios error, it logs the error details and throws an error with the server's response status.
 * - If the error is unexpected, it logs the error and throws a generic error message.
 *
 * @example
 * ```typescript
 * try {
 *   const exists = await checkInstitutionExistence();
 *   console.log("Institution exists:", exists);
 * } catch (error) {
 *   console.error("Error checking institution existence:", error);
 * }
 * ```
 */
export async function checkInstitutionExistence(): Promise<boolean> {
  try {
    const res = await api.get("/main_config/institution-exist");

    const data = res.data as { institutionExist: boolean };

    return data.institutionExist;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Axios received an error response from the server
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(`Server error: ${error.response?.status}`);
    } else {
      // Unexpected error (network, config, etc.)
      console.error("Unexpected error:", error);
      throw new Error(
        "Unknown error occurred while retrieving institution existence."
      );
    }
  }
}

/**
 * Creates a new institution by sending a POST request to the API.
 *
 * @param params - The configuration parameters for the institution.
 *
 * @remarks
 * This function sends a POST request to the `/main_config/institution/` endpoint
 * with the provided institution details. Optional fields are set to default
 * values if not provided. The `logo` field is set to `null` by default.
 *
 * @example
 * ```typescript
 * const institutionData: ConfigFormSchemaType = {
 *   acronym: "ABC",
 *   address: "123 Main St",
 *   category: "university",
 *   city: "Metropolis",
 *   country: "CountryName",
 *   email: "info@institution.com",
 *   email_address: "contact@institution.com",
 *   matricule: "123456",
 *   mission: "To educate and inspire.",
 *   motto: "Knowledge is power.",
 *   name: "Institution Name",
 *   parent_organization: null,
 *   password: "securepassword",
 *   phone_number_1: "+1234567890",
 *   phone_number_2: null,
 *   province: "ProvinceName",
 *   slogan: "Empowering the future.",
 *   status: "private",
 *   vision: "To be a leader in education.",
 *   web_site: "https://institution.com",
 * };
 *
 * const response = await createInstitution(institutionData);
 * console.log(response);
 * ```
 *
 * @returns The response data from the API containing the created institution details.
 *
 * @throws Will throw an error if the API request fails or if the server responds with an error.
 */
export async function createInstitution(
  params: Omit<Institute, "id"> & {
    email: string;
    matricule: string;
    password: string;
  }
) {
  const res = await api.post(`/main_config/institution/`, {
    acronym: params.acronym,
    address: params.address,
    category: params.category,
    city: params.city,
    country: params.country,
    email: params.email,
    email_address: params.email_address,
    matricule: params.matricule,
    mission: params.mission || "",
    motto: params.motto || null,
    name: params.name,
    parent_organization: params.parent_organization || null,
    password: params.password,
    phone_number_1: params.phone_number_1,
    phone_number_2: params.phone_number_2 || null,
    province: params.province,
    slogan: params.slogan || "",
    status: params.status,
    vision: params.vision || "",
    web_site: params.web_site || null,
    logo: null,
  });
  return res.data;
}

/**
 * Fetches the institution data from the API.
 *
 * This function sends a GET request to the `/main_config/institution/` endpoint
 * and retrieves the institution information. It assumes that the API response
 * contains a `data` object with a `results` array, and it returns the first
 * element of that array cast as `InstituteType`.
 *
 * @returns {Promise<InstituteType>} A promise that resolves to the institution data.
 * @throws {Error} If the API request fails or the response format is unexpected.
 */
export async function getInstitution() {
  const res = await api.get("/main_config/institution/");
  const data = res.data;
  return data.results[0] as Institute;
}

/**
 * Updates an institution's information by sending a PUT request to the API.
 *
 * @param {Object} params - The parameters for the function.
 * @param {number} params.id - The unique identifier of the institution to update.
 * @param {Partial<Omit<InstituteType, "id">>} params.params - The data to update the institution with.
 * @returns {Promise<InstituteType>} A promise that resolves to the updated institution data from the API.
 *
 * @remarks
 * This function sends a PUT request to the `/main_config/institution/{id}/` endpoint
 * with the provided institution details. Optional fields are set to their default
 * values if not provided. The `logo` field is explicitly set to `null`.
 *
 * @example
 * ```typescript
 * const updatedData = await updateInstitution({
 *   id: 1,
 *   params: {
 *     name: "New Institution Name",
 *     address: "Beni Kipriani",
 *     // other fields...
 *   },
 * });
 * console.log(updatedData);
 * ```
 */
export async function updateInstitution({
  id,
  params,
}: {
  id: number;
  params: Partial<Omit<Institute, "id">>;
}) {
  const res = await api.put(`/main_config/institution/${id}/`, {
    ...params, logo:null
  });
  return res.data;
}
