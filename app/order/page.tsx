import React, { Suspense } from "react";
import Header from "../common/Header";
import MenuList from "./components/MenuList";
import FooterButton from "./components/FooterButton";
import Footer from "./components/Footer";

export default function page() {
  return (
    <div>
      <Suspense>
        <Header />
        <MenuList />
        <Footer />
        <FooterButton />
      </Suspense>
    </div>
  );
}
