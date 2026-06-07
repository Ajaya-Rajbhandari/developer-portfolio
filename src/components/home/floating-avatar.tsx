"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  animate,
  motion as baseMotion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

// Lottie player loaded client-side only (dotlottie-web uses canvas/WASM).
const DotLottieReact = dynamic(
  () => import("@lottiefiles/dotlottie-react").then((m) => m.DotLottieReact),
  { ssr: false }
);
// Spawn animation file (dotLottie .lottie or Lottie .json). If missing, the avatar
// automatically falls back to the built-in CSS puff.
const LOTTIE_SRC = {
  spawn: "/lottie/spawn.lottie",
};

type LocalMotionProps = {
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  exit?: Record<string, unknown>;
  whileHover?: Record<string, unknown>;
  whileTap?: Record<string, unknown>;
  transition?: Record<string, unknown>;
};

type MotionDivProps = React.ComponentProps<typeof baseMotion.div> & LocalMotionProps;
type MotionGroupProps = React.ComponentProps<typeof baseMotion.g> & LocalMotionProps;
type MotionCircleProps = React.ComponentProps<typeof baseMotion.circle> & LocalMotionProps;
type MotionSpanProps = React.ComponentProps<typeof baseMotion.span> & LocalMotionProps;

const motion = {
  ...baseMotion,
  div: baseMotion.div as React.ComponentType<MotionDivProps>,
  g: baseMotion.g as React.ComponentType<MotionGroupProps>,
  circle: baseMotion.circle as React.ComponentType<MotionCircleProps>,
  span: baseMotion.span as React.ComponentType<MotionSpanProps>,
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const textOrFallback = (value: unknown, fallback: string, maxLength = 80) => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : fallback;
};
const safeAssetUrl = (value: unknown) => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) || trimmed.startsWith("/") ? trimmed : "";
};

const AVATAR_POSITION_KEY = "portfolio-avatar-position-v7";
const AVATAR_BOUNDS_PADDING = 14;

type AvatarSize = "compact" | "medium" | "large";

type ViewportPoint = { x: number; y: number };
type SavedAvatarPoint = ViewportPoint & { size?: AvatarSize };

const getAvatarSize = (): AvatarSize => {
  if (typeof window === "undefined") return "large";
  if (window.innerWidth < 640) return "compact";
  if (window.innerWidth < 1024) return "medium";
  return "large";
};

const getAvatarDimensions = (size: AvatarSize) => {
  if (size === "compact") return { width: 96, height: 150 };
  if (size === "medium") return { width: 128, height: 184 };
  return { width: 160, height: 224 };
};

// On mobile, window.innerHeight is the (taller) layout viewport that extends behind
// the browser UI; visualViewport.height is the actually-visible area, so the avatar
// docks to the visible bottom instead of disappearing below the toolbar.
const getViewportHeight = (): number => {
  if (typeof window === "undefined") return 0;
  return window.visualViewport?.height ?? window.innerHeight;
};

const clampPointToViewport = (point: ViewportPoint, size: AvatarSize): ViewportPoint => {
  if (typeof window === "undefined") return point;
  const { width, height } = getAvatarDimensions(size);
  const maxX = Math.max(AVATAR_BOUNDS_PADDING, window.innerWidth - width - AVATAR_BOUNDS_PADDING);
  const maxY = Math.max(AVATAR_BOUNDS_PADDING, getViewportHeight() - height - AVATAR_BOUNDS_PADDING);
  return {
    x: clamp(point.x, AVATAR_BOUNDS_PADDING, maxX),
    y: clamp(point.y, AVATAR_BOUNDS_PADDING, maxY),
  };
};

// Dock the avatar to the bottom of whichever side edge its center is closest to,
// so it always "sits" in the bottom-left or bottom-right corner.
const snapPointToEdge = (point: ViewportPoint, size: AvatarSize): ViewportPoint => {
  if (typeof window === "undefined") return clampPointToViewport(point, size);
  const { width, height } = getAvatarDimensions(size);
  const clamped = clampPointToViewport(point, size);
  const maxX = Math.max(AVATAR_BOUNDS_PADDING, window.innerWidth - width - AVATAR_BOUNDS_PADDING);
  const maxY = Math.max(AVATAR_BOUNDS_PADDING, getViewportHeight() - height - AVATAR_BOUNDS_PADDING);
  const center = clamped.x + width / 2;
  const snappedX = center < window.innerWidth / 2 ? AVATAR_BOUNDS_PADDING : maxX;
  return { x: snappedX, y: maxY };
};

const getDefaultAvatarPoint = (size: AvatarSize): ViewportPoint => {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  const vw = window.innerWidth;
  const vh = getViewportHeight();
  const { width, height } = getAvatarDimensions(size);

  if (size === "compact") {
    return clampPointToViewport({ x: vw - width - 10, y: vh - height - 16 }, size);
  }

  if (size === "medium") {
    return clampPointToViewport({ x: vw - width - 18, y: vh - height - 24 }, size);
  }

  const pageRightGutter = Math.max(18, (vw - 1200) / 2 + 18);
  return clampPointToViewport(
    {
      x: vw - pageRightGutter - width,
      y: Math.max(220, Math.min(320, vh * 0.34)),
    },
    size
  );
};

export type MouthExpression = "neutral" | "smile" | "surprised" | "sad" | "talking";
type MoodDetail = { expression: MouthExpression; duration?: number };

type CharacterVariant = "developer" | "creator" | "minimal" | "explorer" | "techLead" | "aiBuilder";

type CharacterThemeColors = {
  skin?: string;
  shirt?: string;
  pants?: string;
  eyes?: string;
  pupils?: string;
  accent?: string;
  hair?: string;
  laptop?: string;
};

type CharacterMood = "focused" | "talkative" | "bored" | "excited" | "curious" | "confident";

type PopupItem = "bug" | "idea" | "chat" | "rocket" | "check" | "neural" | "spark";

const POPUP_ITEM_LABELS: Record<PopupItem, string> = {
  bug: "🐞",
  idea: "💡",
  chat: "💬",
  rocket: "🚀",
  check: "✓",
  neural: "✦",
  spark: "✨",
};

type CharacterPersonality = "friendly" | "professional" | "playful" | "calm";

