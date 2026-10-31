import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { LearnCards } from "@/components/learn-cards";
import { PageLoading } from "@/components/page-loading";
import { getTopic, subjects } from "@/content";

export function generateStaticParams() {
  return subjects.flatMap((s) => s.topics.map((t) => ({ subject: s.slug, topic: t.slug })));
}

export async function generateMetadata(props: PageProps<"/[subject]/[topic]">) {
  const { subject, topic } = await props.params;
  return { title: `${getTopic(subject, topic)?.topic.title ?? "Learn"} · Study Buddy` };
}

export default function LearnPage(props: PageProps<"/[subject]/[topic]">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Learn params={props.params} />
    </Suspense>
  );
}

async function Learn({ params }: Pick<PageProps<"/[subject]/[topic]">, "params">) {
  const p = await params;
  const found = getTopic(p.subject, p.topic);
  if (!found) notFound();
  const { subject, topic } = found;
  return (
    <>
      <AppHeader back={{ href: `/${subject.slug}`, label: subject.title }} title={topic.title} />
      <main className="pad-safe mx-auto w-full max-w-3xl pt-5">
        <LearnCards
          cards={topic.learn}
          practiceHref={`/${subject.slug}/${topic.slug}/practice`}
          drillHref={topic.drill ? `/${subject.slug}/${topic.slug}/drill` : undefined}
        />
      </main>
    </>
  );
}
