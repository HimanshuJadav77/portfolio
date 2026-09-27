import { Metadata } from "next";
import { Navigation } from "@/components/navigation/Navigation";
import { Footer } from "@/components/contact/Footer";
import { ContactCTA } from "@/components/contact/ContactCTA";
import { getProfile } from "@/lib/firebase/firestore-server";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: "Contact",
    description: "Get in touch — I'm open to discussing interesting problems, new opportunities, or just talking shop.",
    openGraph: {
      title: "Contact | Himanshu Jadav",
      description: "Get in touch — I'm open to discussing interesting problems, new opportunities, or just talking shop.",
    },
  };
}

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <>
      <Navigation />
      <main id="main-content" className="flex-1 pt-20">
        <ContactCTA />
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
