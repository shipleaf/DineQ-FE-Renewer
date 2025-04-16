"use client";

import Header from "./components/Header";
import OrderInProgress from "./components/OrderInProgress";
import OrderCooking from "./components/OrderCooking";
import OrderReady from "./components/OrderReady";
import { useOrderFilterStore } from "@/store/manageStore";

export default function Page() {
  const { showInProgress, showCooking, showReady } = useOrderFilterStore();

  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex items-center justify-center gap-4">
        {showInProgress && <OrderInProgress />}
        {showCooking && <OrderCooking />}
        {showReady && <OrderReady />}
      </div>
    </div>
  );
}