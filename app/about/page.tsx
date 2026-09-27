import { Metadata } from "next";
import { Navigation } from "@/components/navigation/Navigation";
import { Footer } from "@/components/contact/Footer";
import { Identity } from "@/components/hero/Identity";
import { TechStack } from "@/components/skills/TechStack";
import { EngineeringJourney } from "@/components/experience/EngineeringJourney";
import { getProfile, getSkills, getExperience } from "@/lib/firebase/firestore-server";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: "About",
    description: profile?.bio || "Software developer specializing in Flutter, Node.js, Firebase, and distributed systems.",
    openGraph: {
      title: "About | Himanshu Jadav",
      description: profile?.bio || "Software developer specializing in Flutter, Node.js, Firebase, and distributed systems.",
    },
  };
}

export default async function AboutPage() {
  const [profile, skills, experience] = await Promise.all([
    getProfile(),
    getSkills(),
    getExperience(),
  ]);

  return (
    <>
      <Navigation />
      <main id="main-content" className="flex-1 pt-20">
        <Identity
          role={profile?.role}
          bio={profile?.bio}
          location={profile?.location}
        />
        <TechStack skills={skills} />
        <EngineeringJourney experience={experience} />
      </main>
      <Footer
        location={profile?.location}
        email={`mailto:${profile?.socialLinks.find((s) => s.platform === "email")?.url || "himanshu@example.com"}`}
        linkedin={profile?.socialLinks.find((s) => s.platform === "linkedin")?.url}
        github={profile?.socialLinks.find((s) => s.platform === "github")?.url}
      />
    </>
  );
}
