import { Metadata } from "next";
import { getSiteSettings } from "@/lib/firebase/firestore-server";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage settings",
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return <SettingsForm initialSettings={settings} />;
}
