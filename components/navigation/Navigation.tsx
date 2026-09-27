"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useScrollContext } from "@/components/scroll/ScrollProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/helpers";

const NAV_ITEMS = [
  { label: "SERVICES", sectionId: "capabilities" },
  { label: "ABOUT", sectionId: "about" },
  { label: "PORTFOLIO", sectionId: "projects" },
  { label: "OUTCOMES", sectionId: "case-studies" },
  { label: "TOOLS", sectionId: "tools" },
  { label: "FAQ", sectionId: "faq" },
  { label: "CONTACT", sectionId: "contact" },
] as const;

interface NavigationProps {
  resumeUrl?: string;
  name?: string;
}

export function Navigation({
  name = "HIMANSHU",
}: NavigationProps = {}) {
  const { scrollProgress } = useScrollContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [scrollProgressState, setScrollProgressState] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  // Scroll Progress
  useEffect(() => {
    const unsub = scrollProgress.on("change", (latest: number) => {
      setScrollProgressState(latest);
    });
    return () => unsub();
  }, [scrollProgress]);

  // Active Section Detection
  useEffect(() => {
    if (pathname !== "/") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-25% 0px -55% 0px" }
    );

    NAV_ITEMS.forEach(({ sectionId }) => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    const heroEl = document.getElementById("hero");
    if (heroEl) observer.observe(heroEl);

    return () => observer.disconnect();
  }, [pathname]);

  const scrollToSection = (sectionId: string) => {
    if (pathname !== "/") {
      router.push(`/#${sectionId}`);
      setIsMobileMenuOpen(false);
      return;
    }

    if (sectionId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsMobileMenuOpen(false);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 76;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      window.history.pushState(null, "", `#${sectionId}`);
    }
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu on Escape key
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] bg-[#FF5E36] z-[70] origin-left pointer-events-none w-full"
        style={{
          scaleX: scrollProgress,
        }}
        aria-hidden="true"
      />

      {/* Floating Island Navigation */}
      <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={cn(
            "pointer-events-auto flex items-center justify-between w-full max-w-5xl h-14 sm:h-16 px-5 sm:px-7 rounded-full transition-all duration-300",
            "bg-white/95 dark:bg-card/95 backdrop-blur-md border border-border/80 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.06)]"
          )}
        >
          {/* Logo / Brand Name in restored bold font-display */}
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center outline-none rounded-full group cursor-pointer"
            aria-label="Himanshu Jadav Home"
          >
            <span className="font-display text-lg sm:text-xl font-black uppercase text-foreground tracking-tight group-hover:text-[#FF5E36] transition-colors">
              {name}
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 bg-muted/60 p-1.5 rounded-full border border-border/60">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.sectionId;

              return (
                <button
                  key={item.sectionId}
                  onClick={() => scrollToSection(item.sectionId)}
                  className={cn(
                    "relative font-sans text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors cursor-pointer outline-none uppercase tracking-wider",
                    isActive
                      ? "text-foreground font-black"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Sliding Active Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-full bg-white dark:bg-card shadow-xs border border-border/80 -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action: ONLY Let's Talk button, NO arrows, NO resume */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => scrollToSection("contact")}
              className="px-5 sm:px-6 py-2 rounded-full bg-foreground text-background font-sans text-xs font-black tracking-wider uppercase hover:bg-[#FF5E36] hover:text-white active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              LET'S TALK
            </button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center border border-border text-foreground hover:bg-muted transition-colors outline-none cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Menu className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden bg-background/95 backdrop-blur-xl flex flex-col justify-center items-center px-6 pt-16"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
          >
            <nav className="flex flex-col items-center gap-5 w-full max-w-sm">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.sectionId}
                  onClick={() => scrollToSection(item.sectionId)}
                  className="font-display text-2xl uppercase tracking-tight text-foreground hover:text-[#FF5E36] transition-colors py-1 cursor-pointer"
                >
                  {item.label}
                </button>
              ))}

              <div className="w-full h-px bg-border my-3" />

              <button
                onClick={() => scrollToSection("contact")}
                className="w-full py-3 rounded-full bg-foreground text-background font-sans text-xs font-black uppercase tracking-wider hover:bg-[#FF5E36] hover:text-white transition-colors"
              >
                LET'S TALK
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
