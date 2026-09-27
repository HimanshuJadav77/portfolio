import { adminDb, adminApp } from "@/lib/firebase/admin";
import { Timestamp, FieldValue } from "firebase-admin/firestore";

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  const now = Timestamp.now();

  // Seed Profile
  const profileData = {
    name: "Himanshu Jadav",
    role: "Software Developer",
    bio: "I build robust, scalable systems that solve real problems. Specializing in cross-platform mobile development with Flutter, backend services with Node.js, and real-time infrastructure with Firebase and WebSockets. Passionate about clean architecture, developer experience, and building products that users love.",
    location: "Rajkot, India",
    avatarUrl: "",
    resumeUrl: "",
    socialLinks: [
      { platform: "github", url: "https://github.com/himanshujadav", icon: "github" },
      { platform: "linkedin", url: "https://linkedin.com/in/himanshujadav", icon: "linkedin" },
      { platform: "email", url: "himanshu@example.com", icon: "mail" },
      { platform: "twitter", url: "https://twitter.com/himanshujadav", icon: "twitter" },
    ],
    updatedAt: now,
  };

  await adminDb!.collection("profile").doc("main").set(profileData);
  console.log("✅ Profile seeded");

  // Seed Site Settings
  const siteSettingsData = {
    siteName: "Himanshu Jadav",
    tagline: "Software Developer — Building Systems That Move Data",
    heroStatement: "I BUILD SYSTEMS THAT MOVE DATA.",
    telemetry: [
      { label: "SYSTEM STATUS", value: "ONLINE" },
      { label: "BUILD", value: "2026" },
      { label: "STACK", value: "FLUTTER / NODE / FIREBASE" },
      { label: "MODE", value: "ENGINEERING" },
    ],
    maintenanceMode: false,
    updatedAt: now,
  };

  await adminDb!.collection("site_settings").doc("main").set(siteSettingsData);
  console.log("✅ Site settings seeded");

  // Seed Skills
  const skillsData = [
    { name: "Flutter", category: "mobile", icon: "📱", proficiency: 5, relatedProjects: [], order: 1 },
    { name: "Dart", category: "mobile", icon: "🎯", proficiency: 5, relatedProjects: [], order: 2 },
    { name: "Node.js", category: "backend", icon: "🟢", proficiency: 5, relatedProjects: [], order: 3 },
    { name: "TypeScript", category: "frontend", icon: "🔷", proficiency: 5, relatedProjects: [], order: 4 },
    { name: "React", category: "frontend", icon: "⚛️", proficiency: 4, relatedProjects: [], order: 5 },
    { name: "Next.js", category: "frontend", icon: "▲", proficiency: 4, relatedProjects: [], order: 6 },
    { name: "Firebase", category: "backend", icon: "🔥", proficiency: 5, relatedProjects: [], order: 7 },
    { name: "Firestore", category: "backend", icon: "📄", proficiency: 5, relatedProjects: [], order: 8 },
    { name: "WebSockets", category: "backend", icon: "🔌", proficiency: 4, relatedProjects: [], order: 9 },
    { name: "Socket.IO", category: "backend", icon: "🔌", proficiency: 4, relatedProjects: [], order: 10 },
    { name: "PostgreSQL", category: "backend", icon: "🐘", proficiency: 4, relatedProjects: [], order: 11 },
    { name: "Redis", category: "backend", icon: "🔴", proficiency: 3, relatedProjects: [], order: 12 },
    { name: "Docker", category: "devops", icon: "🐳", proficiency: 4, relatedProjects: [], order: 13 },
    { name: "GitHub Actions", category: "devops", icon: "⚙️", proficiency: 4, relatedProjects: [], order: 14 },
    { name: "Java", category: "other", icon: "☕", proficiency: 3, relatedProjects: [], order: 15 },
    { name: "Python", category: "other", icon: "🐍", proficiency: 3, relatedProjects: [], order: 16 },
    { name: "GraphQL", category: "backend", icon: "📊", proficiency: 3, relatedProjects: [], order: 17 },
    { name: "REST APIs", category: "backend", icon: "🌐", proficiency: 5, relatedProjects: [], order: 18 },
  ];

  const skillRefs: Record<string, string> = {};
  for (const skill of skillsData) {
    const docRef = await adminDb!.collection("skills").add({ ...skill, createdAt: now, updatedAt: now });
    skillRefs[skill.name] = docRef.id;
    console.log(`✅ Skill seeded: ${skill.name}`);
  }

  // Seed Experience
  const experienceData = [
    {
      company: "Freelance",
      role: "Senior Software Developer",
      location: "Remote",
      type: "freelance" as const,
      startDate: Timestamp.fromDate(new Date("2023-01-01")),
      endDate: null,
      current: true,
      description: "Building custom mobile and web applications for clients across various industries. Specializing in Flutter, Node.js, and Firebase-based solutions.",
      technologies: ["Flutter", "Node.js", "Firebase", "TypeScript", "PostgreSQL"],
      highlights: [
        "Delivered 10+ production applications",
        "Reduced client infrastructure costs by 40% through serverless architecture",
        "Implemented real-time collaboration features for multiple clients",
      ],
      order: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      company: "Tech Startup",
      role: "Full Stack Developer",
      location: "Rajkot, India",
      type: "full-time" as const,
      startDate: Timestamp.fromDate(new Date("2021-06-01")),
      endDate: Timestamp.fromDate(new Date("2022-12-31")),
      current: false,
      description: "Developed and maintained core backend services and mobile applications. Worked on real-time messaging systems and scalable APIs.",
      technologies: ["Flutter", "Node.js", "Socket.IO", "MongoDB", "Docker"],
      highlights: [
        "Built real-time messaging system handling 50K+ concurrent users",
        "Designed RESTful APIs serving mobile and web clients",
        "Implemented CI/CD pipelines reducing deployment time by 60%",
      ],
      order: 2,
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const exp of experienceData) {
    await adminDb!.collection("experience").add(exp);
    console.log(`✅ Experience seeded: ${exp.role} at ${exp.company}`);
  }

  // Seed Projects
  const projectsData = [
    {
      title: "FastShare",
      slug: "fastshare",
      shortDescription: "Local file transfer without the cloud. Peer-to-peer over LAN using Flutter and TCP sockets.",
      description: "FastShare is a cross-platform file transfer application that enables users to share files between devices on the same local network without uploading to any cloud service. Built with Flutter for mobile and desktop, it uses direct TCP connections for maximum transfer speeds.",
      category: "mobile",
      featured: true,
      published: true,
      order: 1,
      thumbnailUrl: "",
      heroImageUrl: "",
      gallery: [],
      technologies: [
        { name: "Flutter", icon: "📱" },
        { name: "TCP", icon: "🔌" },
        { name: "LAN", icon: "🌐" },
        { name: "SQLite", icon: "🗄️" },
      ],
      metrics: [
        { label: "Transfer Speed", value: "100MB/s+" },
        { label: "Platforms", value: "4" },
        { label: "Cloud Dependency", value: "Zero" },
      ],
      problem: "Existing file transfer solutions either require internet connectivity, upload files to cloud servers, or have complex setup processes. Users need a simple, fast, and private way to transfer files between devices on the same network.",
      solution: "Built a peer-to-peer file transfer protocol over TCP that discovers devices on the local network using mDNS/Bonjour, establishes direct connections, and transfers files with resume capability. No internet required, no cloud storage, no accounts needed.",
      architecture: "Flutter Client (Mobile/Desktop)\n↓\nmDNS Service Discovery\n↓\nDevice Pairing & Authentication\n↓\nTCP Connection Manager\n↓\nChunked Transfer Engine (with resume)\n↓\nLocal Storage (SQLite + File System)",
      challenges: [
        {
          title: "Cross-Platform Network Discovery",
          description: "mDNS/Bonjour behaves differently across iOS, Android, Windows, macOS, and Linux. Required platform-specific implementations and fallback mechanisms.",
        },
        {
          title: "Large File Handling",
          description: "Transferring files >4GB on 32-bit systems and managing memory efficiently during chunked transfers without loading entire files into RAM.",
        },
        {
          title: "Connection Reliability",
          description: "Handling network interruptions, device sleep/wake cycles, and automatic reconnection with transfer resume from the last chunk.",
        },
      ],
      results: [
        {
          title: "Zero-Cloud Architecture",
          description: "Files never leave the local network. Complete privacy with no third-party storage.",
        },
        {
          title: "Native Transfer Speeds",
          description: "Achieves 95%+ of theoretical LAN bandwidth (100MB/s+ on Gigabit, 1GB/s+ on 10GbE).",
        },
        {
          title: "Cross-Platform Compatibility",
          description: "Single codebase runs on iOS, Android, Windows, macOS, and Linux with platform-specific optimizations.",
        },
      ],
      githubUrl: "https://github.com/himanshujadav/fastshare",
      liveUrl: "",
      seo: {
        title: "FastShare - Local File Transfer Without Cloud",
        description: "Transfer files between devices on LAN without cloud. Peer-to-peer TCP sockets, zero cloud dependency, cross-platform Flutter app.",
        ogImage: "",
      },
      createdAt: Timestamp.fromDate(new Date("2024-03-15")),
      updatedAt: now,
    },
    {
      title: "QuickMessenger",
      slug: "quickmessenger",
      shortDescription: "Real-time messaging app with end-to-end encryption, built with Flutter and Firebase.",
      description: "QuickMessenger is a feature-rich messaging application supporting one-on-one chats, group conversations, media sharing, and real-time presence. Built with Flutter for cross-platform support and Firebase for backend infrastructure.",
      category: "mobile",
      featured: true,
      published: true,
      order: 2,
      thumbnailUrl: "",
      heroImageUrl: "",
      gallery: [],
      technologies: [
        { name: "Flutter", icon: "📱" },
        { name: "Firebase", icon: "🔥" },
        { name: "Firestore", icon: "📄" },
        { name: "Firebase Auth", icon: "🔐" },
        { name: "FCM", icon: "🔔" },
      ],
      metrics: [
        { label: "Active Users", value: "10K+" },
        { label: "Messages/Day", value: "500K+" },
        { label: "Latency", value: "<100ms" },
      ],
      problem: "Building a scalable real-time messaging system that works reliably across platforms with offline support, media sharing, and push notifications.",
      solution: "Leveraged Firebase Firestore for real-time data synchronization, Firebase Auth for secure authentication, Cloud Functions for server-side logic, and FCM for push notifications. Implemented optimistic UI updates for offline-first experience.",
      architecture: "Flutter Client\n↓\nFirebase Authentication\n↓\nCloud Firestore (Real-time Sync)\n↓\nCloud Functions (Server Logic)\n↓\nFirebase Cloud Messaging (Push)\n↓\nFirebase Storage (Media)",
      challenges: [
        {
          title: "Offline-First Messaging",
          description: "Ensuring messages send/receive reliably with intermittent connectivity. Implemented local SQLite cache with background sync.",
        },
        {
          title: "Media Optimization",
          description: "Handling image/video compression, thumbnail generation, and progressive loading for smooth chat experience.",
        },
        {
          title: "Group Chat Scaling",
          description: "Managing real-time updates for groups with 100+ members without excessive Firestore reads/writes.",
        },
      ],
      results: [
        {
          title: "Sub-100ms Latency",
          description: "Real-time message delivery across global infrastructure.",
        },
        {
          title: "99.9% Uptime",
          description: "Firebase managed infrastructure provides enterprise-grade reliability.",
        },
        {
          title: "Offline Resilience",
          description: "Messages queue locally and sync automatically when connection restores.",
        },
      ],
      githubUrl: "https://github.com/himanshujadav/quickmessenger",
      liveUrl: "",
      seo: {
        title: "QuickMessenger - Real-time Messaging App",
        description: "Cross-platform messaging with E2E encryption, built with Flutter and Firebase. Real-time sync, offline support, push notifications.",
        ogImage: "",
      },
      createdAt: Timestamp.fromDate(new Date("2023-08-20")),
      updatedAt: now,
    },
    {
      title: "QuickMessenger Server",
      slug: "quickmessenger-server",
      shortDescription: "Scalable WebSocket-based messaging backend with horizontal scaling support.",
      description: "A custom WebSocket server built with Node.js and Socket.IO to power real-time messaging at scale. Features horizontal scaling with Redis adapter, room-based messaging, presence tracking, and message persistence.",
      category: "backend",
      featured: false,
      published: true,
      order: 3,
      thumbnailUrl: "",
      heroImageUrl: "",
      gallery: [],
      technologies: [
        { name: "Node.js", icon: "🟢" },
        { name: "Socket.IO", icon: "🔌" },
        { name: "Redis", icon: "🔴" },
        { name: "PostgreSQL", icon: "🐘" },
        { name: "Docker", icon: "🐳" },
      ],
      metrics: [
        { label: "Concurrent Connections", value: "50K+" },
        { label: "Messages/Second", value: "10K+" },
        { label: "Horizontal Nodes", value: "Auto-scaling" },
      ],
      problem: "Need a custom messaging backend that can scale horizontally, handle millions of messages, and provide fine-grained control over real-time features beyond what BaaS offers.",
      solution: "Built a Node.js WebSocket server using Socket.IO with Redis adapter for horizontal scaling. Implemented connection pooling, message acknowledgment, presence system, and rate limiting. Deployed with Docker and Kubernetes for auto-scaling.",
      architecture: "Load Balancer\n↓\nSocket.IO Server Cluster (Node.js)\n↓\nRedis Pub/Sub (Cross-node messaging)\n↓\nRedis Presence Store\n↓\nPostgreSQL (Message Persistence)\n↓\nWorker Queue (Async Processing)",
      challenges: [
        {
          title: "Horizontal Scaling",
          description: "Synchronizing WebSocket connections across multiple server instances using Redis adapter and sticky sessions.",
        },
        {
          title: "Message Ordering",
          description: "Guaranteeing message delivery order in distributed environment with acknowledgment and retry mechanisms.",
        },
        {
          title: "Connection Lifecycle",
          description: "Managing heartbeats, reconnection logic, and graceful degradation during server scaling events.",
        },
      ],
      results: [
        {
          title: "Linear Scaling",
          description: "Add server instances to handle more connections without code changes.",
        },
        {
          title: "Sub-millisecond Routing",
          description: "Redis pub/sub enables near-instant message routing between nodes.",
        },
        {
          title: "Zero Downtime Deployments",
          description: "Rolling updates with connection draining for seamless scaling.",
        },
      ],
      githubUrl: "https://github.com/himanshujadav/quickmessenger-server",
      liveUrl: "",
      seo: {
        title: "QuickMessenger Server - Scalable WebSocket Backend",
        description: "Node.js WebSocket server with Socket.IO, Redis clustering, horizontal scaling. Real-time messaging infrastructure.",
        ogImage: "",
      },
      createdAt: Timestamp.fromDate(new Date("2023-11-10")),
      updatedAt: now,
    },
    {
      title: "BhagwatiAdmin",
      slug: "bhagwatiadmin",
      shortDescription: "Admin dashboard for inventory management with real-time analytics and reporting.",
      description: "BhagwatiAdmin is a comprehensive admin panel for inventory and sales management. Features real-time dashboard, product management, order tracking, analytics, and role-based access control. Built as a full-stack application with React, Node.js, and PostgreSQL.",
      category: "fullstack",
      featured: false,
      published: true,
      order: 4,
      thumbnailUrl: "",
      heroImageUrl: "",
      gallery: [],
      technologies: [
        { name: "React", icon: "⚛️" },
        { name: "Node.js", icon: "🟢" },
        { name: "PostgreSQL", icon: "🐘" },
        { name: "TypeScript", icon: "🔷" },
        { name: "Tailwind CSS", icon: "🎨" },
      ],
      metrics: [
        { label: "Dashboard Load", value: "<1.5s" },
        { label: "Data Tables", value: "100K+ rows" },
        { label: "Uptime", value: "99.95%" },
      ],
      problem: "Client needed a modern, performant admin interface to replace legacy desktop software. Requirements included real-time updates, complex data tables, and role-based permissions.",
      solution: "Built a React SPA with TypeScript using TanStack Query for server state, React Table for virtualized data grids, and WebSocket connections for real-time updates. Backend uses Node.js with Prisma ORM and PostgreSQL.",
      architecture: "React Client (Vite + TypeScript)\n↓\nTanStack Query (Server State)\n↓\nREST API (Node.js + Express)\n↓\nPrisma ORM\n↓\nPostgreSQL\n↓\nWebSocket Server (Real-time)",
      challenges: [
        {
          title: "Large Dataset Rendering",
          description: "Virtualized tables with 100K+ rows using windowing and efficient data fetching strategies.",
        },
        {
          title: "Real-time Analytics",
          description: "Computing and streaming dashboard metrics without blocking the main thread.",
        },
        {
          title: "Permission System",
          description: "Implementing flexible RBAC with resource-level permissions across frontend and backend.",
        },
      ],
      results: [
        {
          title: "60% Faster Workflows",
          description: "Modern UX reduced task completion time compared to legacy system.",
        },
        {
          title: "Real-time Collaboration",
          description: "Multiple admins can work simultaneously with live updates.",
        },
        {
          title: "Extensible Architecture",
          description: "Plugin-ready design for future feature additions.",
        },
      ],
      githubUrl: "https://github.com/himanshujadav/bhagwatiadmin",
      liveUrl: "",
      seo: {
        title: "BhagwatiAdmin - Inventory Management Dashboard",
        description: "Full-stack admin panel with real-time analytics, virtualized tables, RBAC. React, Node.js, PostgreSQL.",
        ogImage: "",
      },
      createdAt: Timestamp.fromDate(new Date("2022-09-01")),
      updatedAt: now,
    },
  ];

  for (const proj of projectsData) {
    // Update related project IDs in skills
    for (const tech of proj.technologies) {
      if (skillRefs[tech.name]) {
        await adminDb!.collection("skills").doc(skillRefs[tech.name]).update({
          relatedProjects: FieldValue.arrayUnion("temp-" + proj.slug),
        });
      }
    }

    const docRef = await adminDb!.collection("projects").add(proj);
    
    // Update skills with actual project ID
    for (const tech of proj.technologies) {
      if (skillRefs[tech.name]) {
        await adminDb!.collection("skills").doc(skillRefs[tech.name]).update({
          relatedProjects: FieldValue.arrayRemove("temp-" + proj.slug),
        });
        await adminDb!.collection("skills").doc(skillRefs[tech.name]).update({
          relatedProjects: FieldValue.arrayUnion(docRef.id),
        });
      }
    }

    console.log(`✅ Project seeded: ${proj.title}`);
  }

  console.log("🎉 Database seeding completed!");
  process.exit(0);
}

seedDatabase().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});