import {
  hasAdminSecretConfigured,
  validateAdminSession,
  verifyAdminSecret
} from "@/lib/portfolio";

export const adminSessionCookieName = "admin_session";

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

export async function isAuthorized(request: Request) {
  const configured = await hasAdminSecretConfigured();

  if (!configured) {
    return false;
  }

  const token = getCookieValue(request, adminSessionCookieName);
  return validateAdminSession(token);
}

export async function isValidAdminLogin(secret: string) {
  const configured = await hasAdminSecretConfigured();

  if (!configured) {
    return false;
  }

  return verifyAdminSecret(secret);
}
