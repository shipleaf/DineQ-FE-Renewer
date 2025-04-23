import React from "react";
import ManagedMenuHeader from "./components/ManagedMenuHeader";
import ManagedMenuImage from "./components/ManagedMenuImage";

export default function page() {
  return (
    <div>
      <div className="fixed top-0 z-30">
        <ManagedMenuHeader />
      </div>
      <ManagedMenuImage />
    </div>
  );
}
