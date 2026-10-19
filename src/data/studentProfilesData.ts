import { ProjectItem } from "@/types"

export interface SocialLinks {
  instagram: string
  youtube: string
  github: string
  linkedin: string
}

export interface SkillItem {
  id: string
  name: string
  category: "Frontend" | "Backend" | "AI & ML" | "Design" | "DevOps & Cloud" | "Mobile" | "Cybersecurity" | "Data Science"
  level?: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  isTopDisplayed?: boolean
}

export interface StudentProfileData {
  id: string
  name: string
  username: string
  email: string
  department: string
  branch: string
  aboutMe: string
  avatarUrl?: string
  bannerUrl?: string
  initials: string
  roleTitle: string
  clanName: string
  clanTier: string
  clanRole?: string
  year: string
  studentId: string
  gpa: string
  location: string
  joinedDate: string
  socialLinks: SocialLinks
  skills: SkillItem[]
  projects: ProjectItem[]
  trophiesCount: number
  postsCount: number
  status: "Active" | "Suspended"
}

export interface SkillDirectoryItem {
  id: string
  name: string
  category: "Frontend" | "Backend" | "AI & ML" | "Design" | "DevOps & Cloud" | "Mobile" | "Cybersecurity" | "Data Science"
  icon: string
  description: string
  popular?: boolean
}

