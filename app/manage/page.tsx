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

  const gridColsClass = `grid-cols-${visibleComponents.length || 1}`;

  if (isLoading) {
    return (
      <div className="fixed inset-0 w-[100vw] h-[100vh] flex top-[45%] justify-center z-[100] bg-white/50">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden">
      <Header />
      <div className={`grid ${gridColsClass} gap-4 px-4`}>
        {visibleComponents}
      </div>
    </div>
  );
}