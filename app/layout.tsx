import type { Metadata } from "next";
import "./globals.css";
import {
  AnalyticsDataInitializer,
  ToastInitializer,
} from "@/components/Initializer";
import { DashboardHeader } from "@/components/Header";
import Canva3D from "@/components/Canvas3D";
import TimerDisplayPanel from "@/components/Panel/TimerDisplayPanel";

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
        <ToastInitializer />
        <DashboardHeader />
        <TimerDisplayPanel />
        {children}
        <Canva3D />
      </body>
    </html>
  );
}
