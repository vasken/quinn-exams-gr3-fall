import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { MixedQuiz } from "@/components/practice-pages";

export const metadata: Metadata = { title: "Mixed Review Quiz · Study Buddy" };

export default function QuizPage() {
  return (
    <>
      <AppHeader back={{ href: "/", label: "home" }} title="Mixed quiz" />
      <main className="pad-safe mx-auto w-full max-w-5xl pt-5">
        <MixedQuiz />
      </main>
    </>
  );
}
