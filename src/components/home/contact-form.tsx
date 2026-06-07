"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { FaEnvelope, FaSpinner } from "react-icons/fa";

type Status = "idle" | "sending" | "success" | "error";

interface ContactFormProps {
  ctaLabel: string;
  recipientName?: string;
  onMoodChange?: (mood: "smile" | "neutral" | "talking") => void;
}

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export default function ContactForm({ ctaLabel, recipientName, onMoodChange }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current || status === "sending") return;

    if (!isConfigured) {
      setStatus("error");
      setErrorMessage("Email service is not configured yet. Please email me directly.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");
    onMoodChange?.("talking");

    try {
      await emailjs.sendForm(
        SERVICE_ID as string,
        TEMPLATE_ID as string,
        formRef.current,
        { publicKey: PUBLIC_KEY as string }
      );
      setStatus("success");
      formRef.current.reset();
      onMoodChange?.("smile");
    } catch (error) {
      console.error("EmailJS send failed:", error);
      setStatus("error");
      setErrorMessage("Something went wrong sending your message. Please try again or email me directly.");
      onMoodChange?.("neutral");
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {recipientName && <input type="hidden" name="to_name" value={recipientName} />}
      <div className="space-y-1">
        <label htmlFor="contact-name" className="text-xs uppercase tracking-wider text-primary-accent font-semibold">
          Name
        </label>
        <input
          id="contact-name"
          name="from_name"
          type="text"
          required
          autoComplete="name"
          placeholder="Your name"
          className="w-full rounded-xl border border-border-light bg-surface-raised px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/30 transition-all"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="contact-email" className="text-xs uppercase tracking-wider text-primary-accent font-semibold">
          Email
        </label>
        <input
          id="contact-email"
          name="reply_to"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-xl border border-border-light bg-surface-raised px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/30 transition-all"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="contact-message" className="text-xs uppercase tracking-wider text-primary-accent font-semibold">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          placeholder="Tell me about your project, goal, and timeline."
          className="w-full resize-y rounded-xl border border-border-light bg-surface-raised px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/30 transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        onMouseEnter={() => onMoodChange?.("smile")}
        onMouseLeave={() => onMoodChange?.("neutral")}
        className="w-full px-8 py-4 bg-gradient-to-r from-primary-accent to-button-gradient-to text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-accent/40 transition-all duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {status === "sending" ? (
          <>
            <FaSpinner className="animate-spin" /> Sending…
          </>
        ) : (
          <>
            <FaEnvelope /> {ctaLabel}
          </>
        )}
      </button>

      <div aria-live="polite" className="min-h-[1.25rem]">
        {status === "success" && (
          <p className="text-sm font-medium text-secondary-accent">
            Thanks! Your message has been sent — I&apos;ll reply by email soon.
          </p>
        )}
        {status === "error" && (
          <p className="text-sm font-medium text-red-400">{errorMessage}</p>
        )}
      </div>
    </form>
  );
}
