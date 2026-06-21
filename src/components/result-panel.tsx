"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { RequestState } from "@/hooks/use-api-request";

interface ResultPanelProps<T> {
  state: RequestState<T>;
  title: string;
  emptyMessage: string;
  getText: (data: T) => string;
  onRetry: () => void;
  children?: (data: T) => ReactNode;
}

export function ResultPanel<T>({
  state,
  title,
  emptyMessage,
  getText,
  onRetry,
  children,
}: ResultPanelProps<T>) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2_000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copyResult(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (state.status === "idle") {
    return (
      <section className="result-shell result-empty" aria-label={title}>
        <div className="empty-icon" aria-hidden="true">
          가
        </div>
        <p>{emptyMessage}</p>
        <span>입력한 내용은 저장되지 않아요.</span>
      </section>
    );
  }

  if (state.status === "loading") {
    return (
      <section className="result-shell result-loading" aria-live="polite" aria-label={title}>
        <span className="loader" aria-hidden="true" />
        <strong>표현을 다듬고 있어요</strong>
        <p>문맥과 말투를 함께 살펴보는 중이에요.</p>
      </section>
    );
  }

  if (state.status === "error") {
    return (
      <section className="result-shell result-error" role="alert" aria-label={title}>
        <span className="error-mark" aria-hidden="true">
          !
        </span>
        <strong>{state.error.message}</strong>
        <button type="button" className="secondary-button" onClick={onRetry}>
          다시 시도
        </button>
      </section>
    );
  }

  const text = getText(state.data);

  return (
    <>
      <section className="result-shell result-success" aria-live="polite" aria-label={title}>
        <div className="result-heading">
          <div>
            <span className="ai-badge">AI 생성</span>
            <h2>{title}</h2>
          </div>
          <button
            type="button"
            className="copy-button"
            onClick={() => copyResult(text)}
            aria-label="결과 복사"
          >
            {copied ? "복사했어요" : "복사"}
          </button>
        </div>
        <p className="result-text">{text}</p>
        <p className="ai-note">AI가 만든 제안이에요. 개인과 상황에 따라 적합한 표현은 달라질 수 있어요.</p>
      </section>
      {children?.(state.data)}
    </>
  );
}
