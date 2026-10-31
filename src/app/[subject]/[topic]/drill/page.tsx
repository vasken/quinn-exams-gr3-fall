import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { NoteDrill } from "@/components/note-drill";
import { PageLoading } from "@/components/page-loading";
import { getTopic, subjects } from "@/content";

export function generateStaticParams() {
  return subjects.flatMap((s) => s.topics.filter((t) => t.drill).map((t) => ({ subject: s.slug, topic: t.slug })));
}

export async function generateMetadata(props: PageProps<"/[subject]/[topic]/drill">) {
  const { subject, topic } = await props.params;
  return { title: `Speed test: ${getTopic(subject, topic)?.topic.title ?? ""} · Study Buddy` };
}

export default function DrillPage(props: PageProps<"/[subject]/[topic]/drill">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Drill params={props.params} />
    </Suspense>
  );
}

async function Drill({ params }: Pick<PageProps<"/[subject]/[topic]/drill">, "params">) {
  const p = await params;
  const found = getTopic(p.subject, p.topic);
  if (!found?.topic.drill) notFound();
  const { subject, topic } = found;
  return (
    <>
      <AppHeader back={{ href: `/${subject.slug}`, label: subject.title }} title="Speed Test" />
      <main className="pad-safe mx-auto w-full max-w-5xl pt-5">
        <NoteDrill drillKey={`${subject.slug}/${topic.slug}`} backHref={`/${subject.slug}`} />
      </main>
    </>
  );
}