export const CAMPUS_SKILLS_DIRECTORY: SkillDirectoryItem[] = [
  // Frontend
  { id: "sk-1", name: "React 19", category: "Frontend", icon: "⚛️", description: "Modern React with Actions, use hook, and concurrent rendering", popular: true },
  { id: "sk-2", name: "Tailwind CSS v4", category: "Frontend", icon: "🎨", description: "Next-generation CSS framework with lightning-fast engine", popular: true },
  { id: "sk-3", name: "TypeScript", category: "Frontend", icon: "🔷", description: "Strict static typing and advanced type generics", popular: true },
  { id: "sk-4", name: "Next.js", category: "Frontend", icon: "▲", description: "Full-stack React framework with SSR and App Router", popular: true },
  { id: "sk-5", name: "Vue.js", category: "Frontend", icon: "💚", description: "Progressive JavaScript framework for UI development", popular: false },
  { id: "sk-6", name: "KaTeX & LaTeX", category: "Frontend", icon: "📐", description: "High-performance mathematical typesetting in web apps", popular: true },
  { id: "sk-7", name: "Three.js / WebGL", category: "Frontend", icon: "🌐", description: "Interactive 3D graphics in modern browsers", popular: false },

  // Backend
  { id: "sk-8", name: "Python & Django", category: "Backend", icon: "🐍", description: "High-level Python web framework with ORM and security", popular: true },
  { id: "sk-9", name: "Node.js & Express", category: "Backend", icon: "🟢", description: "Fast, event-driven server runtime and REST APIs", popular: true },
  { id: "sk-10", name: "PostgreSQL", category: "Backend", icon: "🐘", description: "Advanced open-source relational database", popular: true },
  { id: "sk-11", name: "FastAPI", category: "Backend", icon: "⚡", description: "Modern, high-speed Python web framework with type hints", popular: true },
  { id: "sk-12", name: "Embedded C & IoT", category: "Backend", icon: "🔌", description: "Microcontroller firmware, sensors, and hardware interfacing", popular: true },
  { id: "sk-13", name: "Go & Microservices", category: "Backend", icon: "🐹", description: "Concurrent systems programming and scalable backend engines", popular: false },
  { id: "sk-14", name: "Redis & WebSockets", category: "Backend", icon: "🔄", description: "Real-time pub/sub messaging and high-speed in-memory cache", popular: true },

  // AI & ML
  { id: "sk-15", name: "PyTorch", category: "AI & ML", icon: "🔥", description: "Deep learning research and neural network architecture", popular: true },
  { id: "sk-16", name: "LLM Agents & LangChain", category: "AI & ML", icon: "🤖", description: "Autonomous AI agents, RAG pipelines, and tool invocation", popular: true },
  { id: "sk-17", name: "Computer Vision", category: "AI & ML", icon: "👁️", description: "Image classification, object detection with YOLO and OpenCV", popular: false },
  { id: "sk-18", name: "NLP & Vector DBs", category: "AI & ML", icon: "📚", description: "Natural language processing, embeddings, and Pinecone/Chroma", popular: true },

  // Design
  { id: "sk-19", name: "Figma & Prototyping", category: "Design", icon: "🎯", description: "Interactive UI/UX prototypes, components, and auto-layout", popular: true },
  { id: "sk-20", name: "Design Systems", category: "Design", icon: "📐", description: "Reusable token systems, component libraries, and visual guidelines", popular: true },
  { id: "sk-21", name: "UI/UX Architecture", category: "Design", icon: "✨", description: "User journey mapping, wireframing, and usability heuristics", popular: true },
  { id: "sk-22", name: "Micro-interactions", category: "Design", icon: "💫", description: "Subtle physics animations and tactile user feedback", popular: false },

  // DevOps & Cloud
  { id: "sk-23", name: "Docker & Containers", category: "DevOps & Cloud", icon: "🐳", description: "Multi-stage containerization and reproducible runtime envs", popular: true },
  { id: "sk-24", name: "Git & GitHub Actions", category: "DevOps & Cloud", icon: "🐙", description: "Version control workflows, CI/CD automated test pipelines", popular: true },
  { id: "sk-25", name: "Linux & Shell Scripting", category: "DevOps & Cloud", icon: "🐧", description: "UNIX server administration, bash automation, and terminal mastery", popular: true },
  { id: "sk-26", name: "Kubernetes", category: "DevOps & Cloud", icon: "☸️", description: "Container orchestration, rolling deployments, and service mesh", popular: false },

  // Mobile
  { id: "sk-27", name: "React Native", category: "Mobile", icon: "📱", description: "Cross-platform iOS and Android mobile engineering", popular: true },
  { id: "sk-28", name: "Flutter", category: "Mobile", icon: "💙", description: "High-performance compiled mobile applications with Dart", popular: false },

  // Cybersecurity
  { id: "sk-29", name: "Ethical Hacking & Sec", category: "Cybersecurity", icon: "🛡️", description: "Penetration testing, vulnerability scanning, and OWASP Top 10", popular: true },
  { id: "sk-30", name: "Network Auditing", category: "Cybersecurity", icon: "📡", description: "Packet sniffing, Wireshark telemetry, and port defense", popular: false },

  // Data Science
  { id: "sk-31", name: "Market Research & Analysis", category: "Data Science", icon: "📊", description: "Customer discovery, product analytics, and cohort modeling", popular: false },
  { id: "sk-32", name: "Financial Modeling", category: "Data Science", icon: "📈", description: "Venture valuation, cap tables, and startup cashflow forecasting", popular: false },
]

