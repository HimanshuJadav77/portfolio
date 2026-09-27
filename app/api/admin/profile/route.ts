import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { verifyAdminRequest } from "@/lib/firebase/auth-server";
import { Timestamp } from "firebase-admin/firestore";

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

    const doc = await db.collection("profile").doc("main").get();
    if (!doc.exists) {
      return NextResponse.json({ profile: null });
    }

    return NextResponse.json({
      profile: { id: doc.id, ...doc.data() },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable. Firebase Admin credentials are not configured on the server." }, { status: 500 });
    }

    const body = await request.json();
    const { name, role, bio, location, avatarUrl, avatarCrop, resumeUrl, socialLinks } = body;

    if (!name || !role) {
      return NextResponse.json(
        { error: "Name and role are required" },
        { status: 400 }
      );
    }

    const profileData: Record<string, any> = {
      name: name.trim(),
      role: role.trim(),
      bio: bio?.trim() || "",
      location: location?.trim() || "Rajkot, India",
      avatarUrl: avatarUrl?.trim() || "",
      resumeUrl: resumeUrl?.trim() || "/resume.pdf",
      socialLinks: Array.isArray(socialLinks) ? socialLinks : [],
      updatedAt: Timestamp.now(),
    };

    if (avatarCrop && typeof avatarCrop === "object") {
      profileData.avatarCrop = avatarCrop;
    }

    await db.collection("profile").doc("main").set(profileData, { merge: true });

    return NextResponse.json({ profile: profileData });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
