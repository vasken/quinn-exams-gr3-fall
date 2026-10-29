import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { PageLoading } from "@/components/page-loading";
import { TopicList } from "@/components/topic-list";
import { getSubject, subjects } from "@/content";

export function generateStaticParams() {
  return subjects.map((s) => ({ subject: s.slug }));
}

export async function generateMetadata(props: PageProps<"/[subject]">) {
  const { subject } = await props.params;
  return { title: `${getSubject(subject)?.title ?? "Subject"} · Study Buddy` };
}

export default function SubjectPage(props: PageProps<"/[subject]">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Subject params={props.params} />
    </Suspense>
  );
}

async function Subject({ params }: Pick<PageProps<"/[subject]">, "params">) {
  const subject = getSubject((await params).subject);
  if (!subject) notFound();
  return (
    <>
      <AppHeader back={{ href: "/", label: "home" }} title={subject.title} />
      <main className="pad-safe mx-auto w-full max-w-5xl pt-5">
        <TopicList subjectSlug={subject.slug} />
      </main>
    </>
  );
}
