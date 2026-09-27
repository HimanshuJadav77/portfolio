import { Metadata } from "next";
import { getSkills } from "@/lib/firebase/firestore-server";
import { SkillsList } from "@/components/admin/SkillsList";

export const metadata: Metadata = {
  title: "Skills",
  description: "Manage skills",
};

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await getSkills();

  return <SkillsList initialSkills={skills} />;
}
