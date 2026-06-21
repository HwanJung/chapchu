import { describe, expect, it } from "vitest";
import { MEME_DICTIONARY } from "@/lib/meme-dictionary";
import { MZ_STYLE_GUIDE } from "@/lib/mz-style-guide";

const expectedTerms = [
  "널 좋아하는 마음이 커. 진짜 커 막 공룡만해",
  "피라미드에도 악플이 달린다는 사실을 기억하자",
  "ㄹㅇ이가",
  "늙크크",
  "화석",
  "영크크",
  "마라탕",
  "바이럴 타다",
  "잼민이",
  "ㄴㅁㅁㅅㅇ",
  "ㅇㄱㅈㅉㅇㅇ?",
  "느좋",
  "밤티",
  "야르",
  "햄",
  "나같경",
  "듀듀듀",
  "듀아아아아",
  "읏쇼읏쇼",
  "푸데푸데",
  "폼미",
  "폼 미쳤다",
  "마참내",
  "분좋카",
  "알잘딱깔센",
  "감다살",
  "감다뒤",
  "감다죽",
  "~했은",
  "개추",
  "몰?루",
  "이왜진",
  "무뎌보자",
  "RED RED",
  "ㅇㅂ",
  "뭐하누?",
  "정병",
  "추구미",
  "억텐",
  "군침이 싹 도네",
  "ㅇㄱㄹㅇ",
  "사바사",
  "돼지파티",
  "스밍",
  "핑프",
  "많관부",
  "멍청비용",
  "문찐",
  "영포티",
] as const;

describe("MEME_DICTIONARY", () => {
  it("contains only complete term, meaning, examples, and tags fields", () => {
    for (const entry of MEME_DICTIONARY) {
      expect(Object.keys(entry).sort()).toEqual([
        "examples",
        "meaning",
        "tags",
        "term",
      ]);
      expect(entry.term.trim()).not.toBe("");
      expect(entry.meaning.trim()).not.toBe("");
      expect(entry.examples.length).toBeGreaterThan(0);
      expect(entry.tags.length).toBeGreaterThanOrEqual(1);
      expect(entry.tags.length).toBeLessThanOrEqual(3);
      expect(entry.examples.every((example) => example.trim().length > 0)).toBe(
        true,
      );
      expect(entry.tags.every((tag) => tag.trim().length > 0)).toBe(true);
      expect(entry.examples).not.toContain(entry.meaning);
    }
  });

  it("migrates every former expression without duplicate terms", () => {
    const terms = MEME_DICTIONARY.map(({ term }) => term);

    expect(terms).toHaveLength(expectedTerms.length);
    expect(new Set(terms).size).toBe(terms.length);
    expect(new Set(terms)).toEqual(new Set(expectedTerms));
  });

  it("splits previously combined expressions into individual entries", () => {
    const terms = new Set(MEME_DICTIONARY.map(({ term }) => term));

    for (const term of [
      "듀듀듀",
      "듀아아아아",
      "폼미",
      "폼 미쳤다",
      "감다뒤",
      "감다죽",
    ]) {
      expect(terms.has(term)).toBe(true);
    }
    expect(terms.has("듀듀듀, 듀아아아아")).toBe(false);
    expect(terms.has("폼미, 폼 미쳤다")).toBe(false);
    expect(terms.has("감다뒤, 감다죽")).toBe(false);
  });

  it("does not contain a prohibited expression", () => {
    const prohibited = new Set<string>(MZ_STYLE_GUIDE.prohibitedExpressions);

    expect(
      MEME_DICTIONARY.filter(({ term }) => prohibited.has(term)),
    ).toEqual([]);
  });
});
