"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Page() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);

      // if (!params) {
      //   alert("아이디 비밀번호를 입력해 주세요.")
      // }

      await axios.post(`${apiUrl}/api/v1/auth/login`, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true,
      });
      setIsLoading(false);
      router.push("/manage");
    } catch (error) {
      console.error("로그인 실패:", error);
      setIsError(true)
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="p-8 pt-12 flex flex-col gap-4 max-w-sm mx-auto h-[100vh] justify-start">
      <div className="flex items-center justify-start">
        <Image src="/image.png" alt="" width={48} height={24} />
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
      {isError && <span className="text-blue-500 font-[600]">아이디와 비밀번호를 확인해 주세요.</span>}
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white p-2 rounded flex items-center justify-center"
      >
        {isLoading ? (
          <div className="loader !w-[24px] !h-[24px]"></div>
        ) : (
          <span className="text-[16px]">로그인</span>
        )}
      </button>
    </div>
  );
}
