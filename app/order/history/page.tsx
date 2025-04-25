import React, { Suspense } from "react";
import HistoryHeader from "./components/HistoryHeader";
import HistoryContainer from "./components/HistoryContainer";
export default function page() {
  return (
    <div>
      <Suspense>
        <HistoryHeader />
        <HistoryContainer />
      </Suspense>
    </div>
  );
}
