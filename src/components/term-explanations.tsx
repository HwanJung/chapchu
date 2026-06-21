import type { ReactNode } from "react";
import type { TermExplanation } from "@/lib/schemas";

const colors = ["peach", "blue", "green", "yellow", "purple"] as const;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function HighlightedText({
  text,
  terms,
}: {
  text: string;
  terms: TermExplanation[];
}) {
  const uniqueTerms = [...new Set(terms.map(({ term }) => term).filter(Boolean))].sort(
    (a, b) => b.length - a.length,
  );

  if (uniqueTerms.length === 0) return text;

  const pattern = new RegExp(`(${uniqueTerms.map(escapeRegExp).join("|")})`, "g");
  const colorByTerm = new Map(terms.map(({ term }, index) => [term, colors[index % colors.length]]));

  return text.split(pattern).map((part, index) => {
    const color = colorByTerm.get(part);
    return color ? (
      <mark className={`term-highlight ${color}`} key={`${part}-${index}`}>
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    );
  });
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p>
      <strong>{label}</strong>
      <span>{children}</span>
    </p>
  );
}

export function TermExplanations({ terms }: { terms: TermExplanation[] }) {
  if (terms.length === 0) return null;

  return (
    <section className="terms-section" aria-labelledby="terms-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">표현 사전</span>
          <h2 id="terms-title">이 표현도 알아두세요</h2>
        </div>
        <span>{terms.length}개 표현</span>
      </div>
      <div className="term-list">
        {terms.map((item, index) => {
          const color = colors[index % colors.length];
          return (
            <article className={`term-card ${color}`} key={`${item.term}-${index}`}>
              <div className="term-title">
                <span>{index + 1}</span>
                <h3>{item.term}</h3>
              </div>
              <Detail label="뜻">{item.meaning}</Detail>
              <Detail label="느낌">{item.nuance}</Detail>
              <Detail label="이럴 때">{item.usage}</Detail>
              <Detail label="주의">{item.caution}</Detail>
            </article>
          );
        })}
      </div>
    </section>
  );
}
