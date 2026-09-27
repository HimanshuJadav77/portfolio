import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { verifyAdminRequest } from "@/lib/firebase/auth-server";
import { Timestamp } from "firebase-admin/firestore";

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const snapshot = await db.collection("experience").get();
    const experience = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

    return NextResponse.json({ experience });
  } catch (error) {
    console.error("Error fetching experience:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const body = await request.json();
    const {
      company,
      role,
      location,
      type,
      startDate,
      endDate,
      current,
      description,
      technologies,
      highlights,
      order,
    } = body;

    if (!company || !role) {
      return NextResponse.json(
        { error: "Company and role are required" },
        { status: 400 }
      );
    }

    const now = Timestamp.now();
    const id = body.id || `exp-${Date.now()}`;

    const expData = {
      id,
      company: company.trim(),
      role: role.trim(),
      location: location?.trim() || "Remote",
      type: type || "full-time",
      startDate: startDate ? Timestamp.fromDate(new Date(startDate)) : now,
      endDate: current ? null : endDate ? Timestamp.fromDate(new Date(endDate)) : null,
      current: Boolean(current),
      description: description?.trim() || "",
      technologies: Array.isArray(technologies)
        ? technologies
        : typeof technologies === "string"
        ? technologies.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [],
      highlights: Array.isArray(highlights)
        ? highlights
        : typeof highlights === "string"
        ? highlights.split("\n").map((h: string) => h.trim()).filter(Boolean)
        : [],
      order: Number(order) || 0,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection("experience").doc(id).set(expData);

    return NextResponse.json({ experience: expData }, { status: 201 });
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
