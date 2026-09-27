import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { verifyAdminRequest } from "@/lib/firebase/auth-server";
import { Timestamp } from "firebase-admin/firestore";
import { slugify } from "@/lib/utils/helpers";

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

    const snapshot = await db.collection("skills").get();
    const skills = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

    return NextResponse.json({ skills });
  } catch (error) {
    console.error("Error fetching skills:", error);
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
    const { name, category, icon, proficiency, relatedProjects, featured, order } = body;

    if (!name || !category) {
      return NextResponse.json(
        { error: "Skill name and category are required" },
        { status: 400 }
      );
    }

    const id = body.id || slugify(name);
    const now = Timestamp.now();

    const skillData = {
      id,
      name: name.trim(),
      category: category.toLowerCase().trim(),
      icon: icon?.trim() || "⚡",
      proficiency: Number(proficiency) || 5,
      relatedProjects: Array.isArray(relatedProjects) ? relatedProjects : [],
      featured: Boolean(featured),
      order: Number(order) || 0,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection("skills").doc(id).set(skillData);

    return NextResponse.json({ skill: skillData }, { status: 201 });
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
