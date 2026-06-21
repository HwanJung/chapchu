// 월 1회 검수하고 reviewedAt, 표현 목록, 예시를 한 번에 갱신한다.
export const MZ_STYLE_GUIDE = {
  reviewedAt: "2026-06-21",
  approvedExpressions: ["느좋", "추구미", "감다살", "완내스"],
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
    "실화냐",
    "어쩔티비",
  ],
  maxTrendExpressionsPerSentence: 2,
  seniorToMzExamples: [
    {
      input: "사진 분위기가 참 좋구나.",
      output: "이 사진 진짜 느좋.",
    },
    {
      input: "이 옷은 네가 좋아하는 분위기와 잘 맞는구나.",
      output: "이 옷 완전 네 추구미다.",
    },
    {
      input: "여행 계획을 빈틈없이 잘 세웠구나.",
      output: "여행 플랜 짠 거 감다살.",
    },
    {
      input: "그 카페는 내가 좋아하는 스타일이구나.",
      output: "그 카페 완내스.",
    },
  ],
  mzToSeniorExamples: [
    {
      input: "널 좋아하는 마음이 커. 진짜 커 막 공룡만해",
      output: "널 매우 많이 좋아한다.",
    },
    {
      input: "피라미드에도 악플이 달린다는 사실을 기억하자",
      output:
        "아무리 훌륭하고 오래도록 인정받는 대상이라도 비판이나 부정적인 반응은 있을 수 있다는 사실을 기억하자.",
    },
    {
      input: "ㄹㅇ이가",
      output: "진짜야?",
    },
    {
      input: "늙크크",
      output: "나이가 들었다는 뜻이다.",
    },
    {
      input: "화석",
      output: "나이가 들었다는 뜻이다.",
    },
    {
      input: "영크크",
      output: "어리다는 뜻이다.",
    },
    {
      input: "마라탕",
      output: "어리다는 뜻이다.",
    },
    {
      input: "잼민이",
      output: "어리다는 뜻이다.",
    },
    {
      input: "ㄴㅁㅁㅅㅇ",
      output: "너무 무서워.",
    },
    {
      input: "ㅇㄱㅈㅉㅇㅇ?",
      output: "이거 진짜예요?",
    },
    {
      input: "느좋",
      output: "느낌 좋은.",
    },
    {
      input: "밤티",
      output: "못생긴, 구린.",
    },
    {
      input: "야르",
      output: "기분 좋을 때 쓰는 긍정적인 추임새.",
    },
    {
      input: "햄",
      output: "형, 형님.",
    },
    {
      input: "나같경",
      output: "나 같은 경우.",
    },
    {
      input: "듀듀듀, 듀아아아아",
      output: "슬플 때 우는 것을 표현하는 말.",
    },
    {
      input: "읏쇼읏쇼",
      output: "열심히 하는 모습을 나타내는 의성어.",
    },
    {
      input: "푸데푸데",
      output: "잠자는 것을 뜻하는 의성어.",
    },
    {
      input: "폼미, 폼 미쳤다",
      output: "멋지다.",
    },
    {
      input: "마참내",
      output: "마침내.",
    },
    {
      input: "분좋카",
      output: "분위기 좋은 카페.",
    },
    {
      input: "알잘딱깔센",
      output: "알아서 잘, 딱 깔끔하고 센스 있게.",
    },
    {
      input: "감다살",
      output: "감이 다 살아 있네. 분위기를 잘 살렸을 때 긍정적으로 하는 말.",
    },
    {
      input: "감다뒤, 감다죽",
      output: "감이 다 죽었네. '감다살'과 반대되는 말.",
    },
    {
      input: "~했은",
      output: "~했어, ~했다의 뜻으로 쓰는 말투.",
    },
    {
      input: "개추",
      output: "공감한다는 뜻이다.",
    },
    {
      input: "몰?루",
      output: "몰라.",
    },
    {
      input: "이왜진",
      output: "이게 왜 진짜지?",
    },
    {
      input: "무뎌보자",
      output: "먹어 보자.",
    },
    {
      input: "RED RED",
      output: "금지.",
    },
    {
      input: "ㅇㅂ",
      output: "에바. 너무 지나치거나 말도 안 된다는 뜻이다.",
    },
    {
      input: "뭐하누?",
      output: "뭐 하고 있어?",
    },
  ],
} as const;
