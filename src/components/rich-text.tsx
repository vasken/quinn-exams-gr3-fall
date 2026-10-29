/** Renders text with **bold** segments and line breaks. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i} className="block">
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j} className="font-bold">
                {part.slice(2, -2)}
              </strong>
            ) : (
              part
            ),
          )}
        </span>
      ))}
    </>
  );
}
