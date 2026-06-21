import type { Direction, TermExplanation } from "@/lib/schemas";

const colors = ["peach", "blue", "green", "yellow", "purple"] as const;

export function TermExplanations({
  terms,
  direction,
}: {
  terms: TermExplanation[];
  direction: Direction;
}) {
  if (terms.length === 0) return null;

  const description =
    direction === "MZ_TO_SENIOR"
      ? "입력에서 찾은 표현"
      : "번역에 사용된 표현";

  return (
    <section className="terms-section" aria-labelledby="terms-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{description}</span>
          <h2 id="terms-title">밈·MZ어 뜻</h2>
        </div>
        <span>{terms.length}개 표현</span>
      </div>
      <div className="term-list">
        {terms.map((item, index) => {
          const color = colors[index % colors.length];
          return (
            <article className={`term-card ${color}`} key={`${item.term}-${index}`}>
              <div className="term-title">
                <h3>{item.term}</h3>
              </div>
              <p className="term-meaning">{item.meaning}</p>
              <p className="term-example">
                <strong>예)</strong> {item.example}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
