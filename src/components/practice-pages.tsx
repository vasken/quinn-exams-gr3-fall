"use client";

// Topics hold functions (math generators), so they are looked up on the client
// instead of being passed down from server pages.
import { PracticeSession } from "@/components/practice-session";
import { getSubject, getTopic, subjects, topicKey } from "@/content";

export function TopicPractice({ subject, topic }: { subject: string; topic: string }) {
  const found = getTopic(subject, topic)!;
  return (
    <PracticeSession
      topics={[found.topic]}
      progressKey={topicKey(found.subject, found.topic)}
      backHref={`/${subject}`}
      learnHref={`/${subject}/${topic}`}
    />
  );
}

export function SubjectPractice({ subject }: { subject: string }) {
  const s = getSubject(subject)!;
  return <PracticeSession topics={s.topics} progressKey={`${s.slug}/*`} backHref={`/${s.slug}`} />;
}

export function MixedQuiz() {
  return <PracticeSession topics={subjects.flatMap((s) => s.topics)} progressKey="quiz" backHref="/" countScale={2} />;
}
