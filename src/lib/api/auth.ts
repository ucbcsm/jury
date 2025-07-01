"use server";

import api, { authApi } from "@/lib/fetcher";
import { Faculty, User } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Represents a user session, which may include authentication tokens,
 * user information, and potential error details.
 *
 * @typedef {Session}
 * @property {string | null} accessToken - The access token for the session, or null if not available.
 * @property {string | null} refreshToken - The refresh token for the session, or null if not available.
 * @property {Record<string, any> | null} user - An object containing user information, or null if not available.
 * @property {string | null} error - An error message, or null if no error occurred.
 */
export type Session = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  error: string | null;
  faculty?: Faculty;
} | null;

/**
 * Retrieves the server session, including access and refresh tokens, and user information.
 *
 * @returns {Promise<Session>} A promise that resolves to a `Session` object containing the access token,
 * refresh token, user data, and error information. Returns `null` if the access token or user data is unavailable.
 *
 * @throws {Error} Throws an error if the server session retrieval fails.
 *
 * @example
 * ```typescript
 * const session = await getServerSession();
 * if (session) {
 *   console.log("User:", session.user);
 * } else {
 *   console.log("No session available");
 * }
 * ```
 */
export const getServerSession = async (): Promise<Session> => {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value || null;
    const refreshToken = cookieStore.get("refreshToken")?.value || null;

    if (!accessToken || !refreshToken) {
      return null;
    }

    let user = null;
    try {
      const userResponse = await authApi.get("/users/me/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      user = userResponse.data;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        // Unauthorized, session is invalid
        return null;
      }
      throw error;
    }

    let faculty: Faculty | undefined = undefined;
    try {
      const resFaculty = await api.get(`/account/faculty-from-user/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      faculty = resFaculty.data as Faculty | undefined;
    } catch (error: any) {
      if (error?.response?.status !== 404 && error?.response?.status !== 400) {
        throw error;
      }
      // If 404 or 400, faculty remains undefined
    }

    // if (!user) {
    //   return null;
    // }

    return {
      accessToken,
      refreshToken,
      user,
      error: null,
      faculty,
    };
  } catch (error: any) {
    return null;
    // throw new Error("Failed to get server session");
  }
};

/**
 * Authenticates a user by sending their credentials to the authentication API
 * and storing the resulting access and refresh tokens in cookies.
 *
 * @param credentials - An object containing the user's login credentials.
 * @param credentials.matricule - The user's matricule (identifier).
 * @param credentials.password - The user's password.
 *
 * @throws {Error} Throws an error if the login request fails (non-200 status).
 *
 * @remarks
 * This function uses the `use server` directive and is designed to run on the server side.
 * It interacts with the `next/headers` module to manage cookies and redirects the user
 * to the `/app` route upon successful login.
 *
 * @example
 * ```typescript
 * const credentials = { matricule: "12345", password: "securePassword" };
 * await login(credentials);
 * ```
 */
export const login = async (credentials: {
  matricule: string;
  password: string;
}) => {
  try {
    const Cookies = await cookies();

    const res = await authApi.post("/jwt/create", credentials);

    if (res.status !== 200) {
      throw new Error("Login failed");
    }

    const { access, refresh } = res.data as {
      access: string;
      refresh: string;
    };
console.log("Auth,",res.data)
    if (!access || !refresh) {
      throw new Error("Invalid login response");
    } else {
      
      const userResponse = await authApi.get("/users/me/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      const user = userResponse.data;
      console.log("User,",user)
      if ((user.is_superuser || user.is_staff) && user.is_active) {
        Cookies.set("accessToken", access);
        Cookies.set("refreshToken", refresh);
      } else {
        throw new Error("");
      }
    }
  } catch (error: any) {
    if (error?.status === 401) {
      throw new Error("Invalid credentials. Please try again.");
    }

    throw new Error("An error occurred during login. Please try again.");
  }
};

/**
 * Logs out the user by invalidating their session tokens and clearing cookies.
 *
 * @throws {Error} Throws an error if the logout process fails.
 *
 * @remarks
 * This function interacts with the `next/headers` module to manage cookies and
 * redirects the user to the `/auth/login` route upon successful logout.
 *
 * @example
 * ```typescript
 * await logout();
 * ```
 */
export const logout = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!accessToken || !refreshToken) {
      console.warn("Missing tokens during logout");
      throw new Error("Missing tokens");
    }

    // Invalidate tokens on the server
    await authApi.post(
      "/token/logout",
      {
        // refresh: refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Clear cookies
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    // Redirect to login page
    // redirect("/auth/login");
  } catch (error: any) {
    console.error("Error during logout:", error.message || error);
    throw new Error("An error occurred during logout. Please try again.");
  }
};

/**
 * Resets the password for a user by sending a password reset email to the provided email address.
 *
 * @decorator `async`
 *
 * @param email - The email address of the user requesting the password reset.
 *
 * @throws {Error} Throws an error if the password reset request fails.
 *
 * @example
 * ```typescript
 * try {
 *   await resetPassword("user@example.com");
 *   console.log("Password reset email sent successfully.");
 * } catch (error) {
 *   console.error("Failed to send password reset email:", error);
 * }
 * ```
 */
export const resetPassword = async (email: string) => {
  try {
    const res = await authApi.post("/users/reset_password/", { email });
    console.log("Res: ", res);
  } catch (error: any) {
    console.error("Error during password reset:", error);
    // console.error("Error during password reset:", error.message || error);
    // throw new Error(
    //   "An error occurred while attempting to reset the password. Please try again."
    // );
  }
};

/**
 * Confirms the password reset process by sending the provided form data to the server.
 *
 * @param formData - An object containing the necessary data for password reset confirmation.
 * @param formData.new_password - The new password to be set.
 * @param formData.re_new_password - Confirmation of the new password.
 * @param formData.token - The token received for password reset verification.
 * @param formData.uid - The user ID associated with the password reset request.
 *
 * @throws {Error} Throws an error if the password reset confirmation fails.
 *
 * @example
 * ```typescript
 * await resetPasswordConfirm({
 *   new_password: "newPassword123",
 *   re_new_password: "newPassword123",
 *   token: "resetToken",
 *   uid: "userId",
 * });
 * ```
 */
export const resetPasswordConfirm = async (formData: {
  new_password: string;
  re_new_password: string;
  token: string;
  uid: string;
}) => {
  try {
    await authApi.post("/users/reset_password_confirm/", {
      uid: formData.uid,
      token: formData.token,
      new_password: formData.new_password,
      re_new_password: formData.re_new_password,
    });

    redirect("/auth/login");
  } catch (error: any) {
    console.error(
      "Error during password reset confirmation:",
      error.message || error
    );
    throw new Error(
      "An error occurred while confirming the password reset. Please try again."
    );
  }
};
