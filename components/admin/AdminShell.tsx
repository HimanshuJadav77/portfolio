"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  Briefcase,
  User,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { signOutAdmin } from "@/lib/firebase/auth";

const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, description: "Overview" },
  { href: "/admin/projects", label: "Projects", icon: FolderGit2, description: "Projects" },
  { href: "/admin/skills", label: "Skills", icon: Cpu, description: "Skills" },
  { href: "/admin/experience", label: "Experience", icon: Briefcase, description: "Experience" },
  { href: "/admin/profile", label: "Profile", icon: User, description: "Profile" },
  { href: "/admin/settings", label: "Settings", icon: Settings, description: "Settings" },
];

function isActiveLink(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

function sectionTitle(pathname: string | null): { crumb: string; title: string; hint: string } {
  if (!pathname) return { crumb: "ADMIN", title: "Dashboard", hint: "Overview" };
  const match = [...ADMIN_LINKS].reverse().find((l) => isActiveLink(pathname, l.href));
  if (!match) return { crumb: "ADMIN", title: "Dashboard", hint: "Overview" };
  return { crumb: "ADMIN", title: match.label, hint: match.description };
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const section = sectionTitle(pathname);

  const handleLogout = async () => {
    try {
      await signOutAdmin();
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  };

  // Lock body scroll + ESC handling for the drawer
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  const sidebarBody = (
    <div className="flex h-full flex-col">
      {/* Branding */}
      <div className="px-5 pt-6 pb-5 border-b border-border">
        <Link href="/admin" className="block outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-primary" onClick={() => setDrawerOpen(false)}>
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">ADMIN</p>
          <p className="font-display text-lg font-medium text-foreground tracking-tight mt-0.5">Portfolio</p>
        </Link>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin sections">
        <ul className="space-y-0.5">
          {ADMIN_LINKS.map((link) => {
            const active = isActiveLink(pathname, link.href);
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors outline-none",
                    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    active
                      ? "bg-accent text-foreground font-medium border-l-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60 border-l-2 border-transparent"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", active ? "text-primary" : "")} aria-hidden="true" />
                  <span className="flex-1">{link.label}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-primary" aria-hidden="true" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-5 pt-3 border-t border-border space-y-0.5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="flex-1">Open Portfolio</span>
        </a>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer min-h-[44px]"
        >
          <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="flex-1 text-left">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 flex-col bg-card border-r border-border z-40" aria-label="Admin sidebar">
        {sidebarBody}
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Admin navigation">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-card border-r border-border flex flex-col">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
              <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">ADMIN NAVIGATION</p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-10 h-10 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Close navigation"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">{sidebarBody}</div>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-60 flex flex-col min-h-screen min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-background/95 border-b border-border">
          <div className="flex items-center gap-3 h-14 px-4 sm:px-6 max-w-[1200px] mx-auto w-full">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden w-10 h-10 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Open navigation"
              aria-expanded={drawerOpen}
            >
              <Menu className="w-4 h-4" aria-hidden="true" />
            </button>
            <nav className="flex items-center gap-1.5 font-mono text-[11px] tracking-widest text-muted-foreground min-w-0" aria-label="Breadcrumb">
              <span>{section.crumb}</span>
              <span aria-hidden="true">/</span>
              <span className="text-foreground truncate">{section.title.toUpperCase()}</span>
            </nav>
            <div className="flex-1" />
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors min-h-[44px] px-2"
            >
              OPEN PORTFOLIO
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors min-h-[44px] px-2 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              aria-label="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">SIGN OUT</span>
            </button>
          </div>
        </header>

        {/* Workspace */}
        <main className="flex-1 min-w-0">
          <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
