import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { verifyAdminRequest } from "@/lib/firebase/auth-server";
import { projectSchema } from "@/lib/validations/project";
import { Timestamp } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { normalizeGoogleDriveImageUrl } from "@/lib/utils/helpers";

export const runtime = 'nodejs';

async function verifyAdmin(request: NextRequest) {
  return verifyAdminRequest(request);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await verifyAdmin(request);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    let doc = await adminDb!.collection("projects").doc(id).get();
    
    if (!doc.exists) {
      const slugMatch = await adminDb!.collection("projects").where("slug", "==", id).limit(1).get();
      if (!slugMatch.empty) {
        doc = slugMatch.docs[0];
      }
    }

    if (!doc.exists) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await verifyAdmin(request);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    // Partial validation for updates
    const validatedData = projectSchema.partial().parse(body);

    // Resolve target document by ID, or fallback to slug
    let targetDocRef = adminDb!.collection("projects").doc(id);
    let targetDoc = await targetDocRef.get();

    if (!targetDoc.exists) {
      const slugMatch = await adminDb!.collection("projects").where("slug", "==", id).limit(1).get();
      if (!slugMatch.empty) {
        targetDocRef = slugMatch.docs[0].ref;
        targetDoc = slugMatch.docs[0];
      } else {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
    }

    const existingData = targetDoc.data();

    // If slug is being updated to a DIFFERENT slug, check uniqueness
    if (validatedData.slug && validatedData.slug !== existingData?.slug) {
      const slugCheck = await adminDb!.collection("projects")
        .where("slug", "==", validatedData.slug)
        .limit(1)
        .get();
      if (!slugCheck.empty && slugCheck.docs[0].id !== targetDocRef.id) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
      }
    }

    const updateData: Record<string, any> = {
      ...validatedData,
      updatedAt: Timestamp.now(),
    };

    if (validatedData.thumbnailUrl !== undefined) {
      updateData.thumbnailUrl = validatedData.thumbnailUrl ? normalizeGoogleDriveImageUrl(validatedData.thumbnailUrl) : "";
    }
    if (validatedData.heroImageUrl !== undefined) {
      updateData.heroImageUrl = validatedData.heroImageUrl ? normalizeGoogleDriveImageUrl(validatedData.heroImageUrl) : "";
    }
    if (Array.isArray(validatedData.gallery)) {
      updateData.gallery = validatedData.gallery.map((item) => ({
        ...item,
        url: item.url ? normalizeGoogleDriveImageUrl(item.url) : "",
      }));
    }

    await targetDocRef.update(updateData);

    const updatedDoc = await targetDocRef.get();
    const docData = updatedDoc.data();

    try {
      revalidatePath("/", "page");
      revalidatePath("/projects", "page");
      if (docData?.slug) revalidatePath(`/projects/${docData.slug}`, "page");
      revalidatePath("/admin/projects", "page");
    } catch (e) {
      console.warn("revalidatePath error:", e);
    }

    return NextResponse.json({ id: updatedDoc.id, ...docData });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 });
    }
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await verifyAdmin(request);
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    let targetDocRef = adminDb!.collection("projects").doc(id);
    const targetDoc = await targetDocRef.get();
    if (!targetDoc.exists) {
      const slugMatch = await adminDb!.collection("projects").where("slug", "==", id).limit(1).get();
      if (!slugMatch.empty) {
        targetDocRef = slugMatch.docs[0].ref;
      }
    }

    await targetDocRef.delete();

    try {
      revalidatePath("/", "page");
      revalidatePath("/projects", "page");
      revalidatePath("/admin/projects", "page");
    } catch (e) {
      console.warn("revalidatePath error:", e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}