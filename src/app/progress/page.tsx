import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header";
import { ProgressTable } from "@/components/progress-table";

export const metadata: Metadata = { title: "My Stars · Study Buddy" };

export default function ProgressPage() {
  return (
    <>
      <AppHeader back={{ href: "/", label: "home" }} title="My Stars" />
      <main className="pad-safe mx-auto w-full max-w-4xl pt-5">
        <ProgressTable />
      </main>
    </>
  );
}
