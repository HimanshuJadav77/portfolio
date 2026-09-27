import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectById, getSkills } from "@/lib/firebase/firestore-server";
import { AdminProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Edit Project",
    description: "Edit project",
  };
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, skills] = await Promise.all([
    getProjectById(id),
    getSkills(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <AdminProjectForm project={project} skills={skills} mode="edit" />
  );
}