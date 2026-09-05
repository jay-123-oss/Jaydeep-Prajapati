"use client";

import React, { useState, useRef, useEffect } from "react";
import { soundFX } from "@/utils/soundFX";

interface Track {
  id: number;
  title: string;
  artist: string;
  subtitle: string;
  src: string;
  cover: string;
}

const PLAYLIST: Track[] = [
  {
    id: 1,
    title: "Mere Mehboob Qayamat Hogi",
    artist: "Kishore Kumar",
    subtitle: "Mr. X In Bombay (1964)",
    src: "/music/mere_mehboob_qayamat_hogi.mp3",
    cover: "/image copy 2.png",
  },
  {
    id: 2,
    title: "Dekha Ek Khwab",
    artist: "Kishore Kumar & Lata Mangeshkar",
    subtitle: "Silsila (1981)",
    src: "/music/dekha_ek_khwab.mp3",
    cover: "/image copy 2.png",
  },
  {
    id: 3,
    title: "Chura Liya Hai Tumne Jo Dil Ko",
    artist: "Asha Bhosle & Mohammed Rafi",
    subtitle: "Yaadon Ki Baaraat (1973)",
    src: "/music/chura_liya_hai.mp3",
    cover: "/image copy 2.png",
  },
  {
    id: 4,
    title: "Tumhein Dekhen Meri Aankhen",
    artist: "Kumar Sanu & Alka Yagnik",
    subtitle: "Rang (1993)",
    src: "/music/tumhein_dekhen_meri_aankhen.mp3",
    cover: "/image copy 2.png",
  },
];

