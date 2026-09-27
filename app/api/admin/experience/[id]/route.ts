import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { verifyAdminRequest } from "@/lib/firebase/auth-server";
import { Timestamp } from "firebase-admin/firestore";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const body = await request.json();
    const updateData: Record<string, any> = {
      ...body,
      updatedAt: Timestamp.now(),
    };
    delete updateData.id;

    if (updateData.startDate && typeof updateData.startDate === "string") {
      updateData.startDate = Timestamp.fromDate(new Date(updateData.startDate));
    }
    if (updateData.endDate && typeof updateData.endDate === "string") {
      updateData.endDate = Timestamp.fromDate(new Date(updateData.endDate));
    }
    if (updateData.current) {
      updateData.endDate = null;
    }
    if (typeof updateData.technologies === "string") {
      updateData.technologies = updateData.technologies.split(",").map((t: string) => t.trim()).filter(Boolean);
    }
    if (typeof updateData.highlights === "string") {
      updateData.highlights = updateData.highlights.split("\n").map((h: string) => h.trim()).filter(Boolean);
    }

    const docRef = db.collection("experience").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    await docRef.update(updateData);
    const updated = await docRef.get();

    return NextResponse.json({
      experience: { id: updated.id, ...updated.data() },
    });
  } catch (error) {
    console.error("Error updating experience:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    await db.collection("experience").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
