"use client";

import Header from "./components/Header";
import OrderInProgress from "./components/OrderInProgress";
import OrderCooking from "./components/OrderCooking";
import OrderReady from "./components/OrderReady";
import { useOrderFilterStore } from "@/store/manageStore";
import { useEffect, useState, useMemo, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { useOrderStatusStore } from "@/store/manageStore";

// type InvalidateMsg = {
//   messageId?: string;
//   type?: "invalidate";
//   text?: string;
// };

export default function Page() {
  const { showInProgress, showCooking, showReady } = useOrderFilterStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // STOMP client 보관 & StrictMode 중복 연결 방지 가드
  const clientRef = useRef<Client | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const WS_URL = process.env.NEXT_PUBLIC_WS_WSS!;
    const TOPIC = "/topic/orders";
    const APP_ACK = "/app/ack";

    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 3000,
      heartbeatIncoming: 15000,
      heartbeatOutgoing: 15000,

      onConnect: () => {
        // 최초/재연결 시 즉시 리패치 유도
        const st = useOrderStatusStore.getState();
        st.setInProgressUpdated(true);
        st.setCookingUpdated(true);
        st.setReadyUpdated(true);

        client.subscribe(
          TOPIC,
          (msg: IMessage) => {
            const payload = safeJSON(msg.body) as
              | { type?: "invalidate"; text?: string; messageId?: string }
              | undefined;

            if (!payload) {
              // STOMP 프레임 ACK
              // eslint-disable-next-line
              (msg as any).ack?.();
              return;
            }

            if (
              payload.type === "invalidate" &&
              typeof payload.text === "string"
            ) {
              const path = payload.text;
              const st = useOrderStatusStore.getState();

              if (path.startsWith("/api/v1/orders")) {
                st.setInProgressUpdated(true);
                st.setCookingUpdated(true);
              }
              if (path.includes("/api/v1/store/orders/accept")) {
                st.setCookingUpdated(true);
                st.setReadyUpdated(true);
              }
              if (path.includes("/api/v1/store/orders/complete")) {
                st.setReadyUpdated(true);
              }
              // if (
              //   path.includes("/api/v1/store/tables/") &&
              //   path.includes("/clear")
              // ) {
              //   // 테이블 비우기 시, 필요하다면 추가 리패치 플래그도 켜기
              //   st.setInProgressUpdated(true);
              // }

              // 서버 커스텀 ACK
              if (payload.messageId) {
                client.publish({
                  destination: APP_ACK,
                  body: JSON.stringify({ messageId: payload.messageId }),
                  headers: { "content-type": "application/json" },
                });
              }
            }

            // STOMP 프레임 ACK (client-individual)
            // eslint-disable-next-line
            (msg as any).ack?.();
          },
          {
            id: "orders-sub-0",
            ack: "client-individual",
          }
        );
      },

      onStompError: (frame) => {
        console.error("STOMP Error:", frame.headers["message"], frame.body);
      },

      onWebSocketClose: () => {
        console.warn("WebSocket Disconnected");
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
      startedRef.current = false;
    };
  }, []);

  const visibleComponents = useMemo(() => {
    return [
      showInProgress && <OrderInProgress key="inProgress" />,
      showCooking && <OrderCooking key="cooking" />,
      showReady && <OrderReady key="ready" />,
    ].filter(Boolean);
  }, [showInProgress, showCooking, showReady]);

  const gridColsClass =
    ({ 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3" } as const)[
      visibleComponents.length as 1 | 2 | 3
    ] || "grid-cols-1";

  if (isLoading) {
    return (
      <div className="fixed inset-0 w-[100vw] h-[100vh] flex top-[45%] justify-center z-[100] bg-white/50">
        <span className="loader"></span>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="p-8 text-center text-lg font-bold">
        <Header isMobile={isMobile} />
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden">
      <Header isMobile={isMobile} />
      <div className={`grid ${gridColsClass} gap-4 px-4 w-full`}>
        {visibleComponents.map((component, idx) => (
          <div key={idx} className="min-w-0 w-full">
            {component}
          </div>
        ))}
      </div>
    </div>
  );
}

function safeJSON(s?: string) {
  try {
    return s ? JSON.parse(s) : undefined;
  } catch {
    return undefined;
  }
}