export const ALL_STUDENT_PROFILES: StudentProfileData[] = [
  {
    id: "stu-1",
    name: "Aarav Khanna",
    username: "aarav_k",
    email: "aarav.k@campus.edu",
    department: "School of Engineering & Applied Sciences",
    branch: "B.Tech - Computer Science & Engineering",
    year: "3rd Year (Class of 2027)",
    studentId: "CC-2023-CS-0842",
    gpa: "9.2 / 10.0",
    location: "Main Campus, Block C",
    joinedDate: "August 2023",
    initials: "AK",
    roleTitle: "Lead Frontend Architect & UI/UX Designer",
    clanName: "Pixel Pirates",
    clanTier: "Tier 1: Elite",
    clanRole: "Clan Leader",
    aboutMe:
      "Passionate full-stack engineer and UI/UX architect obsessed with crafting intuitive, lightning-fast digital experiences. Currently leading frontend architecture for campus clan projects and competing in national hackathons across India. When I'm not designing responsive interfaces in React and Tailwind CSS, you'll find me experimenting with generative AI agents and mentoring junior developers in campus workshops.",
    avatarUrl: "",
    bannerUrl: "",
    socialLinks: {
      github: "https://github.com/aaravkhanna",
      linkedin: "https://linkedin.com/in/aaravkhanna",
      instagram: "https://instagram.com/aarav.khanna",
      youtube: "https://youtube.com/@aaravkhanna",
    },
    skills: [
      { id: "s1-1", name: "React 19", category: "Frontend", level: "Expert", isTopDisplayed: true },
      { id: "s1-2", name: "TypeScript", category: "Frontend", level: "Expert", isTopDisplayed: true },
      { id: "s1-3", name: "Tailwind CSS v4", category: "Frontend", level: "Expert", isTopDisplayed: true },
      { id: "s1-4", name: "Figma & Prototyping", category: "Design", level: "Advanced", isTopDisplayed: true },
      { id: "s1-5", name: "UI/UX Architecture", category: "Design", level: "Expert", isTopDisplayed: true },
      { id: "s1-6", name: "Next.js", category: "Frontend", level: "Advanced", isTopDisplayed: true },
      { id: "s1-7", name: "Python & Django", category: "Backend", level: "Intermediate", isTopDisplayed: false },
      { id: "s1-8", name: "Node.js & Express", category: "Backend", level: "Intermediate", isTopDisplayed: false },
      { id: "s1-9", name: "Docker & Containers", category: "DevOps & Cloud", level: "Intermediate", isTopDisplayed: false },
      { id: "s1-10", name: "KaTeX & LaTeX", category: "Frontend", level: "Advanced", isTopDisplayed: false },
    ],
    projects: [
      {
        id: "sp-1",
        title: "DevMatch - Peer Mentorship Network",
        description: "An intelligent student pairing platform matching senior engineers with 1st-year developers based on programming interests and hackathon tracks.",
        coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
        status: "in_progress",
        isClanProject: false,
        ownerName: "Aarav Khanna",
        githubLink: "https://github.com/aaravkhanna/devmatch",
        liveLink: "https://devmatch.campusclans.edu",
        updates: [
          { id: "spu-1", title: "Version 1.0 Release", content: "Shipped core pairing algorithm and interactive mentor cards.", createdAt: "3 days ago" },
          { id: "spu-2", title: "WebSockets Chat", content: "Integrated real-time direct messaging between mentors and juniors.", createdAt: "Yesterday" },
        ],
        createdAt: "October 2026",
      },
      {
        id: "sp-2",
        title: "KaTeX Math Equation Playground",
        description: "Real-time LaTeX formula renderer and live math editor built with React and Tailwind CSS v4.",
        coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
        status: "completed",
        isClanProject: false,
        ownerName: "Aarav Khanna",
        githubLink: "https://github.com/aaravkhanna/katex-playground",
        liveLink: "https://katex.campusclans.edu",
        updates: [
          { id: "spu-3", title: "Passed Full Unit Tests", content: "Benchmarked rendering speed across 200 simultaneous complex KaTeX formulas.", createdAt: "Last week" },
        ],
        createdAt: "September 2026",
      },
      {
        id: "cp-1",
        title: "Campus Clans UI Kit v2",
        description: "Glassmorphic component library with forward-curved carousels and dark mode support for student applications.",
        status: "completed",
        isClanProject: true,
        clanName: "Pixel Pirates",
        githubLink: "https://github.com/campusclans/ui-kit",
        liveLink: "https://campusclans.edu/ui-kit",
        updates: [
          { id: "cpu-1", title: "Figma Tokens Sync", content: "Exported design tokens to Tailwind v4 theme variables.", createdAt: "2 weeks ago" }
        ],
        createdAt: "August 2026",
      }
    ],
    trophiesCount: 2,
    postsCount: 3,
    status: "Active",
  },
  {
    id: "stu-2",
    name: "Riya Malhotra",
    username: "riya_design",
    email: "riya.m@campus.edu",
    department: "Faculty of Design & Creative Arts",
    branch: "B.Des - User Experience & Interaction Design",
    year: "2nd Year (Class of 2028)",
    studentId: "CC-2024-DES-0114",
    gpa: "9.5 / 10.0",
    location: "Design Studios, Block E",
    joinedDate: "August 2024",
    initials: "RM",
    roleTitle: "Co-Leader & Design Systems Architect",
    clanName: "Pixel Pirates",
    clanTier: "Tier 1: Elite",
    clanRole: "Co-Leader",
    aboutMe:
      "Interaction designer passionate about accessible user experiences, motion systems, and tactile glassmorphic interfaces. Leading design tokens and Figma libraries for campus-wide hackathon squads. Constantly auditing digital touchpoints for WCAG AAA accessibility standards.",
    avatarUrl: "",
    bannerUrl: "",
    socialLinks: {
      github: "https://github.com/riyamalhotra",
      linkedin: "https://linkedin.com/in/riyamalhotra",
      instagram: "https://instagram.com/riya.ux",
      youtube: "https://youtube.com/@riyamalhotradesign",
    },
    skills: [
      { id: "s2-1", name: "Figma & Prototyping", category: "Design", level: "Expert", isTopDisplayed: true },
      { id: "s2-2", name: "Design Systems", category: "Design", level: "Expert", isTopDisplayed: true },
      { id: "s2-3", name: "UI/UX Architecture", category: "Design", level: "Expert", isTopDisplayed: true },
      { id: "s2-4", name: "Micro-interactions", category: "Design", level: "Advanced", isTopDisplayed: true },
      { id: "s2-5", name: "Tailwind CSS v4", category: "Frontend", level: "Intermediate", isTopDisplayed: true },
      { id: "s2-6", name: "React 19", category: "Frontend", level: "Intermediate", isTopDisplayed: false },
    ],
    projects: [
      {
        id: "sp-201",
        title: "Glassmorphic Token Engine",
        description: "Open-source Figma plugin that automates the conversion of multi-layered glass shadows into CSS backdrop-filter and Tailwind v4 themes.",
        coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=600&q=80",
        status: "completed",
        isClanProject: false,
        ownerName: "Riya Malhotra",
        githubLink: "https://github.com/riyamalhotra/glass-tokens",
        liveLink: "https://figma.com/@riyamalhotra",
        updates: [
          { id: "spu-201", title: "1,200+ Figma Community Installs", content: "Reached community trending milestone on Figma plugin store.", createdAt: "4 days ago" }
        ],
        createdAt: "September 2026",
      },
      {
        id: "sp-202",
        title: "Campus Accessibility Audit Tool",
        description: "Visual contrast and keyboard navigation simulator evaluating student portals for neurodiverse campus learners.",
        coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&h=600&q=80",
        status: "in_progress",
        isClanProject: false,
        ownerName: "Riya Malhotra",
        githubLink: "https://github.com/riyamalhotra/campus-a11y",
        updates: [
          { id: "spu-202", title: "Color Contrast Engine Ready", content: "Passed APCA 1.0 contrast testing algorithms.", createdAt: "Yesterday" }
        ],
        createdAt: "October 2026",
      }
    ],
    trophiesCount: 1,
    postsCount: 2,
    status: "Active",
  },
  {
    id: "stu-3",
    name: "Kabir Singh",
    username: "kabir_ece",
    email: "kabir.s@campus.edu",
    department: "School of Engineering & Applied Sciences",
    branch: "B.Tech - Electronics & Communication",
    year: "4th Year (Class of 2026)",
    studentId: "CC-2022-EC-0419",
    gpa: "8.8 / 10.0",
    location: "Hardware Prototyping Wing, Block A",
    joinedDate: "August 2022",
    initials: "KS",
    roleTitle: "Clan Leader & Embedded Systems Engineer",
    clanName: "Circuit Crew",
    clanTier: "Tier 2: Contender",
    clanRole: "Clan Leader",
    aboutMe:
      "Hardware tinkerer, robotics designer, and firmware developer working on autonomous drone swarms and high-speed telemetry radios. Experienced in PCB layout, FreeRTOS, and real-time sensor fusion algorithms for outdoor aerospace vehicles.",
    avatarUrl: "",
    bannerUrl: "",
    socialLinks: {
      github: "https://github.com/kabirsingh-ece",
      linkedin: "https://linkedin.com/in/kabirsinghece",
      instagram: "https://instagram.com/kabir_circuits",
      youtube: "https://youtube.com/@kabir_electronics",
    },
    skills: [
      { id: "s3-1", name: "Embedded C & IoT", category: "Backend", level: "Expert", isTopDisplayed: true },
      { id: "s3-2", name: "Python & Django", category: "Backend", level: "Advanced", isTopDisplayed: true },
      { id: "s3-3", name: "Linux & Shell Scripting", category: "DevOps & Cloud", level: "Advanced", isTopDisplayed: true },
      { id: "s3-4", name: "Redis & WebSockets", category: "Backend", level: "Advanced", isTopDisplayed: true },
      { id: "s3-5", name: "Computer Vision", category: "AI & ML", level: "Intermediate", isTopDisplayed: false },
    ],
    projects: [
      {
        id: "sp-301",
        title: "Autonomous Drone Telemetry Beacon",
        description: "ESP32-based LoRa ground telemetry node broadcasting 60 FPS flight diagnostics directly to web frontends via WebSockets.",
        coverImage: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&h=600&q=80",
        status: "completed",
        isClanProject: true,
        clanName: "Circuit Crew",
        ownerName: "Kabir Singh",
        githubLink: "https://github.com/circuitcrew/drone-telemetry",
        liveLink: "https://telemetry.campusclans.edu",
        updates: [
          { id: "spu-301", title: "Range Test Passed (3.2 km)", content: "Maintained packet loss under 0.4% across open campus sports grounds.", createdAt: "1 week ago" }
        ],
        createdAt: "August 2026",
      },
      {
        id: "sp-302",
        title: "Smart Campus Microgrid Monitor",
        description: "IoT power monitoring hardware collecting rooftop solar inverter voltages with real-time anomaly detection.",
        coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&h=600&q=80",
        status: "in_progress",
        isClanProject: false,
        ownerName: "Kabir Singh",
        githubLink: "https://github.com/kabirsingh-ece/microgrid-iot",
        updates: [
          { id: "spu-302", title: "Sensor Array Calibrated", content: "Current sensors calibrated with 99.8% precision bench meters.", createdAt: "3 days ago" }
        ],
        createdAt: "October 2026",
      }
    ],
    trophiesCount: 3,
    postsCount: 4,
    status: "Active",
  },
  {
    id: "stu-4",
    name: "Naina Kapoor",
    username: "naina_biz",
    email: "naina.k@campus.edu",
    department: "Faculty of Management Studies",
    branch: "BBA - Technology Entrepreneurship & Finance",
    year: "2nd Year (Class of 2028)",
    studentId: "CC-2024-MGT-0302",
    gpa: "9.1 / 10.0",
    location: "Innovation Incubation Centre, Block B",
    joinedDate: "August 2024",
    initials: "NK",
    roleTitle: "Clan Strategist & Venture Lead",
    clanName: "Venture Verse",
    clanTier: "Tier 2: Contender",
    clanRole: "Core Strategist",
    aboutMe:
      "Venture scout and product strategist connecting collegiate software prototypes with angel funding and seed incubators. Experienced in financial modeling, product pitching, customer discovery interviews, and campus venture hackathons.",
    avatarUrl: "",
    bannerUrl: "",
    socialLinks: {
      github: "https://github.com/nainakapoor",
      linkedin: "https://linkedin.com/in/nainakapoor-biz",
      instagram: "https://instagram.com/naina_ventures",
      youtube: "https://youtube.com/@nainastartups",
    },
    skills: [
      { id: "s4-1", name: "Market Research & Analysis", category: "Data Science", level: "Expert", isTopDisplayed: true },
      { id: "s4-2", name: "Financial Modeling", category: "Data Science", level: "Expert", isTopDisplayed: true },
      { id: "s4-3", name: "Figma & Prototyping", category: "Design", level: "Intermediate", isTopDisplayed: true },
      { id: "s4-4", name: "UI/UX Architecture", category: "Design", level: "Intermediate", isTopDisplayed: false },
    ],
    projects: [
      {
        id: "sp-401",
        title: "Campus Seed Valuation Calculator",
        description: "Interactive DCF and Berkus-method valuation framework designed specifically for early-stage collegiate startups.",
        coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=600&q=80",
        status: "completed",
        isClanProject: true,
        clanName: "Venture Verse",
        ownerName: "Naina Kapoor",
        liveLink: "https://valuation.ventureverse.edu",
        updates: [
          { id: "spu-401", title: "Adopted by Incubation Cell", content: "Now utilized by 14 campus incubation startups for angel pitch decks.", createdAt: "2 weeks ago" }
        ],
        createdAt: "July 2026",
      }
    ],
    trophiesCount: 1,
    postsCount: 1,
    status: "Active",
  },
  {
    id: "stu-5",
    name: "Devansh Sharma",
    username: "devansh_ml",
    email: "devansh.s@campus.edu",
    department: "School of Engineering & Applied Sciences",
    branch: "B.Tech - Computer Science & Engineering",
    year: "3rd Year (Class of 2027)",
    studentId: "CC-2023-CS-0255",
    gpa: "9.6 / 10.0",
    location: "AI Research Lab, Block D",
    joinedDate: "August 2023",
    initials: "DS",
    roleTitle: "Clan Leader & Chief AI Researcher",
    clanName: "Binary Beasts",
    clanTier: "Tier 1: Elite",
    clanRole: "Clan Leader",
    aboutMe:
      "Machine learning builder focusing on local LLM fine-tuning, quantization, and real-time semantic search over campus academic corpora. Winner of Smart India Hackathon and builder of distributed vector databases on campus GPU clusters.",
    avatarUrl: "",
    bannerUrl: "",
    socialLinks: {
      github: "https://github.com/devansh-ai",
      linkedin: "https://linkedin.com/in/devanshsharma-ai",
      instagram: "https://instagram.com/devansh_bytes",
      youtube: "https://youtube.com/@devansh_ml",
    },
    skills: [
      { id: "s5-1", name: "PyTorch", category: "AI & ML", level: "Expert", isTopDisplayed: true },
      { id: "s5-2", name: "Python & Django", category: "Backend", level: "Expert", isTopDisplayed: true },
      { id: "s5-3", name: "LLM Agents & LangChain", category: "AI & ML", level: "Expert", isTopDisplayed: true },
      { id: "s5-4", name: "FastAPI", category: "Backend", level: "Advanced", isTopDisplayed: true },
      { id: "s5-5", name: "NLP & Vector DBs", category: "AI & ML", level: "Expert", isTopDisplayed: true },
      { id: "s5-6", name: "Docker & Containers", category: "DevOps & Cloud", level: "Advanced", isTopDisplayed: false },
      { id: "s5-7", name: "PostgreSQL", category: "Backend", level: "Advanced", isTopDisplayed: false },
    ],
    projects: [
      {
        id: "sp-501",
        title: "Campus-LLM: Local Quantized Tutor",
        description: "A 4-bit GGUF quantized open-weights assistant trained on campus engineering syllabi, running offline on student laptops.",
        coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&h=600&q=80",
        status: "completed",
        isClanProject: true,
        clanName: "Binary Beasts",
        ownerName: "Devansh Sharma",
        githubLink: "https://github.com/binarybeasts/campus-llm",
        liveLink: "https://ai.binarybeasts.edu",
        updates: [
          { id: "spu-501", title: "Shipped v2 with Llama-3.1-8B", content: "Context window extended to 16k tokens with instant KaTeX math parsing.", createdAt: "5 days ago" }
        ],
        createdAt: "September 2026",
      },
      {
        id: "sp-502",
        title: "Vectorized Lecture Search Engine",
        description: "Hybrid BM25 + dense embedding search pipeline index over 450 hours of recorded university classroom lectures.",
        coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&h=600&q=80",
        status: "in_progress",
        isClanProject: false,
        ownerName: "Devansh Sharma",
        githubLink: "https://github.com/devansh-ai/lecture-search",
        updates: [
          { id: "spu-502", title: "Whisper Transcription Finished", content: "Automated batch speech recognition completed with 97.4% word accuracy.", createdAt: "Yesterday" }
        ],
        createdAt: "October 2026",
      }
    ],
    trophiesCount: 4,
    postsCount: 5,
    status: "Active",
  },
  {
    id: "stu-6",
    name: "Ananya Patel",
    username: "ananya_p",
    email: "ananya.p@campus.edu",
    department: "School of Engineering & Applied Sciences",
    branch: "B.Tech - Information Technology",
    year: "1st Year (Class of 2029)",
    studentId: "CC-2025-IT-0912",
    gpa: "8.9 / 10.0",
    location: "First Year Block, Block F",
    joinedDate: "August 2025",
    initials: "AP",
    roleTitle: "Aspiring Full-Stack Software Engineer",
    clanName: "Seeking Clan",
    clanTier: "Independent",
    clanRole: "Recruitment Candidate",
    aboutMe:
      "First-year programmer passionate about algorithms, clean code in TypeScript, and building modern web apps with React. Actively looking for an energetic clan to join and build hackathon projects. Quick learner with deep curiosity.",
    avatarUrl: "",
    bannerUrl: "",
    socialLinks: {
      github: "https://github.com/ananyapatel-dev",
      linkedin: "https://linkedin.com/in/ananyapatel-tech",
      instagram: "https://instagram.com/ananya.codes",
      youtube: "https://youtube.com/@ananyapatel",
    },
    skills: [
      { id: "s6-1", name: "React 19", category: "Frontend", level: "Intermediate", isTopDisplayed: true },
      { id: "s6-2", name: "TypeScript", category: "Frontend", level: "Intermediate", isTopDisplayed: true },
      { id: "s6-3", name: "Tailwind CSS v4", category: "Frontend", level: "Intermediate", isTopDisplayed: true },
      { id: "s6-4", name: "Python & Django", category: "Backend", level: "Beginner", isTopDisplayed: true },
    ],
    projects: [
      {
        id: "sp-601",
        title: "AlgoVisualizer: Interactive Graph Traversals",
        description: "Interactive visualizer demonstrating Dijkstra's shortest path, A* algorithm, and DFS/BFS graph traversals on custom grids.",
        coverImage: "https://images.unsplash.com/photo-1516116211227-bbc0c253818e?auto=format&fit=crop&w=1200&h=600&q=80",
        status: "in_progress",
        isClanProject: false,
        ownerName: "Ananya Patel",
        githubLink: "https://github.com/ananyapatel-dev/algoviz",
        liveLink: "https://algoviz.campusclans.edu",
        updates: [
          { id: "spu-601", title: "Added Weighted Maze Generator", content: "Supports Prim's maze generation with variable terrain friction weights.", createdAt: "3 days ago" }
        ],
        createdAt: "October 2026",
      }
    ],
    trophiesCount: 0,
    postsCount: 1,
    status: "Active",
  },
  {
    id: "stu-7",
    name: "Vikram Rathore",
    username: "vikram_sec",
    email: "vikram.r@campus.edu",
    department: "School of Engineering & Applied Sciences",
    branch: "B.Tech - Computer Science & Cyber Defense",
    year: "4th Year (Class of 2026)",
    studentId: "CC-2022-CS-0711",
    gpa: "9.3 / 10.0",
    location: "Cyber Forensics Lab, Block D",
    joinedDate: "August 2022",
    initials: "VR",
    roleTitle: "Security Researcher & Penetration Tester",
    clanName: "Binary Beasts",
    clanTier: "Tier 1: Elite",
    clanRole: "Security Lead",
    aboutMe:
      "Cybersecurity researcher and ethical hacker conducting vulnerability assessments, penetration testing, and zero-day research. Awarded 12+ responsible disclosure hall of fames. Dedicated to hardening campus systems and mentoring defensive security squads.",
    avatarUrl: "",
    bannerUrl: "",
    socialLinks: {
      github: "https://github.com/vikram-sec",
      linkedin: "https://linkedin.com/in/vikram-rathore-sec",
      instagram: "https://instagram.com/vikram_cyber",
      youtube: "https://youtube.com/@vikram_security",
    },
    skills: [
      { id: "s7-1", name: "Ethical Hacking & Sec", category: "Cybersecurity", level: "Expert", isTopDisplayed: true },
      { id: "s7-2", name: "Network Auditing", category: "Cybersecurity", level: "Expert", isTopDisplayed: true },
      { id: "s7-3", name: "Linux & Shell Scripting", category: "DevOps & Cloud", level: "Expert", isTopDisplayed: true },
      { id: "s7-4", name: "Docker & Containers", category: "DevOps & Cloud", level: "Advanced", isTopDisplayed: true },
      { id: "s7-5", name: "Python & Django", category: "Backend", level: "Advanced", isTopDisplayed: false },
    ],
    projects: [
      {
        id: "sp-701",
        title: "Campus Wi-Fi Security Sentinel",
        description: "Automated IDS daemon detecting rogue rogue access points and de-authentication sweeps across eduroam campus access points.",
        coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&h=600&q=80",
        status: "completed",
        isClanProject: true,
        clanName: "Binary Beasts",
        ownerName: "Vikram Rathore",
        githubLink: "https://github.com/binarybeasts/wifi-sentinel",
        updates: [
          { id: "spu-701", title: "Deployed to Campus NOC", content: "Presented at campus cybersecurity awareness workshop with IT directors.", createdAt: "2 weeks ago" }
        ],
        createdAt: "September 2026",
      }
    ],
    trophiesCount: 2,
    postsCount: 2,
    status: "Active",
  }
]

