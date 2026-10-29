import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { PageLoading } from "@/components/page-loading";
import { TopicPractice } from "@/components/practice-pages";
import { getTopic, subjects } from "@/content";

export function generateStaticParams() {
  return subjects.flatMap((s) => s.topics.map((t) => ({ subject: s.slug, topic: t.slug })));
}

export async function generateMetadata(props: PageProps<"/[subject]/[topic]/practice">) {
  const { subject, topic } = await props.params;
  return { title: `Practise ${getTopic(subject, topic)?.topic.title ?? ""} · Study Buddy` };
}

export default function TopicPracticePage(props: PageProps<"/[subject]/[topic]/practice">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Practice params={props.params} />
    </Suspense>
  );
}

async function Practice({ params }: Pick<PageProps<"/[subject]/[topic]/practice">, "params">) {
  const p = await params;
  const found = getTopic(p.subject, p.topic);
  if (!found) notFound();
  const { subject, topic } = found;
  return (
    <>
      <AppHeader back={{ href: `/${subject.slug}`, label: subject.title }} title={topic.title} />
      <main className="pad-safe mx-auto w-full max-w-5xl pt-5">
        <TopicPractice subject={subject.slug} topic={topic.slug} />
      </main>
    </>
  );
}
