type DotMood = "pause" | "bright" | "calm" | "curious";
export function SayLessDot({ mood = "calm", color = "mint", className }: { mood?: DotMood; color?: "mint" | "lavender" | "jonquil" | "melon" | "azure"; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden="true" focusable="false">
      <circle cx="60" cy="60" r="57" fill={`var(--color-${color})`} stroke="var(--color-ink)" strokeWidth="2" />
      <circle cx="60" cy="60" r="50" stroke="var(--color-ink)" strokeOpacity=".18" />
      <g stroke="var(--color-ink)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        {mood === "pause" && <path d="M43 43v27m34-27v27" />}
        {mood === "bright" && <path d="M32 53h20m-10-10v20m26-10h20M78 43v20M43 80q17 12 34 0" />}
        {mood === "calm" && <path d="M32 53q10 12 20 0m16 0q10 12 20 0M43 76q17 14 34 0" />}
        {mood === "curious" && <><ellipse cx="42" cy="53" rx="6" ry="9" /><ellipse cx="78" cy="53" rx="6" ry="9" /><path d="M49 80q11-7 22 0" /></>}
      </g>
    </svg>
  );
}
