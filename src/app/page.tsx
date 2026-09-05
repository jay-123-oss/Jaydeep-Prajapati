import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import SocialShowcaseSection from "@/components/SocialShowcaseSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CyberChessPopup from "@/components/CyberChessPopup";
import DynamicCyberCursor from "@/components/DynamicCyberCursor";
import CyberCommandPalette from "@/components/CyberCommandPalette";
import HudScrollIndicator from "@/components/HudScrollIndicator";

// 5 Bespoke Cyber Additions
import HolographicIdCard from "@/components/HolographicIdCard";
import NeuralVisionSandbox from "@/components/NeuralVisionSandbox";
import ModelQuantizerPlayground from "@/components/ModelQuantizerPlayground";
import AgentSwarmArena from "@/components/AgentSwarmArena";
import MissionControlDock from "@/components/MissionControlDock";
import SecurityAuditModal from "@/components/SecurityAuditModal";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-x-hidden">
      <DynamicCyberCursor />
      <CyberCommandPalette />
      <HudScrollIndicator />
      <Navbar />
      <HeroSection />
      <AboutSection />

      <SkillsSection />
      <ProjectsSection />

      {/* ── FEATURE 2: INTERACTIVE MODEL QUANTIZER & LATENCY PLAYGROUND ── */}
      <ModelQuantizerPlayground />

      <ExperienceSection />

      {/* ── FEATURE 4: AUTONOMOUS MULTI-AGENT SWARM ARENA ── */}
      <AgentSwarmArena />

      <SocialShowcaseSection />
      <ContactSection />
      <Footer />

      {/* ── INTERACTIVE MODALS & OVERLAYS ── */}
      <CyberChessPopup />
      <HolographicIdCard />
      <NeuralVisionSandbox />
      <MissionControlDock />
      <SecurityAuditModal />
    </main>
  );
}
