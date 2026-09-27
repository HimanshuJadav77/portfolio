import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { verifyAdminRequest } from "@/lib/firebase/auth-server";
import { Timestamp } from "firebase-admin/firestore";

export const runtime = 'nodejs';

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

    if (updateData.proficiency !== undefined) {
      updateData.proficiency = Number(updateData.proficiency);
    }
    if (updateData.order !== undefined) {
      updateData.order = Number(updateData.order);
    }

    const docRef = db.collection("skills").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    await docRef.update(updateData);
    const updated = await docRef.get();

    return NextResponse.json({
      skill: { id: updated.id, ...updated.data() },
    });
  } catch (error) {
    console.error("Error updating skill:", error);
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

    await db.collection("skills").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
