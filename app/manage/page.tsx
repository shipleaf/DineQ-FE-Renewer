"use client";

import Header from "./components/Header";
import OrderInProgress from "./components/OrderInProgress";
import OrderCooking from "./components/OrderCooking";
import OrderReady from "./components/OrderReady";
import { useOrderFilterStore } from "@/store/manageStore";
import { useEffect, useState, useMemo } from "react";

export default function Page() {
  const { showInProgress, showCooking, showReady } = useOrderFilterStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind 기준 sm 이하
    };

    checkMobile(); // 처음에도 체크
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // useEffect(() => {
  //   console.log("📱 isMobile 상태:", isMobile);
  // }, [isMobile]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  const visibleComponents = useMemo(() => {
    return [
      showInProgress && <OrderInProgress key="inProgress" />,
      showCooking && <OrderCooking key="cooking" />,
      showReady && <OrderReady key="ready" />,
    ].filter(Boolean); // false인 항목 제거
  }, [showInProgress, showCooking, showReady]);

  const gridColsClass =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
    }[visibleComponents.length] || "grid-cols-1";

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
        <Header isMobile={isMobile}/>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden">
      <Header isMobile={isMobile}/>
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