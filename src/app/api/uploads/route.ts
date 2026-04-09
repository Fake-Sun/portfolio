import path from "node:path";

import { NextResponse } from "next/server";

import { isAuthorized } from "@/lib/admin-auth";
import { saveUploadedFile } from "@/lib/portfolio";

function sanitizeFileName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthorized(request))) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const extension = path.extname(file.name) || ".png";
    const baseName = path.basename(file.name, extension);
    const fileName = `${Date.now()}-${sanitizeFileName(baseName)}${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await saveUploadedFile(fileName, buffer, file.type);

    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
