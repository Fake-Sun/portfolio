import { NextResponse } from "next/server";

import { adminSessionCookieName } from "@/lib/admin-auth";
import {
  createAdminSession,
  hasAdminSecretConfigured,
  setAdminSecret
} from "@/lib/portfolio";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      secret?: string;
      confirmSecret?: string;
    };

    if (await hasAdminSecretConfigured()) {
      return NextResponse.json({ error: "Admin secret is already configured." }, { status: 400 });
    }

    const secret = String(body.secret ?? "");
    const confirmSecret = String(body.confirmSecret ?? "");

    if (secret !== confirmSecret) {
      return NextResponse.json({ error: "Secrets do not match." }, { status: 400 });
    }

    await setAdminSecret(secret);
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
    const message = error instanceof Error ? error.message : "Unable to set admin secret.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
