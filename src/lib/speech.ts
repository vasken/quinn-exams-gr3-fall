"use client";

import { audioUrl } from "./audio";
import { ZH_RUN } from "./mandarin";

export type Lang = "en" | "fr" | "zh";

const voices: Partial<Record<Lang, SpeechSynthesisVoice | null>> = {};

/** Apple's joke and robot voices (listed in every language on recent Macs and iPads). */
const NOVELTY = /eloquence|\b(eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley|albert|bahh|bells|boing|bubbles|cellos|jester|organ|superstar|trinoids|whisper|wobble|zarvox|bad news|good news)\b/i;
/** Natural-sounding voices that are known to be good. */
const GOOD: Record<Lang, RegExp> = {
  fr: /am[ée]lie|thomas|chantal|audrey|aur[ée]lie|marie|google fran/i,
  en: /samantha|ava|allison|susan|karen|daniel|google/i,
  zh: /tingting|ting-ting|lili|yu-shu|google 普通话|google.*chinese/i,
};
/** Each language's preferred accent: Canadian English and French, mainland Mandarin. */
const REGION: Record<Lang, string> = { en: "ca", fr: "ca", zh: "cn" };

/** Higher is better. Prefers downloaded high-quality voices, then well-known voices, then the local accent. */
export function scoreVoice(v: Pick<SpeechSynthesisVoice, "name" | "lang" | "voiceURI">, lang: Lang) {
  const code = v.lang.replace("_", "-").toLowerCase();
  if (!code.startsWith(lang) && !(lang === "zh" && code.startsWith("cmn"))) return -Infinity;
  const id = `${v.name} ${v.voiceURI}`;
  // Hong Kong voices speak Cantonese, not Mandarin.
  if (lang === "zh" && (/-hk|yue/.test(code) || /cantonese|sinji/i.test(id))) return -Infinity;
  let score = 0;
  if (NOVELTY.test(id)) score -= 100;
  if (/premium/i.test(id)) score += 8;
  else if (/enhanced|neural|natural/i.test(id)) score += 6;
  else if (/compact/i.test(id)) score -= 2;
  if (GOOD[lang].test(id)) score += 4;
  if (code === `${lang}-${REGION[lang]}`) score += 2;
  return score;
}

function pickVoice(lang: Lang) {
  if (voices[lang] !== undefined) return voices[lang];
  const all = window.speechSynthesis.getVoices();
  if (!all.length) return null; // not loaded yet; try again next time
  const ranked = all.map((v) => ({ v, s: scoreVoice(v, lang) })).filter((x) => x.s > -Infinity);
  ranked.sort((a, b) => b.s - a.s);
  voices[lang] = ranked[0]?.v ?? null;
  return voices[lang];
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  // Ask now so Chrome starts loading its voices before the first tap.
  window.speechSynthesis.getVoices();
  // Voices can arrive late or change (e.g. after downloading one): pick again.
  window.speechSynthesis.addEventListener?.("voiceschanged", () => {
    for (const k of Object.keys(voices)) delete voices[k as Lang];
  });
}

export function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Strip emoji, markdown, French markers and blanks so the voice reads cleanly. */
export function speakable(text: string, lang: Lang = "en") {
  if (lang === "zh") {
    // A fill-in blank is read as a short pause.
    return text.replace(/（?_{2,}）?/g, "，").replace(/[（）]/g, "").replace(/\s+/g, "").replace(/^，+|，+(?=[，。？！]|$)/g, "");
  }
  return text
    .replace(/\*\*/g, "")
    .replace(/[{}]/g, "")
    .replace(/\[\[[^\]]*\]\]/g, " ")
    .replace(/_{2,}/g, lang === "fr" ? ", " : " blank ")
    .replace(/\p{Extended_Pictographic}|️/gu, "")
    .replace(/\s+/g, " ")
    .replace(/([.!?…:])\s*\.(?!\.)/g, "$1")
    .trim();
}

/**
 * Split text into English, French and Mandarin parts. French is wrapped in {braces}; Chinese characters
 * are found on their own. [[Pinyin]] is only for reading on screen, so it is left out.
 */
