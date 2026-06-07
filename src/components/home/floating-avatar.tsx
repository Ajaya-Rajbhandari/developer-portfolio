"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion as baseMotion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useReducedMotion,
} from "framer-motion";

type LocalMotionProps = {
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  exit?: Record<string, unknown>;
  whileHover?: Record<string, unknown>;
  whileTap?: Record<string, unknown>;
  transition?: Record<string, unknown>;
  drag?: boolean;
  dragMomentum?: boolean;
  dragElastic?: number;
  dragConstraints?: { left: number; right: number; top: number; bottom: number };
};

type MotionDivProps = React.ComponentProps<typeof baseMotion.div> & LocalMotionProps;
type MotionGroupProps = React.ComponentProps<typeof baseMotion.g> & LocalMotionProps;
type MotionCircleProps = React.ComponentProps<typeof baseMotion.circle> & LocalMotionProps;

const motion = {
  ...baseMotion,
  div: baseMotion.div as React.ComponentType<MotionDivProps>,
  g: baseMotion.g as React.ComponentType<MotionGroupProps>,
  circle: baseMotion.circle as React.ComponentType<MotionCircleProps>,
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
  messages: string[];
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
    messages: [
      "This portfolio is built to load fast, not just look expensive.",
      "React, TypeScript, Sanity — yes, the stack has taste.",
      "I’m checking the project cards for actual outcomes. Wild concept.",
      "Clean UI, clean code, fewer mystery bugs. Revolutionary.",
      "The case studies explain the problem, role, stack, and result.",
      "Responsive layout? Already handled, because phones exist.",
      "This site ships credibility before it ships confetti.",
      "I refactored the awkward parts so visitors do not have to suffer.",
      "Performance matters. Shockingly, people dislike waiting.",
      "Hire the human behind this before another meeting creates a spreadsheet.",
    ],
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
    messages: [
      "The visuals are here to guide attention, not scream into the void.",
      "This portfolio tells the story behind the work. Fancy, I know.",
      "Micro-interactions add personality without becoming a circus.",
      "Each section has a job: prove value, then make contact easy.",
      "The design says polished; the content says useful.",
      "A little motion helps visitors notice what matters.",
      "Yes, the avatar talks. No, it is not replacing the developer. Yet.",
      "The featured work should make recruiters stop doom-scrolling.",
      "Good visuals are strategy wearing nicer shoes.",
      "Let’s make the portfolio memorable without adding twelve carousels.",
    ],
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
    messages: [
      "Less noise, more proof. Radical portfolio strategy.",
      "The layout keeps attention on the work, where it belongs.",
      "Whitespace is doing actual labor here.",
      "No clutter, no gimmicks, no 47 badges fighting for attention.",
      "The copy is short because visitors have lives.",
      "Clear sections beat decorative chaos every time.",
      "The portfolio stays calm so the projects can speak.",
      "Minimal does not mean empty. It means edited.",
      "If a detail does not help the story, it leaves. Harsh but fair.",
      "Professional, readable, and thankfully not a template explosion.",
    ],
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
    messages: [
      "Scroll around — the good stuff is not hiding behind a PDF from 2018.",
      "The project stories show decisions, tradeoffs, and outcomes.",
      "There is more here than a hero headline doing cardio.",
      "Explore the sections; I promise they are not just decorative rectangles.",
      "This portfolio has momentum, which is useful because attention spans do not.",
      "The work is organized so you can judge skill quickly.",
      "Every section should answer: why trust this developer?",
      "Adventure mode: portfolio edition. Extremely dangerous, obviously.",
      "The CTA is clear because scavenger hunts are not UX.",
      "If you find a better section, click it. I can handle the rejection.",
    ],
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
    messages: [
      "The portfolio is structured like a product: goal, proof, conversion.",
      "Good architecture saves future-you from sending apology messages.",
      "The projects highlight role, stack, constraints, and outcomes.",
      "Strong systems, smooth delivery, fewer dramatic Slack threads.",
      "This site balances personality with credibility.",
      "The CTA is focused because ambiguity is not a growth strategy.",
      "Maintainable code matters after the launch tweet stops getting likes.",
      "The case studies are written for humans and hiring teams. Efficient.",
      "Clear decisions beat shiny confusion every time.",
      "This portfolio says senior without needing a thirty-line buzzword salad.",
    ],
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
    messages: [
      "I scanned the portfolio. Signal found: practical builder energy.",
      "AI features are useful when they solve problems, not when they cosplay as magic.",
      "This site connects strategy, code, and outcome. Suspiciously sensible.",
      "Automation belongs where it saves time, not where it annoys users faster.",
      "The work shows modern tooling without worshipping the tooling.",
      "Prompt accepted: make the portfolio clearer and less boring.",
      "The strongest projects explain impact, not just dependencies installed.",
      "I detect polish, performance, and a healthy dislike of vague CTAs.",
      "Tiny interaction, big memory hook. Humans are weird; use that.",
      "This avatar is optional. Good work, unfortunately, is not.",
    ],
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
  const typewriterTimer = useRef<NodeJS.Timeout | null>(null);
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
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const [dragConstraints, setDragConstraints] = useState<{ left: number; right: number; top: number; bottom: number }>({
    left: -400,
    right: 12,
    top: -400,
    bottom: 12,
  });
  const snapFrame = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const avatarRef = useRef<HTMLDivElement | null>(null);

  const { scrollY } = useScroll();
  const floatY = useTransform(scrollY, [0, 400], [0, 16]);
  const floatScale = useTransform(scrollY, [0, 400], [1, 1.02]);
  const combinedY = useTransform([floatY, dragY], ([a, b]) => Number(a) + Number(b));

  const pupilX = useSpring(mouseX, { stiffness: 120, damping: 16 });
  const pupilY = useSpring(mouseY, { stiffness: 120, damping: 16 });
  const pupilScaleSpring = useSpring(pupilScale, { stiffness: 320, damping: 22 });
  const eyeX = useTransform([pupilX, idleEyeX], ([a, b]) => Number(a) + Number(b));
  const eyeY = useTransform([pupilY, idleEyeY], ([a, b]) => Number(a) + Number(b));
  const headTilt = useTransform(mouseX, [-10, 10], [5, -5]);
  const [isUserIdle, setIsUserIdle] = useState(false);
  const [unlocked] = useState(true);
  const [showDragPrompt, setShowDragPrompt] = useState(false);
  const [currentPromptMessage, setCurrentPromptMessage] = useState("Preparing the portfolio pitch...");
  const [typedPromptMessage, setTypedPromptMessage] = useState("");
  const [isTypingPrompt, setIsTypingPrompt] = useState(false);
  const [popupItem, setPopupItem] = useState<PopupItem | null>(null);
  const [speechPlacement, setSpeechPlacement] = useState<"left" | "right">("left");
  const popupTimer = useRef<NodeJS.Timeout | null>(null);
  const popupHideTimer = useRef<NodeJS.Timeout | null>(null);
  const renderMode = avatar?.renderMode === "staticAsset" ? "staticAsset" : "animatedRig";
  const shouldUseAnimatedRig = renderMode === "animatedRig";
  const cmsAvatarUrl = !shouldUseAnimatedRig ? safeAssetUrl(avatar?.avatarSvg) || safeAssetUrl(avatar?.avatarImage) : "";
  const cmsAvatarTitle = textOrFallback(avatar?.title, "Floating character", 60);
  const customPromptMessage = typeof avatar?.message === "string" ? avatar.message.trim().slice(0, 80) : "";
  const characterVariant = getCharacterVariant(avatar?.characterVariant);
  const personality = avatar?.personality || "friendly";
  const personalityBehavior = PERSONALITY_BEHAVIOR[personality] || PERSONALITY_BEHAVIOR.friendly;
  const preset = CHARACTER_PRESETS[characterVariant];
  const colors = preset.colors;
  const animation = preset.animation;

  const messagePool = useMemo(() => {
    return customPromptMessage ? [customPromptMessage, ...preset.messages] : preset.messages;
  }, [customPromptMessage, preset.messages]);

  const introMessage = useMemo(() => {
    const characterLabel = preset.label.replace(" character", "");
    return `Hi, I’m the ${personalityBehavior.label.toLowerCase()} ${characterLabel}. I’ll point out the portfolio bits, with only a medically safe amount of sarcasm.`;
  }, [personalityBehavior.label, preset.label]);

  const idleMouths = useMemo<MouthExpression[]>(() => {
    return personalityBehavior.mouths || animation.idleMouths;
  }, [animation.idleMouths, personalityBehavior.mouths]);

  useEffect(() => {
    const unsub = scrollY.on("change", (value: number) => {
      if (value < 200 && !isDraggingRef.current) {
        const step = () => {
          const k = 0.15;
          const nextX = dragX.get() * (1 - k);
          const nextY = dragY.get() * (1 - k);
          dragX.set(Math.abs(nextX) < 0.5 ? 0 : nextX);
          dragY.set(Math.abs(nextY) < 0.5 ? 0 : nextY);
          if (Math.abs(nextX) >= 0.5 || Math.abs(nextY) >= 0.5) {
            snapFrame.current = requestAnimationFrame(step);
          } else {
            snapFrame.current = null;
          }
        };
        if (!snapFrame.current) snapFrame.current = requestAnimationFrame(step);
      }
    });
    return () => {
      unsub();
      if (snapFrame.current) cancelAnimationFrame(snapFrame.current);
    };
  }, [scrollY, dragX, dragY]);

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
      if (typewriterTimer.current) clearTimeout(typewriterTimer.current);
      if (snapFrame.current) cancelAnimationFrame(snapFrame.current);
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

  // Speech bubble: introduces the selected character on the first screen, then rotates through the CMS message + built-in portfolio lines.
  useEffect(() => {
    if (prefersReduced) return;

    const finishTalking = () => {
      setIsTypingPrompt(false);
      setMouth("smile");
      idleEyeX.set(0);
      idleEyeY.set(0);
      if (talkTimer.current) clearTimeout(talkTimer.current);
      talkTimer.current = setTimeout(() => setMouth("neutral"), 900);
    };

    const speak = (message: string) => {
      if (typewriterTimer.current) clearTimeout(typewriterTimer.current);
      if (talkTimer.current) clearTimeout(talkTimer.current);

      setCurrentPromptMessage(message);
      setTypedPromptMessage("");
      setShowDragPrompt(true);
      setIsTypingPrompt(true);

      // Make the character visibly "say" the line instead of the text feeling detached.
      setMouth("talking");
      idleEyeX.set(-3);
      idleEyeY.set(-4);

      const chars = Array.from(message);
      const typeSpeed = personality === "playful" ? 18 : personality === "calm" ? 36 : personality === "professional" ? 28 : 24;
      let index = 0;

      const typeNext = () => {
        index += 1;
        setTypedPromptMessage(chars.slice(0, index).join(""));

        // Keep the mouth moving while the line types, with tiny pauses that feel like speech.
        setMouth(index % 5 === 0 ? "smile" : "talking");

        if (index < chars.length) {
          typewriterTimer.current = setTimeout(typeNext, chars[index - 1] === "," || chars[index - 1] === "." ? typeSpeed * 5 : typeSpeed);
          return;
        }

        finishTalking();
      };

      typewriterTimer.current = setTimeout(typeNext, 120);
    };

    const pickMessage = () => {
      const pool = messagePool.length ? messagePool : [introMessage];
      const next = pool[Math.floor(Math.random() * pool.length)] || introMessage;
      speak(next);

      const [minDelay, maxDelay] = personalityBehavior.messageEvery;
      promptTimer.current = setTimeout(pickMessage, minDelay + Math.random() * (maxDelay - minDelay));
    };

    promptTimer.current = setTimeout(() => {
      speak(introMessage);
      const [minDelay, maxDelay] = personalityBehavior.messageEvery;
      promptTimer.current = setTimeout(pickMessage, Math.max(5200, minDelay * 0.7) + Math.random() * Math.min(2400, maxDelay - minDelay));
    }, 320);

    return () => {
      if (promptTimer.current) clearTimeout(promptTimer.current);
      if (typewriterTimer.current) clearTimeout(typewriterTimer.current);
    };
  }, [idleEyeX, idleEyeY, introMessage, messagePool, personality, personalityBehavior.messageEvery, prefersReduced]);

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

  // Keep the speech bubble on the side with available viewport space.
  useEffect(() => {
    const updateSpeechPlacement = () => {
      const rect = avatarRef.current?.getBoundingClientRect();
      if (!rect || typeof window === "undefined") return;
      const avatarCenter = rect.left + rect.width / 2;
      setSpeechPlacement(avatarCenter < window.innerWidth * 0.48 ? "right" : "left");
    };

    updateSpeechPlacement();
    window.addEventListener("resize", updateSpeechPlacement);
    const unsubscribeX = dragX.on("change", updateSpeechPlacement);
    const unsubscribeY = dragY.on("change", updateSpeechPlacement);
    const unsubscribeScroll = scrollY.on("change", updateSpeechPlacement);

    return () => {
      window.removeEventListener("resize", updateSpeechPlacement);
      unsubscribeX();
      unsubscribeY();
      unsubscribeScroll();
    };
  }, [dragX, dragY, scrollY]);

  // Compute drag constraints based on viewport and avatar size
  useEffect(() => {
    const compute = () => {
      const padding = 12;
      const rect = avatarRef.current?.getBoundingClientRect();
      const width = rect?.width ?? 180;
      const height = rect?.height ?? 220;
      const vw = window.innerWidth || 0;
      const vh = window.innerHeight || 0;
      const left = -(vw - width - padding * 2);
      const right = padding;
      const top = -(vh - height - padding * 2);
      const bottom = padding;
      setDragConstraints({ left, right, top, bottom });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

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

  const speechBubbleClassName = `absolute top-4 z-[60] w-64 max-w-[72vw] rounded-2xl border border-primary-accent/35 bg-bg-card/95 px-4 py-3 text-sm leading-snug text-text-primary shadow-2xl shadow-primary-accent/10 backdrop-blur-md sm:top-7 sm:w-72 ${
    speechPlacement === "right"
      ? "left-[calc(100%-0.35rem)] before:absolute before:left-[-0.45rem] before:top-10 before:h-4 before:w-4 before:rotate-45 before:border-b before:border-l before:border-primary-accent/35 before:bg-bg-card/95"
      : "right-[calc(100%-0.35rem)] before:absolute before:right-[-0.45rem] before:top-10 before:h-4 before:w-4 before:rotate-45 before:border-r before:border-t before:border-primary-accent/35 before:bg-bg-card/95"
  }`;

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
      initial={{ opacity: 0, scale: 0.35, y: 96, rotate: -12 }}
      animate={{ opacity: visible ? 1 : 0, scale: 1, y: 0, rotate: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 18, mass: 0.9, delay: 0.05 }}
      style={{
        x: dragX,
        y: combinedY,
        scale: floatScale,
      }}
      ref={avatarRef}
      className="fixed bottom-5 right-3 sm:bottom-8 sm:right-8 z-50 pointer-events-auto select-none"
      aria-hidden
      drag={unlocked}
      dragMomentum={false}
      dragElastic={0.12}
      dragConstraints={dragConstraints}
      onDragStart={() => {
        setShowDragPrompt(false);
        setMouth("smile");
        setIsUserIdle(false);
        isDraggingRef.current = true;
      }}
      onDragEnd={() => {
        setMouth("smile");
        isDraggingRef.current = false;
      }}
    >
      {showDragPrompt && unlocked && (
        <motion.div
          key={currentPromptMessage}
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className={speechBubbleClassName}
        >
          <span className="mb-1 flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-secondary">
            <span>{preset.label.replace(" character", "")}</span>
            <span className="flex items-center gap-1.5 rounded-full border border-primary-accent/30 px-2 py-0.5 tracking-[0.08em]">
              <span className={isTypingPrompt ? "h-1.5 w-1.5 rounded-full bg-primary-accent animate-pulse" : "h-1.5 w-1.5 rounded-full bg-text-secondary/60"} />
              {personalityBehavior.label}
            </span>
          </span>
          <span className="block min-h-[2.5rem] pr-1">
            {typedPromptMessage || currentPromptMessage.slice(0, 1)}
            {isTypingPrompt && <span className="ml-0.5 inline-block h-4 w-1 translate-y-0.5 animate-pulse rounded-full bg-primary-accent" />}
          </span>
        </motion.div>
      )}
      {popupItem && (
        <motion.div
          key={popupItem}
          initial={{ opacity: 0, y: 12, scale: 0.72, rotate: -8 }}
          animate={{ opacity: 1, y: -30, scale: 1, rotate: 5 }}
          exit={{ opacity: 0, y: -46, scale: 0.8 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="absolute top-8 -left-2 z-40 grid h-10 w-10 place-items-center rounded-full border border-border-light bg-bg-card/90 text-lg shadow-lg"
        >
          <span aria-hidden>{POPUP_ITEM_LABELS[popupItem]}</span>
        </motion.div>
      )}
      <motion.div
        whileHover={{ scale: 1.02 }}
        style={{ y: idleY }}
        className="relative z-10 drop-shadow-[0_10px_25px_rgba(0,0,0,0.25)] pointer-events-auto"
        onClick={triggerTalk}
      >
        {cmsAvatarUrl ? (
          // Render CMS-uploaded SVG/image as an external image instead of injecting SVG markup.
          // This keeps the CMS override safe while preserving the draggable floating behavior.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cmsAvatarUrl}
            alt={cmsAvatarTitle}
            className="w-36 h-auto sm:w-40 max-h-[220px] object-contain"
            draggable={false}
          />
        ) : (
        <svg width="180" height="220" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className="w-36 h-auto sm:w-40">
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
        initial={{ opacity: 0, y: 14, scale: 0.7 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.42 }}
        className="pointer-events-none relative z-20 -mt-3 ml-auto mr-1 w-fit rounded-full border border-primary-accent/30 bg-bg-card/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-secondary shadow-lg shadow-primary-accent/10 backdrop-blur-md"
      >
        <span className="text-primary-accent">{preset.label.replace(" character", "")}</span> · {personalityBehavior.label}
      </motion.div>
    </motion.div>
  );
}
