import React, { Suspense } from "react";
import Header from "../common/Header";
import MenuList from "./components/MenuList";
import FooterButton from "./components/FooterButton";
import Footer from "./components/Footer";
import OrderPageSkeleton from "./components/skeleton/OrderPageSkeleton";

export default function page() {
  return (
    <div>
      <Suspense fallback={<OrderPageSkeleton />}>
        <Header />
        <MenuList />
      </Suspense>
        <Footer />
        <FooterButton />
    </div>
  );
}
