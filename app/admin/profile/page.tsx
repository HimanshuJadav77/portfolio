import { Metadata } from "next";
import { getProfile } from "@/lib/firebase/firestore-server";
import { ProfileForm } from "@/components/admin/ProfileForm";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage profile",
};

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return <ProfileForm initialProfile={profile} />;
}
