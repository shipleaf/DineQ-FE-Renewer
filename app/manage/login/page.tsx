"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Page() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleLogin = async () => {
    try {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);

      await axios.post(`${apiUrl}/api/v1/auth/login`, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true,
      });

      router.push("/manage");
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <div className="p-8 pt-12 flex flex-col gap-4 max-w-sm mx-auto h-[100vh] justify-start">
      <div className="flex items-center justify-start">
        <Image src="/Image.png" alt="" width={48} height={24}/>
        <span className="font-[700] text-lg">DineQ</span>
      </div>
      <input
        type="text"
        placeholder="아이디"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white p-2 rounded"
      >
        로그인
      </button>
    </div>
  );
}
