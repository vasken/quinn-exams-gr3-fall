"use client";

let voice: SpeechSynthesisVoice | null | undefined;

function pickVoice() {
  if (voice !== undefined) return voice;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null; // not loaded yet; try again next time
  voice =
    voices.find((v) => v.lang === "en-CA") ??
    voices.find((v) => v.lang === "en-US" && /samantha|google/i.test(v.name)) ??
    voices.find((v) => v.lang.startsWith("en")) ??
    null;
  return voice;
}

export function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Strip emoji, markdown and blanks so the voice reads cleanly. */
export function speakable(text: string) {
  return text
    .replace(/\*\*/g, "")
    .replace(/_{2,}/g, " blank ")
    .replace(/\p{Extended_Pictographic}|️/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function speak(text: string) {
  if (!canSpeak()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(speakable(text));
  const v = pickVoice();
  if (v) u.voice = v;
  u.lang = v?.lang ?? "en-CA";
  u.rate = 0.9;
  synth.speak(u);
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}
