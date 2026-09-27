import { Project, Skill, Experience, Profile, SiteSettings } from "@/types";

const now = new Date("2026-01-01T00:00:00Z");

export const FALLBACK_PROFILE: Profile = {
  id: "main",
  name: "Himanshu Jadav",
  role: "Software Developer | Flutter & Node.js",
  bio: "MCA graduate & Software Engineer crafting high-throughput systems, real-time socket delivery, and resilient offline-first architectures.",
  location: "Rajkot, Gujarat, India",
  avatarUrl: "/images/himanshu-profile.jpg",
  resumeUrl: "https://drive.google.com/file/d/1iIDQiO3snQjOQZTe6gjWRhFa5d2fbLoI/view?usp=sharing",
  socialLinks: [
    { platform: "github", url: "https://github.com/HimanshuJadav77", icon: "github" },
    { platform: "linkedin", url: "https://linkedin.com/in/himanshu-jadav-17b56b2a1", icon: "linkedin" },
    { platform: "email", url: "mailto:himanshujadav1877@gmail.com", icon: "mail" },
  ],
  updatedAt: now,
};

export const FALLBACK_SITE_SETTINGS: SiteSettings = {
  id: "main",
  siteName: "Himanshu Jadav",
  tagline: "Software Engineer — Building Systems That Move Data",
  heroStatement: "MCA graduate & Software Engineer crafting high-throughput systems, real-time socket delivery, and resilient offline-first architectures.",
  telemetry: [
    { label: "SYSTEM STATUS", value: "ONLINE" },
    { label: "LOCATION", value: "Rajkot, Gujarat, India" },
    { label: "STACK", value: "FLUTTER · NODE.JS · DISTRIBUTED" },
    { label: "MODE", value: "PRODUCTION" },
  ],
  maintenanceMode: false,
  updatedAt: now,
};

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: "fastshare",
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
    githubUrl: "https://github.com/HimanshuJadav77/fastshare",
    liveUrl: "",
    seo: {
      title: "FastShare - Local File Transfer Without Cloud",
      description: "Transfer files between devices on LAN without cloud. Peer-to-peer TCP sockets, zero cloud dependency, cross-platform Flutter app.",
      ogImage: "",
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "quickmessenger",
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
    githubUrl: "https://github.com/HimanshuJadav77/quickmessenger",
    liveUrl: "",
    seo: {
      title: "QuickMessenger - Real-time Messaging App",
      description: "Cross-platform messaging with E2E encryption, built with Flutter and Firebase. Real-time sync, offline support, push notifications.",
      ogImage: "",
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "realtime-backend",
    title: "QuickMessenger Server",
    slug: "realtime-backend",
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
    githubUrl: "https://github.com/HimanshuJadav77/quickmessenger-server",
    liveUrl: "",
    seo: {
      title: "QuickMessenger Server - Scalable WebSocket Backend",
      description: "Node.js WebSocket server with Socket.IO, Redis clustering, horizontal scaling. Real-time messaging infrastructure.",
      ogImage: "",
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "bhagwatiadmin",
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
    githubUrl: "https://github.com/HimanshuJadav77/bhagwatiadmin",
    liveUrl: "",
    seo: {
      title: "BhagwatiAdmin - Inventory Management Dashboard",
      description: "Full-stack admin panel with real-time analytics, virtualized tables, RBAC. React, Node.js, PostgreSQL.",
      ogImage: "",
    },
    createdAt: now,
    updatedAt: now,
  },
];

export const FALLBACK_SKILLS: Skill[] = [
  { id: "s1", name: "Flutter", category: "mobile", icon: "📱", proficiency: 5, relatedProjects: ["fastshare", "quickmessenger"], order: 1 },
  { id: "s2", name: "Dart", category: "mobile", icon: "🎯", proficiency: 5, relatedProjects: ["fastshare", "quickmessenger"], order: 2 },
  { id: "s3", name: "Node.js", category: "backend", icon: "🟢", proficiency: 5, relatedProjects: ["realtime-backend", "bhagwatiadmin"], order: 3 },
  { id: "s4", name: "TypeScript", category: "frontend", icon: "🔷", proficiency: 5, relatedProjects: ["bhagwatiadmin"], order: 4 },
  { id: "s5", name: "React", category: "frontend", icon: "⚛️", proficiency: 4, relatedProjects: ["bhagwatiadmin"], order: 5 },
  { id: "s6", name: "Next.js", category: "frontend", icon: "▲", proficiency: 4, relatedProjects: [], order: 6 },
  { id: "s7", name: "Firebase", category: "backend", icon: "🔥", proficiency: 5, relatedProjects: ["quickmessenger"], order: 7 },
  { id: "s8", name: "Firestore", category: "backend", icon: "📄", proficiency: 5, relatedProjects: ["quickmessenger"], order: 8 },
  { id: "s9", name: "WebSockets", category: "backend", icon: "🔌", proficiency: 4, relatedProjects: ["realtime-backend"], order: 9 },
  { id: "s10", name: "Socket.IO", category: "backend", icon: "🔌", proficiency: 4, relatedProjects: ["realtime-backend"], order: 10 },
  { id: "s11", name: "PostgreSQL", category: "backend", icon: "🐘", proficiency: 4, relatedProjects: ["bhagwatiadmin", "realtime-backend"], order: 11 },
  { id: "s12", name: "Redis", category: "backend", icon: "🔴", proficiency: 3, relatedProjects: ["realtime-backend"], order: 12 },
  { id: "s13", name: "Docker", category: "devops", icon: "🐳", proficiency: 4, relatedProjects: ["realtime-backend"], order: 13 },
  { id: "s14", name: "GitHub Actions", category: "devops", icon: "⚙️", proficiency: 4, relatedProjects: [], order: 14 },
  { id: "s15", name: "REST APIs", category: "backend", icon: "🌐", proficiency: 5, relatedProjects: ["bhagwatiadmin"], order: 15 },
];

export const FALLBACK_EXPERIENCE: Experience[] = [
  {
    id: "exp1",
    company: "Freelance & Systems Engineering",
    role: "Software Developer",
    location: "Remote",
    type: "freelance",
    startDate: new Date("2023-01-01"),
    endDate: undefined,
    current: true,
    description: "Building production mobile and backend applications. Specializing in Flutter, Node.js, and Firebase-based real-time architectures.",
    technologies: ["Flutter", "Node.js", "Firebase", "TypeScript", "PostgreSQL"],
    highlights: [
      "Delivered production applications across mobile and distributed backends",
      "Engineered peer-to-peer local streaming protocols over TCP sockets",
      "Designed real-time event infrastructure with WebSocket delivery",
    ],
    order: 1,
    createdAt: now,
    updatedAt: now,
  },
];
