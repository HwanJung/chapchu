import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TermExplanations } from "@/components/term-explanations";

const terms = [
  {
    term: "느좋",
    meaning: "느낌이 좋다.",
    example: "오늘 올린 사진 완전 느좋.",
  },
];

describe("TermExplanations", () => {
  it("hides the section when there are no explanations", () => {
    expect(
      renderToStaticMarkup(
        <TermExplanations terms={[]} direction="MZ_TO_SENIOR" />,
      ),
    ).toBe("");
  });

  it("shows a source-expression card for MZ-to-senior translation", () => {
    const html = renderToStaticMarkup(
      <TermExplanations terms={terms} direction="MZ_TO_SENIOR" />,
    );

    expect(html).toContain("밈·MZ어 뜻");
    expect(html).toContain("입력에서 찾은 표현");
    expect(html).toContain("느좋");
    expect(html).toContain("느낌이 좋다.");
    expect(html).toContain("오늘 올린 사진 완전 느좋.");
  });

  it("labels cards as expressions used by senior-to-MZ translation", () => {
    const html = renderToStaticMarkup(
      <TermExplanations terms={terms} direction="SENIOR_TO_MZ" />,
    );

    expect(html).toContain("번역에 사용된 표현");
  });
});