/** Get student profile by ID or username */
export function getStudentProfileById(idOrUsername: string): StudentProfileData | undefined {
  const clean = idOrUsername.toLowerCase().trim()
  return ALL_STUDENT_PROFILES.find(
    (s) => s.id.toLowerCase() === clean || s.username.toLowerCase() === clean || s.name.toLowerCase() === clean
  )
}

/** Get skills directory with real student counts */
export function getSkillsDirectoryWithCounts(): Array<SkillDirectoryItem & { studentCount: number; students: { id: string; name: string; avatar: string }[] }> {
  return CAMPUS_SKILLS_DIRECTORY.map((skill) => {
    const matchedStudents = ALL_STUDENT_PROFILES.filter((student) =>
      student.skills.some((s) => s.name.toLowerCase().includes(skill.name.toLowerCase()) || skill.name.toLowerCase().includes(s.name.toLowerCase()))
    )
    return {
      ...skill,
      studentCount: matchedStudents.length,
      students: matchedStudents.map((s) => ({ id: s.id, name: s.name, avatar: s.initials })),
    }
  })
}

/** Search students with multi-filter */
export function searchStudents(
  query: string,
  categoryFilter?: string,
  clanFilter?: string,
  departmentFilter?: string
): StudentProfileData[] {
  const q = query.toLowerCase().trim()
  return ALL_STUDENT_PROFILES.filter((s) => {
    const matchesQuery =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.username.toLowerCase().includes(q) ||
      s.branch.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.clanName.toLowerCase().includes(q) ||
      s.skills.some((sk) => sk.name.toLowerCase().includes(q) || sk.category.toLowerCase().includes(q))

    const matchesCategory =
      !categoryFilter ||
      categoryFilter === "All" ||
      s.skills.some((sk) => sk.category.toLowerCase() === categoryFilter.toLowerCase())

    const matchesClan =
      !clanFilter || clanFilter === "All Clans" || s.clanName.toLowerCase() === clanFilter.toLowerCase()

    const matchesDepartment =
      !departmentFilter ||
      departmentFilter === "All Departments" ||
      s.department.toLowerCase().includes(departmentFilter.toLowerCase())

    return matchesQuery && matchesCategory && matchesClan && matchesDepartment
  })
}
