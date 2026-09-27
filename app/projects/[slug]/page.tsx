import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation/Navigation";
import { Footer } from "@/components/contact/Footer";
import { CaseStudy } from "@/components/case-study/CaseStudy";
import {
  getProjectBySlug,
  getPublishedProjects,
  getProfile,
  getSiteSettings,
} from "@/lib/firebase/firestore-server";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.filter((p) => Boolean(p.slug)).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.seo?.title || project.title,
    description: project.seo?.description || project.shortDescription,
    openGraph: {
      title: project.seo?.title || project.title,
      description: project.seo?.description || project.shortDescription,
      images: project.seo?.ogImage ? [{ url: project.seo.ogImage }] : project.heroImageUrl ? [{ url: project.heroImageUrl }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.seo?.title || project.title,
      description: project.seo?.description || project.shortDescription,
      images: project.seo?.ogImage ? [project.seo.ogImage] : project.heroImageUrl ? [project.heroImageUrl] : [],
    },
  };
}

export default async function ProjectCaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, allProjects, profile, siteSettings] = await Promise.all([
    getProjectBySlug(slug),
    getPublishedProjects(),
    getProfile(),
    getSiteSettings(),
  ]);

  if (!project) {
    notFound();
  }

  // Find next project for "Next Project" section
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const nextProject = allProjects.length > 1
    ? allProjects[(currentIndex + 1) % allProjects.length]
    : undefined;

  return (
    <>
      <Navigation
        name={profile?.name?.split(" ")[0]?.toUpperCase() || "HIMANSHU"}
        resumeUrl={profile?.resumeUrl || "/resume.pdf"}
      />
      <main id="main-content" className="flex-1 pt-24 sm:pt-28">
        <CaseStudy project={project} nextProject={nextProject} />
      </main>
      <Footer
        location={profile?.location}
        email={
          profile?.socialLinks?.find((s) => s.platform === "email")?.url?.startsWith("mailto:")
            ? profile.socialLinks.find((s) => s.platform === "email")!.url
            : `mailto:${profile?.socialLinks?.find((s) => s.platform === "email")?.url || "himanshu@example.com"}`
        }
        linkedin={profile?.socialLinks?.find((s) => s.platform === "linkedin")?.url}
        github={profile?.socialLinks?.find((s) => s.platform === "github")?.url}
        telemetry={siteSettings?.telemetry}
      />
    </>
  );
}