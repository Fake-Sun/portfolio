import { NextResponse } from "next/server";

import { adminSessionCookieName } from "@/lib/admin-auth";
import { deleteAdminSession } from "@/lib/portfolio";

function getCookieValue(request: Request, name: string) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  for (const part of cookieHeader.split(";")) {
    const [rawKey, ...rest] = part.trim().split("=");
    if (rawKey === name) {
      return decodeURIComponent(rest.join("="));
    }
  }

  return "";
}

export async function POST(request: Request) {
  const token = getCookieValue(request, adminSessionCookieName);
  await deleteAdminSession(token);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminSessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0)
  });

  return response;
}
