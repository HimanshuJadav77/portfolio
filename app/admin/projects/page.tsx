import { Metadata } from "next";
import { getAllProjectsAdmin, getSkills } from "@/lib/firebase/firestore-server";
import { AdminProjectsList } from "@/components/admin/ProjectsList";

export const metadata: Metadata = {
  title: "Projects",
  description: "Manage projects",
};

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const [projects, skills] = await Promise.all([
    getAllProjectsAdmin(),
    getSkills(),
  ]);

  return (
    <AdminProjectsList projects={projects} skills={skills} />
  );
}
