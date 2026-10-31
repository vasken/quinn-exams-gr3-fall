"use client";

import { speak } from "@/lib/speech";

/** French words in {braces}: tap to hear them. */
function French({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speak(`{${text}}`);
      }}
      className="inline cursor-pointer text-left font-bold underline decoration-primary/50 decoration-dotted decoration-2 underline-offset-4"
    >
      {text}
    </button>
  );
}

function withFrench(text: string) {
  return text.split(/(\{[^}]+\})/g).map((part, i) => (part.startsWith("{") && part.endsWith("}") ? <French key={i} text={part.slice(1, -1)} /> : part));
}

/** Renders text with **bold** segments, {French} words and line breaks. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i} className="block">
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j} className="font-bold">
                {withFrench(part.slice(2, -2))}
              </strong>
            ) : (
              <span key={j}>{withFrench(part)}</span>
            ),
          )}
        </span>
      ))}
    </>
  );
}

/** Plain text with markup removed (for tiles and buttons). */
export const plain = (text: string) => text.replace(/\*\*/g, "").replace(/[{}]/g, "");
