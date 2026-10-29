import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { PageLoading } from "@/components/page-loading";
import { SubjectPractice } from "@/components/practice-pages";
import { getSubject, subjects } from "@/content";

export function generateStaticParams() {
  return subjects.map((s) => ({ subject: s.slug }));
}

export default function SubjectPracticePage(props: PageProps<"/[subject]/practice">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Practice params={props.params} />
    </Suspense>
  );
}

async function Practice({ params }: Pick<PageProps<"/[subject]/practice">, "params">) {
  const subject = getSubject((await params).subject);
  if (!subject) notFound();
  return (
    <>
      <AppHeader back={{ href: `/${subject.slug}`, label: subject.title }} title={`All of ${subject.title}`} />
      <main className="pad-safe mx-auto w-full max-w-5xl pt-5">
        <SubjectPractice subject={subject.slug} />
      </main>
    </>
  );
}
