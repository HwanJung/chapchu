// 월 1회 검수하고 reviewedAt, 표현 목록, 예시를 한 번에 갱신한다.
export const MZ_STYLE_GUIDE = {
  reviewedAt: "2026-06-21",
  approvedExpressions: ["느좋", "추구미", "감다살"],
  prohibitedExpressions: [
    "대박",
    "짱",
    "헐",
    "핵인싸",
    "갑분싸",
    "JMT",
    "존맛",
    "개이득",
    "오지다",
    "어쩔티비",
    "완내스"
  ],
  maxTrendExpressionsPerSentence: 2,
  seniorToMzExamples: [
    {
      input: "사진 분위기가 참 좋구나.",
      output: "이거 진짜느좋",
    },
    {
      input: "이 옷은 네가 좋아하는 분위기와 잘 맞는구나.",
      output: "이거 완전 네스타일",
    },
    {
      input: "여행 계획을 빈틈없이 잘 세웠구나.",
      output: "계획 ㄹㅇ 잘 짰누",
    },
    {
      input:"너 누군데? 나 알아?",
      output: "ㅋㅋ 너 뭐누? 나 아누?",
    },
    {
      input:"잘먹겠습니다!",
      output: "야르~! 무뎌보자",
    },
    {
      input: "뭐하는 중이야?",
      output: "뭐하누",
    },
    {
      input: "나이 들었네",
      output: "늙크크",
    },
    {
      input: "어린이는 발닦고 주무시기나 하셔.",
      output: "마라탕은 가서 마라탕이라 무라",
    },
    {
      input: "어떡해. 정말 슬프다.",
      output: "듀아아아아아아",
    },
    {
      input: "잘 모르겠는데?",
      output: "몰?루",
    },
  ],
} as const;
