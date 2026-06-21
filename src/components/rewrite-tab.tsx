"use client";

import { useState } from "react";
import { ResultPanel } from "@/components/result-panel";
import { TextComposer } from "@/components/text-composer";
import { useApiRequest } from "@/hooks/use-api-request";
import type { Audience, RewriteRequest, RewriteResponse } from "@/lib/schemas";

const audiences: { value: Audience; label: string; icon: string }[] = [
  { value: "PROFESSOR", label: "교수님", icon: "학" },
  { value: "BOSS", label: "직장 상사", icon: "상" },
  { value: "COWORKER", label: "회사 동료", icon: "동" },
  { value: "FRIEND", label: "친구", icon: "친" },
  { value: "PARTNER", label: "연인", icon: "연" },
  { value: "FAMILY", label: "가족", icon: "가" },
];

export function RewriteTab() {
  const [inputText, setInputText] = useState("");
  const [audience, setAudience] = useState<Audience>("PROFESSOR");
  const { state, run } = useApiRequest<RewriteRequest, RewriteResponse>("/api/rewrite");

  function submit() {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    void run({ inputText: trimmed, audience });
  }

  return (
    <div className="tab-content">
      <section className="workspace-card input-card">
        <TextComposer
          id="rewrite-input"
          label="전달할 내용"
          placeholder="예) 과제 제출을 하루 늦게 해도 될까요?"
          value={inputText}
          onChange={setInputText}
        />

        <fieldset className="audience-picker">
          <legend>누구에게 보낼까요?</legend>
          <div>
            {audiences.map((item) => (
              <button
                type="button"
                className={audience === item.value ? "selected" : ""}
                aria-pressed={audience === item.value}
                onClick={() => setAudience(item.value)}
                key={item.value}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>

        <button
          className="primary-button"
          type="button"
          disabled={!inputText.trim() || state.status === "loading"}
          onClick={submit}
        >
          {state.status === "loading" ? "다듬는 중…" : "상황에 맞게 바꾸기"}
        </button>
      </section>

      <ResultPanel
        state={state}
        title="다듬은 문장"
        emptyMessage="전할 내용과 상대를 고르면 알맞은 말투로 바꿔 드려요."
        getText={(data) => data.resultText}
        onRetry={submit}
      />
    </div>
  );
}