const PERSONALITY_BEHAVIOR: Record<CharacterPersonality, PersonalityBehavior> = {
  friendly: {
    mouths: ["smile", "talking", "neutral", "smile"],
    actionMultiplier: 1,
    messageEvery: [8000, 14000],
    talkDuration: 1350,
    label: "Friendly",
  },
  professional: {
    mouths: ["neutral", "smile", "neutral"],
    actionMultiplier: 1.18,
    messageEvery: [11000, 17000],
    talkDuration: 1050,
    label: "Professional",
  },
  playful: {
    mouths: ["smile", "surprised", "talking", "smile", "talking"],
    actionMultiplier: 0.78,
    messageEvery: [6500, 11000],
    talkDuration: 1550,
    label: "Playful",
  },
  calm: {
    mouths: ["neutral", "neutral", "smile"],
    actionMultiplier: 1.35,
    messageEvery: [13000, 19000],
    talkDuration: 950,
    label: "Calm",
  },
};

type CharacterAnimation = {
  mood: CharacterMood;
  idleMouths: MouthExpression[];
  bobSpeed: number;
  bobAmount: number;
  swaySpeed: number;
  swayAmount: number;
  blinkMin: number;
  blinkMax: number;
  eyeDriftX: number;
  eyeDriftY: number;
  actionEvery: [number, number];
  popupItems?: PopupItem[];
};

type PersonalityBehavior = {
  mouths: MouthExpression[];
  actionMultiplier: number;
  messageEvery: [number, number];
  talkDuration: number;
  label: string;
};

type CharacterPreset = {
  label: string;
  colors: Required<CharacterThemeColors>;
  hasHair: boolean;
  accessory: "laptop" | "spark" | "none";
  bodyShape: "hoodie" | "jacket" | "tee" | "minimal";
  animation: CharacterAnimation;
};

const CHARACTER_PRESETS: Record<CharacterVariant, CharacterPreset> = {
  developer: {
    label: "Developer character",
    hasHair: true,
    accessory: "laptop",
    bodyShape: "hoodie",
    colors: {
      skin: "#F2C6A0",
      shirt: "#7C3AED",
      pants: "#111827",
      eyes: "#F8FAFC",
      pupils: "#111827",
      accent: "#8B5CF6",
      hair: "#1F2937",
      laptop: "#CBD5E1",
    },
    animation: {
      mood: "focused",
      idleMouths: ["neutral", "smile", "neutral"],
      bobSpeed: 1.05,
      bobAmount: 1.8,
      swaySpeed: 0.85,
      swayAmount: 2.6,
      blinkMin: 2600,
      blinkMax: 5200,
      eyeDriftX: 5,
      eyeDriftY: 3,
      actionEvery: [5600, 8200],
      popupItems: ["bug", "check", "idea"],
    },
  },
  creator: {
    label: "Creator character",
    hasHair: true,
    accessory: "spark",
    bodyShape: "tee",
    colors: {
      skin: "#D99A6C",
      shirt: "#06B6D4",
      pants: "#1E293B",
      eyes: "#F8FAFC",
      pupils: "#0F172A",
      accent: "#22D3EE",
      hair: "#3B2416",
      laptop: "#E0F2FE",
    },
    animation: {
      mood: "talkative",
      idleMouths: ["smile", "talking", "smile", "surprised"],
      bobSpeed: 1.45,
      bobAmount: 3.1,
      swaySpeed: 1.35,
      swayAmount: 5.5,
      blinkMin: 1800,
      blinkMax: 3600,
      eyeDriftX: 8,
      eyeDriftY: 5,
      actionEvery: [3600, 5600],
      popupItems: ["chat", "idea", "rocket"],
    },
  },
  minimal: {
    label: "Minimal professional character",
    hasHair: false,
    accessory: "none",
    bodyShape: "minimal",
    colors: {
      skin: "#F2C6A0",
      shirt: "#334155",
      pants: "#0F172A",
      eyes: "#F8FAFC",
      pupils: "#111827",
      accent: "#64748B",
      hair: "#1F2937",
      laptop: "#CBD5E1",
    },
    animation: {
      mood: "bored",
      idleMouths: ["neutral", "neutral", "sad", "neutral"],
      bobSpeed: 0.62,
      bobAmount: 1.1,
      swaySpeed: 0.45,
      swayAmount: 1.8,
      blinkMin: 3600,
      blinkMax: 6800,
      eyeDriftX: 3,
      eyeDriftY: 2,
      actionEvery: [7200, 10400],
      popupItems: ["check"],
    },
  },
  explorer: {
    label: "Explorer character",
    hasHair: true,
    accessory: "spark",
    bodyShape: "jacket",
    colors: {
      skin: "#B77952",
      shirt: "#0F766E",
      pants: "#1E293B",
      eyes: "#F8FAFC",
      pupils: "#111827",
      accent: "#F59E0B",
      hair: "#111827",
      laptop: "#FDE68A",
    },
    animation: {
      mood: "excited",
      idleMouths: ["smile", "surprised", "smile", "talking"],
      bobSpeed: 1.75,
      bobAmount: 4.2,
      swaySpeed: 1.6,
      swayAmount: 7,
      blinkMin: 1500,
      blinkMax: 2800,
      eyeDriftX: 10,
      eyeDriftY: 7,
      actionEvery: [2600, 4600],
      popupItems: ["rocket", "idea", "chat"],
    },
  },
  techLead: {
    label: "Tech lead character",
    hasHair: true,
    accessory: "laptop",
    bodyShape: "jacket",
    colors: {
      skin: "#C08457",
      shirt: "#1D4ED8",
      pants: "#0F172A",
      eyes: "#F8FAFC",
      pupils: "#020617",
      accent: "#60A5FA",
      hair: "#171717",
      laptop: "#E2E8F0",
    },
    animation: {
      mood: "confident",
      idleMouths: ["neutral", "smile", "neutral", "talking"],
      bobSpeed: 0.92,
      bobAmount: 1.5,
      swaySpeed: 0.72,
      swayAmount: 2.2,
      blinkMin: 3000,
      blinkMax: 5600,
      eyeDriftX: 4,
      eyeDriftY: 2.5,
      actionEvery: [6200, 9000],
      popupItems: ["check", "idea"],
    },
  },
  aiBuilder: {
    label: "AI builder character",
    hasHair: true,
    accessory: "spark",
    bodyShape: "hoodie",
    colors: {
      skin: "#E0B089",
      shirt: "#581C87",
      pants: "#111827",
      eyes: "#F8FAFC",
      pupils: "#020617",
      accent: "#A78BFA",
      hair: "#312E81",
      laptop: "#DDD6FE",
    },
    animation: {
      mood: "curious",
      idleMouths: ["neutral", "surprised", "smile", "talking"],
      bobSpeed: 1.28,
      bobAmount: 2.4,
      swaySpeed: 1.18,
      swayAmount: 4.8,
      blinkMin: 1700,
      blinkMax: 3900,
      eyeDriftX: 12,
      eyeDriftY: 5,
      actionEvery: [3200, 5600],
      popupItems: ["neural", "idea", "spark"],
    },
  },
};