export function speechParts(text: string): { lang: Lang; text: string }[] {
  return text
    .split(/(\{[^}]+\})/g)
    .flatMap((part): { lang: Lang; text: string }[] => {
      if (part.startsWith("{") && part.endsWith("}")) return [{ lang: "fr" as const, text: speakable(part, "fr") }];
      return part
        .replace(/\[\[[^\]]*\]\]/g, " ")
        .split(ZH_RUN)
        .map((p, i) => (i % 2 ? { lang: "zh" as const, text: speakable(p, "zh") } : { lang: "en" as const, text: speakable(p) }));
    })
    .filter((p) => /[\p{L}\p{N}]/u.test(p.text));
}

/** Bumped on every speak/stop, so a reading that was replaced stops. */
let ticket = 0;
let player: HTMLAudioElement | null = null;
let unlocked = false;
/** Chrome can drop `end` events for utterances that get garbage-collected, so hold on to them. */
const live = new Set<SpeechSynthesisUtterance>();

/**
 * Reads text aloud: English with the browser voice, French and Mandarin from the recordings in public/fr/
 * and public/zh/ (browser voices for them are unreliable: some browsers read them with the English voice).
 */
export function speak(text: string) {
  if (!canSpeak()) return;
  stopSpeaking();
  const mine = ticket;
  const parts = speechParts(text).map((p) => ({ ...p, url: p.lang === "en" ? null : audioUrl(p.text, p.lang) }));
  // iPads only allow audio started by a tap, so start the player now even if English comes first.
  const firstClip = parts.find((p) => p.url)?.url;
  const ready = Promise.all([firstClip ? unlock(firstClip) : null, parts.some((p) => !p.url) ? voicesReady() : null]);
  void ready.then(async () => {
    for (const part of parts) {
      if (mine !== ticket) return;
      if (part.url && (await playClip(part.url))) continue;
      if (mine !== ticket) return;
      await utter(part.text, part.lang);
    }
  });
}

function getPlayer() {
  player ??= new Audio();
  return player;
}

async function unlock(url: string) {
  if (unlocked) return;
  const el = getPlayer();
  el.src = url;
  el.muted = true;
  try {
    await el.play();
    el.pause();
    unlocked = true;
  } catch {
    // Not allowed yet: the clip will fall back to the browser voice.
  }
  el.muted = false;
}

/** Plays a recording to the end. False if it could not play. */
function playClip(url: string): Promise<boolean> {
  const el = getPlayer();
  return new Promise((resolve) => {
    const done = (ok: boolean) => {
      el.onended = el.onerror = el.onpause = null;
      resolve(ok);
    };
    el.onended = () => done(true);
    el.onpause = () => done(true); // stopped by stopSpeaking()
    el.onerror = () => done(false);
    el.src = url;
    el.currentTime = 0;
    el.play().catch(() => done(false));
  });
}

/** Chrome loads its voices only when first asked; without them it reads in the default voice. */
function voicesReady(): Promise<void> {
  const synth = window.speechSynthesis;
  if (synth.getVoices().length) return Promise.resolve();
  return new Promise((resolve) => {
    const go = () => {
      synth.removeEventListener("voiceschanged", go);
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(go, 1500);
    synth.addEventListener("voiceschanged", go);
  });
}

function utter(text: string, lang: Lang): Promise<void> {
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice(lang);
    if (v) u.voice = v;
    u.lang = v?.lang ?? { en: "en-CA", fr: "fr-CA", zh: "zh-CN" }[lang];
    u.rate = lang === "en" ? 0.9 : 0.8;
    // Safety net in case the browser never reports the end.
    const timer = setTimeout(() => resolve(), 4000 + text.length * 150);
    u.onend = u.onerror = () => {
      clearTimeout(timer);
      live.delete(u);
      resolve();
    };
    live.add(u);
    window.speechSynthesis.speak(u);
  });
}

export function stopSpeaking() {
  ticket++;
  if (!canSpeak()) return;
  window.speechSynthesis.cancel();
  live.clear();
  player?.pause();
}
