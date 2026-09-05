"use client";

import React, { useState, useEffect, useRef } from "react";
import { WaspButton } from "@/components/ui/wasp-button";
import { useTheme } from "@/context/ThemeContext";
import { soundFX } from "@/utils/soundFX";

export interface ProjectItem {
  id: string;
  title: string;
  codename: string;
  category: "llm" | "vision" | "distributed" | "fullstack" | string;
  tagline: string;
  description: string;
  architecture: string[];
  metrics: { label: string; value: string }[];
  tags: string[];
  githubUrl?: string;
  github_url?: string;
  liveUrl?: string;
  live_url?: string;
  linkedinUrl?: string;
  linkedin_url?: string;
  videoUrl?: string;
  video_url?: string;
  images?: string[];
  usersCount?: string;
  users_count?: string;
  featured?: boolean;
}

export interface ProjectComment {
  id: string;
  project_id: string;
  author_name: string;
  author_role: string;
  content: string;
  likes: number;
  created_at: string;
  isUserCreated?: boolean;
}

export const INITIAL_PROJECT_COMMENTS: Record<string, ProjectComment[]> = {
  "neuro-vision": [
    {
      id: "c-nv-1",
      project_id: "neuro-vision",
      author_name: "Alex Rivera",
      author_role: "AI Engineer",
      content:
        "Tested this pipeline with multi-stream RTSP on Jetson Orin Nano. TensorRT FP16 quantization keeps latency under 8ms. Incredible work on the zero-copy buffer!",
      likes: 14,
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
    {
      id: "c-nv-2",
      project_id: "neuro-vision",
      author_name: "Sarah Chen",
      author_role: "ML Researcher",
      content:
        "How does the custom YOLOv10 backbone handle low-light occlusions compared to standard ByteTrack? The 140+ FPS throughput is stunning.",
      likes: 9,
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: "c-nv-3",
      project_id: "neuro-vision",
      author_name: "Jaydeep Prajapati",
      author_role: "Author / Dev",
      content:
        "@Sarah Chen — We augmented the training dataset with synthetic low-lux noise and applied temporal smoothing across 5 consecutive bounding frames to eliminate occlusion flicker.",
      likes: 22,
      created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
  ],
  "omni-agent": [
    {
      id: "c-om-1",
      project_id: "omni-agent",
      author_name: "Marcus Vance",
      author_role: "Systems Architect",
      content:
        "The dynamic DAG reflection logic with recursive retry is top tier. Sub-second function dispatching makes human-in-the-loop agent swarms remarkably reliable.",
      likes: 11,
      created_at: new Date(Date.now() - 3600000 * 60).toISOString(),
    },
    {
      id: "c-om-2",
      project_id: "omni-agent",
      author_name: "Priya Sharma",
      author_role: "MLOps Lead",
      content:
        "pgvector + Redis hybrid memory cut retrieval latency down to <14ms. Exactly what we needed for multi-tenant state trees.",
      likes: 7,
      created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    },
  ],
  "tensor-flow-mesh": [
    {
      id: "c-tf-1",
      project_id: "tensor-flow-mesh",
      author_name: "David Miller",
      author_role: "Cloud Lead",
      content:
        "PagedAttention integration on Triton with slot-based cache eviction is top notch. Scaling across multi-node GPU clusters effortlessly.",
      likes: 12,
      created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    },
  ],
  "synth-craft": [
    {
      id: "c-sc-1",
      project_id: "synth-craft",
      author_name: "Elena Vasquez",
      author_role: "Frontend Architect",
      content:
        "In-browser WebContainer compilation under 850ms is incredible for live generative UI. Beautifully executed Next.js 16 App Router setup!",
      likes: 16,
      created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
    },
  ],
  "rag-vault": [
    {
      id: "c-rv-1",
      project_id: "rag-vault",
      author_name: "Kenji Sato",
      author_role: "Search Engineer",
      content:
        "Reciprocal Rank Fusion with ColBERT cross-encoder re-ranking gives crisp context windows. Zero hallucinations observed on legal PDFs.",
      likes: 8,
      created_at: new Date(Date.now() - 3600000 * 40).toISOString(),
    },
  ],
  "deep-audio": [
    {
      id: "c-da-1",
      project_id: "deep-audio",
      author_name: "Liam O'Connor",
      author_role: "Audio ML",
      content:
        "StyleTTS2 with expressive neural prosody at 185ms total turnaround over WebRTC is remarkable for real-time voice conversations!",
      likes: 15,
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ],
};

const DEFAULT_PROJECTS: ProjectItem[] = [
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
      "Dynamic DAG workflow generation with recursive retry logic",
      "Persistent hybrid memory (pgvector + Redis caching)",
      "Quantized LLM tool-calling fallback pipeline with speculative decoding",
    ],
    metrics: [
      { label: "Token Throughput", value: "320 tok/s" },
      { label: "Tool Accuracy", value: "98.4%" },
      { label: "Memory Retrieval", value: "< 14ms" },
    ],
    tags: ["Python", "LangChain", "vLLM", "Redis", "pgvector", "FastAPI"],
    github_url: "https://github.com/jay-123-oss/OmniAgent-Autonomous-Orchestrator",
    live_url: "#projects",
    linkedin_url: "https://www.linkedin.com/in/jaydeep-prajapati-a97988358/",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    users_count: "18,500+ Developers",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&q=80",
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    ],
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
      "Custom YOLOv10 + SAM zero-shot backbone with FP16 precision",
      "TensorRT FP16 quantization engine with CUDA graph acceleration",
      "Multi-threaded GStreamer RTSP ingestion pipeline with zero-copy DMA",
    ],
    metrics: [
      { label: "Inference Speed", value: "140+ FPS" },
      { label: "mAP@0.50:0.95", value: "92.8%" },
      { label: "GPU VRAM Footprint", value: "1.4 GB" },
    ],
    tags: ["PyTorch", "TensorRT", "CUDA", "OpenCV", "ONNX", "C++"],
    github_url: "https://github.com/jay-123-oss/NeuroVision-Edge-Tracking",
    live_url: "#projects",
    linkedin_url: "https://www.linkedin.com/in/jaydeep-prajapati-a97988358/",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    users_count: "42,000+ Edge Devices",
    images: [
      "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
    ],
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
      "Continuous dynamic batching layer with slot-based cache eviction",
      "PagedAttention vLLM cluster router with cross-node tensor sharding",
      "gRPC telemetry and health monitoring daemon with Prometheus exporters",
    ],
    metrics: [
      { label: "P99 Latency", value: "< 28ms" },
      { label: "Throughput Boost", value: "4.2x" },
      { label: "Cluster Uptime", value: "99.99%" },
    ],
    tags: ["Kubernetes", "Triton", "Ray", "vLLM", "gRPC", "Docker"],
    github_url: "https://github.com/jay-123-oss/HyperScale-Distributed-Mesh",
    live_url: "#projects",
    linkedin_url: "https://www.linkedin.com/in/jaydeep-prajapati-a97988358/",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    users_count: "8,500+ GPU Nodes",
    images: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80",
    ],
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
      "Streaming AST code generation pipeline with AST validation",
      "In-browser WebContainer sandbox execution with node runtime",
      "Next.js 16 App Router & Server Components with real-time WebSocket sync",
    ],
    metrics: [
      { label: "First Render Latency", value: "< 850ms" },
      { label: "Code Compilation", value: "100% Client-Side" },
      { label: "Active Developers", value: "25,000+" },
    ],
    tags: ["Next.js 16", "React 19", "Tailwind CSS", "WebContainer", "TypeScript"],
    github_url: "https://github.com/jay-123-oss/SynthCraft-GenUI-Studio",
    live_url: "#projects",
    linkedin_url: "https://www.linkedin.com/in/jaydeep-prajapati-a97988358/",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    users_count: "25,000+ Active Users",
    images: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    ],
  },
  {
    id: "rag-vault",
    title: "VectorVault — Enterprise RAG & Hybrid Knowledge Graph",
    codename: "SYS-05 // SEMANTIC RAG",
    category: "llm",
    featured: false,
    tagline: "Multi-tenant dense-sparse retrieval system with cross-encoder re-ranking.",
    description:
      "Engineered an enterprise semantic search engine combining BM25 keyword matching with dense embedding retrieval and reciprocal rank fusion for hallucination-free document QA.",
    architecture: [
      "Dense vector + Sparse BM25 hybrid indexing with reciprocal rank fusion",
      "ColBERT re-ranking cross-encoder stage with dynamic token scoring",
      "Automated document chunking, layout analysis & OCR pipeline",
    ],
    metrics: [
      { label: "Precision@5", value: "96.7%" },
      { label: "Index Capacity", value: "25M+ Docs" },
      { label: "Query Time", value: "< 42ms" },
    ],
    tags: ["Qdrant", "FastAPI", "Python", "HuggingFace", "Redis"],
    github_url: "https://github.com/jay-123-oss/VectorVault-Hybrid-RAG",
    live_url: "#projects",
    linkedin_url: "https://www.linkedin.com/in/jaydeep-prajapati-a97988358/",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    users_count: "50+ Enterprise Teams",
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    ],
  },
  {
    id: "deep-audio",
    title: "Vocalis — Low-Latency Voice AI & Speech Synthesis Stream",
    codename: "SYS-06 // NEURAL AUDIO",
    category: "vision",
    featured: false,
    tagline: "Duplex streaming speech-to-speech engine with sub-200ms turnaround.",
    description:
      "Built a full-duplex conversational voice agent with WebRTC streaming, Whisper speech recognition, and neural vocoder audio synthesis for real-time human interaction.",
    architecture: [
      "WebRTC bi-directional audio streaming with jitter buffer management",
      "Streaming Whisper STT with VAD silence gating and early intent prediction",
      "StyleTTS2 low-latency audio generation with expressive neural prosody",
    ],
    metrics: [
      { label: "Total Audio Latency", value: "185ms" },
      { label: "WER (Error Rate)", value: "3.4%" },
      { label: "Concurrent Calls", value: "500+" },
    ],
    tags: ["WebRTC", "PyTorch", "FastAPI", "Docker", "Whisper"],
    github_url: "https://github.com/jay-123-oss/Vocalis-Voice-AI",
    live_url: "#projects",
    linkedin_url: "https://www.linkedin.com/in/jaydeep-prajapati-a97988358/",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    users_count: "15,000+ Daily Sessions",
    images: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
    ],
  },
];