const getCharacterVariant = (value: unknown): CharacterVariant => {
  return value === "creator" ||
    value === "minimal" ||
    value === "explorer" ||
    value === "techLead" ||
    value === "aiBuilder" ||
    value === "developer"
    ? value
    : "developer";
};

type ActiveCharacterAvatar = {
  title?: string;
  renderMode?: "animatedRig" | "staticAsset";
  characterVariant?: CharacterVariant;
  personality?: CharacterPersonality;
  message?: string;
  avatarSvg?: string;
  avatarImage?: string;
} | null;

// Short, punchy tokens that float up above the head and fade — kept brief so they read mid-flight.
const FLOATING_PHRASES: Record<CharacterVariant, string[]> = {
  developer: ["Clean code ✨", "Fast ⚡", "Fewer bugs 🐞", "Ship it 🚀", "Typed & tidy", "Performance 📈", "Refactored 🧹", "React + TS", "Less waiting ⏱️", "Hire the human 👋"],
  creator: ["Storytelling ✨", "Polished 🎨", "On brand", "Memorable", "Motion 🌀", "Personality 💫", "Crafted", "Stop scrolling 🛑", "Useful + pretty", "Make contact easy"],
  minimal: ["Less noise", "More proof", "Edited ✂️", "Whitespace 🤍", "Calm", "No clutter", "Readable", "Focused", "Clean lines", "Professional"],
  explorer: ["Explore 🧭", "Outcomes 🎯", "Momentum 🚀", "Real stories", "Dive in", "Adventure ⛰️", "Trust built", "Keep clicking", "Discover", "No old PDFs 📄"],
  techLead: ["Architecture 🏗️", "Goal → proof", "Maintainable", "Senior 🧠", "Clear decisions", "Scales 📊", "Smooth delivery", "Less drama", "Product-minded", "Trust 🤝"],
  aiBuilder: ["Signal found 📡", "Practical AI 🤖", "Solves problems", "Automation ✦", "Modern tooling", "Curious 🔍", "Impact > deps", "Prompt accepted", "Polish ✨", "Optional, I know"],
};

// Classic cartoon "dizzy" stars that orbit the head on a tilted 3D ring.
const DIZZY_STARS = Array.from({ length: 5 }, (_, i) => ({
  angle: (i / 5) * 360, // even spacing around the ring
  size: 13 + (i % 3) * 5, // 13–23px for a bit of variety
}));
const DIZZY_TILT = 64; // orbit-plane tilt (deg) → the 3D halo look
const DIZZY_RADIUS = 28; // orbit radius (px)

// Spawn "poof": soft dust/cloud puffs that expand outward and dissipate as the avatar materialises.
const SPAWN_PUFFS = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const ring = i % 2; // alternate a near and a far ring for a fuller cloud
  return {
    x: Math.cos(angle) * (26 + ring * 24),
    y: Math.sin(angle) * (22 + ring * 18) - 6, // bias slightly upward
    size: 16 + ((i * 7) % 20), // 16–34px
    delay: (i % 5) * 0.03,
  };
});
type FloatingAvatarProps = {
  avatar?: ActiveCharacterAvatar;
};

