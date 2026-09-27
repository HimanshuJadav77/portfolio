import { Hero } from "@/components/hero/Hero";
import { Identity } from "@/components/hero/Identity";
import { LatestPortfolio } from "@/components/projects/LatestPortfolio";
import { CaseStudiesRows } from "@/components/proof/CaseStudiesRows";
import { TechToolsBar } from "@/components/skills/TechToolsBar";
import { CalloutBanner } from "@/components/proof/CalloutBanner";
import { ServicesAccordion } from "@/components/services/ServicesAccordion";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { Navigation } from "@/components/navigation/Navigation";
import { SectionErrorBoundary } from "@/components/error/SectionErrorBoundary";
import CustomCursor from "../components/interactions/CustomCursor";
import AmbientBackground from "../components/interactions/AmbientBackground";
import ClientContactCTA from "@/components/contact/ClientContactCTA";
import ClientFooter from "@/components/contact/ClientFooter";
import {
  getPublishedProjects,
  getSkills,
  getExperience,
  getProfile,
  getSiteSettings,
} from "@/lib/firebase/firestore-server";

export const revalidate = 60;

export async function generateMetadata() {
  const profile = await getProfile();

  return {
    title: profile?.name || "Himanshu Jadav — Software Developer",
    description:
      profile?.bio ||
      "I build systems that move data. Software developer specializing in Flutter, Node.js, Firebase, and distributed systems.",
    openGraph: {
      title: profile?.name || "Himanshu Jadav — Software Developer",
      description: profile?.bio || "I build systems that move data.",
      images: profile?.avatarUrl ? [{ url: profile.avatarUrl }] : [],
    },
  };
}

export default async function HomePage() {
  const [projects, skills, experience, profile, siteSettings] = await Promise.all([
    getPublishedProjects(),
    getSkills(),
    getExperience(),
    getProfile(),
    getSiteSettings(),
  ]);

  const emailUrl = profile?.socialLinks?.find((s) => s.platform === "email")?.url;
  const cleanEmail = emailUrl?.replace(/^mailto:/, "") || "himanshujadav1877@gmail.com";
  const mailtoEmail = emailUrl?.startsWith("mailto:") ? emailUrl : `mailto:${cleanEmail}`;
  const githubUrl =
    profile?.socialLinks?.find((s) => s.platform === "github")?.url || "https://github.com/HimanshuJadav77";
  const linkedinUrl =
    profile?.socialLinks?.find((s) => s.platform === "linkedin")?.url || "https://linkedin.com/in/himanshu-jadav-17b56b2a1";
  const resumeUrl =
    profile?.resumeUrl || "https://drive.google.com/file/d/1iIDQiO3snQjOQZTe6gjWRhFa5d2fbLoI/view?usp=sharing";
  const avatarUrl = profile?.avatarUrl || "/images/himanshu-profile.jpg";

  return (
    <>
      <AmbientBackground />
      <CustomCursor />
      <Navigation
        name={profile?.name?.split(" ")[0]?.toUpperCase() || "HIMANSHU"}
        resumeUrl={resumeUrl}
      />
      <main id="main-content" className="flex-1">
        {/* 01 — HERO (Center Arch, Neon Signature Script, Bio Card with Spinning Badge) */}
        <SectionErrorBoundary label="HERO">
          <Hero
            heroStatement={siteSettings?.heroStatement}
            githubUrl={githubUrl}
            linkedinUrl={linkedinUrl}
            email={cleanEmail}
            name={profile?.name}
            role={profile?.role}
            location={profile?.location}
            avatarUrl={avatarUrl}
          />
        </SectionErrorBoundary>

        {/* 02 — SERVICES / CAPABILITIES ACCORDION */}
        <SectionErrorBoundary label="CAPABILITIES">
          <ServicesAccordion projects={projects} skills={skills} />
        </SectionErrorBoundary>

        {/* 03 — IDENTITY & STATS (Horizontal Axis with Center Circular Portrait) */}
        <SectionErrorBoundary label="ABOUT">
          <Identity
            role={profile?.role}
            bio={profile?.bio}
            location={profile?.location}
            avatarUrl={avatarUrl}
            resumeUrl={resumeUrl}
            projectsCount={projects.length}
            skillsCount={skills.length}
            experienceCount={experience.length}
          />
        </SectionErrorBoundary>

        {/* 04 — LATEST PORTFOLIO (2x2 Visual Project Grid) */}
        <SectionErrorBoundary label="PROJECTS">
          <LatestPortfolio projects={projects} />
        </SectionErrorBoundary>

        {/* 05 — CASE STUDIES / OUTCOME ROWS */}
        <SectionErrorBoundary label="CASE-STUDIES">
          <CaseStudiesRows projects={projects} />
        </SectionErrorBoundary>

        {/* 06 — TOOLS BAR */}
        <SectionErrorBoundary label="TOOLS">
          <TechToolsBar />
        </SectionErrorBoundary>

        {/* 07 — CALLOUT BANNER */}
        <SectionErrorBoundary label="CALLOUT">
          <CalloutBanner />
        </SectionErrorBoundary>

        {/* 08 — FAQ ACCORDION */}
        <SectionErrorBoundary label="FAQ">
          <FAQAccordion />
        </SectionErrorBoundary>

        {/* 09 — CONTACT (Split Card) */}
        <SectionErrorBoundary label="CONTACT">
          <ClientContactCTA
            email={cleanEmail}
            phone={profile?.phone || "9054158657"}
            location={profile?.location}
            githubUrl={githubUrl}
            linkedinUrl={linkedinUrl}
            resumeUrl={resumeUrl}
            avatarUrl={avatarUrl}
          />
        </SectionErrorBoundary>
      </main>

      {/* 10 — FOOTER (Watermark, Social Pills, IST Telemetry) */}
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
