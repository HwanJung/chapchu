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
  termDefinitions: [
    {
      term: "정병",
      meaning: "정신병을 줄여 이르는 말.",
    },
    {
      term: "추구미",
      meaning: "자신이 추구하는 미의식이나 이미지.",
    },
    {
      term: "억텐",
      meaning: "억지로 높은 텐션을 유지하는 것.",
    },
    {
      term: "군침이 싹 도네",
      meaning: "음식이 맛있어 보여 먹고 싶다는 뜻.",
    },
    {
      term: "ㅇㄱㄹㅇ",
      meaning: "격하게 동의하는말.",
    },
    {
      term: "사바사",
      meaning: "사람마다 다르다는 뜻.",
    },
    {
      term: "돼지파티",
      meaning:
        "먹고 싶은 음식을 종류별로 차려 놓고 배부를 때까지 먹는 파티.",
    },
    {
      term: "인급동",
      meaning: "인기가 급상승한 동영상.",
    },
    {
      term: "스밍",
      meaning: "노래를 반복해서 들어 순위를 올려 주는 행위.",
    },
    {
      term: "핑프",
      meaning:
        "검색하면 알 수 있는 정보를 직접 검색하지 않고 물어보는 사람.",
    },
    {
      term: "많관부",
      meaning: "많은 관심 부탁드립니다를 줄여 이르는 말.",
    },
    {
      term: "멍청비용",
      meaning: "부주의로 인해 불필요하게 지출하는 비용.",
    },
    {
      term: "문찐",
      meaning: "유행이나 대중문화를 잘 몰라 뒤처지는 사람.",
    },
  ],
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
      input: "그 카페는 내가 좋아하는 스타일이구나.",
      output: "거기 진짜 완내스",
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
      input: "바이럴 타다",
      output: "유행이 되다",
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
    {
      input: "정병",
      output: "정신병.",
    },
    {
      input: "추구미",
      output: "추구하는 미의식.",
    },
    {
      input: "억텐",
      output: "억지로 높은 텐션을 유지하는 것.",
    },
    {
      input: "군침이 싹 도네",
      output: "음식이 맛있어 보인다.",
    },
    {
      input: "ㅇㄱㄹㅇ",
      output: "격하게 동의한다는 뜻 또는 정말이라는 뜻.",
    },
    {
      input: "사바사",
      output: "사람마다 다르다는 뜻.",
    },
    {
      input: "돼지파티",
      output:
        "먹고 싶은 음식을 종류별로 차려 놓고 배부를 때까지 먹는 파티.",
    },
    {
      input: "스밍",
      output: "노래를 반복해서 들어 순위를 올려 주는 행위.",
    },
    {
      input: "핑프",
      output:
        "검색하면 알 수 있는 정보를 직접 검색하지 않고 물어보는 사람.",
    },
    {
      input: "많관부",
      output: "많은 관심 부탁드립니다.",
    },
    {
      input: "멍청비용",
      output: "부주의로 인해 나가는 비용.",
    },
    {
      input: "문찐",
      output: "유행에 뒤처지는 사람.",
    },
    {
      input: "영포티",
      output: "나이가 많은데 젊어보이려 하는 사람",
    },
  ],
} as const;
