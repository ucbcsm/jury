import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cookieName: string }> }
) {
  const { cookieName } = await params;
  const cookieValue = (await cookies()).get(cookieName);

  return new Response(JSON.stringify({ cookieName: cookieValue?.value }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
export async function POST(
  request: Request,
  { params }: { params: Promise<{ cookieName: string }> }
) {
  const { cookieName } = await params;
  const body = await request.json();
  const cookieValue = body[cookieName];

  (await cookies()).set(cookieName, cookieValue);

  return new Response(JSON.stringify({ [cookieName]: cookieValue }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ cookieName: string }> }
) {
  const { cookieName } = await params;
  (await cookies()).delete(cookieName);

  return new Response(JSON.stringify({ [cookieName]: null }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
