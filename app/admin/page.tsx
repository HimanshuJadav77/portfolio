import { Metadata } from "next";
import { getAllProjectsAdmin, getSkills, getExperience, getProfile } from "@/lib/firebase/firestore-server";
import { AdminOverview } from "@/components/admin/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Admin overview",
};

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const [projects, skills, experience, profile] = await Promise.all([
    getAllProjectsAdmin(),
    getSkills(),
    getExperience(),
    getProfile(),
  ]);

  return (
    <AdminOverview
      projects={projects}
      skills={skills}
      experience={experience}
      profile={profile}
    />
  );
}
