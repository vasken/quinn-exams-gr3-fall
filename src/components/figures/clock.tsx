/** A clock face showing o'clock or half past. */
export function Clock({ hour, half }: { hour: number; half?: boolean }) {
  const hand = (turns: number, length: number) => {
    const a = turns * 2 * Math.PI;
    return { x2: 100 + length * Math.sin(a), y2: 100 - length * Math.cos(a) };
  };
  return (
    <svg viewBox="0 0 200 200" className="mx-auto w-full max-w-56" role="img" aria-label={`A clock showing ${hour}:${half ? "30" : "00"}`}>
      <circle cx="100" cy="100" r="94" fill="#fff" stroke="#1c1917" strokeWidth="4" />
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i / 60) * 2 * Math.PI;
        const r1 = i % 5 ? 86 : 80;
        return (
          <line
            key={i}
            x1={100 + r1 * Math.sin(a)}
            y1={100 - r1 * Math.cos(a)}
            x2={100 + 90 * Math.sin(a)}
            y2={100 - 90 * Math.cos(a)}
            stroke="#1c1917"
            strokeWidth={i % 5 ? 1 : 2.5}
          />
        );
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const a = (n / 12) * 2 * Math.PI;
        return (
          <text key={n} x={100 + 66 * Math.sin(a)} y={100 - 66 * Math.cos(a)} textAnchor="middle" dominantBaseline="central" fontSize="18" fontWeight="700" fill="#1c1917">
            {n}
          </text>
        );
      })}
      <line x1="100" y1="100" {...hand(((hour % 12) + (half ? 0.5 : 0)) / 12, 38)} stroke="#1c1917" strokeWidth="8" strokeLinecap="round" />
      <line x1="100" y1="100" {...hand(half ? 0.5 : 0, 54)} stroke="#2f5bd3" strokeWidth="5" strokeLinecap="round" />
      <circle cx="100" cy="100" r="6" fill="#1c1917" />
    </svg>
  );
}
