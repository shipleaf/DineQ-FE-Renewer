"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";

export default function ManagedMenuHeader() {
  const router = useRouter();
  return (
    <div className="p-4">
      <button onClick={() => router.back()}>
        <FaArrowLeft color="white" size={20} />
      </button>
    </div>
  );
}
