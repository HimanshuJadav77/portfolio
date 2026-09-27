import { Metadata } from "next";
import { getExperience } from "@/lib/firebase/firestore-server";
import { ExperienceList } from "@/components/admin/ExperienceList";

export const metadata: Metadata = {
  title: "Experience",
  description: "Manage experience",
};

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const experience = await getExperience();

  return <ExperienceList initialExperience={experience} />;
}
