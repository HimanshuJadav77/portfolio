import { Metadata } from "next";
import { getAllProjectsAdmin, getSkills, getExperience, getProfile } from "@/lib/firebase/firestore-server";
import { hasValidCredentials, getMissingAdminConfig } from "@/lib/firebase/admin";
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

  const isDbConnected = hasValidCredentials();
  const missingVars = !isDbConnected ? getMissingAdminConfig() : [];

  return (
    <AdminOverview
      projects={projects}
      skills={skills}
      experience={experience}
      profile={profile}
      isDbConnected={isDbConnected}
      missingVars={missingVars}
    />
  );
}
