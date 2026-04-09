import { NextResponse } from "next/server";

import { isAuthorized } from "@/lib/admin-auth";
import { parseProjectInput, upsertProject } from "@/lib/portfolio";

export async function POST(request: Request) {
  try {
    if (!(await isAuthorized(request))) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const input = parseProjectInput(body);
    const project = await upsertProject(input);

    return NextResponse.json({ project });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
