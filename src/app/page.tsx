"use client";

import { useState } from "react";
import { RewriteTab } from "@/components/rewrite-tab";
import { TranslateTab } from "@/components/translate-tab";

type Tab = "translate" | "rewrite";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("translate");

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="세대번역소 홈">
          <span className="brand-mark" aria-hidden="true">
            <i>가</i>
            <i>말</i>
          </span>
          <span>
            <strong>세대번역소</strong>
            <small>말뜻과 마음 사이</small>
          </span>
        </a>
        <span className="privacy-pill">입력 내용은 저장하지 않아요</span>
      </header>

      <section className="hero" id="top">
        <span className="hero-kicker">마음을 잇는 한국어 도구</span>
        <h1>
          같은 마음, <em>통하는 말</em>로
        </h1>
        <p>낯선 세대 표현은 쉽게 풀고, 전하고 싶은 말은 관계에 맞게 다듬어 보세요.</p>
      </section>

      <nav className="tabs" aria-label="기능 선택">
        <button
          type="button"
          className={activeTab === "translate" ? "active" : ""}
          aria-selected={activeTab === "translate"}
          role="tab"
          onClick={() => setActiveTab("translate")}
        >
          <span aria-hidden="true">⇄</span>
          <strong>세대어 번역</strong>
          <small>MZ어와 어르신어 사이</small>
        </button>
        <button
          type="button"
          className={activeTab === "rewrite" ? "active" : ""}
          aria-selected={activeTab === "rewrite"}
          role="tab"
          onClick={() => setActiveTab("rewrite")}
        >
          <span aria-hidden="true">✎</span>
          <strong>상황별 말 바꾸기</strong>
          <small>상대에 알맞은 말투로</small>
        </button>
      </nav>

      <div role="tabpanel" hidden={activeTab !== "translate"}>
        <TranslateTab />
      </div>
      <div role="tabpanel" hidden={activeTab !== "rewrite"}>
        <RewriteTab />
      </div>

      <aside className="guide-note">
        <span aria-hidden="true">i</span>
        <p>
          <strong>번역 결과는 참고용이에요.</strong>
          세대별 표현과 적절한 말투는 개인, 관계, 상황에 따라 다를 수 있습니다.
        </p>
      </aside>

      <footer>
        <strong>세대번역소</strong>
        <span>서로의 말을 이해하는 작은 시작</span>
      </footer>
    </main>
  );
}
