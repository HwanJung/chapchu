# 세대번역소

세대별 표현을 문맥에 맞게 번역하고, 상대와의 관계에 맞는 말투로 문장을 다듬는 Next.js MVP입니다.

## 실행

Node.js 22 이상이 필요합니다.

```bash
npm install
cp .env.example .env.local
npm run dev
```

`.env.local`에 OpenAI API 키를 설정합니다.

```text
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5-mini
```

## 검증

```bash
npm run lint
npm test
npm run build
```

입력 문장과 AI 생성 결과는 저장하지 않으며, 서버 오류 로그에도 포함하지 않습니다.
