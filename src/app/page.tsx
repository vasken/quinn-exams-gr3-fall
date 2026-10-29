import Link from "next/link";
import { Shuffle, Star } from "lucide-react";
import { primaryButton, secondaryButton } from "@/components/button-styles";
import { SettingsBar } from "@/components/settings";
import { Sisters } from "@/components/sisters";
import { SubjectGrid } from "@/components/subject-grid";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="pad-safe mx-auto w-full max-w-4xl pt-[max(1.25rem,env(safe-area-inset-top))]">
      <section aria-label="Settings" className="mb-6 rounded-2xl border bg-white px-3 py-2">
        <SettingsBar />
      </section>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-end gap-3">
          <Sisters className="h-24" />
          <h1 className="text-3xl font-bold">Subjects</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/progress" className={cn(secondaryButton, "min-h-12")}>
            <Star className="size-5 fill-highlight text-amber-500" /> My stars
          </Link>
          <Link href="/quiz" className={cn(primaryButton, "min-h-12")}>
            <Shuffle className="size-5" /> Mixed quiz
          </Link>
        </div>
      </div>

      <SubjectGrid />
    </main>
  );
}
