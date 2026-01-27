"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useReducedMotion,
} from "framer-motion";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export type MouthExpression = "neutral" | "smile" | "surprised" | "sad" | "talking";
type MoodDetail = { expression: MouthExpression; duration?: number };

export default function FloatingAvatar() {
  const prefersReduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const [mouth, setMouth] = useState<MouthExpression>("neutral");
  const [visible, setVisible] = useState(false);

  const frameReq = useRef<number | null>(null);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);
  const talkTimer = useRef<NodeJS.Timeout | null>(null);
  const bobFrame = useRef<number | null>(null);
  const idleTimeout = useRef<NodeJS.Timeout | null>(null);
  const swayFrame = useRef<number | null>(null);
  const blinkTimer = useRef<NodeJS.Timeout | null>(null);
  const eyeDriftTimer = useRef<NodeJS.Timeout | null>(null);
  const promptTimer = useRef<NodeJS.Timeout | null>(null);

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
  const floatScale = useTransform(scrollY, [0, 400], [0.94, 1]);
  const floatOpacity = useTransform(scrollY, [0, 120], [0, 1]);
  const combinedY = useTransform([floatY, dragY], ([a, b]) => a + b);

  const pupilX = useSpring(mouseX, { stiffness: 120, damping: 16 });
  const pupilY = useSpring(mouseY, { stiffness: 120, damping: 16 });
  const pupilScaleSpring = useSpring(pupilScale, { stiffness: 320, damping: 22 });
  const eyeX = useTransform([pupilX, idleEyeX], ([a, b]) => a + b);
  const eyeY = useTransform([pupilY, idleEyeY], ([a, b]) => a + b);
  const headTilt = useTransform(mouseX, [-10, 10], [5, -5]);
  const headRotation = useTransform([headTilt, idleSway], ([a, b]) => a + b);
  const [isUserIdle, setIsUserIdle] = useState(false);
  const [unlocked] = useState(true);
  const [showDragPrompt, setShowDragPrompt] = useState(false);

  useEffect(() => {
    const unsub = scrollY.on("change", (value) => {
      setActive(value > 120);
      setVisible(true);
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
    const handler = (e: MouseEvent) => {
      targetX.current = e.clientX;
      targetY.current = e.clientY;
      if (frameReq.current) return;
      frameReq.current = window.requestAnimationFrame(() => {
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
    window.addEventListener("mousemove", handler);
    const activity = () => {
      setIsUserIdle(false);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      idleTimeout.current = setTimeout(() => setIsUserIdle(true), 3000);
    };
    window.addEventListener("mousemove", activity);
    activity();
    return () => {
      window.removeEventListener("mousemove", handler);
      window.removeEventListener("mousemove", activity);
      if (frameReq.current) cancelAnimationFrame(frameReq.current);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      if (blinkTimer.current) clearTimeout(blinkTimer.current);
      if (promptTimer.current) clearTimeout(promptTimer.current);
      if (snapFrame.current) cancelAnimationFrame(snapFrame.current);
    };
  }, [mouseX, mouseY, prefersReduced]);

  useEffect(() => {
    if (!active || prefersReduced) return;
    const mouths: MouthExpression[] = ["neutral", "smile", "surprised", "sad"];
    const schedule = () => {
      idleTimer.current = setTimeout(() => {
        const pick = mouths[Math.floor(Math.random() * mouths.length)];
        setMouth(pick);
        setTimeout(() => setMouth("neutral"), 1200);
        schedule();
      }, 5200 + Math.random() * 3000);
    };
    schedule();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [active, prefersReduced]);

  // Subtle idle bob
  useEffect(() => {
    if (prefersReduced) return;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const t = (ts - start) / 1000;
      idleY.set(Math.sin(t * 1.2) * 2.2);
      bobFrame.current = requestAnimationFrame(tick);
    };
    bobFrame.current = requestAnimationFrame(tick);
    return () => {
      if (bobFrame.current) cancelAnimationFrame(bobFrame.current);
    };
  }, [idleY, prefersReduced]);

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
      idleSway.set(Math.sin(t * 1.1) * 4); // gentle +/-4 deg
      swayFrame.current = requestAnimationFrame(tick);
    };
    swayFrame.current = requestAnimationFrame(tick);
    return () => {
      if (swayFrame.current) cancelAnimationFrame(swayFrame.current);
    };
  }, [idleSway, isUserIdle, prefersReduced]);

  // Blink loop
  useEffect(() => {
    if (prefersReduced) return;
    const blink = () => {
      pupilScale.set(0.1);
      setTimeout(() => pupilScale.set(1), 140);
      const next = 2500 + Math.random() * 2500;
      blinkTimer.current = setTimeout(blink, next);
    };
    blinkTimer.current = setTimeout(blink, 2200 + Math.random() * 800);
    return () => {
      if (blinkTimer.current) clearTimeout(blinkTimer.current);
    };
  }, [pupilScale, prefersReduced]);

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
      // pick a new target within a modest radius
      const x = clamp((Math.random() - 0.5) * 12, -8, 8);
      const y = clamp((Math.random() - 0.5) * 10, -6, 6);
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

  // Show drag prompt after a short delay (drag is unlocked immediately)
  useEffect(() => {
    if (prefersReduced) return;
    promptTimer.current = setTimeout(() => setShowDragPrompt(true), 10000);
    return () => {
      if (promptTimer.current) clearTimeout(promptTimer.current);
    };
  }, [prefersReduced]);

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
    setMouth("talking");
    if (talkTimer.current) clearTimeout(talkTimer.current);
    talkTimer.current = setTimeout(() => setMouth("neutral"), 900);
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
      initial={{ opacity: 0, scale: 0.9, y: 24 }}
      animate={{ opacity: visible ? 1 : 0, scale: 1, y: 0 }}
      style={{
        x: dragX,
        y: combinedY,
        scale: floatScale,
        opacity: floatOpacity,
      }}
      ref={avatarRef}
      className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-30 pointer-events-auto select-none"
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
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          className="absolute -top-4 right-0 translate-y-[-100%] bg-bg-card/90 border border-border-light text-sm text-text-primary px-3 py-2 rounded-lg shadow-lg"
        >
          Drag me across the screen!
        </motion.div>
      )}
      <motion.div
        whileHover={{ scale: 1.02 }}
        style={{ y: idleY }}
        className="drop-shadow-[0_10px_25px_rgba(0,0,0,0.25)] pointer-events-auto"
        onClick={triggerTalk}
      >
        <svg width="180" height="220" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className="w-36 h-auto sm:w-40">
          <title>Floating Character</title>
          <g id="body-group">
            <rect id="torso" x="150" y="200" width="100" height="120" rx="20" fill="#4A90E2" />
            <rect id="left-arm" x="120" y="210" width="30" height="80" rx="15" fill="#4A90E2" />
            <rect id="right-arm" x="250" y="210" width="30" height="80" rx="15" fill="#4A90E2" />
            <rect id="left-leg" x="165" y="320" width="30" height="90" rx="15" fill="#357ABD" />
            <rect id="right-leg" x="205" y="320" width="30" height="90" rx="15" fill="#357ABD" />
          </g>

          <motion.g style={{ rotate: headTilt, transformOrigin: "200px 120px", transformBox: "fill-box" }}>
            <g id="head-group">
              <circle id="head" cx="200" cy="120" r="80" fill="#FFD93D" />
            </g>

            <g id="eyes-group">
              <g id="left-eye">
                <circle id="left-eye-white" cx="175" cy="110" r="18" fill="#FFFFFF" />
                <motion.circle
                  id="left-pupil"
                  cx="175"
                  cy="110"
                  r="6"
                  fill="#000000"
                  style={{ translateX: eyeX, translateY: eyeY, scaleY: pupilScaleSpring }}
                />
              </g>
              <g id="right-eye">
                <circle id="right-eye-white" cx="225" cy="110" r="18" fill="#FFFFFF" />
                <motion.circle
                  id="right-pupil"
                  cx="225"
                  cy="110"
                  r="6"
                  fill="#000000"
                  style={{ translateX: eyeX, translateY: eyeY, scaleY: pupilScaleSpring }}
                />
              </g>
            </g>

            <g id="mouth-group">
              <line id="mouth-neutral" x1="180" y1="145" x2="220" y2="145" stroke="#000000" strokeWidth="3" strokeLinecap="round" style={mouthStyles.neutral} />
              <path id="mouth-smile" d="M 180 140 Q 200 155 220 140" stroke="#000000" strokeWidth="3" fill="none" strokeLinecap="round" style={mouthStyles.smile} />
              <circle id="mouth-surprised" cx="200" cy="145" r="12" fill="#000000" style={mouthStyles.surprised} />
              <path id="mouth-sad" d="M 180 150 Q 200 140 220 150" stroke="#000000" strokeWidth="3" fill="none" strokeLinecap="round" style={mouthStyles.sad} />
              <ellipse id="mouth-talking" cx="200" cy="145" rx="15" ry="20" fill="#000000" style={mouthStyles.talking} />
            </g>
          </motion.g>
        </svg>
      </motion.div>
    </motion.div>
  );
}
