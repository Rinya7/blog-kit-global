// src/app/layout.tsx
"use client";
import { Provider } from "react-redux";
import { store } from "../store";
import "./globals.css";

//export const metadata = {
//  title: "Мой блог",
//  description: "SPA-блог на Next.js 13",
//};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className="bg-gray-900 dark:bg-gray-50">
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
