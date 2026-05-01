"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  language: "en" | "hi";
  currentValue: string;
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionResultEvent {
  resultIndex: number;
  results: { 0: { transcript: string }; isFinal: boolean; length: number }[] & {
    length: number;
  };
}

export default function VoiceInput({ language, currentValue, onTranscript, disabled }: Props) {
  const [supported, setSupported] = useState(false);
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const baseRef = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (Ctor) setSupported(true);
  }, []);

  function start(currentText: string) {
    if (typeof window === "undefined") return;
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) return;
    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = language === "hi" ? "hi-IN" : "en-IN";
    baseRef.current = currentText ? currentText + " " : "";

    rec.onresult = (e) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const transcript = res[0].transcript;
        if (res.isFinal) final += transcript;
        else interim += transcript;
      }
      onTranscript((baseRef.current + final + interim).trim());
      if (final) baseRef.current = baseRef.current + final + " ";
    };
    rec.onerror = () => setRecording(false);
    rec.onend = () => setRecording(false);

    recognitionRef.current = rec;
    rec.start();
    setRecording(true);
  }

  function stop() {
    recognitionRef.current?.stop();
    setRecording(false);
  }

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={() => {
        if (recording) stop();
        else start(currentValue);
      }}
      disabled={disabled}
      title={recording ? "Stop recording" : "Start voice input"}
      className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-colors cursor-pointer disabled:opacity-40 ${
        recording
          ? "bg-legal-red/15 border-legal-red/40 text-legal-red animate-pulse"
          : "bg-white/[0.04] border-white/[0.08] hover:border-gold-500/40 text-ivory/60 hover:text-gold-400"
      }`}
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
        <path d="M19 10v2a7 7 0 01-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    </button>
  );
}
