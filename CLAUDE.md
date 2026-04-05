# DineQ-FE-Renewer — Claude 참조 문서

식당 주문 관리 시스템. 고객 주문 화면과 관리자 화면으로 구성된 Next.js 앱.

---

## 기술 스택

| 영역 | 라이브러리 | 버전 |
|---|---|---|
| 프레임워크 | Next.js (App Router) | 15.2.8 |
| UI | React | 19.0.0 |
| 언어 | TypeScript | 5 |
| 클라이언트 상태 | Zustand | 5.0.3 |
| 서버 상태 / 캐싱 | TanStack React Query | 5.74.3 |
| HTTP | Axios | 1.8.4 |
| 실시간 통신 | @stomp/stompjs (WebSocket) | 7.1.1 |
| 스타일 | Tailwind CSS | 4 |
| 날짜 처리 | date-fns | 4.1.0 |
| 아이콘 | react-icons | 5.5.0 |

---

## 디렉토리 구조

```
DineQ-FE-Renewer/
├── app/
│   ├── api/                  # API 호출 함수 전체 (axios/fetch)
│   │   ├── fetchMenuAPI.ts           # 메뉴 조회
│   │   ├── fetchOrderAPI.ts          # 주문 생성·조회
│   │   ├── fetchForManagerAPI.ts     # 관리자 전용 (주문·메뉴·카테고리·테이블·매출)
│   │   ├── validateOrderSessionAPI.ts # 세션 유효성 검증
│   │   ├── fetchToken.ts             # QR 토큰 생성
│   │   └── useLoginAPI.ts            # 로그아웃
│   ├── order/                # 고객 주문 화면
│   │   ├── hooks/
│   │   │   ├── useMenuData.ts          # 메뉴 데이터 변환 (그룹핑·정렬·필터링)
│   │   │   ├── useProgressiveRender.ts # 카테고리 점진적 렌더링
│   │   │   └── useCategoryScroll.ts    # 스크롤 위치 기반 활성 카테고리 추적
│   │   └── components/
│   │       ├── Cart.tsx
│   │       └── menu-list/
│   ├── manage/               # 관리자 화면
│   │   └── components/
│   │       ├── OrderInProgress.tsx   # 신규 주문 감지 로직 포함
│   │       ├── OrderCooking.tsx
│   │       └── OrderReady.tsx
│   ├── common/               # 공유 컴포넌트
│   ├── providers/
│   │   └── TanStackProvider.tsx    # React Query 설정
│   └── type/
│       └── menu/menu.ts            # 공유 타입 정의 (Menu, CategoryEntry, MenusByCategoryId)
├── store/
│   ├── cartStore.ts          # 장바구니 상태 (Zustand)
│   └── manageStore.ts        # 관리자 필터/상태 (Zustand)
└── public/
```

---

## 코딩 컨벤션

### 네이밍
- **컴포넌트 파일**: PascalCase (`Cart.tsx`, `MenuCard.tsx`)
- **훅 파일**: camelCase (`useMenuData.ts`, `useCategoryScroll.ts`)
- **API 함수**: camelCase 동사+명사 (`fetchAllMenus`, `putOrdersToCooking`, `deleteMenu`)
- **상수**: UPPER_SNAKE_CASE (`INITIAL_CATEGORY_RENDER_COUNT`, `CATEGORY_RENDER_BATCH_SIZE`)
- **타입**: PascalCase (`CartItem`, `CartState`, `CategoryEntry`)

### 패턴
- 클라이언트 컴포넌트/훅 상단에 `"use client"` 명시
- Axios 요청은 항상 `withCredentials: true` (세션 쿠키 기반 인증)
- **FormData 전송은 native `fetch` 사용** (Axios 불가) — `submitNewMenu`, `submitMenuUpdate` 참고
- Zustand 스토어는 `create<StoreType>((set) => ({ ... }))` 패턴
- React Query 훅은 `useSuspenseQueries` / `useQuery` 사용, staleTime/gcTime Infinity 설정 많음
- 타입 정의는 사용하는 API 파일 상단에 export

### 스타일
- Tailwind CSS 유틸리티 클래스 인라인 사용 (별도 CSS 파일 없음)
- 한국어 주석 사용 (`// 장바구니에 추가됨`, `// 조리 중, 조리 완료`)

---

## 주요 로직 위치

| 로직 | 파일 | 함수/변수 |
|---|---|---|
| 메뉴 카테고리 그룹핑·정렬 | `app/order/hooks/useMenuData.ts` | `useMemo` 내부 |
| 장바구니 CRUD + 가격 계산 | `store/cartStore.ts` | `addToCart`, `updateQuantity` |
| 세션 검증 (HTTP 상태코드 해석) | `app/api/validateOrderSessionAPI.ts` | `validateOrderSession` |
| 매출 날짜 포맷 | `app/api/fetchForManagerAPI.ts` | `fetchSalesHistory`, `fetchTotalSales` |
| 테이블 수 응답 파싱 | `app/api/fetchForManagerAPI.ts` | `getTableNumber` |
| 점진적 렌더링 타이머 | `app/order/hooks/useProgressiveRender.ts` | `useProgressiveRender` |

---

## 주의사항 / 알려진 버그

- **`validateOrderSession`**: HTTP 501 에러도 `true` 반환 — 세션이 이미 존재하는 케이스로 의도된 동작
- **`fetchCatergories`**: 함수명 오타 ("Catergory**ies**") — 수정 시 모든 import 변경 필요
- **`deleteMenuInfo`**: URL에 `}}` 오타 — `/api/v1/store/menus/${menu_id}}` (중괄호 2개)
- **`getTableNumber`**: 응답이 `number` 또는 `{ count: number }` 두 가지 형태로 올 수 있음

---

## 환경변수

| 변수 | 용도 |
|---|---|
| `NEXT_PUBLIC_API_URL` | 백엔드 API 베이스 URL |
| `NEXT_STANDALONE` | Docker 빌드 시 standalone 출력 활성화 |