export default function ProjectsSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(DEFAULT_PROJECTS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Comments and Link Feature States
  const [comments, setComments] = useState<Record<string, ProjectComment[]>>(INITIAL_PROJECT_COMMENTS);
  const [showComments, setShowComments] = useState<boolean>(true);
  const [showLinksHud, setShowLinksHud] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [newCommentText, setNewCommentText] = useState<string>("");
  const [commentAuthor, setCommentAuthor] = useState<string>("");
  const [commentRole, setCommentRole] = useState<string>("AI Engineer");
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [isPostingComment, setIsPostingComment] = useState<boolean>(false);
  const [showBenchmark, setShowBenchmark] = useState<boolean>(false);
  const [benchmarkRunning, setBenchmarkRunning] = useState<boolean>(false);

  // Fetch dynamic projects from API with fallback
  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => {
        if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
          // Merge API data with default imagery if empty
          const formatted = data.projects.map((p: any, idx: number) => {
            const fallback = DEFAULT_PROJECTS[idx % DEFAULT_PROJECTS.length];
            return {
              ...p,
              images:
                Array.isArray(p.images) && p.images.length > 0
                  ? p.images
                  : fallback.images,
              video_url: p.video_url || fallback.video_url,
              linkedin_url: p.linkedin_url || fallback.linkedin_url,
              users_count: p.users_count || fallback.users_count,
              tags: Array.isArray(p.tags) ? p.tags : fallback.tags,
              architecture: Array.isArray(p.architecture) ? p.architecture : fallback.architecture,
              metrics: Array.isArray(p.metrics) && p.metrics.length > 0 ? p.metrics : fallback.metrics,
            };
          });
          setProjectsList(formatted);
        }
      })
      .catch(() => {
        // Fallback already set
      });
  }, []);

  // Load comments, author name, liked comments & handle project URL hash
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAuthor = localStorage.getItem("portfolio_user_name");
      if (savedAuthor) setCommentAuthor(savedAuthor);

      try {
        const savedLikes = localStorage.getItem("portfolio_liked_comments");
        if (savedLikes) setLikedComments(JSON.parse(savedLikes));
      } catch {}

      try {
        const savedComments = localStorage.getItem("portfolio_all_comments");
        if (savedComments) {
          setComments((prev) => ({ ...prev, ...JSON.parse(savedComments) }));
        }
      } catch {}

      // Fetch comments from DB API
      fetch("/api/comments")
        .then((r) => r.json())
        .then((data) => {
          if (data.comments && Array.isArray(data.comments) && data.comments.length > 0) {
            const grouped: Record<string, ProjectComment[]> = {};
            data.comments.forEach((c: any) => {
              if (!grouped[c.project_id]) grouped[c.project_id] = [];
              grouped[c.project_id].push({
                id: c.id,
                project_id: c.project_id,
                author_name: c.author_name,
                author_role: c.author_role || "AI Engineer",
                content: c.content,
                likes: c.likes || 0,
                created_at: c.created_at || new Date().toISOString(),
              });
            });
            setComments((prev) => {
              const merged = { ...prev };
              Object.keys(grouped).forEach((k) => {
                merged[k] = grouped[k];
              });
              return merged;
            });
          }
        })
        .catch(() => {});

      // Check URL hash to jump to project: e.g. #project=neuro-vision
      const hash = window.location.hash;
      if (hash.includes("project=")) {
        const pId = hash.split("project=")[1]?.split("&")[0];
        const foundIdx = projectsList.findIndex((p) => p.id === pId);
        if (foundIdx !== -1) {
          setCurrentIndex(foundIdx);
          setIsPaused(true);
        }
      }
    }
  }, [projectsList]);

  // Auto-swap every 2 seconds (user requirement) with hover-pause
  useEffect(() => {
    if (isPaused || projectsList.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projectsList.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, projectsList.length]);

  const currentProject = projectsList[currentIndex] || projectsList[0];
  const currentComments = comments[currentProject.id] || INITIAL_PROJECT_COMMENTS[currentProject.id] || [];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + projectsList.length) % projectsList.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projectsList.length);
  };

  const handleCopyProjectLink = () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}${window.location.pathname}#project=${currentProject.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      soundFX.playVictoryFanfare();
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleSubmitComment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCommentText.trim()) return;

    const author = commentAuthor.trim() || "Visiting AI Engineer";
    const role = commentRole.trim() || "AI Engineer";
    const text = newCommentText.trim();

    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio_user_name", author);
    }

    const tempComment: ProjectComment = {
      id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      project_id: currentProject.id,
      author_name: author,
      author_role: role,
      content: text,
      likes: 0,
      created_at: new Date().toISOString(),
      isUserCreated: true,
    };

    soundFX.playClick();
    setIsPostingComment(true);

    // Optimistic update
    setComments((prev) => {
      const existing = prev[currentProject.id] || [];
      const updated = [...existing, tempComment];
      if (typeof window !== "undefined") {
        try {
          const allSaved = JSON.parse(localStorage.getItem("portfolio_all_comments") || "{}");
          allSaved[currentProject.id] = updated;
          localStorage.setItem("portfolio_all_comments", JSON.stringify(allSaved));
        } catch {}
      }
      return { ...prev, [currentProject.id]: updated };
    });

    setNewCommentText("");

    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: currentProject.id,
          author_name: author,
          author_role: role,
          content: text,
        }),
      });
    } catch {} finally {
      setIsPostingComment(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    const isAlreadyLiked = likedComments[commentId];
    soundFX.playClick();

    setLikedComments((prev) => {
      const next = { ...prev, [commentId]: !isAlreadyLiked };
      if (typeof window !== "undefined") {
        localStorage.setItem("portfolio_liked_comments", JSON.stringify(next));
      }
      return next;
    });

    setComments((prev) => {
      const projectList = prev[currentProject.id] || [];
      const updated = projectList.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            likes: isAlreadyLiked ? Math.max(0, c.likes - 1) : c.likes + 1,
          };
        }
        return c;
      });
      if (typeof window !== "undefined") {
        try {
          const allSaved = JSON.parse(localStorage.getItem("portfolio_all_comments") || "{}");
          allSaved[currentProject.id] = updated;
          localStorage.setItem("portfolio_all_comments", JSON.stringify(allSaved));
        } catch {}
      }
      return { ...prev, [currentProject.id]: updated };
    });

    try {
      await fetch("/api/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: commentId,
          action: isAlreadyLiked ? "unlike" : "like",
        }),
      });
    } catch {}
  };

  const handleDeleteComment = (commentId: string) => {
    soundFX.playClick();
    setComments((prev) => {
      const projectList = prev[currentProject.id] || [];
      const updated = projectList.filter((c) => c.id !== commentId);
      if (typeof window !== "undefined") {
        try {
          const allSaved = JSON.parse(localStorage.getItem("portfolio_all_comments") || "{}");
          allSaved[currentProject.id] = updated;
          localStorage.setItem("portfolio_all_comments", JSON.stringify(allSaved));
        } catch {}
      }
      return { ...prev, [currentProject.id]: updated };
    });
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "Recently";
    }
  };

  // Safe image list (2, 3, or 4 images)
  const images =
    currentProject.images && currentProject.images.length > 0
      ? currentProject.images.slice(0, 4)
      : [
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
          "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&q=80",
        ];

  // Resolve links
  const githubLink = currentProject.github_url || currentProject.githubUrl || "https://github.com";
  const liveLink = currentProject.live_url || currentProject.liveUrl || "https://demo.example.com";
  const linkedinLink = currentProject.linkedin_url || currentProject.linkedinUrl || "https://linkedin.com";
  const usersMetric = currentProject.users_count || currentProject.usersCount || "10,000+ Users";
  const videoUrl = currentProject.video_url || currentProject.videoUrl;

  // Render Adaptive Image Gallery Frame based on image count (2, 3, or 4)
  const renderImageGallery = () => {
    const count = images.length;

    // 2 Images Layout: Dual split 50/50 comparison frame
    if (count === 2) {
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            width: "100%",
            height: "220px",
            minHeight: "0px",
            maxHeight: "220px",
            overflow: "hidden",
          }}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setLightboxImage(img)}
              style={{
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(32, 190, 255, 0.4)",
                backgroundColor: "#030712",
                cursor: "zoom-in",
                height: "100%",
                minHeight: 0,
                maxHeight: "220px",
              }}
              className="group"
            >
              <img
                src={img}
                alt={`${currentProject.title} screenshot ${idx + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.3s ease",
                }}
                className="group-hover:scale-105"
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "6px",
                  left: "6px",
                  fontSize: "9px",
                  fontFamily: "monospace",
                  backgroundColor: "rgba(3, 7, 18, 0.8)",
                  border: "1px solid #20BEFF",
                  padding: "2px 6px",
                  color: "#20BEFF",
                }}
              >
                FRAME_0{idx + 1} // VIEW
              </div>
            </div>
          ))}
        </div>
      );
    }

    // 3 Images Layout: Spotlight Triptych (1 large featured left + 2 stacked right)
    if (count === 3) {
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.25fr 1fr",
            gap: "8px",
            width: "100%",
            height: "220px",
            minHeight: "0px",
            maxHeight: "220px",
            overflow: "hidden",
          }}
        >
          {/* Main Large Left Frame */}
          <div
            onClick={() => setLightboxImage(images[0])}
            style={{
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(32, 190, 255, 0.5)",
              backgroundColor: "#030712",
              cursor: "zoom-in",
              height: "100%",
              minHeight: 0,
              maxHeight: "220px",
            }}
            className="group"
          >
            <img
              src={images[0]}
              alt={`${currentProject.title} spotlight`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.3s ease",
              }}
              className="group-hover:scale-105"
            />
            <div
              style={{
                position: "absolute",
                top: "6px",
                left: "6px",
                fontSize: "9px",
                fontFamily: "monospace",
                backgroundColor: "rgba(3, 7, 18, 0.85)",
                border: "1px solid #20BEFF",
                padding: "2px 6px",
                color: "#20BEFF",
              }}
            >
              SPOTLIGHT // 01
            </div>
          </div>

          {/* 2 Stacked Right Frames */}
          <div
            style={{
              display: "grid",
              gridTemplateRows: "1fr 1fr",
              gap: "8px",
              height: "220px",
              minHeight: 0,
              maxHeight: "220px",
              overflow: "hidden",
            }}
          >
            {images.slice(1, 3).map((img, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxImage(img)}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  border: "1px solid rgba(32, 190, 255, 0.35)",
                  backgroundColor: "#030712",
                  cursor: "zoom-in",
                  height: "100%",
                  minHeight: 0,
                }}
                className="group"
              >
                <img
                  src={img}
                  alt={`${currentProject.title} view ${idx + 2}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.3s ease",
                  }}
                  className="group-hover:scale-105"
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "4px",
                    left: "4px",
                    fontSize: "8px",
                    fontFamily: "monospace",
                    backgroundColor: "rgba(3, 7, 18, 0.8)",
                    border: "1px solid #20BEFF",
                    padding: "1px 5px",
                    color: "#20BEFF",
                  }}
                >
                  VIEW_0{idx + 2}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 4 Images Layout: Asymmetric 2x2 Cyber Quad Grid
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "6px",
          width: "100%",
          height: "220px",
          minHeight: "0px",
          maxHeight: "220px",
          overflow: "hidden",
        }}
      >
        {images.slice(0, 4).map((img, idx) => (
          <div
            key={idx}
            onClick={() => setLightboxImage(img)}
            style={{
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(32, 190, 255, 0.4)",
              backgroundColor: "#030712",
              cursor: "zoom-in",
              height: "100%",
              minHeight: 0,
            }}
            className="group"
          >
            <img
              src={img}
              alt={`${currentProject.title} quad ${idx + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.3s ease",
              }}
              className="group-hover:scale-105"
            />
            <div
              style={{
                position: "absolute",
                bottom: "4px",
                left: "4px",
                fontSize: "8px",
                fontFamily: "monospace",
                backgroundColor: "rgba(3, 7, 18, 0.8)",
                border: "1px solid #20BEFF",
                padding: "1px 5px",
                color: "#20BEFF",
              }}
            >
              QUAD_0{idx + 1}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section
      id="projects"
      style={{
        width: "100%",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(36px, 6vw, 60px) clamp(12px, 3vw, 24px)",
        userSelect: "none",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* ── Background Cyber Matrix Grid ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Ambient Radial Glow ── */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "1000px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(32, 190, 255, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: "1480px",
          width: "100%",
          margin: "0 auto",
          position: "relative",
          zIndex: 20,
        }}
      >
        {/* ── Section Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <div>
            {/* Status Tag */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#10B981",
                  boxShadow: "0 0 8px #10B981",
                  display: "inline-block",
                }}
              />
              <span
                className="font-pixel"
                style={{
                  fontSize: "11px",
                  color: "#20BEFF",
                  letterSpacing: "0.14em",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                // 02. ARCHITECTURE SPOTLIGHT [AUTO-SWAPPING EVERY 4.5S]
              </span>
            </div>

            {/* Main Section Heading */}
            <h2
              className="font-chakra"
              style={{
                fontSize: "clamp(1.8rem, 3.8vw, 2.6rem)",
                fontWeight: 800,
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                margin: 0,
                lineHeight: 1.1,
                textTransform: "uppercase",
              }}
            >
              FLAGSHIP AI SYSTEMS
            </h2>
          </div>

          {/* ── Interactive Carousel Controls & Playback Indicator ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontSize: "10px",
                fontFamily: "monospace",
                color: isPaused ? "#F59E0B" : "#10B981",
                backgroundColor: "rgba(0,0,0,0.5)",
                border: `1px solid ${isPaused ? "rgba(245, 158, 11, 0.4)" : "rgba(16, 185, 129, 0.4)"}`,
                padding: "3px 8px",
                letterSpacing: "0.08em",
              }}
            >
              {isPaused ? "PAUSED (HOVER)" : "AUTO-SWAP 4.5S ⚡"}
            </span>

            <button
              type="button"
              suppressHydrationWarning
              onClick={handlePrev}
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1.5px solid #20BEFF",
                color: "#20BEFF",
                padding: "5px 12px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 800,
                boxShadow: "0 0 10px rgba(32, 190, 255, 0.2)",
              }}
            >
              ←
            </button>

            <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#FFFFFF", fontWeight: 700 }}>
              {String(currentIndex + 1).padStart(2, "0")} / {String(projectsList.length).padStart(2, "0")}
            </span>

            <button
              type="button"
              suppressHydrationWarning
              onClick={handleNext}
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1.5px solid #20BEFF",
                color: "#20BEFF",
                padding: "5px 12px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 800,
                boxShadow: "0 0 10px rgba(32, 190, 255, 0.2)",
              }}
            >
              →
            </button>
          </div>
        </div>

        {/* ── System Selector Timeline Tabs (Click to Jump) ── */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "8px",
            marginBottom: "14px",
          }}
        >
          {projectsList.map((p, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                type="button"
                suppressHydrationWarning
                key={p.id || idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  backgroundColor: isActive
                    ? isDark
                      ? "rgba(32, 190, 255, 0.2)"
                      : "#E0F2FE"
                    : isDark
                    ? "rgba(10, 16, 26, 0.6)"
                    : "#F1F5F9",
                  border: isActive
                    ? isDark
                      ? "1.5px solid #20BEFF"
                      : "1.5px solid #0284C7"
                    : isDark
                    ? "1px solid rgba(255,255,255,0.12)"
                    : "1px solid #CBD5E1",
                  color: isActive
                    ? isDark
                      ? "#20BEFF"
                      : "#0369A1"
                    : isDark
                    ? "#94A3B8"
                    : "#475569",
                  fontWeight: isActive ? 700 : 500,
                  padding: "5px 12px",
                  fontSize: "10px",
                  fontFamily: "monospace",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.08em",
                  boxShadow: isActive
                    ? isDark
                      ? "0 0 15px rgba(32, 190, 255, 0.3)"
                      : "0 2px 8px rgba(2, 132, 199, 0.25)"
                    : "none",
                  transition: "all 0.2s ease",
                }}
              >
                {p.codename || `SYS-0${idx + 1}`}
              </button>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            FULL-WIDTH CINEMATIC PROJECT CARD (EXPANDS HORIZONTALLY FULL SCREEN)
           ═══════════════════════════════════════════════════════════════════════ */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{
            width: "100%",
            backgroundColor: isDark ? "var(--bg-card, #070D19)" : "#ffffff",
            border: isDark ? "2px solid #20BEFF" : "2px solid #0284C7",
            borderRadius: "0px",
            padding: "clamp(12px, 2.5vw, 18px) clamp(10px, 2.5vw, 22px)",
            position: "relative",
            boxShadow: isDark
              ? "0 0 40px rgba(32, 190, 255, 0.25), 0 20px 50px rgba(0,0,0,0.85)"
              : "0 10px 30px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(2, 132, 199, 0.12)",
            backdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            transition: "all 0.3s ease",
          }}
        >
          {/* 2-Second Swap Animated Progress Line */}
          <div
            key={currentIndex}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "3px",
              backgroundColor: isDark ? "#20BEFF" : "#0284C7",
              boxShadow: isDark ? "0 0 10px #20BEFF" : "0 0 8px rgba(2, 132, 199, 0.5)",
              animation: isPaused ? "none" : "progressFill 4.5s linear",
              width: isPaused ? "100%" : "0%",
            }}
          />

          {/* Sci-Fi Corner Brackets */}
          <div style={{ position: "absolute", top: "4px", left: "4px", width: "10px", height: "10px", borderTop: isDark ? "2px solid #20BEFF" : "2px solid #0284C7", borderLeft: isDark ? "2px solid #20BEFF" : "2px solid #0284C7" }} />
          <div style={{ position: "absolute", top: "4px", right: "4px", width: "10px", height: "10px", borderTop: isDark ? "2px solid #20BEFF" : "2px solid #0284C7", borderRight: isDark ? "2px solid #20BEFF" : "2px solid #0284C7" }} />
          <div style={{ position: "absolute", bottom: "4px", left: "4px", width: "10px", height: "10px", borderBottom: isDark ? "2px solid #20BEFF" : "2px solid #0284C7", borderLeft: isDark ? "2px solid #20BEFF" : "2px solid #0284C7" }} />
          <div style={{ position: "absolute", bottom: "4px", right: "4px", width: "10px", height: "10px", borderBottom: isDark ? "2px solid #20BEFF" : "2px solid #0284C7", borderRight: isDark ? "2px solid #20BEFF" : "2px solid #0284C7" }} />

          {/* ─────────────────────────────────────────────────────────────────
              TOP HALF SPLIT:
              HALF-LEFT: 2, 3, or 4 Images (Dynamic Layout Frame)
              HALF-RIGHT: Demo Video Player
             ───────────────────────────────────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 270px), 1fr))",
              gap: "16px",
              alignItems: "stretch",
              width: "100%",
              minHeight: "220px",
            }}
          >
            {/* ── HALF-LEFT: DYNAMIC MULTI-IMAGE GALLERY FRAME (3, 2, or 4 Images) ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                width: "100%",
                backgroundColor: isDark ? "rgba(0, 0, 0, 0.4)" : "#F8FAFC",
                border: isDark ? "1px solid rgba(32, 190, 255, 0.25)" : "1.5px solid #E2E8F0",
                padding: "10px 12px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="font-pixel" style={{ fontSize: "10px", color: isDark ? "#20BEFF" : "#0369A1", letterSpacing: "0.1em", fontWeight: 700 }}>
                  // SCREENSHOT TELEMETRY [{images.length} FRAMES]
                </span>
                <span style={{ fontSize: "9px", color: isDark ? "#9CA3AF" : "#475569", fontWeight: 600 }}>CLICK IMAGE TO ZOOM</span>
              </div>

              {/* Render Adaptive Images Grid */}
              <div
                style={{
                  width: "100%",
                  height: "220px",
                  maxHeight: "220px",
                  minHeight: "220px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {renderImageGallery()}
              </div>
            </div>

            {/* ── HALF-RIGHT: DEMO VIDEO PLAYER ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                width: "100%",
                backgroundColor: isDark ? "rgba(0, 0, 0, 0.4)" : "#F8FAFC",
                border: isDark ? "1px solid rgba(32, 190, 255, 0.25)" : "1.5px solid #E2E8F0",
                padding: "10px 12px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="font-pixel" style={{ fontSize: "10px", color: isDark ? "#F59E0B" : "#B45309", letterSpacing: "0.1em", fontWeight: 700 }}>
                  // LIVE DEMO STREAM &amp; EXECUTION
                </span>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    color: isDark ? "#10B981" : "#047857",
                    backgroundColor: isDark ? "rgba(16, 185, 129, 0.15)" : "#D1FAE5",
                    border: isDark ? "1px solid #10B981" : "1px solid #059669",
                    padding: "1px 6px",
                  }}
                >
                  ● 1080P STREAM
                </span>
              </div>

              {/* Video Player or Interactive Cyber Fallback */}
              <div
                style={{
                  flex: 1,
                  minHeight: "200px",
                  height: "220px",
                  maxHeight: "230px",
                  backgroundColor: "#030712",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {videoUrl ? (
                  <video
                    key={videoUrl}
                    src={videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  /* Animated High-Tech Terminal Video Fallback */
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "16px",
                      textAlign: "center",
                      gap: "8px",
                      color: "#38BDF8",
                    }}
                  >
                    <div style={{ fontSize: "2rem" }}>⚡</div>
                    <div className="font-chakra" style={{ fontSize: "1rem", fontWeight: 700 }}>
                      REAL-TIME MODEL INFERENCE FEED
                    </div>
                    <p style={{ fontSize: "11px", color: "#94A3B8", maxWidth: "320px", margin: 0 }}>
                      Live GPU execution container active. Connect to live demo stream or explore model repository below.
                    </p>
                    <a
                      href={liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#000",
                        backgroundColor: "#20BEFF",
                        padding: "5px 12px",
                        letterSpacing: "0.08em",
                        textDecoration: "none",
                        marginTop: "2px",
                      }}
                    >
                      OPEN INSTANCE ↗
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────────
              BOTTOM HALF:
              PROJECT METADATA (NAME, TECH, DESCRIPTION, USERS, 3 ACTION BUTTONS)
             ───────────────────────────────────────────────────────────────── */}
          <div
            className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr]"
            style={{
              gap: "20px",
              paddingTop: "12px",
              borderTop: isDark ? "1.5px solid rgba(32, 190, 255, 0.2)" : "1.5px solid #E2E8F0",
            }}
          >
            {/* Left: Project Title, Tagline, Description & Architecture */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <span
                  className="font-pixel"
                  style={{
                    fontSize: "11px",
                    color: isDark ? "#20BEFF" : "#0369A1",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                  }}
                >
                  {currentProject.codename}
                </span>

                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    backgroundColor: isDark ? "rgba(32, 190, 255, 0.15)" : "#E0F2FE",
                    color: isDark ? "#20BEFF" : "#0369A1",
                    border: isDark ? "1px solid #20BEFF" : "1.5px solid #0284C7",
                    padding: "2px 8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {currentProject.category}
                </span>

                {/* Users Count Pill */}
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: isDark ? "#10B981" : "#047857",
                    backgroundColor: isDark ? "rgba(16, 185, 129, 0.15)" : "#D1FAE5",
                    border: isDark ? "1px solid #10B981" : "1.5px solid #059669",
                    padding: "2px 10px",
                    letterSpacing: "0.04em",
                  }}
                >
                  👥 {usersMetric}
                </span>
              </div>

              {/* Title */}
              <h3
                className="font-chakra"
                style={{
                  fontSize: "clamp(1.2rem, 2.2vw, 1.65rem)",
                  fontWeight: 800,
                  color: isDark ? "#ffffff" : "#0F172A",
                  lineHeight: 1.2,
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                {currentProject.title}
              </h3>

              {/* Tagline */}
              <p
                style={{
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  color: isDark ? "#38BDF8" : "#0284C7",
                  margin: 0,
                }}
              >
                {currentProject.tagline}
              </p>

              {/* Full Description */}
              <p
                style={{
                  fontSize: "0.85rem",
                  lineHeight: 1.5,
                  color: isDark ? "#D1D5DB" : "#334155",
                  margin: 0,
                  fontWeight: isDark ? 400 : 500,
                }}
              >
                {currentProject.description}
              </p>

              {/* Architecture Highlights */}
              {currentProject.architecture && currentProject.architecture.length > 0 && (
                <div
                  style={{
                    backgroundColor: isDark ? "rgba(0, 0, 0, 0.4)" : "#F1F5F9",
                    border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1.5px solid #CBD5E1",
                    padding: "10px 14px",
                    marginTop: "2px",
                  }}
                >
                  <div
                    className="font-pixel"
                    style={{
                      fontSize: "9.5px",
                      fontWeight: 700,
                      color: isDark ? "#9CA3AF" : "#475569",
                      letterSpacing: "0.08em",
                      marginBottom: "6px",
                    }}
                  >
                    // ARCHITECTURE HIGHLIGHTS
                  </div>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "16px",
                      color: isDark ? "#E2E8F0" : "#0F172A",
                      fontSize: "0.83rem",
                      lineHeight: 1.5,
                      fontWeight: isDark ? 400 : 600,
                    }}
                  >
                    {currentProject.architecture.map((arch, i) => (
                      <li key={i} style={{ marginBottom: "2px" }}>{arch}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right: Metrics, Tech Tags, and 3 Action Links */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "14px" }}>
              {/* Telemetry Metrics */}
              {currentProject.metrics && currentProject.metrics.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 75px), 1fr))",
                    gap: "8px",
                    backgroundColor: isDark ? "rgba(0, 0, 0, 0.45)" : "#F8FAFC",
                    border: isDark ? "1px solid rgba(32, 190, 255, 0.2)" : "1.5px solid #E2E8F0",
                    padding: "10px",
                  }}
                >
                  {currentProject.metrics.map((m, idx) => (
                    <div key={idx} style={{ textAlign: "center" }}>
                      <div
                        className="font-chakra"
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 800,
                          color: isDark ? "#20BEFF" : "#0284C7",
                          marginBottom: "2px",
                        }}
                      >
                        {m.value}
                      </div>
                      <div
                        style={{
                          fontSize: "9px",
                          fontWeight: 700,
                          color: isDark ? "#9CA3AF" : "#475569",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Interactive Hardware Benchmark Simulator Trigger */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => {
                    soundFX.playClick();
                    setShowBenchmark(!showBenchmark);
                    if (!showBenchmark) {
                      setBenchmarkRunning(true);
                      setTimeout(() => setBenchmarkRunning(false), 900);
                    }
                  }}
                  style={{
                    backgroundColor: showBenchmark ? "rgba(32, 190, 255, 0.2)" : "rgba(32, 190, 255, 0.08)",
                    border: "1px solid #20BEFF",
                    color: isDark ? "#20BEFF" : "#0284C7",
                    padding: "4px 10px",
                    fontSize: "10px",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span>{showBenchmark ? "✕ HIDE BENCHMARK" : "⚡ RUN HARDWARE BENCHMARK"}</span>
                  <span style={{ fontSize: "9px", opacity: 0.8 }}>[CUDA // FP16]</span>
                </button>
              </div>

              {/* Benchmark Telemetry Box */}
              {showBenchmark && (
                <div
                  style={{
                    backgroundColor: isDark ? "rgba(3, 7, 18, 0.95)" : "#F8FAFC",
                    border: isDark ? "1.5px solid #20BEFF" : "1.5px solid #0284C7",
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    boxShadow: isDark ? "0 0 20px rgba(32, 190, 255, 0.2)" : "0 4px 15px rgba(0,0,0,0.08)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", fontFamily: "monospace", color: isDark ? "#38BDF8" : "#0284C7", fontWeight: 700 }}>
                    <span>// HARDWARE BENCHMARK: NVIDIA JETSON &amp; H100</span>
                    <span style={{ color: benchmarkRunning ? "#F59E0B" : "#10B981" }}>
                      {benchmarkRunning ? "PROFILING INFERENCE..." : "● VERIFIED BENCHMARK"}
                    </span>
                  </div>

                  {benchmarkRunning ? (
                    <div style={{ padding: "14px 0", textAlign: "center", color: isDark ? "#38BDF8" : "#0284C7", fontSize: "11px", fontFamily: "monospace" }}>
                      <span style={{ display: "inline-block", animation: "spin 0.8s linear infinite", marginRight: "8px" }}>⟳</span>
                      Running continuous FP16/INT8 kernel sweeps across 10,000 requests...
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "10px", fontFamily: "monospace" }}>
                      <div style={{ backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#EDF2F7", padding: "6px 8px", border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #CBD5E1" }}>
                        <div style={{ color: isDark ? "#94A3B8" : "#64748B" }}>FP32 UNOPTIMIZED</div>
                        <div style={{ color: "#EF4444", fontWeight: 700, fontSize: "12px" }}>34 FPS // 84ms P99</div>
                        <div style={{ color: isDark ? "#64748B" : "#94A3B8", fontSize: "9px" }}>VRAM: 5.8 GB</div>
                      </div>
                      <div style={{ backgroundColor: isDark ? "rgba(16, 185, 129, 0.12)" : "#D1FAE5", padding: "6px 8px", border: "1px solid #10B981" }}>
                        <div style={{ color: isDark ? "#34D399" : "#047857" }}>TENSORRT + AWQ</div>
                        <div style={{ color: isDark ? "#10B981" : "#059669", fontWeight: 700, fontSize: "12px" }}>142 FPS // 18ms P99</div>
                        <div style={{ color: isDark ? "#34D399" : "#047857", fontSize: "9px" }}>+317% SPEEDUP // 1.4 GB</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Technologies Used (Pills) */}
              <div>
                <div
                  className="font-pixel"
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: isDark ? "#9CA3AF" : "#475569",
                    letterSpacing: "0.1em",
                    marginBottom: "8px",
                  }}
                >
                  // TECHNOLOGIES &amp; FRAMEWORKS
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {currentProject.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#F1F5F9",
                        border: isDark ? "1px solid rgba(255, 255, 255, 0.18)" : "1.5px solid #CBD5E1",
                        color: isDark ? "#E2E8F0" : "#0F172A",
                        fontSize: "11px",
                        fontWeight: 600,
                        fontFamily: "monospace",
                        padding: "3px 10px",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons Row: LIVE DEMO + CODE REPO + LINKEDIN + SHARE LINK + COMMENTS + LINKS HUD */}
              <div
                style={{
                  display: "flex",
                  gap: "clamp(6px, 1.5vw, 10px)",
                  flexWrap: "wrap",
                  alignItems: "center",
                  paddingTop: "14px",
                  borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1.5px solid #E2E8F0",
                }}
              >
                {/* 1. Live Demo */}
                <WaspButton
                  href={liveLink}
                  target="_blank"
                  variant={isDark ? "light" : "dark"}
                  paddingX={16}
                  paddingY={9}
                  fontSize={11}
                  cutTopLeft={6}
                  cutBottomRight={6}
                >
                  LIVE DEMO ↗
                </WaspButton>

                {/* 2. GitHub Repo */}
                <WaspButton
                  href={githubLink}
                  target="_blank"
                  variant={isDark ? "dark" : "light"}
                  paddingX={14}
                  paddingY={9}
                  fontSize={11}
                  cutTopLeft={6}
                  cutBottomRight={6}
                >
                  🐙 CODE REPO
                </WaspButton>

                {/* 3. LinkedIn Post */}
                <WaspButton
                  href={linkedinLink}
                  target="_blank"
                  variant={isDark ? "dark" : "light"}
                  paddingX={14}
                  paddingY={9}
                  fontSize={11}
                  cutTopLeft={6}
                  cutBottomRight={6}
                >
                  💼 LINKEDIN POST
                </WaspButton>

                {/* 4. Copy / Share Project Direct Link */}
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={handleCopyProjectLink}
                  style={{
                    backgroundColor: copiedLink
                      ? isDark
                        ? "rgba(16, 185, 129, 0.25)"
                        : "#DCFCE7"
                      : isDark
                      ? "rgba(32, 190, 255, 0.12)"
                      : "#E0F2FE",
                    border: copiedLink
                      ? "1.5px solid #10B981"
                      : isDark
                      ? "1.5px solid #20BEFF"
                      : "1.5px solid #0284C7",
                    color: copiedLink
                      ? isDark
                        ? "#34D399"
                        : "#166534"
                      : isDark
                      ? "#38BDF8"
                      : "#0369A1",
                    padding: "8px 14px",
                    fontSize: "11px",
                    fontWeight: 800,
                    fontFamily: "monospace",
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                    boxShadow: copiedLink
                      ? "0 0 16px rgba(16, 185, 129, 0.5)"
                      : "0 0 10px rgba(32, 190, 255, 0.18)",
                  }}
                >
                  {copiedLink ? "✓ LINK COPIED!" : "🔗 SHARE LINK"}
                </button>

                {/* 5. Discussion / Comments Toggle Button */}
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => {
                    soundFX.playClick();
                    setShowComments(!showComments);
                  }}
                  style={{
                    backgroundColor: showComments
                      ? isDark
                        ? "rgba(168, 85, 247, 0.25)"
                        : "#F3E8FF"
                      : isDark
                      ? "rgba(255, 255, 255, 0.06)"
                      : "#F1F5F9",
                    border: showComments
                      ? "1.5px solid #A855F7"
                      : isDark
                      ? "1.5px solid rgba(255, 255, 255, 0.2)"
                      : "1.5px solid #CBD5E1",
                    color: showComments
                      ? isDark
                        ? "#C084FC"
                        : "#6B21A8"
                      : isDark
                      ? "#E2E8F0"
                      : "#334155",
                    padding: "8px 14px",
                    fontSize: "11px",
                    fontWeight: 800,
                    fontFamily: "monospace",
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                    boxShadow: showComments
                      ? "0 0 15px rgba(168, 85, 247, 0.35)"
                      : "none",
                  }}
                >
                  💬 COMMENTS ({currentComments.length})
                </button>

                {/* 6. Quick Links HUD Toggle */}
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => {
                    soundFX.playClick();
                    setShowLinksHud(!showLinksHud);
                  }}
                  style={{
                    backgroundColor: showLinksHud
                      ? isDark
                        ? "rgba(245, 158, 11, 0.2)"
                        : "#FEF3C7"
                      : isDark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "#F1F5F9",
                    border: showLinksHud
                      ? "1.5px solid #F59E0B"
                      : isDark
                      ? "1.5px solid rgba(255, 255, 255, 0.18)"
                      : "1.5px solid #CBD5E1",
                    color: showLinksHud
                      ? isDark
                        ? "#FBBF24"
                        : "#92400E"
                      : isDark
                      ? "#94A3B8"
                      : "#475569",
                    padding: "8px 12px",
                    fontSize: "11px",
                    fontWeight: 700,
                    fontFamily: "monospace",
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.2s ease",
                  }}
                >
                  🌐 LINKS HUD {showLinksHud ? "▲" : "▼"}
                </button>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              LINKS HUD PANEL (EXPANDABLE / INTERACTIVE)
             ───────────────────────────────────────────────────────────── */}
          {showLinksHud && (
            <div
              onMouseEnter={() => setIsPaused(true)}
              style={{
                backgroundColor: isDark ? "rgba(3, 7, 18, 0.8)" : "#F8FAFC",
                border: isDark ? "1.5px solid rgba(32, 190, 255, 0.4)" : "1.5px solid #0284C7",
                padding: "14px 18px",
                marginTop: "14px",
                boxShadow: isDark
                  ? "0 0 25px rgba(32, 190, 255, 0.15)"
                  : "0 4px 15px rgba(2, 132, 199, 0.1)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="font-pixel" style={{ fontSize: "11px", color: isDark ? "#20BEFF" : "#0284C7", fontWeight: 800, letterSpacing: "0.1em" }}>
                    // DIRECT TELEMETRY LINKS &amp; PERMALINKS
                  </span>
                  <span style={{ fontSize: "9px", padding: "1px 6px", backgroundColor: isDark ? "rgba(16, 185, 129, 0.2)" : "#D1FAE5", color: isDark ? "#34D399" : "#065F46", border: isDark ? "1px solid #10B981" : "1px solid #059669", fontWeight: 700 }}>
                    ● 4 ENDPOINTS ACTIVE
                  </span>
                </div>

                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setShowLinksHud(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: isDark ? "#94A3B8" : "#64748B",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  ✕ CLOSE
                </button>
              </div>

              {/* Permalink Direct Copy Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: isDark ? "rgba(0, 0, 0, 0.5)" : "#FFFFFF",
                  border: isDark ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid #CBD5E1",
                  padding: "6px 10px",
                }}
              >
                <span style={{ fontSize: "11px", color: isDark ? "#38BDF8" : "#0284C7", fontWeight: 700 }}>
                  SHARE URL:
                </span>
                <input
                  type="text"
                  readOnly
                  value={typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}#project=${currentProject.id}` : `#project=${currentProject.id}`}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    color: isDark ? "#F1F5F9" : "#0F172A",
                    fontSize: "11px",
                    fontFamily: "monospace",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={handleCopyProjectLink}
                  style={{
                    backgroundColor: copiedLink ? "#10B981" : isDark ? "#20BEFF" : "#0284C7",
                    color: copiedLink ? "#FFFFFF" : isDark ? "#000000" : "#FFFFFF",
                    border: "none",
                    padding: "4px 12px",
                    fontSize: "10px",
                    fontWeight: 800,
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                    transition: "all 0.2s ease",
                  }}
                >
                  {copiedLink ? "✓ COPIED" : "📋 COPY"}
                </button>
              </div>

              {/* 4 Link Tiles Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "10px",
                }}
              >
                {/* Live Demo Link Tile */}
                <a
                  href={liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    padding: "8px 12px",
                    backgroundColor: isDark ? "rgba(32, 190, 255, 0.08)" : "#F0F9FF",
                    border: isDark ? "1px solid rgba(32, 190, 255, 0.3)" : "1px solid #BAE6FD",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "10px", fontWeight: 800, color: isDark ? "#20BEFF" : "#0369A1" }}>
                      ⚡ LIVE INSTANCE
                    </span>
                    <span style={{ fontSize: "10px", color: isDark ? "#38BDF8" : "#0284C7" }}>↗</span>
                  </div>
                  <span style={{ fontSize: "10px", color: isDark ? "#94A3B8" : "#64748B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {liveLink}
                  </span>
                </a>

                {/* Code Repo Link Tile */}
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    padding: "8px 12px",
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "#F8FAFC",
                    border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid #E2E8F0",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "10px", fontWeight: 800, color: isDark ? "#F1F5F9" : "#1E293B" }}>
                      🐙 SOURCE REPO
                    </span>
                    <span style={{ fontSize: "10px", color: isDark ? "#94A3B8" : "#64748B" }}>↗</span>
                  </div>
                  <span style={{ fontSize: "10px", color: isDark ? "#94A3B8" : "#64748B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {githubLink}
                  </span>
                </a>

                {/* LinkedIn Link Tile */}
                <a
                  href={linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    padding: "8px 12px",
                    backgroundColor: isDark ? "rgba(10, 102, 194, 0.1)" : "#EFF6FF",
                    border: isDark ? "1px solid rgba(10, 102, 194, 0.3)" : "1px solid #BFDBFE",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "10px", fontWeight: 800, color: "#0A66C2" }}>
                      💼 LINKEDIN ARTICLE
                    </span>
                    <span style={{ fontSize: "10px", color: "#0A66C2" }}>↗</span>
                  </div>
                  <span style={{ fontSize: "10px", color: isDark ? "#94A3B8" : "#64748B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {linkedinLink}
                  </span>
                </a>

                {/* Docs / API Spec Link Tile */}
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    padding: "8px 12px",
                    backgroundColor: isDark ? "rgba(168, 85, 247, 0.08)" : "#FAF5FF",
                    border: isDark ? "1px solid rgba(168, 85, 247, 0.25)" : "1px solid #E9D5FF",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "10px", fontWeight: 800, color: isDark ? "#C084FC" : "#7E22CE" }}>
                      📑 ARCHITECTURE &amp; DOCS
                    </span>
                    <span style={{ fontSize: "10px", color: isDark ? "#C084FC" : "#7E22CE" }}>↗</span>
                  </div>
                  <span style={{ fontSize: "10px", color: isDark ? "#94A3B8" : "#64748B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    Technical Specifications
                  </span>
                </a>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              PROJECT COMMENTS & COMMUNITY DISCUSSION CONSOLE
             ───────────────────────────────────────────────────────────── */}
          {showComments && (
            <div
              onMouseEnter={() => setIsPaused(true)}
              style={{
                backgroundColor: isDark ? "rgba(5, 10, 20, 0.85)" : "#F8FAFC",
                border: isDark ? "1.5px solid rgba(168, 85, 247, 0.35)" : "1.5px solid #CBD5E1",
                padding: "16px 20px",
                marginTop: "14px",
                position: "relative",
                boxShadow: isDark
                  ? "0 0 30px rgba(168, 85, 247, 0.12), inset 0 0 20px rgba(0,0,0,0.5)"
                  : "0 4px 20px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* Console Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "10px",
                  paddingBottom: "12px",
                  marginBottom: "14px",
                  borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #E2E8F0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <span
                    className="font-pixel"
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      color: isDark ? "#C084FC" : "#6B21A8",
                      letterSpacing: "0.12em",
                    }}
                  >
                    // PEER REVIEWS &amp; TRANSMISSIONS [{currentComments.length}]
                  </span>
                  <span
                    style={{
                      fontSize: "9.5px",
                      fontWeight: 700,
                      backgroundColor: isDark ? "rgba(16, 185, 129, 0.15)" : "#D1FAE5",
                      color: isDark ? "#34D399" : "#047857",
                      border: isDark ? "1px solid #10B981" : "1px solid #059669",
                      padding: "1px 8px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    ● LIVE DISCUSSION
                  </span>
                  {isPaused && (
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        color: isDark ? "#F59E0B" : "#B45309",
                        backgroundColor: isDark ? "rgba(245, 158, 11, 0.12)" : "#FEF3C7",
                        border: isDark ? "1px solid rgba(245, 158, 11, 0.3)" : "1px solid #FCD34D",
                        padding: "1px 6px",
                      }}
                    >
                      🛡️ TIMER PAUSED
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setShowComments(false)}
                  style={{
                    background: "none",
                    border: isDark ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid #CBD5E1",
                    color: isDark ? "#94A3B8" : "#64748B",
                    padding: "2px 8px",
                    fontSize: "10px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ✕ HIDE COMMENTS
                </button>
              </div>

              {/* Add New Comment Box */}
              <form
                onSubmit={handleSubmitComment}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  backgroundColor: isDark ? "rgba(0, 0, 0, 0.4)" : "#FFFFFF",
                  border: isDark ? "1px solid rgba(168, 85, 247, 0.25)" : "1.5px solid #E2E8F0",
                  padding: "14px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Name Input */}
                  <input
                    type="text"
                    suppressHydrationWarning
                    placeholder="Your Name / Handle..."
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    onFocus={() => setIsPaused(true)}
                    style={{
                      flex: 1,
                      minWidth: "180px",
                      backgroundColor: isDark ? "#030712" : "#F8FAFC",
                      border: isDark ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid #CBD5E1",
                      color: isDark ? "#F1F5F9" : "#0F172A",
                      fontSize: "12px",
                      fontWeight: 600,
                      padding: "6px 10px",
                      outline: "none",
                    }}
                  />

                  {/* Role Selector */}
                  <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "10px", color: isDark ? "#94A3B8" : "#64748B", fontWeight: 700 }}>
                      ROLE:
                    </span>
                    {(["AI Engineer", "ML Researcher", "Tech Lead", "Community"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        suppressHydrationWarning
                        onClick={() => {
                          soundFX.playClick();
                          setCommentRole(r);
                        }}
                        style={{
                          backgroundColor: commentRole === r
                            ? isDark
                              ? "rgba(168, 85, 247, 0.25)"
                              : "#F3E8FF"
                            : isDark
                            ? "rgba(255, 255, 255, 0.05)"
                            : "#F1F5F9",
                          border: commentRole === r
                            ? "1px solid #A855F7"
                            : isDark
                            ? "1px solid rgba(255, 255, 255, 0.1)"
                            : "1px solid #E2E8F0",
                          color: commentRole === r
                            ? isDark
                              ? "#C084FC"
                              : "#7E22CE"
                            : isDark
                            ? "#94A3B8"
                            : "#475569",
                          fontSize: "10px",
                          fontWeight: commentRole === r ? 800 : 500,
                          padding: "3px 8px",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea */}
                <textarea
                  rows={2}
                  suppressHydrationWarning
                  placeholder={`Leave peer review or questions on ${currentProject.title}...`}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onFocus={() => setIsPaused(true)}
                  style={{
                    width: "100%",
                    backgroundColor: isDark ? "#030712" : "#F8FAFC",
                    border: isDark ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid #CBD5E1",
                    color: isDark ? "#F1F5F9" : "#0F172A",
                    fontSize: "12px",
                    lineHeight: 1.5,
                    padding: "8px 10px",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />

                {/* Submit Row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "9.5px", color: isDark ? "#64748B" : "#94A3B8" }}>
                    Markdown supported. Transmissions stored per system.
                  </span>

                  <button
                    type="submit"
                    disabled={isPostingComment || !newCommentText.trim()}
                    suppressHydrationWarning
                    style={{
                      backgroundColor: !newCommentText.trim()
                        ? isDark
                          ? "rgba(255, 255, 255, 0.08)"
                          : "#E2E8F0"
                        : isDark
                        ? "#A855F7"
                        : "#7E22CE",
                      color: !newCommentText.trim()
                        ? isDark
                          ? "#64748B"
                          : "#94A3B8"
                        : "#FFFFFF",
                      border: "none",
                      padding: "7px 18px",
                      fontSize: "11px",
                      fontWeight: 800,
                      fontFamily: "monospace",
                      cursor: !newCommentText.trim() ? "not-allowed" : "pointer",
                      letterSpacing: "0.08em",
                      boxShadow: newCommentText.trim()
                        ? "0 0 15px rgba(168, 85, 247, 0.4)"
                        : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isPostingComment ? "TRANSMITTING..." : "TRANSMIT COMMENT ⮞"}
                  </button>
                </div>
              </form>

              {/* Comment List */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  maxHeight: "360px",
                  overflowY: "auto",
                  paddingRight: "4px",
                }}
              >
                {currentComments.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: isDark ? "#94A3B8" : "#64748B",
                      fontSize: "12px",
                    }}
                  >
                    No transmissions recorded yet. Be the first to peer-review this model!
                  </div>
                ) : (
                  currentComments.map((c) => {
                    const isLiked = likedComments[c.id];
                    const initials = c.author_name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase() || "AI";

                    return (
                      <div
                        key={c.id}
                        style={{
                          display: "flex",
                          gap: "12px",
                          backgroundColor: isDark ? "rgba(0, 0, 0, 0.35)" : "#FFFFFF",
                          border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #E2E8F0",
                          padding: "10px 12px",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {/* Avatar Badge */}
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: isDark ? "rgba(168, 85, 247, 0.2)" : "#F3E8FF",
                            border: isDark ? "1.5px solid #A855F7" : "1.5px solid #7E22CE",
                            color: isDark ? "#C084FC" : "#7E22CE",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {initials}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                              <span style={{ fontSize: "12px", fontWeight: 700, color: isDark ? "#F1F5F9" : "#0F172A" }}>
                                {c.author_name}
                              </span>

                              <span
                                style={{
                                  fontSize: "9px",
                                  fontWeight: 700,
                                  padding: "1px 6px",
                                  backgroundColor: c.author_role?.includes("Author")
                                    ? isDark ? "rgba(16, 185, 129, 0.15)" : "#D1FAE5"
                                    : c.author_role?.includes("Research")
                                    ? isDark ? "rgba(236, 72, 153, 0.15)" : "#FCE7F3"
                                    : isDark ? "rgba(32, 190, 255, 0.15)" : "#E0F2FE",
                                  color: c.author_role?.includes("Author")
                                    ? isDark ? "#34D399" : "#047857"
                                    : c.author_role?.includes("Research")
                                    ? isDark ? "#F472B6" : "#BE185D"
                                    : isDark ? "#38BDF8" : "#0369A1",
                                  border: isDark ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid #CBD5E1",
                                }}
                              >
                                {c.author_role || "COMMUNITY"}
                              </span>
                            </div>

                            <span suppressHydrationWarning style={{ fontSize: "10px", color: isDark ? "#64748B" : "#94A3B8" }}>
                              {formatTimeAgo(c.created_at)}
                            </span>
                          </div>

                          {/* Comment Text */}
                          <p
                            style={{
                              margin: "2px 0 6px 0",
                              fontSize: "0.82rem",
                              lineHeight: 1.5,
                              color: isDark ? "#CBD5E1" : "#334155",
                            }}
                          >
                            {c.content}
                          </p>

                          {/* Action Row: Like & Delete */}
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <button
                              type="button"
                              suppressHydrationWarning
                              onClick={() => handleLikeComment(c.id)}
                              style={{
                                background: "none",
                                border: isLiked
                                  ? "1px solid #EF4444"
                                  : isDark
                                  ? "1px solid rgba(255, 255, 255, 0.1)"
                                  : "1px solid #E2E8F0",
                                backgroundColor: isLiked
                                  ? isDark
                                    ? "rgba(239, 68, 68, 0.15)"
                                    : "#FEE2E2"
                                  : "transparent",
                                color: isLiked ? "#EF4444" : isDark ? "#94A3B8" : "#64748B",
                                padding: "2px 8px",
                                fontSize: "10px",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                transition: "all 0.15s ease",
                              }}
                            >
                              {isLiked ? "❤️" : "🤍"} {c.likes}
                            </button>

                            {c.isUserCreated && (
                              <button
                                type="button"
                                suppressHydrationWarning
                                onClick={() => handleDeleteComment(c.id)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: isDark ? "#64748B" : "#94A3B8",
                                  fontSize: "10px",
                                  cursor: "pointer",
                                }}
                              >
                                🗑️ Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── High-Res Image Lightbox Modal ── */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(3, 7, 18, 0.92)",
            backdropFilter: "blur(14px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            cursor: "zoom-out",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "1080px",
              width: "100%",
              maxHeight: "90vh",
              border: "2px solid #20BEFF",
              boxShadow: "0 0 50px rgba(32, 190, 255, 0.5)",
              backgroundColor: "#030712",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setLightboxImage(null)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "rgba(3, 7, 18, 0.85)",
                border: "1px solid #20BEFF",
                color: "#20BEFF",
                padding: "4px 10px",
                fontSize: "12px",
                cursor: "pointer",
                fontWeight: 700,
                zIndex: 10,
              }}
            >
              ✕ CLOSE
            </button>
            <img
              src={lightboxImage}
              alt="Expanded preview"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "85vh",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
        </div>
      )}

      {/* Keyframe animation for progress line */}
      <style jsx>{`
        @keyframes progressFill {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
