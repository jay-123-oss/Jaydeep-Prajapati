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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jaydeepprajapati.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jaydeep Prajapati — AI/ML & Software Engineer Portfolio",
    template: "%s | Jaydeep Prajapati",
  },
  description:
    "Portfolio of Jaydeep Prajapati, an AI/ML and Software Engineer specializing in local-first computer vision (Trinetra), autonomous LangGraph agent pipelines, and high-performance full-stack web applications.",
  keywords: [
    "Jaydeep Prajapati",
    "Jaydeep Prajapati AI",
    "Jaydeep Prajapati Software Engineer",
    "Machine Learning Engineer",
    "Computer Vision Engineer",
    "Software Engineer",
    "Edge AI Developer",
    "Trinetra Vision",
    "LangGraph Autonomous Agents",
    "PyTorch",
    "Next.js 16",
    "Gyan Sagar College of Engineering",
    "Kaggle AI Agents",
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
    canonical: "https://jaydeepprajapati.vercel.app/",
  },
  openGraph: {
    title: "Jaydeep Prajapati — AI/ML & Software Engineer Portfolio",
    description:
      "Official portfolio of Jaydeep Prajapati. Exploring spatial computer vision (Trinetra), autonomous LangGraph agents, and modern software engineering.",
    url: "https://jaydeepprajapati.vercel.app/",
    siteName: "Jaydeep Prajapati",
    images: [
      {
        url: "/profile_logo.png",
        width: 1200,
        height: 630,
        alt: "Jaydeep Prajapati — AI/ML & Software Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaydeep Prajapati — AI/ML & Software Engineer Portfolio",
    description:
      "Official portfolio of Jaydeep Prajapati. Exploring spatial computer vision (Trinetra), autonomous LangGraph agents, and modern software engineering.",
    images: ["/profile_logo.png"],
    creator: "@ai.by.jaydeep",
  },
  icons: {
    icon: "/profile_logo.png",
    shortcut: "/profile_logo.png",
    apple: "/profile_logo.png",
  },
  verification: {
    google: "WiN_o3sehcfc6Tyknz1aO23tXXV5f95_w7iIpR72Mbg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://jaydeepprajapati.vercel.app/#person",
      name: "Jaydeep Prajapati",
      givenName: "Jaydeep",
      familyName: "Prajapati",
      jobTitle: "AI/ML & Software Engineer",
      url: "https://jaydeepprajapati.vercel.app/",
      image: "https://jaydeepprajapati.vercel.app/profile_logo.png",
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
      description:
        "Jaydeep Prajapati is an AI/ML and Software Engineer specializing in local-first computer vision, autonomous agent architectures, and full-stack software development.",
      knowsAbout: [
        "Computer Vision",
        "Machine Learning",
        "Artificial Intelligence",
        "Software Engineering",
        "YOLO Object Detection",
        "Edge AI Inference",
        "Autonomous Agent Swarms",
        "LangGraph",
        "PyTorch",
        "Next.js",
        "FastAPI",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://jaydeepprajapati.vercel.app/#website",
      url: "https://jaydeepprajapati.vercel.app/",
      name: "Jaydeep Prajapati — AI/ML & Software Engineer Portfolio",
      description:
        "Official engineering portfolio of Jaydeep Prajapati, featuring interactive AI sandboxes, real-time model quantization, and verified software projects.",
      publisher: {
        "@id": "https://jaydeepprajapati.vercel.app/#person",
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
