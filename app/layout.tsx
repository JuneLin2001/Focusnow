import type { Metadata } from "next";
import "./globals.css";
import AnalyticsDataInitializer from "@/components/Initializer/AnalyticsDataInitializer";
import { DashboardHeader } from "@/components/Header";

export const metadata: Metadata = {
  title: "Focusnow",
  description:
    "A website combining Pomodoro timer, 3D scenes, and penguin-themed interactive game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AnalyticsDataInitializer />
        <DashboardHeader />
        {children}
      </body>
    </html>
  );
}
