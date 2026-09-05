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

export const metadata: Metadata = {
  title: "Jaydeep Prajapati — Machine Learning & AI Systems Engineer",
  description:
    "Portfolio of Er. Jaydeep Prajapati. Architecting high-throughput neural models, autonomous LLM agent pipelines, edge computer vision, and low-latency distributed inference engines.",
  keywords: [
    "Jaydeep Prajapati",
    "Machine Learning Engineer",
    "AI Systems Architect",
    "Computer Vision",
    "TensorRT",
    "LLM Agent Swarm",
    "PyTorch",
    "FastAPI",
    "Next.js 16",
    "Deep Learning",
  ],
  authors: [{ name: "Jaydeep Prajapati", url: "https://www.linkedin.com/in/jaydeep-prajapati-a97988358/" }],
  creator: "Jaydeep Prajapati",
  openGraph: {
    title: "Jaydeep Prajapati — Machine Learning & AI Systems Engineer",
    description:
      "Explore flagship AI systems, autonomous agent swarms, edge computer vision pipelines, and deep learning architectures.",
    url: "/",
    siteName: "Jaydeep AI Engineering Portfolio",
    images: [
      {
        url: "/image copy.png",
        width: 1200,
        height: 630,
        alt: "Jaydeep Prajapati — AI Systems Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaydeep Prajapati — Machine Learning & AI Systems Engineer",
    description:
      "Explore flagship AI systems, autonomous agent swarms, edge computer vision pipelines, and deep learning architectures.",
    images: ["/image copy.png"],
    creator: "@ai.by.jaydeep",
  },
  icons: {
    icon: "/image copy.png",
    shortcut: "/image copy.png",
    apple: "/image copy.png",
  },
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
      <body suppressHydrationWarning className="min-h-full antialiased selection:bg-cyan-500 selection:text-black">
        <ThemeProvider>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
