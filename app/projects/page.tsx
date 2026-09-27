import { Metadata } from "next";
import { EditorialProjectsCatalog } from "@/components/projects/EditorialProjectsCatalog";
import { Navigation } from "@/components/navigation/Navigation";
import ClientFooter from "@/components/contact/ClientFooter";
import {
  getPublishedProjects,
  getProfile,
  getSiteSettings,
} from "@/lib/firebase/firestore-server";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: "Projects | Himanshu Jadav",
    description: "Complete portfolio of systems I've engineered — from mobile apps to distributed backends.",
    openGraph: {
      title: "Projects | Himanshu Jadav",
      description: "Complete portfolio of systems I've engineered.",
    },
  };
}

export default async function ProjectsPage() {
  const [projects, profile, siteSettings] = await Promise.all([
    getPublishedProjects(),
    getProfile(),
    getSiteSettings(),
  ]);

  const emailUrl = profile?.socialLinks?.find((s) => s.platform === "email")?.url;
  const cleanEmail = emailUrl?.replace(/^mailto:/, "") || "himanshujadav1877@gmail.com";
  const mailtoEmail = emailUrl?.startsWith("mailto:") ? emailUrl : `mailto:${cleanEmail}`;
  const githubUrl = profile?.socialLinks?.find((s) => s.platform === "github")?.url || "https://github.com/HimanshuJadav77";
  const linkedinUrl = profile?.socialLinks?.find((s) => s.platform === "linkedin")?.url || "https://linkedin.com/in/himanshu-jadav-17b56b2a1";
  const resumeUrl = profile?.resumeUrl || "https://drive.google.com/file/d/1iIDQiO3snQjOQZTe6gjWRhFa5d2fbLoI/view?usp=sharing";

  return (
    <>
      <Navigation
        name={profile?.name?.split(" ")[0]?.toUpperCase() || "HIMANSHU"}
        resumeUrl={resumeUrl}
      />
      <main id="main-content" className="flex-1">
        <EditorialProjectsCatalog projects={projects} />
      </main>
      <ClientFooter
        name={profile?.name}
        role={profile?.role}
        location={profile?.location}
        email={mailtoEmail}
        linkedin={linkedinUrl}
        github={githubUrl}
        resumeUrl={resumeUrl}
        telemetry={siteSettings?.telemetry}
      />
    </>
  );
}
