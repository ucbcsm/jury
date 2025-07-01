import api, { authApi } from "@/lib/fetcher";
import { Faculty, User } from "@/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ cookieName: string }> }
// ) {
//   const { cookieName } = await params;
//   const cookieValue = (await cookies()).get(cookieName);

//   return new Response(JSON.stringify({ cookieName: cookieValue?.value }), {
//     status: 200,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }

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
//  type Session = {
//   accessToken: string | null;
//   refreshToken: string | null;
//   user: User | null;
//   error: string | null;
//   faculty?: Faculty;
// } | null;

/**
 * Handles the retrieval of the server session as an API route handler.
 * Accepts a GET request and returns the session object or null.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} The response containing the session or null.
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || null;
    const refreshToken = cookieStore.get("refreshToken")?.value || null;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(null, { status: 200 });
    }

    const userResponse = await authApi.get("/users/me/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

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
    }

    const user = userResponse.data;
    if (!user) {
      return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(
      {
        accessToken,
        refreshToken,
        user,
        error: null,
        faculty,
      },
      { status: 200 }
    );
  } catch (error: any) {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return NextResponse.json(null, { status: 200 });
  }
}
