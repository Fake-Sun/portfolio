"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

type AdminAuthProps = {
  mode: "setup" | "login";
  copy: Record<string, unknown>;
};

export function AdminAuth({ mode, copy }: AdminAuthProps) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [secret, setSecret] = useState("");
  const [confirmSecret, setConfirmSecret] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(mode === "setup" ? "Creating admin account..." : "Signing in...");

    const response = await fetch(
      mode === "setup" ? "/api/admin/setup" : "/api/admin/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body:
          mode === "setup"
            ? JSON.stringify({ secret, confirmSecret })
            : JSON.stringify({ secret })
      }
    );

    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setStatus(payload.error ?? "Authentication failed.");
      return;
    }

    setStatus(mode === "setup" ? "Admin account created." : "Signed in.");
    startTransition(() => router.refresh());
  }

  return (
    <section className="admin-auth-shell">
      <div className="section-heading">
        <span className="eyebrow">Portfolio CMS</span>
        <h1>{copy.adminTitle as string}</h1>
        <p>
          {mode === "setup"
            ? (copy.adminSetupText as string)
            : (copy.adminLoginText as string)}
        </p>
      </div>

      <form className="admin-setup" onSubmit={handleSubmit}>
        <label>
          <span>
            {mode === "setup"
              ? (copy.createAdminSecret as string)
              : (copy.adminSecret as string)}
          </span>
          <input
            type="password"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
          />
        </label>

        {mode === "setup" ? (
          <label>
            <span>{copy.confirmAdminSecret as string}</span>
            <input
              type="password"
              value={confirmSecret}
              onChange={(event) => setConfirmSecret(event.target.value)}
            />
          </label>
        ) : null}

        <div className="admin-actions">
          <button type="submit">
            {mode === "setup"
              ? (copy.setAdminSecret as string)
              : (copy.adminLoginButton as string)}
          </button>
          <span>{status}</span>
        </div>
      </form>
    </section>
  );
}
