import { NextResponse } from "next/server";

import { adminSessionCookieName, isValidAdminLogin } from "@/lib/admin-auth";
import { createAdminSession } from "@/lib/portfolio";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { secret?: string };
    const secret = String(body.secret ?? "");

    if (!(await isValidAdminLogin(secret))) {
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
    }

    const session = await createAdminSession();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(adminSessionCookieName, session.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(session.expiresAt)
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to log in.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
