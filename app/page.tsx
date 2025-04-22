"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/order/expiration");
    // eslint-disable-next-line
  }, []);

  return <div></div>;
}