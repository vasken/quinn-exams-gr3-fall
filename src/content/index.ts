import { coding } from "./coding";
import { faith } from "./faith";
import { french } from "./french";
import { language } from "./language";
import { mandarin } from "./mandarin";
import { maps } from "./maps";
import { math } from "./math";
import { money } from "./money";
import { music } from "./music";
import { phonics } from "./phonics";
import { science } from "./science";
import { social } from "./social";
import type { Subject, Topic } from "./types";

export const subjects: Subject[] = [language, phonics, math, money, coding, social, maps, science, music, french, mandarin, faith];

export function getSubject(slug: string): Subject | undefined {
  return subjects.find((s) => s.slug === slug);
}

export function getTopic(subjectSlug: string, topicSlug: string): { subject: Subject; topic: Topic } | undefined {
  const subject = getSubject(subjectSlug);
  const topic = subject?.topics.find((t) => t.slug === topicSlug);
  return subject && topic ? { subject, topic } : undefined;
}

export const topicKey = (subject: Subject, topic: Topic) => `${subject.slug}/${topic.slug}`;
