import api from "@/lib/fetcher";
import { User } from "@/types";

export async function getUsers({
  is_student,
  is_staff,
  is_superuser,
}: {
  is_student?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
}) {
  const res = await api.get(
    `/account/users/?is_student=${is_student || false}&is_staff=${
      is_staff || false
    }&is_superuser=${is_superuser || false}`
  );
  return res.data.results as User[];
}

export async function getStudentsUsers() {
  const res = await api.get(
    `/account/users/?is_student=true`
  );
  return res.data.results as User[];
}

export async function getStaffUsers(is_permanent_teacher?: boolean) {
  const res = await api.get(
    `/account/users/?is_staff=true&${
      typeof is_permanent_teacher !== "undefined" &&
      `is_permanent_teacher=${is_permanent_teacher}`
    }`
  );
  return res.data.results as User[];
}

export async function getSuperUsers() {
  const res = await api.get(
    `/account/users/?is_superuser=true`
  );
  return res.data.results as User[];
}

export async function updateUser({
  id,
  params,
}: {
  id: number;
  params: Partial<Omit<User, "id">>;
}) {
  const res = await api.put(`/account/users/${id}/`, {
    ...params,
    // avatar: null,
  });
  return res.data;
}

// export async function getAsignedFaculty() {

//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get("accessToken")?.value || null;

//   const res = await api.get(`/account/faculty-from-user/`, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });

//   if (!res.data) {
//     return null;
//   }

//   return res.data as Faculty;
// }
