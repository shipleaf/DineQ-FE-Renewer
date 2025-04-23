import React from "react";
import ManagedMenuList from "./components/ManagedMenuList";
import ManagedFooter from "./components/ManagedFooter";
import MenuHeader from "./components/MenuHeader";

export default function page() {
  return (
    <div>
      <MenuHeader />
      <ManagedMenuList />
      <ManagedFooter />
    </div>
  );
}
