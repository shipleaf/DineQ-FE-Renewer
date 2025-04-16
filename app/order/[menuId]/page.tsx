import React from "react";
import MenuImage from "./components/MenuImage";
import MenuHeader from "./components/MenuHeader";

export default function page() {
  return (
    <div>
      <div className="fixed top-0 z-30">
        <MenuHeader />
      </div>
      <MenuImage />
    </div>
  );
}
