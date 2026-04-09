import { NextResponse } from "next/server";

import { isAuthorized } from "@/lib/admin-auth";
import { deleteProject } from "@/lib/portfolio";

type DeleteRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function DELETE(request: Request, { params }: DeleteRouteProps) {
  try {
    if (!(await isAuthorized(request))) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { slug } = await params;
    await deleteProject(slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete project.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
