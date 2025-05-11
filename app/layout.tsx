import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import TanStackProvider from "./providers/TanStackProvider";

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "DineQ",
  description: "주문을 간편하게",
  icons: {
    icon: "/image.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pretendard.variable} font-pretendard m-auto`}>
        <TanStackProvider>{children}</TanStackProvider>
      </body>
    </html>
  );
}
