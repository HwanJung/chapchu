"use client";

import { useState } from "react";
import { ResultPanel } from "@/components/result-panel";
import { TermExplanations } from "@/components/term-explanations";
import { TextComposer } from "@/components/text-composer";
import { useApiRequest } from "@/hooks/use-api-request";
import type { Direction, TranslateRequest, TranslateResponse } from "@/lib/schemas";

export function TranslateTab() {
  const [inputText, setInputText] = useState("");
  const [direction, setDirection] = useState<Direction>("MZ_TO_SENIOR");
  const { state, run, reset } = useApiRequest<TranslateRequest, TranslateResponse>(
    "/api/translate",
  );

  function submit() {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    void run({ inputText: trimmed, direction });
  }

  function switchDirection() {
    setDirection((current) =>
      current === "MZ_TO_SENIOR" ? "SENIOR_TO_MZ" : "MZ_TO_SENIOR",
    );
    reset();
  }

  const isMZToSenior = direction === "MZ_TO_SENIOR";

  return (
    <div className="tab-content">
      <section className="workspace-card input-card">
        <div className="direction-picker" aria-label="번역 방향">
          <div className={isMZToSenior ? "active" : ""}>
            <span>입력</span>
            <strong>{isMZToSenior ? "MZ어" : "어르신어"}</strong>
          </div>
          <button type="button" onClick={switchDirection} aria-label="번역 방향 전환">
            ⇄
          </button>
          <div className={!isMZToSenior ? "active" : ""}>
            <span>변환</span>
            <strong>{isMZToSenior ? "어르신어" : "MZ어"}</strong>
          </div>
        </div>

        <TextComposer
          id="translate-input"
          label="번역할 문장"
          placeholder={
            isMZToSenior
              ? "예) 점메추 부탁! 오늘은 얼큰한 거 땡겨"
              : "예) 자네, 오늘 점심 식사는 무엇으로 하겠나?"
          }
          value={inputText}
          onChange={setInputText}
        />

        <button
          className="primary-button"
          type="button"
          disabled={!inputText.trim() || state.status === "loading"}
          onClick={() => submit()}
        >
          {state.status === "loading" ? "번역하는 중…" : "세대어 번역하기"}
        </button>
      </section>

      <ResultPanel
        state={state}
        title="번역 결과"
        emptyMessage="번역할 문장을 입력하면 결과가 여기에 나타나요."
        getText={(data) => data.resultText}
        onRetry={() => submit()}
      >
        {(data) => (
          <TermExplanations
            terms={data.termExplanations}
            direction={direction}
          />
        )}
      </ResultPanel>
    </div>
  );
}
