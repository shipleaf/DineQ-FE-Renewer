## Node.js 이미지 불러오기
FROM node:20-alpine AS builder

## 컨테이너 내 /app 디렉토리에서 작업
WORKDIR /app

## pnpm을 설치없이 쓰기위한 node 옵션
RUN corepack enable

## 먼저 복사하는 이유, pnpm install 결과를 캐싱 가능하다! 뒤 ./는 복사할 디렉터리
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_WSS

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WS_WSS=$NEXT_PUBLIC_WS_WSS

## 이제 나머지 카피
COPY . .
RUN pnpm build


FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]