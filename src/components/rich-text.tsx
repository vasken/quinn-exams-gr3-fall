"use client";

import { pinyinOf, ZH_RUN } from "@/lib/mandarin";
import { speak } from "@/lib/speech";

const tappable = "inline cursor-pointer text-left font-bold underline decoration-primary/50 decoration-dotted decoration-2 underline-offset-4";

/** French words in {braces}: tap to hear them. */
function French({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speak(`{${text}}`);
      }}
      className={tappable}
    >
      {text}
    </button>
  );
}

/** Chinese characters, with pinyin above them if asked. */
export function Hanzi({ text, pinyin }: { text: string; pinyin?: boolean }) {
  if (!pinyin) return <span lang="zh-CN">{text}</span>;
  return (
    <span lang="zh-CN">
      {pinyinOf(text).map(({ ch, py }, i) =>
        py ? (
          <ruby key={i} className="mx-[0.08em]">
            {ch}
            <rt className="text-[0.6em] font-normal text-muted-foreground">{py}</rt>
          </ruby>
        ) : (
          ch
        ),
      )}
    </span>
  );
}

/** Chinese: tap to hear it. */
function Chinese({ text, pinyin }: { text: string; pinyin?: boolean }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      className={tappable}
    >
      <Hanzi text={text} pinyin={pinyin} />
    </button>
  );
}

const TOKENS = new RegExp(`(\\{[^}]+\\}|\\[\\[[^\\]]+\\]\\]|${ZH_RUN.source.slice(1, -1)})`, "gu");

function inline(text: string, pinyin?: boolean) {
  return text.split(TOKENS).map((part, i) => {
    if (i % 2 === 0) return part;
    if (part.startsWith("{")) return <French key={i} text={part.slice(1, -1)} />;
    if (part.startsWith("[[")) return <span key={i} className="font-normal italic">{part.slice(2, -2)}</span>;
    return <Chinese key={i} text={part} pinyin={pinyin} />;
  });
}

/**
 * Renders text with **bold** segments, {French} and Chinese you can tap to hear, [[pinyin]] and line breaks.
 * With `pinyin`, Chinese characters get their pinyin above them.
 */
export function RichText({ text, pinyin }: { text: string; pinyin?: boolean }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i} className="block">
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j} className="font-bold">
                {inline(part.slice(2, -2), pinyin)}
              </strong>
            ) : (
              <span key={j}>{inline(part, pinyin)}</span>
            ),
          )}
        </span>
      ))}
    </>
  );
}

/** Plain text with markup removed (for tiles and buttons). */
export const plain = (text: string) => text.replace(/\*\*/g, "").replace(/[{}]/g, "").replace(/\[\[|\]\]/g, "");
