import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  number?: string;
  tone?: "ink" | "plum" | "paper";
  className?: string;
};

/**
 * Editorial kicker. Sits above a heading like a magazine section label:
 *
 *   01 ───── On accreditation
 *
 * `number` optional. `tone="paper"` for use on dark surfaces.
 */
export const Eyebrow = ({ children, number, tone = "ink", className = "" }: Props) => {
  const text = tone === "paper" ? "text-white/70" : tone === "plum" ? "text-plum" : "text-ink-mute";
  const rule = tone === "paper" ? "bg-white/30" : "bg-rule-strong";
  return (
    <p className={`eyebrow flex items-center gap-3 ${text} ${className}`}>
      {number && (
        <>
          <span className="font-mono text-[11px]">{number}</span>
          <span className={`h-px w-8 ${rule}`} aria-hidden />
        </>
      )}
      <span>{children}</span>
    </p>
  );
};

export default Eyebrow;