export default function MusicPlayerWidget() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // When track index changes, reload and play if was playing
  useEffect(() => {
    if (audioRef.current && isMounted) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    soundFX.playClick();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {});
    }
  };

  const playNext = () => {
    soundFX.playClick();
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const playPrev = () => {
    soundFX.playClick();
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const selectTrack = (index: number) => {
    soundFX.playClick();
    setCurrentTrackIndex(index);
    setShowPlaylist(false);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      audioRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    soundFX.playClick();
    if (!audioRef.current) return;
    const newMute = !isMuted;
    setIsMuted(newMute);
    audioRef.current.muted = newMute;
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      suppressHydrationWarning
      data-cursor="music"
      className="music-player-widget"
      style={{
        width: "370px",
        maxWidth: "100%",
        backgroundColor: "#18181B",
        border: "1px solid rgba(255, 255, 255, 0.14)",
        borderRadius: "18px",
        padding: "12px 14px",
        boxShadow:
          "0 10px 30px rgba(0,0,0,0.55), inset 0 1.5px 0 rgba(254, 240, 138, 0.35), inset 0 0 15px rgba(56, 189, 248, 0.05)",
        display: "flex",
        flexDirection: "column",
        gap: "9px",
        color: "#ffffff",
        userSelect: "none",
        fontFamily: "Inter, sans-serif",
        position: "relative",
      }}
    >
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={playNext}
        suppressHydrationWarning
      />

      {/* ── Upper Section: Side-by-Side Art & Info ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Cover Image with Spinning Ring when Playing */}
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: "#09090B",
            flexShrink: 0,
            boxShadow: isPlaying
              ? "0 0 14px rgba(56, 189, 248, 0.4)"
              : "0 4px 12px rgba(0,0,0,0.4)",
            border: isPlaying ? "1.5px solid #38BDF8" : "1px solid rgba(255,255,255,0.1)",
            position: "relative",
            transition: "all 0.3s ease",
          }}
        >
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        {/* Title, Artist, & Track Counter */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "9.5px",
                color: "#38BDF8",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {currentTrack.artist}
            </span>
            <span
              style={{
                fontSize: "9px",
                color: "#9CA3AF",
                backgroundColor: "rgba(255,255,255,0.08)",
                padding: "1px 5px",
                borderRadius: "4px",
                fontFamily: "monospace",
              }}
            >
              {currentTrackIndex + 1} / {PLAYLIST.length}
            </span>
          </div>

          <div
            style={{
              fontSize: "12.5px",
              fontWeight: 700,
              color: "#FFFFFF",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={currentTrack.title}
          >
            {currentTrack.title}
          </div>

          <div style={{ fontSize: "10px", color: "#A1A1AA" }}>
            {currentTrack.subtitle}
          </div>
        </div>

        {/* Playback Controls (Prev, Play/Pause, Next) */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          {/* Previous Track */}
          <button
            type="button"
            onClick={playPrev}
            onMouseEnter={() => soundFX.playHover()}
            title="Previous Track"
            suppressHydrationWarning
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "none",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              cursor: "pointer",
              fontSize: "11px",
              transition: "all 0.15s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.25)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
            }}
          >
            ⏮
          </button>

          {/* Main Play / Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            onMouseEnter={() => soundFX.playHover()}
            suppressHydrationWarning
            style={{
              backgroundColor: isMounted && isPlaying ? "#38BDF8" : "#FFFFFF",
              color: "#000000",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "14px",
              boxShadow: "0 0 12px rgba(255, 255, 255, 0.25)",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {isMounted && isPlaying ? "❚❚" : "▶"}
          </button>

          {/* Next Track */}
          <button
            type="button"
            onClick={playNext}
            onMouseEnter={() => soundFX.playHover()}
            title="Next Track"
            suppressHydrationWarning
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "none",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              cursor: "pointer",
              fontSize: "11px",
              transition: "all 0.15s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.25)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
            }}
          >
            ⏭
          </button>

          {/* Playlist Toggle Button */}
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setShowPlaylist(!showPlaylist);
            }}
            title="Playlist"
            suppressHydrationWarning
            style={{
              background: showPlaylist ? "#38BDF8" : "rgba(255, 255, 255, 0.08)",
              color: showPlaylist ? "#000000" : "#FFFFFF",
              border: "none",
              borderRadius: "6px",
              padding: "4px 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "11px",
              transition: "all 0.15s ease",
            }}
          >
            ☰
          </button>
        </div>
      </div>

      {/* ── Dropdown Playlist View (when ☰ is clicked) ── */}
      {showPlaylist && (
        <div
          style={{
            backgroundColor: "#09090B",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "10px",
            padding: "6px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            maxHeight: "180px",
            overflowY: "auto",
            zIndex: 50,
          }}
        >
          {PLAYLIST.map((t, idx) => (
            <div
              key={t.id}
              onClick={() => selectTrack(idx)}
              onMouseEnter={() => soundFX.playHover()}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "5px 8px",
                borderRadius: "6px",
                backgroundColor:
                  idx === currentTrackIndex ? "rgba(56, 189, 248, 0.15)" : "transparent",
                color: idx === currentTrackIndex ? "#38BDF8" : "#E4E4E7",
                cursor: "pointer",
                fontSize: "11px",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
                <span style={{ fontSize: "9.5px", opacity: 0.6 }}>{idx + 1}.</span>
                <span style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {t.title}
                </span>
              </div>
              <span style={{ fontSize: "9.5px", opacity: 0.7, whiteSpace: "nowrap" }}>
                {idx === currentTrackIndex && isPlaying ? "▶ PLAYING" : t.artist.split("&")[0].trim()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Lower Section: Timeline & Volume Bar ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {/* Timeline Slider */}
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          suppressHydrationWarning
          style={{
            width: "100%",
            height: "3px",
            borderRadius: "2px",
            appearance: "none",
            backgroundColor: "#3F3F46",
            accentColor: "#38BDF8",
            cursor: "pointer",
          }}
        />

        {/* Timer & Volume Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            suppressHydrationWarning
            style={{
              fontSize: "10px",
              color: "#9CA3AF",
              fontWeight: 600,
              display: "flex",
              gap: "6px",
            }}
          >
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Volume Controller */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              padding: "2px 8px",
              borderRadius: "12px",
            }}
          >
            <button
              type="button"
              onClick={toggleMute}
              suppressHydrationWarning
              style={{
                background: "none",
                border: "none",
                color: isMuted ? "#EF4444" : "#9CA3AF",
                fontSize: "12px",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              {isMuted || volume === 0 ? "🔇" : "🔊"}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              suppressHydrationWarning
              style={{
                width: "60px",
                height: "3px",
                borderRadius: "2px",
                appearance: "none",
                backgroundColor: "#3F3F46",
                accentColor: "#38BDF8",
                cursor: "pointer",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
