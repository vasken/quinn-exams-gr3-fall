import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { secondaryButton } from "./button-styles";
import { SettingsChip } from "./settings";

export function AppHeader({ back, title }: { back?: { href: string; label: string }; title: string }) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="pad-safe mx-auto flex max-w-5xl items-center gap-3 !pb-3 pt-3">
        {back && (
          <Link href={back.href} aria-label={`Back to ${back.label}`} className={cn(secondaryButton, "size-12 min-h-12 shrink-0 px-0")}>
            <ChevronLeft className="size-7" />
          </Link>
        )}
        <h1 className="min-w-0 flex-1 truncate text-xl font-bold sm:text-2xl">{title}</h1>
        <SettingsChip />
      </div>
    </header>
  );
}
