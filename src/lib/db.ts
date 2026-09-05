import { neon } from "@neondatabase/serverless";

export function getDb() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_6fmQKyBeTY7r@ep-bold-mouse-aeox7um2-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";
  return neon(databaseUrl);
}

export async function initDb() {
  const sql = getDb();

  // Create tables if they don't exist
  await sql`
    CREATE TABLE IF NOT EXISTS portfolio_config (
      id VARCHAR(50) PRIMARY KEY,
      headline VARCHAR(255) NOT NULL,
      subheadline TEXT NOT NULL,
      cta_text VARCHAR(100) NOT NULL,
      cta_link VARCHAR(255) NOT NULL,
      stat1_value VARCHAR(50) NOT NULL,
      stat1_label VARCHAR(100) NOT NULL,
      stat2_value VARCHAR(50) NOT NULL,
      stat2_label VARCHAR(100) NOT NULL,
      video_opacity_dark NUMERIC DEFAULT 1.0,
      video_opacity_light NUMERIC DEFAULT 0.9,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await sql`ALTER TABLE portfolio_config ADD COLUMN IF NOT EXISTS video_opacity_dark NUMERIC DEFAULT 1.0;`;
    await sql`ALTER TABLE portfolio_config ADD COLUMN IF NOT EXISTS video_opacity_light NUMERIC DEFAULT 0.9;`;
  } catch {}

  await sql`
    CREATE TABLE IF NOT EXISTS skills (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      level INT NOT NULL,
      category VARCHAR(50) NOT NULL,
      code VARCHAR(50) NOT NULL,
      tagline TEXT NOT NULL,
      tags JSONB NOT NULL,
      sort_order INT DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id VARCHAR(100) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      codename VARCHAR(100) NOT NULL,
      category VARCHAR(50) NOT NULL,
      tagline TEXT NOT NULL,
      description TEXT NOT NULL,
      architecture JSONB NOT NULL,
      metrics JSONB NOT NULL,
      tags JSONB NOT NULL,
      github_url TEXT,
      live_url TEXT,
      featured BOOLEAN DEFAULT false,
      sort_order INT DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS video_url TEXT;`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS linkedin_url TEXT;`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS users_count TEXT;`;
  } catch {}

  await sql`
    CREATE TABLE IF NOT EXISTS experiences (
      id VARCHAR(100) PRIMARY KEY,
      role VARCHAR(255) NOT NULL,
      company VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      period VARCHAR(100) NOT NULL,
      badge VARCHAR(100) NOT NULL,
      overview TEXT NOT NULL,
      achievements JSONB NOT NULL,
      technologies JSONB NOT NULL,
      sort_order INT DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS inquiries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS project_comments (
      id VARCHAR(100) PRIMARY KEY,
      project_id VARCHAR(100) NOT NULL,
      author_name VARCHAR(150) NOT NULL,
      author_role VARCHAR(100) DEFAULT 'AI Engineer',
      content TEXT NOT NULL,
      likes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS social_profiles (
      id VARCHAR(50) PRIMARY KEY,
      platform VARCHAR(50) NOT NULL,
      username VARCHAR(100) NOT NULL,
      display_name VARCHAR(100) NOT NULL,
      profile_pic TEXT,
      verified BOOLEAN DEFAULT true,
      bio TEXT,
      external_link TEXT,
      posts_count VARCHAR(20) DEFAULT '0',
      followers_count VARCHAR(20) DEFAULT '279',
      following_count VARCHAR(20) DEFAULT '258',
      views_30days VARCHAR(100) DEFAULT '762 views in the last 30 days.',
      music_track VARCHAR(100) DEFAULT 'Jannat B Praak',
      highlights JSONB DEFAULT '[]'::jsonb,
      posts JSONB DEFAULT '[]'::jsonb,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // ── Seed social_profiles if empty ──
  const existingInsta = await sql`SELECT id FROM social_profiles WHERE id = 'instagram'`;
  if (existingInsta.length === 0) {
    const defaultHighlights = [
      { title: "New", isAdd: true },
      { id: 1, title: "# college", video: "/instagram/reel_1.mp4" },
      { id: 2, title: "💗", video: "/instagram/reel_2.mp4" },
      { id: 3, title: "😉", video: "/instagram/reel_3.mp4" },
      { id: 4, title: "Real diamond 💎", video: "/instagram/reel_4.mp4" },
      { id: 5, title: "Memories ✨", video: "/instagram/reel_5.mp4" },
      { id: 6, title: "Vibes 🔥", video: "/instagram/reel_6.mp4" },
      { id: 7, title: "Friends 🤝", video: "/instagram/reel_7.mp4" },
      { id: 8, title: "Life 🌟", video: "/instagram/reel_8.mp4" },
    ];
    await sql`
      INSERT INTO social_profiles (
        id, platform, username, display_name, profile_pic, verified, bio, external_link,
        posts_count, followers_count, following_count, views_30days, music_track, highlights, posts
      ) VALUES (
        'instagram',
        'instagram',
        'jaydeep.prajapati_18',
        'Er. Jaydeep Prajapati',
        '/instagram/avatar.png',
        true,
        'Digital creator\n❤️🚩jay shree Ram 🚩\n🤔A man without EGO , is not a man.\n⚠️ Currently busy turning my dreams into reality.',
        'www.instagram.com/websetu.32?igsh=MTJwdXI3enBqd...',
        '0',
        '279',
        '258',
        '762 views in the last 30 days.',
        'Jannat · B Praak',
        ${JSON.stringify(defaultHighlights)},
        '[]'::jsonb
      )
    `;

    await sql`
      INSERT INTO social_profiles (
        id, platform, username, display_name, profile_pic, verified, bio, external_link,
        posts_count, followers_count, following_count, views_30days, music_track, highlights, posts
      ) VALUES (
        'github',
        'github',
        'jay-123-oss',
        'Er. Jaydeep Prajapati',
        '/linkedin/avatar.png',
        true,
        '💻 Python & Web Developer | 🚀 Learning AI & Automation |\n✨ Sharing code & building projects',
        '/Jaydeep_Prajapati_Resume_Strict1Page.pdf',
        '25',
        '7',
        '31',
        '7 followers · 31 following',
        'Open Source',
        '[]'::jsonb,
        '[]'::jsonb
      )
    `;

    await sql`
      INSERT INTO social_profiles (
        id, platform, username, display_name, profile_pic, verified, bio, external_link,
        posts_count, followers_count, following_count, views_30days, music_track, highlights, posts
      ) VALUES (
        'linkedin',
        'linkedin',
        'jaydeep-prajapati-a97988358',
        'Jaydeep--- (jay) ---Prajapati',
        '/linkedin/avatar.png',
        true,
        'python Devloper | Machine learning |MySQL | MongoDB |Computer vision| web Devloper | Git & Github | Data science | Data analyst | FastApi | Docker | AWS | Gen ai learning.....',
        'https://www.linkedin.com/in/jaydeep-prajapati-a97988358/',
        '491',
        '491',
        '500+',
        '30 profile views',
        'AI Engineering',
        '[]'::jsonb,
        '[]'::jsonb
      )
    `;
  }

  // ── Seed portfolio_config if empty ──
  const existingConfig = await sql`SELECT id FROM portfolio_config WHERE id = 'main'`;
  if (existingConfig.length === 0) {
    await sql`
      INSERT INTO portfolio_config (
        id, headline, subheadline, cta_text, cta_link,
        stat1_value, stat1_label, stat2_value, stat2_label
      ) VALUES (
        'main',
        'MACHINE LEARNING & AI SYSTEMS',
        'Architecting high-throughput neural models, autonomous LLM pipelines, and ultra-low-latency distributed inference engines.',
        'EXPLORE MODELS',
        '#skills',
        '25M+',
        'Daily Inferences',
        '< 38ms',
        'P99 Inference Latency'
      )
    `;
  }

  // ── Seed skills if empty ──
  const existingSkills = await sql`SELECT id FROM skills LIMIT 1`;
  if (existingSkills.length === 0) {
    const defaultSkills = [
      {
        id: "nextjs",
        name: "Next.js 16 / React 19",
        level: 95,
        category: "frontend",
        code: "UI-01 // CORE",
        tagline: "Server Components, streaming SSR, App Router architecture.",
        tags: ["React 19", "Server Actions", "Turbopack", "Hydration"],
        sort_order: 1,
      },
      {
        id: "typescript",
        name: "TypeScript (Strict)",
        level: 92,
        category: "frontend",
        code: "TS-02 // TYPE",
        tagline: "Generic inference, AST transforms, strict null safety.",
        tags: ["Generics", "Type Guards", "Utility Types", "AST"],
        sort_order: 2,
      },
      {
        id: "tailwind",
        name: "Tailwind CSS v4 & Styling",
        level: 96,
        category: "frontend",
        code: "CSS-03 // STYLE",
        tagline: "Dynamic token systems, high-performance CSS animations.",
        tags: ["Tailwind v4", "CSS Variables", "Responsive", "Tokens"],
        sort_order: 3,
      },
      {
        id: "framer",
        name: "Framer Motion & Micro-UI",
        level: 88,
        category: "frontend",
        code: "ANIM-04 // FX",
        tagline: "Layout orchestration, springs, gesture-driven HUD components.",
        tags: ["Layout Animations", "Gestures", "Springs", "SVG Paths"],
        sort_order: 4,
      },
      {
        id: "pytorch",
        name: "PyTorch & Deep Learning",
        level: 94,
        category: "ai",
        code: "AI-01 // TENSOR",
        tagline: "Transformer backbones, custom CUDA ops, distributed training.",
        tags: ["TorchDynamo", "CUDA", "Multi-GPU", "FlashAttention"],
        sort_order: 5,
      },
      {
        id: "vllm",
        name: "vLLM & Inference Serving",
        level: 92,
        category: "ai",
        code: "AI-02 // SERVE",
        tagline: "PagedAttention, continuous batching, AWQ/GGUF quantization.",
        tags: ["Continuous Batching", "PagedAttention", "AWQ", "Triton"],
        sort_order: 6,
      },
      {
        id: "langchain",
        name: "LangChain & Multi-Agents",
        level: 90,
        category: "ai",
        code: "AI-03 // AGENT",
        tagline: "Hierarchical agent DAGs, semantic routing, tool reflection.",
        tags: ["Agent Swarms", "Tool Calling", "Reflection", "DAGs"],
        sort_order: 7,
      },
      {
        id: "tensorrt",
        name: "TensorRT & Computer Vision",
        level: 86,
        category: "ai",
        code: "AI-04 // VISION",
        tagline: "Zero-shot YOLO segmentation, ONNX runtime, Jetson deployment.",
        tags: ["YOLOv10", "SAM", "ONNX", "Edge AI"],
        sort_order: 8,
      },
      {
        id: "fastapi",
        name: "FastAPI & Python Async",
        level: 92,
        category: "backend",
        code: "API-01 // ASYNC",
        tagline: "High-throughput asynchronous microservices, gRPC streaming.",
        tags: ["AsyncIO", "Pydantic v2", "gRPC", "WebSockets"],
        sort_order: 9,
      },
      {
        id: "pgvector",
        name: "pgvector & Qdrant (RAG)",
        level: 90,
        category: "backend",
        code: "DATA-02 // VEC",
        tagline: "Hybrid dense-sparse indexing, cross-encoder re-ranking.",
        tags: ["HNSW", "Cosine Indexing", "ColBERT", "Hybrid RAG"],
        sort_order: 10,
      },
      {
        id: "redis",
        name: "Redis Semantic Cache",
        level: 88,
        category: "backend",
        code: "DATA-03 // CACHE",
        tagline: "High-speed token buffer, Pub/Sub message broker.",
        tags: ["Semantic Caching", "Pub/Sub", "In-Memory", "Low Latency"],
        sort_order: 11,
      },
      {
        id: "docker-k8s",
        name: "Docker & Kubernetes",
        level: 89,
        category: "devops",
        code: "OPS-01 // CLOUD",
        tagline: "Multi-node GPU orchestration, auto-scaling, Helm charts.",
        tags: ["K8s", "GPU Operators", "Helm", "Multi-Cloud"],
        sort_order: 12,
      },
    ];

    for (const s of defaultSkills) {
      await sql`
        INSERT INTO skills (id, name, level, category, code, tagline, tags, sort_order)
        VALUES (${s.id}, ${s.name}, ${s.level}, ${s.category}, ${s.code}, ${s.tagline}, ${JSON.stringify(s.tags)}, ${s.sort_order})
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }

  // ── Seed projects if empty ──
  const existingProjects = await sql`SELECT id FROM projects LIMIT 1`;
  if (existingProjects.length === 0) {
    const defaultProjects = [
      {
        id: "omni-agent",
        title: "OmniAgent — Multi-Modal Autonomous Orchestration Engine",
        codename: "SYS-01 // AGENTIC CORE",
        category: "llm",
        featured: true,
        tagline: "Autonomous hierarchical agent swarm with dynamic tool reflection and memory graph.",
        description:
          "Engineered an enterprise-grade agentic orchestration system supporting distributed tool calling, semantic state reflection, and persistent vector memory. Implemented sub-second function dispatching and token streaming.",
        architecture: [
          "Dynamic DAG workflow generation",
          "Persistent hybrid memory (pgvector + Redis)",
          "Quantized LLM tool-calling fallback pipeline",
        ],
        metrics: [
          { label: "Token Throughput", value: "320 tok/s" },
          { label: "Tool Accuracy", value: "98.4%" },
          { label: "Memory Retrieval", value: "< 14ms" },
        ],
        tags: ["Python", "LangChain", "vLLM", "Redis", "pgvector", "FastAPI"],
        github_url: "https://github.com",
        live_url: "https://demo.example.com",
        sort_order: 1,
      },
      {
        id: "neuro-vision",
        title: "NeuroVision — Real-Time Spatial Edge Detection & Tracking",
        codename: "SYS-02 // NEURAL SIGHT",
        category: "vision",
        featured: true,
        tagline: "Hardware-accelerated zero-shot object segmentation and 3D bounding inference.",
        description:
          "Developed a low-latency computer vision pipeline optimized with TensorRT and ONNX Runtime for edge IoT deployment. Achieved 140+ FPS on embedded NVIDIA Jetson platforms with multi-stream camera inputs.",
        architecture: [
          "Custom YOLOv10 + SAM zero-shot backbone",
          "TensorRT FP16 quantization engine",
          "Multi-threaded GStreamer RTSP ingestion pipeline",
        ],
        metrics: [
          { label: "Inference Speed", value: "140+ FPS" },
          { label: "mAP@0.50:0.95", value: "92.8%" },
          { label: "GPU VRAM Footprint", value: "1.4 GB" },
        ],
        tags: ["PyTorch", "TensorRT", "CUDA", "OpenCV", "ONNX", "C++"],
        github_url: "https://github.com",
        live_url: "https://demo.example.com",
        sort_order: 2,
      },
      {
        id: "tensor-flow-mesh",
        title: "HyperScale — Distributed Model Sharding & Inference Mesh",
        codename: "SYS-03 // DISTRIBUTED ML",
        category: "distributed",
        featured: false,
        tagline: "High-throughput model parallelism and load-balanced tensor serving cluster.",
        description:
          "Architected a cloud-native distributed inference router with continuous batching, PagedAttention optimizations, and automatic replica scaling across multi-node GPU clusters.",
        architecture: [
          "Continuous dynamic batching layer",
          "PagedAttention vLLM cluster router",
          "gRPC telemetry and health monitoring daemon",
        ],
        metrics: [
          { label: "P99 Latency", value: "< 28ms" },
          { label: "Throughput Boost", value: "4.2x" },
          { label: "Cluster Uptime", value: "99.99%" },
        ],
        tags: ["Kubernetes", "Triton", "Ray", "vLLM", "gRPC", "Docker"],
        github_url: "https://github.com",
        live_url: "https://demo.example.com",
        sort_order: 3,
      },
      {
        id: "synth-craft",
        title: "SynthCraft — Generative UI & Context-Aware Studio",
        codename: "SYS-04 // FULL-STACK AI",
        category: "fullstack",
        featured: true,
        tagline: "Next-generation generative workspace compiling conversational intent into live React code.",
        description:
          "A full-stack AI development platform combining streaming AST parsing, live WebContainer sandboxing, and real-time LLM diff patching for zero-latency UI scaffolding.",
        architecture: [
          "Streaming AST code generation pipeline",
          "In-browser WebContainer sandbox execution",
          "Next.js 16 App Router & Server Components",
        ],
        metrics: [
          { label: "First Render Latency", value: "< 850ms" },
          { label: "Code Compilation", value: "100% Client-Side" },
          { label: "Active Developers", value: "12,000+" },
        ],
        tags: ["Next.js 16", "React 19", "Tailwind CSS", "WebContainer", "TypeScript"],
        github_url: "https://github.com",
        live_url: "https://demo.example.com",
        sort_order: 4,
      },
    ];

    for (const p of defaultProjects) {
      await sql`
        INSERT INTO projects (
          id, title, codename, category, tagline, description,
          architecture, metrics, tags, github_url, live_url, featured, sort_order
        ) VALUES (
          ${p.id}, ${p.title}, ${p.codename}, ${p.category}, ${p.tagline}, ${p.description},
          ${JSON.stringify(p.architecture)}, ${JSON.stringify(p.metrics)}, ${JSON.stringify(p.tags)},
          ${p.github_url}, ${p.live_url}, ${p.featured}, ${p.sort_order}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }

  // ── Seed experiences if empty ──
  const existingExp = await sql`SELECT id FROM experiences LIMIT 1`;
  if (existingExp.length === 0) {
    const defaultExp = [
      {
        id: "lead-ai-eng",
        role: "Staff / Lead Machine Learning Engineer",
        company: "Autonomous Systems & AI Labs",
        location: "Vancouver, BC / Remote",
        period: "2024 — PRESENT",
        badge: "ACTIVE DEPLOYMENT",
        overview:
          "Spearheading the engineering of multi-modal agentic systems, model distillation pipelines, and real-time distributed inference infrastructure.",
        achievements: [
          "Engineered an autonomous multi-agent task execution system processing over 25M daily inferences with <38ms P99 latency.",
          "Fine-tuned and quantized Llama 3 & Mistral open-weights models down to 4-bit AWQ/GGUF, reducing cloud inference costs by 62%.",
          "Designed a fault-tolerant vector retrieval pipeline (pgvector + Qdrant) scaling across 15M+ enterprise technical documents.",
        ],
        technologies: ["PyTorch", "vLLM", "LangChain", "TensorRT", "Kubernetes", "Ray", "Python", "Docker"],
        sort_order: 1,
      },
      {
        id: "sr-ml-dev",
        role: "Senior AI / Full-Stack Engineer",
        company: "Cognitive Nexus Technologies",
        location: "San Francisco, CA / Remote",
        period: "2022 — 2024",
        badge: "PRODUCTION IMPACT",
        overview:
          "Architected end-to-end full-stack AI applications, streaming LLM interfaces, and computer vision edge processing workflows.",
        achievements: [
          "Built real-time streaming conversational studio supporting WebRTC audio duplex and streaming code diff generation.",
          "Optimized zero-shot computer vision inference on NVIDIA Jetson embedded hardware, achieving 120 FPS on RTSP video feeds.",
        ],
        technologies: ["Next.js 15", "FastAPI", "OpenCV", "CUDA", "Redis", "TypeScript", "Tailwind CSS"],
        sort_order: 2,
      },
    ];

    for (const e of defaultExp) {
      await sql`
        INSERT INTO experiences (
          id, role, company, location, period, badge, overview,
          achievements, technologies, sort_order
        ) VALUES (
          ${e.id}, ${e.role}, ${e.company}, ${e.location}, ${e.period}, ${e.badge}, ${e.overview},
          ${JSON.stringify(e.achievements)}, ${JSON.stringify(e.technologies)}, ${e.sort_order}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }

  // ── Create social_profiles table ──
  await sql`
    CREATE TABLE IF NOT EXISTS social_profiles (
      id VARCHAR(50) PRIMARY KEY,
      platform VARCHAR(50) NOT NULL,
      username VARCHAR(100) NOT NULL,
      display_name VARCHAR(150) NOT NULL,
      verified BOOLEAN DEFAULT TRUE,
      category VARCHAR(100) DEFAULT 'Digital creator',
      profile_pic TEXT,
      thought_bubble TEXT DEFAULT 'Make this space yours...',
      bio_lines JSONB,
      external_link TEXT,
      threads_handle VARCHAR(100),
      music_track VARCHAR(150),
      posts_count VARCHAR(20) DEFAULT '0',
      followers_count VARCHAR(20) DEFAULT '279',
      following_count VARCHAR(20) DEFAULT '258',
      views_30days VARCHAR(100) DEFAULT '762 views in the last 30 days.',
      highlights JSONB,
      empty_title VARCHAR(100) DEFAULT 'Create your first post',
      empty_subtitle VARCHAR(100) DEFAULT 'Make this space your own.',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // ── Seed social_profiles if empty ──
  const existingSocial = await sql`SELECT id FROM social_profiles LIMIT 1`;
  if (existingSocial.length === 0) {
    const defaultSocialProfiles = [
      {
        id: "instagram",
        platform: "instagram",
        username: "jaydeep.prajapati_18",
        display_name: "Er. Jaydeep Prajapati",
        verified: true,
        category: "Digital creator",
        profile_pic: "/instagram/avatar.png",
        thought_bubble: "Make this space yours...",
        bio_lines: [
          "❤️🚩jay shree Ram 🚩",
          "🤔A man without EGO , is not a man.",
          "⚠️ Currently busy turning my dreams into reality.",
        ],
        external_link: "www.instagram.com/websetu.32?igsh=MTJwdXI3enBqd...",
        threads_handle: "jaydeep.prajapati_18",
        music_track: "Jannat · B Praak",
        posts_count: "0",
        followers_count: "279",
        following_count: "258",
        views_30days: "762 views in the last 30 days.",
        highlights: [
          { title: "New", isAdd: true },
          { id: 1, title: "# college", video: "/instagram/reel_1.mp4" },
          { id: 2, title: "💗", video: "/instagram/reel_2.mp4" },
          { id: 3, title: "😉", video: "/instagram/reel_3.mp4" },
          { id: 4, title: "Real diamond 💎", video: "/instagram/reel_4.mp4" },
          { id: 5, title: "Memories ✨", video: "/instagram/reel_5.mp4" },
          { id: 6, title: "Vibes 🔥", video: "/instagram/reel_6.mp4" },
          { id: 7, title: "Friends 🤝", video: "/instagram/reel_7.mp4" },
          { id: 8, title: "Life 🌟", video: "/instagram/reel_8.mp4" },
        ],
        empty_title: "Capture and Share the World",
        empty_subtitle: "Share your photos and videos. When you share, they will show up on your profile.",
      },
      {
        id: "github",
        platform: "github",
        username: "jay-123-oss",
        display_name: "Er. Jaydeep Prajapati",
        verified: true,
        category: "Python & Web Developer",
        profile_pic: "/linkedin/avatar.png",
        thought_bubble: "Focusing",
        bio_lines: [
          "💻 Python & Web Developer | 🚀 Learning AI & Automation |",
          "✨ Sharing code & building projects",
        ],
        external_link: "/Jaydeep_Prajapati_Resume_Strict1Page.pdf",
        threads_handle: "jay-123-oss",
        music_track: "Open Source",
        posts_count: "25",
        followers_count: "7",
        following_count: "31",
        views_30days: "7 followers · 31 following",
        highlights: [],
        empty_title: "jay-123-oss / README.md",
        empty_subtitle: "JAAYDEEP PRAJAPATI",
      },
      {
        id: "linkedin",
        platform: "linkedin",
        username: "jaydeep-prajapati-a97988358",
        display_name: "Jaydeep--- (jay) ---Prajapati",
        verified: true,
        category: "python Devloper | Machine learning |MySQL | MongoDB |Computer vision| web Devloper | Git & Github | Data science | Data analyst | FastApi | Docker | AWS | Gen ai learning.....",
        profile_pic: "/linkedin/avatar.png",
        thought_bubble: "Verify in 2 minutes",
        bio_lines: [
          "python Devloper | Machine learning |MySQL | MongoDB |Computer vision| web Devloper | Git & Github | Data science | Data analyst | FastApi | Docker | AWS | Gen ai learning.....",
        ],
        external_link: "https://www.linkedin.com/in/jaydeep-prajapati-a97988358/",
        threads_handle: "jaydeep-prajapati",
        music_track: "AI Engineering",
        posts_count: "491",
        followers_count: "491",
        following_count: "500+",
        views_30days: "30 profile views",
        highlights: [],
        empty_title: "Showcase your work with projects",
        empty_subtitle: "Add one manually or import it from a connected apps. Members with projects receive more views.",
      },
    ];

    for (const sp of defaultSocialProfiles) {
      await sql`
        INSERT INTO social_profiles (
          id, platform, username, display_name, verified, category,
          profile_pic, thought_bubble, bio_lines, external_link,
          threads_handle, music_track, posts_count, followers_count,
          following_count, views_30days, highlights, empty_title, empty_subtitle
        ) VALUES (
          ${sp.id}, ${sp.platform}, ${sp.username}, ${sp.display_name}, ${sp.verified}, ${sp.category},
          ${sp.profile_pic}, ${sp.thought_bubble}, ${JSON.stringify(sp.bio_lines)}, ${sp.external_link},
          ${sp.threads_handle}, ${sp.music_track}, ${sp.posts_count}, ${sp.followers_count},
          ${sp.following_count}, ${sp.views_30days}, ${JSON.stringify(sp.highlights)}, ${sp.empty_title}, ${sp.empty_subtitle}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }
  }
}
