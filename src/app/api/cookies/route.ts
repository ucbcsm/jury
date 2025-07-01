import { cookies } from "next/headers";

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    if (!cookieStore) {
      throw new Error("Failed to access cookies.");
    }

    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return new Response(JSON.stringify({ message: "Cookies deleted successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}