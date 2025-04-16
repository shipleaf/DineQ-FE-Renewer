import React from "react";
import Header from "../common/Header";
import MenuList from "./components/MenuList";
import FooterButton from "./components/FooterButton";
import Footer from "./components/Footer";

export default function page() {
  return (
    <div>
      <Header />
      <MenuList />
      <Footer />
      <FooterButton />
    </div>
  );
}