export default function FloatingAvatar({ avatar }: FloatingAvatarProps) {
  const prefersReduced = useReducedMotion();
  const active = true;
  const visible = true;
  const [mouth, setMouth] = useState<MouthExpression>("neutral");

  const frameReq = useRef<number | null>(null);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);
  const talkTimer = useRef<NodeJS.Timeout | null>(null);
  const bobFrame = useRef<number | null>(null);
  const idleTimeout = useRef<NodeJS.Timeout | null>(null);
  const swayFrame = useRef<number | null>(null);
  const blinkTimer = useRef<NodeJS.Timeout | null>(null);
  const eyeDriftTimer = useRef<NodeJS.Timeout | null>(null);
  const promptTimer = useRef<NodeJS.Timeout | null>(null);
  const cursorFollowTimer = useRef<NodeJS.Timeout | null>(null);
  const cursorFollowUntil = useRef(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const idleY = useMotionValue(0);
  const idleSway = useMotionValue(0);
  const pupilScale = useMotionValue(1);
  const idleEyeX = useMotionValue(0);
  const idleEyeY = useMotionValue(0);
  const idleEyeTarget = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const avatarX = useMotionValue(0);
  const avatarY = useMotionValue(0);
  const [avatarSize, setAvatarSize] = useState<AvatarSize>("large");
  const [hasMounted, setHasMounted] = useState(false);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const targetX = useRef(0);
  const targetY = useRef(0);
  const avatarRef = useRef<HTMLDivElement | null>(null);

  const pupilX = useSpring(mouseX, { stiffness: 120, damping: 16 });
  const pupilY = useSpring(mouseY, { stiffness: 120, damping: 16 });
  const pupilScaleSpring = useSpring(pupilScale, { stiffness: 320, damping: 22 });
  const eyeX = useTransform([pupilX, idleEyeX], ([a, b]) => Number(a) + Number(b));
  const eyeY = useTransform([pupilY, idleEyeY], ([a, b]) => Number(a) + Number(b));
  const headTilt = useTransform(mouseX, [-10, 10], [5, -5]);
  const [isUserIdle, setIsUserIdle] = useState(false);
  const [popupItem, setPopupItem] = useState<PopupItem | null>(null);
  const [floaters, setFloaters] = useState<{ id: number; text: string }[]>([]);
  const floaterIdRef = useRef(0);
  const lastFloatRef = useRef<string>("");
  const [spawning, setSpawning] = useState(true);
  const [dizzy, setDizzy] = useState(false);
  const dizzyRef = useRef(false);
  // Fall back to the CSS puff if the spawn Lottie can't load.
  const [spawnFxFailed, setSpawnFxFailed] = useState(false);
  const hoverCountRef = useRef(0);
  const hoverResetRef = useRef<NodeJS.Timeout | null>(null);
  const dizzyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const popupTimer = useRef<NodeJS.Timeout | null>(null);
  const popupHideTimer = useRef<NodeJS.Timeout | null>(null);
  const renderMode = avatar?.renderMode === "staticAsset" ? "staticAsset" : "animatedRig";
  const shouldUseAnimatedRig = renderMode === "animatedRig";
  const cmsAvatarUrl = !shouldUseAnimatedRig ? safeAssetUrl(avatar?.avatarSvg) || safeAssetUrl(avatar?.avatarImage) : "";
  const cmsAvatarTitle = textOrFallback(avatar?.title, "Floating character", 60);
  const customPromptMessage = typeof avatar?.message === "string" ? avatar.message.trim().slice(0, 80) : "";
  const characterVariant = getCharacterVariant(avatar?.characterVariant);
  // The displayed character rotates through the available presets over the day (see effect below).
  const [activeVariant, setActiveVariant] = useState<CharacterVariant>(characterVariant);
  const personality = avatar?.personality || "friendly";
  const personalityBehavior = PERSONALITY_BEHAVIOR[personality] || PERSONALITY_BEHAVIOR.friendly;
  const preset = CHARACTER_PRESETS[activeVariant];
  const colors = preset.colors;
  const animation = preset.animation;

  const floatingPool = useMemo(() => {
    const base = FLOATING_PHRASES[activeVariant] || FLOATING_PHRASES.developer;
    // Mix in a short CMS message as an occasional token, only if brief enough to read mid-flight.
    return customPromptMessage && customPromptMessage.length <= 28 ? [customPromptMessage, ...base] : base;
  }, [activeVariant, customPromptMessage]);

  const idleMouths = useMemo<MouthExpression[]>(() => {
    return personalityBehavior.mouths || animation.idleMouths;
  }, [animation.idleMouths, personalityBehavior.mouths]);

  const setAvatarPoint = useCallback(
    (point: ViewportPoint, size = avatarSize) => {
      const safePoint = clampPointToViewport(point, size);
      avatarX.set(safePoint.x);
      avatarY.set(safePoint.y);
      return safePoint;
    },
    [avatarSize, avatarX, avatarY]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initializeAvatarPosition = () => {
      const nextSize = getAvatarSize();
      setAvatarSize(nextSize);

      let nextPoint = getDefaultAvatarPoint(nextSize);
      try {
        const saved = window.localStorage.getItem(AVATAR_POSITION_KEY);
        const parsed = saved ? (JSON.parse(saved) as SavedAvatarPoint) : null;
        if (parsed?.size === nextSize && typeof parsed.x === "number" && typeof parsed.y === "number") {
          nextPoint = { x: parsed.x, y: parsed.y };
        }
      } catch {
        // Ignore corrupt saved positions and keep the default placement.
      }

      // Always dock to a bottom corner, whether using the saved spot or the default.
      setAvatarPoint(snapPointToEdge(nextPoint, nextSize), nextSize);
      setHasMounted(true);
    };

    initializeAvatarPosition();
  }, [setAvatarPoint]);

  useEffect(() => {
    if (prefersReduced) return;

    const stopTracking = () => {
      cursorFollowUntil.current = 0;
      targetX.current = 0;
      targetY.current = 0;
      mouseX.set(0);
      mouseY.set(0);
      setIsUserIdle(true);
      if (cursorFollowTimer.current) {
        clearTimeout(cursorFollowTimer.current);
        cursorFollowTimer.current = null;
      }
    };

    const handler = (e: MouseEvent) => {
      if (Date.now() > cursorFollowUntil.current) return;
      targetX.current = e.clientX;
      targetY.current = e.clientY;
      if (frameReq.current) return;
      frameReq.current = window.requestAnimationFrame(() => {
        if (Date.now() > cursorFollowUntil.current) {
          stopTracking();
          frameReq.current = null;
          return;
        }
        const rect = avatarRef.current?.getBoundingClientRect();
        // Use the element's visual center; rect already includes all transforms (drag, scroll)
        const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
        const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
        const dx = clamp((targetX.current - cx) / 10, -16, 16);
        const dy = clamp((targetY.current - cy) / 10, -16, 16);
        mouseX.set(dx);
        mouseY.set(dy);
        frameReq.current = null;
      });
    };

    const activity = () => {
      if (Date.now() <= cursorFollowUntil.current) setIsUserIdle(false);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      idleTimeout.current = setTimeout(() => setIsUserIdle(true), 3000);
    };
    const handleMouseOut = (event: MouseEvent) => {
      if (!event.relatedTarget) stopTracking();
    };
    const handleVisibilityChange = () => {
      if (document.hidden) stopTracking();
    };
    window.addEventListener("mousemove", handler);
    window.addEventListener("mousemove", activity);
    window.addEventListener("mouseleave", stopTracking);
    window.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("blur", stopTracking);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    setIsUserIdle(true);
    return () => {
      window.removeEventListener("mousemove", handler);
      window.removeEventListener("mousemove", activity);
      window.removeEventListener("mouseleave", stopTracking);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("blur", stopTracking);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (cursorFollowTimer.current) clearTimeout(cursorFollowTimer.current);
      if (frameReq.current) cancelAnimationFrame(frameReq.current);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      if (blinkTimer.current) clearTimeout(blinkTimer.current);
      if (promptTimer.current) clearTimeout(promptTimer.current);
    };
  }, [mouseX, mouseY, prefersReduced]);

  useEffect(() => {
    if (!active || prefersReduced) return;
    const schedule = () => {
      idleTimer.current = setTimeout(() => {
        const pick = idleMouths[Math.floor(Math.random() * idleMouths.length)] || "neutral";
        setMouth(pick);
        const resetDelay = pick === "talking" ? 950 : pick === "surprised" ? 850 : 1300;
        setTimeout(() => setMouth("neutral"), resetDelay);
        schedule();
      }, (animation.actionEvery[0] + Math.random() * (animation.actionEvery[1] - animation.actionEvery[0])) * personalityBehavior.actionMultiplier);
    };
    schedule();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [active, animation.actionEvery, idleMouths, personalityBehavior.actionMultiplier, prefersReduced]);

  // Subtle idle bob
  useEffect(() => {
    if (prefersReduced) return;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const t = (ts - start) / 1000;
      idleY.set(Math.sin(t * animation.bobSpeed) * animation.bobAmount);
      bobFrame.current = requestAnimationFrame(tick);
    };
    bobFrame.current = requestAnimationFrame(tick);
    return () => {
      if (bobFrame.current) cancelAnimationFrame(bobFrame.current);
    };
  }, [animation.bobAmount, animation.bobSpeed, idleY, prefersReduced]);

  // Idle sway when user is idle
  useEffect(() => {
    if (prefersReduced) return;
    if (isUserIdle) {
      setMouth("smile");
      if (talkTimer.current) clearTimeout(talkTimer.current);
      talkTimer.current = setTimeout(() => setMouth("neutral"), 1400);
    }
    if (!isUserIdle) {
      idleSway.set(0);
      if (swayFrame.current) cancelAnimationFrame(swayFrame.current);
      idleEyeX.set(0);
      idleEyeY.set(0);
      if (eyeDriftTimer.current) clearTimeout(eyeDriftTimer.current);
      return;
    }
    let start: number | null = null;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const t = (ts - start) / 1000;
      idleSway.set(Math.sin(t * animation.swaySpeed) * animation.swayAmount);
      swayFrame.current = requestAnimationFrame(tick);
    };
    swayFrame.current = requestAnimationFrame(tick);
    return () => {
      if (swayFrame.current) cancelAnimationFrame(swayFrame.current);
    };
  }, [animation.swayAmount, animation.swaySpeed, idleSway, isUserIdle, prefersReduced]);

  // Blink loop
  useEffect(() => {
    if (prefersReduced) return;
    const blink = () => {
      pupilScale.set(0.1);
      setTimeout(() => pupilScale.set(1), 140);
      const next = animation.blinkMin + Math.random() * (animation.blinkMax - animation.blinkMin);
      blinkTimer.current = setTimeout(blink, next);
    };
    blinkTimer.current = setTimeout(blink, animation.blinkMin + Math.random() * 800);
    return () => {
      if (blinkTimer.current) clearTimeout(blinkTimer.current);
    };
  }, [animation.blinkMax, animation.blinkMin, pupilScale, prefersReduced]);

  // Idle eye drift when idle
  useEffect(() => {
    if (prefersReduced) return;
    if (!isUserIdle) {
      idleEyeX.set(0);
      idleEyeY.set(0);
      if (eyeDriftTimer.current) clearTimeout(eyeDriftTimer.current);
      return;
    }

    const hop = () => {
      // pick a new target within this character's personality radius
      const x = clamp((Math.random() - 0.5) * animation.eyeDriftX * 2, -animation.eyeDriftX, animation.eyeDriftX);
      const y = clamp((Math.random() - 0.5) * animation.eyeDriftY * 2, -animation.eyeDriftY, animation.eyeDriftY);
      idleEyeTarget.current = { x, y };
      idleEyeX.set(idleEyeTarget.current.x);
      idleEyeY.set(idleEyeTarget.current.y);
      eyeDriftTimer.current = setTimeout(hop, 1600 + Math.random() * 1600);
    };
    hop();

    return () => {
      if (eyeDriftTimer.current) clearTimeout(eyeDriftTimer.current);
    };
  }, [idleEyeX, idleEyeY, isUserIdle, prefersReduced]);

  // Floating words: one short token at a time rises from the centre of the head and fades.
  useEffect(() => {
    if (prefersReduced) return;
    let stopped = false;

    const emit = () => {
      if (stopped) return;
      // Stay silent while dizzy — no words during the easter egg.
      if (!dizzyRef.current) {
        // Pick a token, avoiding an immediate repeat so it doesn't say the same thing twice in a row.
        let text = floatingPool[Math.floor(Math.random() * floatingPool.length)] || "✨";
        for (let guard = 0; floatingPool.length > 1 && text === lastFloatRef.current && guard < 6; guard += 1) {
          text = floatingPool[Math.floor(Math.random() * floatingPool.length)] || text;
        }
        lastFloatRef.current = text;

        const id = (floaterIdRef.current += 1);
        setFloaters((prev) => [...prev.slice(-1), { id, text }]);

        // React to the thought.
        setMouth("talking");
        idleEyeX.set(-2);
        idleEyeY.set(-3);
        if (talkTimer.current) clearTimeout(talkTimer.current);
        talkTimer.current = setTimeout(() => setMouth("smile"), 650);

        // Remove once it has finished rising and fading.
        setTimeout(() => setFloaters((prev) => prev.filter((f) => f.id !== id)), 2800);
      }

      // Calmer cadence: a new word every ~3.5–6s, so each one is readable on its own.
      const next = 3500 + Math.random() * 2500;
      promptTimer.current = setTimeout(emit, next);
    };

    promptTimer.current = setTimeout(emit, 1000);
    return () => {
      stopped = true;
      if (promptTimer.current) clearTimeout(promptTimer.current);
    };
  }, [floatingPool, idleEyeX, idleEyeY, prefersReduced]);

  // Auto-rotate the avatar through the available built-in characters across the day,
  // so it isn't always the same one — a random one each visit, then switching every few hours.
  useEffect(() => {
    if (prefersReduced || !shouldUseAnimatedRig || cmsAvatarUrl) return;
    const variants = Object.keys(CHARACTER_PRESETS) as CharacterVariant[];
    const SLOT_MS = 4 * 60 * 60 * 1000; // 6 characters → a full rotation across ~24h
    const pickDifferent = (current: CharacterVariant) => {
      const others = variants.filter((v) => v !== current);
      return others[Math.floor(Math.random() * others.length)] || current;
    };
    // Start each visit on a random character, then keep switching through the day.
    setActiveVariant((current) => pickDifferent(current));
    const interval = setInterval(() => setActiveVariant((current) => pickDifferent(current)), SLOT_MS);
    return () => clearInterval(interval);
  }, [shouldUseAnimatedRig, cmsAvatarUrl, prefersReduced]);

  // Spawn "poof": clear the entrance burst once it has played.
  useEffect(() => {
    if (prefersReduced) return;
    const t = setTimeout(() => setSpawning(false), 2000);
    return () => clearTimeout(t);
  }, [prefersReduced]);

  // Dizzy easter egg: spin the pupils in a fast circle while dizzy, then settle.
  useEffect(() => {
    dizzyRef.current = dizzy;
    if (!dizzy) return;
    setFloaters([]); // clear any floating words for the duration
    setMouth("surprised");
    let raf = 0;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const t = (ts - start) / 1000;
      idleEyeX.set(Math.cos(t * 13) * 7);
      idleEyeY.set(Math.sin(t * 13) * 7);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      idleEyeX.set(0);
      idleEyeY.set(0);
      setMouth("neutral");
    };
  }, [dizzy, idleEyeX, idleEyeY]);

  // Count rapid hovers; after the 3rd in quick succession, make the avatar dizzy for a few seconds.
  const handleAvatarHover = useCallback(() => {
    if (dizzy) return;
    hoverCountRef.current += 1;
    if (hoverResetRef.current) clearTimeout(hoverResetRef.current);
    hoverResetRef.current = setTimeout(() => {
      hoverCountRef.current = 0;
    }, 2500);
    if (hoverCountRef.current >= 3) {
      hoverCountRef.current = 0;
      setDizzy(true);
      if (dizzyTimerRef.current) clearTimeout(dizzyTimerRef.current);
      dizzyTimerRef.current = setTimeout(() => setDizzy(false), 3200);
    }
  }, [dizzy]);

  // Fall back to the matching CSS effect if that Lottie file can't be loaded (e.g. not added yet).
  const onLottieError = useCallback(
    (onFail: () => void) =>
      (dotLottie: { addEventListener: (event: "loadError", cb: () => void) => void } | null) => {
        dotLottie?.addEventListener("loadError", onFail);
      },
    []
  );

  // Character item popups: small temporary item appears every few seconds, based on the selected persona.
  useEffect(() => {
    if (prefersReduced) return;
    const items = animation.popupItems || [];
    if (!items.length) return;

    const schedulePopup = () => {
      const item = items[Math.floor(Math.random() * items.length)] || null;
      setPopupItem(item);
      if (popupHideTimer.current) clearTimeout(popupHideTimer.current);
      popupHideTimer.current = setTimeout(() => setPopupItem(null), 1850);
      const nextDelay = (animation.actionEvery[0] + 1800 + Math.random() * (animation.actionEvery[1] - animation.actionEvery[0] + 2200)) * personalityBehavior.actionMultiplier;
      popupTimer.current = setTimeout(schedulePopup, nextDelay);
    };

    popupTimer.current = setTimeout(schedulePopup, 4200 + Math.random() * 2800);
    return () => {
      if (popupTimer.current) clearTimeout(popupTimer.current);
      if (popupHideTimer.current) clearTimeout(popupHideTimer.current);
    };
  }, [animation.actionEvery, animation.popupItems, personalityBehavior.actionMultiplier, prefersReduced]);

  // Keep the avatar responsive and clamped using absolute viewport coordinates only.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const nextSize = getAvatarSize();
      const sizeChanged = nextSize !== avatarSize;
      setAvatarSize(nextSize);
      const currentPoint = sizeChanged ? getDefaultAvatarPoint(nextSize) : { x: avatarX.get(), y: avatarY.get() };
      // Keep the avatar docked to its nearest edge as the viewport resizes.
      setAvatarPoint(snapPointToEdge(currentPoint, nextSize), nextSize);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    // Re-dock when the mobile visible viewport changes (toolbar show/hide).
    window.visualViewport?.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("scroll", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("scroll", handleResize);
    };
  }, [avatarSize, avatarX, avatarY, setAvatarPoint]);

  const handleAvatarPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (typeof window === "undefined") return;

    event.preventDefault();
    setMouth("smile");
    setIsUserIdle(false);
    isDraggingRef.current = true;
    dragOffsetRef.current = {
      x: event.clientX - avatarX.get(),
      y: event.clientY - avatarY.get(),
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingRef.current) return;
      moveEvent.preventDefault();
      setAvatarPoint(
        {
          x: moveEvent.clientX - dragOffsetRef.current.x,
          y: moveEvent.clientY - dragOffsetRef.current.y,
        },
        avatarSize
      );
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      upEvent.preventDefault();
      isDraggingRef.current = false;
      setMouth("smile");
      // Dock to the bottom corner of the nearest side: glide both axes so it
      // visibly slides into the bottom-left / bottom-right corner and "sits".
      const seated = snapPointToEdge(
        {
          x: upEvent.clientX - dragOffsetRef.current.x,
          y: upEvent.clientY - dragOffsetRef.current.y,
        },
        avatarSize
      );
      const settle = { type: "spring" as const, stiffness: 260, damping: 28, mass: 0.9 };
      animate(avatarX, seated.x, settle);
      animate(avatarY, seated.y, settle);
      try {
        window.localStorage.setItem(AVATAR_POSITION_KEY, JSON.stringify({ ...seated, size: avatarSize }));
      } catch {
        // Position persistence is optional; docking still works without storage.
      }
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", handlePointerUp, { passive: false });
    window.addEventListener("pointercancel", handlePointerUp, { passive: false });
  };

  const triggerTalk = () => {
    const followDuration = 4200;
    cursorFollowUntil.current = Date.now() + followDuration;
    setIsUserIdle(false);
    mouseX.set(0);
    mouseY.set(0);
    setMouth("talking");
    if (talkTimer.current) clearTimeout(talkTimer.current);
    talkTimer.current = setTimeout(() => setMouth("neutral"), 900);
    if (cursorFollowTimer.current) clearTimeout(cursorFollowTimer.current);
    cursorFollowTimer.current = setTimeout(() => {
      cursorFollowUntil.current = 0;
      mouseX.set(0);
      mouseY.set(0);
      setIsUserIdle(true);
      cursorFollowTimer.current = null;
    }, followDuration);
  };

  const mouthStyles = useMemo(
    () => ({
      neutral: { display: mouth === "neutral" ? "block" : "none", opacity: mouth === "neutral" ? 1 : 0 },
      smile: { display: mouth === "smile" ? "block" : "none", opacity: mouth === "smile" ? 1 : 0, transition: "opacity 140ms ease" },
      surprised: { display: mouth === "surprised" ? "block" : "none", opacity: mouth === "surprised" ? 1 : 0, transition: "opacity 140ms ease" },
      sad: { display: mouth === "sad" ? "block" : "none", opacity: mouth === "sad" ? 1 : 0, transition: "opacity 140ms ease" },
      talking: { display: mouth === "talking" ? "block" : "none", opacity: mouth === "talking" ? 1 : 0, transition: "opacity 140ms ease" },
    }),
    [mouth]
  );

  // Listen for external mouth change requests (e.g., button hovers)
  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<MoodDetail>).detail;
      if (!detail?.expression) return;
      setMouth(detail.expression);
      if (talkTimer.current) clearTimeout(talkTimer.current);
      if (detail.duration !== 0) {
        talkTimer.current = setTimeout(() => setMouth("neutral"), detail.duration ?? 1200);
      }
    };
    window.addEventListener("avatar:set-mouth", handler as EventListener);
    return () => window.removeEventListener("avatar:set-mouth", handler as EventListener);
  }, []);

  if (prefersReduced) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible && hasMounted ? 1 : 0 }}
      transition={{ duration: 0.2, delay: 0.05 }}
      style={{
        x: avatarX,
        y: avatarY,
      }}
      ref={avatarRef}
      className="fixed left-0 top-0 z-50 pointer-events-auto select-none touch-none will-change-transform"
      aria-hidden
      onPointerDown={handleAvatarPointerDown}
    >
      {/* Spawn "poof": fallback dust burst centred on the avatar art (the badge below would
          otherwise pull a full-box centre downward and misalign it). */}
      {spawning && spawnFxFailed && (
        <div className="pointer-events-none absolute left-10 top-[74px] sm:left-14 sm:top-[105px] lg:left-20 lg:top-[150px] z-[58] -translate-x-1/2 -translate-y-1/2">
          {SPAWN_PUFFS.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-zinc-400/55 blur-[3px]"
              style={{ width: p.size, height: p.size }}
              initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
              animate={{ opacity: [0, 0.85, 0], scale: [0.3, 1.15, 0.7], x: p.x, y: p.y }}
              transition={{ duration: 0.85, ease: "easeOut", delay: p.delay }}
            />
          ))}
        </div>
      )}

      {/* Spawn "poof": Lottie smoke/dust burst, centred on the avatar art (half art width/height). */}
      {spawning && !spawnFxFailed && (
        <div className="pointer-events-none absolute left-10 top-[74px] sm:left-14 sm:top-[105px] lg:left-20 lg:top-[150px] z-[58] -translate-x-1/2 -translate-y-1/2">
          <DotLottieReact
            src={LOTTIE_SRC.spawn}
            autoplay
            loop={false}
            className="h-32 w-32 sm:h-44 sm:w-44 lg:h-60 lg:w-60"
            dotLottieRefCallback={onLottieError(() => setSpawnFxFailed(true))}
          />
        </div>
      )}

      {/* Dizzy easter egg: cartoon stars orbiting the head on a tilted 3D ring while the eyes spin. */}
      {dizzy && (
        <div
          className="pointer-events-none absolute bottom-full left-10 -mb-2 sm:left-14 lg:left-20 z-[60] -translate-x-1/2"
          style={{ perspective: "320px" }}
        >
          <motion.div
            className="relative h-14 w-14"
            style={{ transformStyle: "preserve-3d", rotateX: DIZZY_TILT }}
            animate={{ rotateZ: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            {DIZZY_STARS.map((s, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotateZ(${s.angle}deg) translateY(-${DIZZY_RADIUS}px)`,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Counter the ring tilt so the star keeps facing the viewer. */}
                <div
                  className="leading-none drop-shadow-[0_0_5px_rgba(250,204,21,0.9)]"
                  style={{ transform: `rotateX(-${DIZZY_TILT}deg)`, fontSize: s.size }}
                >
                  ⭐
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Floating thought words: rise from the centre of the head and fade.
          Outer span owns the horizontal centring (left = half the art width, then -translate-x-1/2);
          the inner motion.span owns the rise/fade so Framer's transform can't clobber the centring. */}
      {floaters.map((f) => (
        <span
          key={f.id}
          className="pointer-events-none absolute bottom-full left-10 sm:left-14 lg:left-20 z-[60] -translate-x-1/2"
        >
          <motion.span
            initial={{ opacity: 0, y: -6, scale: 0.7 }}
            animate={{ opacity: [0, 1, 1, 0], y: -140, scale: 1 }}
            transition={{ duration: 2.6, ease: "easeOut", times: [0, 0.18, 0.7, 1] }}
            className="block whitespace-nowrap rounded-full border border-primary-accent/35 bg-bg-card/90 px-3 py-1 text-xs font-semibold text-text-primary shadow-lg shadow-black/20 backdrop-blur-sm sm:text-sm"
          >
            {f.text}
          </motion.span>
        </span>
      ))}
      {popupItem && (
        <motion.div
          key={popupItem}
          initial={{ opacity: 0, y: 12, rotate: -8 }}
          animate={{ opacity: 1, y: -30, rotate: 5 }}
          exit={{ opacity: 0, y: -46 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="absolute top-8 -left-2 z-40 grid h-8 w-8 place-items-center rounded-full border border-border-light bg-bg-card/90 text-base shadow-lg sm:h-10 sm:w-10 sm:text-lg"
        >
          <span aria-hidden>{POPUP_ITEM_LABELS[popupItem]}</span>
        </motion.div>
      )}
      <motion.div
        style={{ y: idleY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15, delay: 0.45 }}
        className="relative z-10 drop-shadow-[0_10px_25px_rgba(0,0,0,0.25)] pointer-events-auto"
        onClick={triggerTalk}
        onMouseEnter={handleAvatarHover}
      >
        {cmsAvatarUrl ? (
          // Render CMS-uploaded SVG/image as an external image instead of injecting SVG markup.
          // This keeps the CMS override safe while preserving the draggable floating behavior.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cmsAvatarUrl}
            alt={cmsAvatarTitle}
            className="h-auto w-20 max-h-[145px] object-contain sm:w-28 sm:max-h-[180px] lg:w-40 lg:max-h-[224px]"
            draggable={false}
          />
        ) : (
        <svg width="180" height="220" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className="h-auto w-20 sm:w-28 lg:w-40">
          <title>{cmsAvatarTitle}</title>
          <ellipse cx="200" cy="430" rx="82" ry="18" fill={colors.accent} opacity="0.18" />
          <g id="body-group">
            <rect id="neck" x="182" y="178" width="36" height="42" rx="16" fill={colors.skin} />
            <rect id="left-arm" x="118" y="218" width="34" height="92" rx="17" fill={colors.shirt} opacity="0.9" />
            <rect id="right-arm" x="248" y="218" width="34" height="92" rx="17" fill={colors.shirt} opacity="0.9" />
            <circle cx="135" cy="310" r="16" fill={colors.skin} />
            <circle cx="265" cy="310" r="16" fill={colors.skin} />
            {preset.bodyShape === "jacket" && (
              <>
                <rect id="torso" x="145" y="205" width="110" height="128" rx="24" fill={colors.shirt} />
                <path d="M200 206 L228 332 H172 Z" fill="#0F172A" opacity="0.32" />
                <path d="M164 220 L196 220 L178 292" stroke={colors.accent} strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.75" />
                <path d="M236 220 L204 220 L222 292" stroke={colors.accent} strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.75" />
              </>
            )}
            {preset.bodyShape === "hoodie" && (
              <>
                <rect id="torso" x="145" y="205" width="110" height="128" rx="28" fill={colors.shirt} />
                <path d="M168 218 Q200 250 232 218" stroke="#EDE9FE" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.7" />
                <line x1="190" y1="232" x2="184" y2="274" stroke="#EDE9FE" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
                <line x1="210" y1="232" x2="216" y2="274" stroke="#EDE9FE" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
                <rect x="170" y="278" width="60" height="24" rx="12" fill="#0F172A" opacity="0.16" />
              </>
            )}
            {preset.bodyShape === "tee" && (
              <>
                <path id="torso" d="M154 208 H246 L258 332 H142 Z" fill={colors.shirt} />
                <circle cx="200" cy="254" r="24" fill={colors.accent} opacity="0.18" />
              </>
            )}
            {preset.bodyShape === "minimal" && (
              <>
                <rect id="torso" x="150" y="205" width="100" height="126" rx="22" fill={colors.shirt} />
                <rect x="166" y="225" width="68" height="8" rx="4" fill={colors.accent} opacity="0.5" />
              </>
            )}
            <rect id="left-leg" x="164" y="326" width="34" height="88" rx="16" fill={colors.pants} />
            <rect id="right-leg" x="202" y="326" width="34" height="88" rx="16" fill={colors.pants} />
            <rect x="150" y="405" width="50" height="16" rx="8" fill="#020617" opacity="0.9" />
            <rect x="200" y="405" width="50" height="16" rx="8" fill="#020617" opacity="0.9" />
            {preset.accessory === "laptop" && (
              <g id="laptop" transform="translate(0 4)">
                <rect x="151" y="274" width="98" height="58" rx="8" fill={colors.laptop} />
                <rect x="160" y="284" width="80" height="38" rx="4" fill="#0F172A" opacity="0.82" />
                <circle cx="200" cy="303" r="5" fill={colors.accent} />
                <rect x="142" y="332" width="116" height="10" rx="5" fill="#94A3B8" />
              </g>
            )}
            {preset.accessory === "spark" && (
              <g id="spark" fill={colors.accent} opacity="0.9">
                <path d="M293 190 L302 210 L322 219 L302 228 L293 248 L284 228 L264 219 L284 210 Z" />
                <circle cx="278" cy="172" r="5" />
                <circle cx="324" cy="258" r="4" />
              </g>
            )}
          </g>

          <motion.g style={{ rotate: headTilt, transformOrigin: "200px 120px", transformBox: "fill-box" }}>
            <g id="head-group">
              <circle id="head" cx="200" cy="120" r="80" fill={colors.skin} />
              {preset.hasHair && (
                <path
                  id="hair"
                  d="M122 112 C126 54 169 25 220 38 C260 48 281 78 278 126 C258 104 235 90 202 90 C166 90 143 100 122 112 Z"
                  fill={colors.hair}
                />
              )}
              <circle cx="152" cy="124" r="10" fill={colors.skin} opacity="0.95" />
              <circle cx="248" cy="124" r="10" fill={colors.skin} opacity="0.95" />
            </g>

            <g id="eyes-group">
              <g id="left-eye">
                <circle id="left-eye-white" cx="175" cy="110" r="18" fill={colors.eyes} />
                <motion.circle
                  id="left-pupil"
                  cx="175"
                  cy="110"
                  r="6"
                  fill={colors.pupils}
                  style={{ translateX: eyeX, translateY: eyeY, scaleY: pupilScaleSpring }}
                />
              </g>
              <g id="right-eye">
                <circle id="right-eye-white" cx="225" cy="110" r="18" fill={colors.eyes} />
                <motion.circle
                  id="right-pupil"
                  cx="225"
                  cy="110"
                  r="6"
                  fill={colors.pupils}
                  style={{ translateX: eyeX, translateY: eyeY, scaleY: pupilScaleSpring }}
                />
              </g>
            </g>

            <g id="mouth-group">
              <line id="mouth-neutral" x1="180" y1="145" x2="220" y2="145" stroke={colors.pupils} strokeWidth="3" strokeLinecap="round" style={mouthStyles.neutral} />
              <path id="mouth-smile" d="M 180 140 Q 200 155 220 140" stroke={colors.pupils} strokeWidth="3" fill="none" strokeLinecap="round" style={mouthStyles.smile} />
              <circle id="mouth-surprised" cx="200" cy="145" r="12" fill={colors.pupils} style={mouthStyles.surprised} />
              <path id="mouth-sad" d="M 180 150 Q 200 140 220 150" stroke={colors.pupils} strokeWidth="3" fill="none" strokeLinecap="round" style={mouthStyles.sad} />
              <ellipse id="mouth-talking" cx="200" cy="145" rx="15" ry="20" fill={colors.pupils} style={mouthStyles.talking} />
            </g>
          </motion.g>
        </svg>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.42 }}
        className="pointer-events-none relative z-20 -mt-2 ml-auto mr-1 hidden w-fit items-center gap-1.5 rounded-full border border-border-light bg-bg-card/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] shadow-lg shadow-primary-accent/10 backdrop-blur-md sm:flex"
      >
        <span className="rounded-full bg-orange-500/15 px-2 py-0.5 text-orange-500">{preset.label.replace(" character", "")}</span>
        <span className="rounded-full bg-purple-500/15 px-2 py-0.5 text-purple-500">{personalityBehavior.label}</span>
      </motion.div>
    </motion.div>
  );
}
