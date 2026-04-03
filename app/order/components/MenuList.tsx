"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MenuListContent from "./menu-list/MenuListContent";

export default function MenuList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableId = searchParams.get("tableId");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!tableId || !token) {
      router.replace("/order/expiration");
    }
  }, [router, tableId, token]);

  if (!tableId || !token) return null;

  return <MenuListContent tableId={tableId} token={token} />;
}
