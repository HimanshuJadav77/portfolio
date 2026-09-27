import { Metadata } from "next";
import { getSkills } from "@/lib/firebase/firestore-server";
import { AdminProjectForm } from "@/components/admin/ProjectForm";

export const metadata: Metadata = {
  title: "Create Project",
  description: "Create a new portfolio project",
};

export const dynamic = 'force-dynamic';

export default async function NewProjectPage() {
  const skills = await getSkills();

  return (
    <AdminProjectForm skills={skills} mode="create" />
  );
}
