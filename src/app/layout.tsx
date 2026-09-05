import type { Metadata } from "next";
import { Chakra_Petch, Silkscreen, Inter, Slabo_13px } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const silkscreen = Silkscreen({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const slabo = Slabo_13px({
  variable: "--font-slabo",
  subsets: ["latin"],
  weight: ["400"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jaydeep-prajapati.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jaydeep Prajapati — AI/ML Systems & Edge Computer Vision Engineer",
    template: "%s | Jaydeep Prajapati",
  },
  description:
    "Portfolio of Jaydeep Prajapati (B.Tech CSE, Gyan Sagar College of Engineering). Specializing in local-first spatial vision (Trinetra), autonomous LangGraph agent pipelines, real-time model quantization, and full-stack AI web engineering.",
  keywords: [
    "Jaydeep Prajapati",
    "Jaydeep Prajapati AI",
    "Machine Learning Engineer",
    "Computer Vision Engineer",
    "Edge AI Developer",
    "YOLOv8 Trinetra",
    "Autonomous Agent Swarms",
    "LangGraph Travel Planner",
    "PyTorch",
    "Full Stack AI Developer",
    "Next.js 16",
    "Gyan Sagar College of Engineering",
    "Kaggle AI Agents",
    "Cyberpunk AI Portfolio",
  ],
  authors: [
    {
      name: "Jaydeep Prajapati",
      url: "https://www.linkedin.com/in/jaydeep-prajapati-a97988358/",
    },
  ],
  creator: "Jaydeep Prajapati",
  publisher: "Jaydeep Prajapati",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jaydeep Prajapati — AI/ML Systems & Edge Computer Vision Engineer",
    description:
      "Explore production AI systems, Trinetra spatial vision, autonomous LangGraph agent swarms, model quantization sandboxes, and applied deep learning.",
    url: "/",
    siteName: "Jaydeep Prajapati Portfolio",
    images: [
      {
        url: "/profile_logo.png",
        width: 1200,
        height: 630,
        alt: "Jaydeep Prajapati — AI/ML Systems Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaydeep Prajapati — AI/ML Systems & Edge Computer Vision Engineer",
    description:
      "Explore production AI systems, Trinetra spatial vision, autonomous LangGraph agent swarms, model quantization sandboxes, and applied deep learning.",
    images: ["/profile_logo.png"],
    creator: "@ai.by.jaydeep",
  },
  icons: {
    icon: "/profile_logo.png",
    shortcut: "/profile_logo.png",
    apple: "/profile_logo.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Jaydeep Prajapati",
      jobTitle: "AI/ML Systems & Computer Vision Engineer",
      url: siteUrl,
      image: `${siteUrl}/profile_logo.png`,
      sameAs: [
        "https://github.com/jay-123-oss",
        "https://www.linkedin.com/in/jaydeep-prajapati-a97988358/",
        "https://www.instagram.com/ai.by.jaydeep/?hl=en",
        "https://www.kaggle.com/jaydeepprajapatik",
      ],
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Gyan Sagar College of Engineering",
      },
      knowsAbout: [
        "Artificial Intelligence",
        "Computer Vision",
        "YOLO Object Detection",
        "Edge AI Inference",
        "Autonomous Agent Swarms",
        "LangGraph",
        "PyTorch",
        "Next.js",
        "Full-Stack Web Development",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Jaydeep Prajapati — AI/ML Systems Portfolio",
      description:
        "Official engineering portfolio of Jaydeep Prajapati, featuring interactive AI sandboxes, real-time model quantization, and verified technical projects.",
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${chakraPetch.variable} ${silkscreen.variable} ${inter.variable} ${slabo.variable} h-full`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full antialiased selection:bg-cyan-500 selection:text-black">
        <ThemeProvider>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
