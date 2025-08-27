# CLAUDE.md

## 🎯 목적
- Eventitta 프론트(`eventitta-front`)를 Next.js 15 + TS + Tailwind + shadcn/ui로 개발  
- 백엔드(`eventitta-backend`)는 Spring Boot + MySQL + Swagger(`/v3/api-docs`)  
- OpenAPI → **Orval**로 타입/훅 자동 생성  
- 인증: JWT 쿠키(HttpOnly, Secure, withCredentials)  

---

## 🚀 주요 명령어
```bash
npm ci
npm run orval         # Swagger → src/api/eventitta.ts 생성
npm run dev           # http://localhost:3000
npm run build && npm run start -p 3000
```

---

## ⚙️ 환경 변수
```
NEXT_PUBLIC_API_BASE_URL=/api
OPENAPI_URL=http://localhost:8080/v3/api-docs
```

---

## 📂 구조
```
src/app/              # Next.js App Router
src/api/              # orval 생성물
src/lib/axios-instance.ts
components/ui/        # shadcn/ui
```

---

## 🔑 규칙
1. API 호출 → `axios-instance.ts` (withCredentials:true) 사용  
2. 타입/훅 → 반드시 Orval 생성물(`src/api/eventitta.ts`) 기반  
3. 페이지 생성 시 로딩/에러/빈목록 UI 포함  
4. 보호 라우트 → `middleware.ts`에서 access_token 쿠키 확인  
5. 테스트 → Playwright(로그인→목록), RTL(폼 검증)  
