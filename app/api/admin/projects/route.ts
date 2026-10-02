import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { verifyAdminRequest } from "@/lib/firebase/auth-server";
import { projectSchema } from "@/lib/validations/project";
import { Timestamp } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { normalizeGoogleDriveImageUrl } from "@/lib/utils/helpers";

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const adminUser = await verifyAdminRequest(request);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const snapshot = await adminDb!.collection("projects").orderBy("order", "asc").get();
    const projects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminUser = await verifyAdminRequest(request);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = projectSchema.parse(body);

    // Check slug uniqueness
    const slugCheck = await adminDb!.collection("projects").where("slug", "==", validatedData.slug).limit(1).get();
    if (!slugCheck.empty) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const now = Timestamp.now();
    const normalizedGallery = (validatedData.gallery || []).map((item) => ({
      ...item,
      url: item.url ? normalizeGoogleDriveImageUrl(item.url) : "",
    }));

    const projectData = {
      ...validatedData,
      thumbnailUrl: validatedData.thumbnailUrl ? normalizeGoogleDriveImageUrl(validatedData.thumbnailUrl) : "",
      heroImageUrl: validatedData.heroImageUrl ? normalizeGoogleDriveImageUrl(validatedData.heroImageUrl) : "",
      gallery: normalizedGallery,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await adminDb!.collection("projects").add(projectData);

    try {
      revalidatePath("/", "page");
      revalidatePath("/projects", "page");
      if (projectData.slug) revalidatePath(`/projects/${projectData.slug}`, "page");
      revalidatePath("/admin/projects", "page");
    } catch (e) {
      console.warn("revalidatePath error:", e);
    }

    return NextResponse.json({ id: docRef.id, ...projectData }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}