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

    const doc = await db.collection("site_settings").doc("main").get();
    if (!doc.exists) {
      return NextResponse.json({ settings: null });
    }

    return NextResponse.json({
      settings: { id: doc.id, ...doc.data() },
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
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
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const body = await request.json();
    const { siteName, tagline, heroStatement, telemetry, maintenanceMode } = body;

    const settingsData = {
      siteName: siteName?.trim() || "Himanshu Jadav",
      tagline: tagline?.trim() || "Software Engineer — Building Systems That Move Data",
      heroStatement: heroStatement?.trim() || "I BUILD SYSTEMS THAT MOVE DATA.",
      telemetry: Array.isArray(telemetry) ? telemetry : [],
      maintenanceMode: Boolean(maintenanceMode),
      updatedAt: Timestamp.now(),
    };

    await db.collection("site_settings").doc("main").set(settingsData, { merge: true });

    return NextResponse.json({ settings: settingsData });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
