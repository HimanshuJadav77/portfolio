"use client";

import { cn } from "@/lib/utils/helpers";

interface FooterProps {
  name?: string;
  role?: string;
  location?: string;
  email?: string;
  github?: string;
  linkedin?: string;
  resumeUrl?: string;
  telemetry?: Array<{ label: string; value: string }>;
  className?: string;
}

const FOOTER_NAV = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#projects" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export function Footer({
  name = "Himanshu Jadav",
  role = "Software Engineer",
  location = "Rajkot, Gujarat, India",
  telemetry = [],
  className,
}: FooterProps) {
  return (
    <footer
      className={cn("bg-background border-t border-border relative overflow-hidden", className)}
      role="contentinfo"
      aria-label="Footer"
    >
      <div className="container-narrow pt-12 pb-14 sm:pt-14 sm:pb-16 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-border/80">
          {/* Identity */}
          <div>
            <h4 className="font-display font-medium text-lg text-foreground tracking-tight">
              {name}
            </h4>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">
              {role.split("|")[0].trim()}
            </p>
          </div>

          {/* Quick Nav */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-muted-foreground">
              {FOOTER_NAV.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] font-mono text-muted-foreground">
          {/* Telemetry / Location */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{telemetry.length > 0 ? telemetry[0].value : `Based in ${location}`}</span>
          </div>

          {/* Copyright */}
          <div>
            <span>© 2026 {name}. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
