"use client";

import LoginButton from "../Auth/LoginButton";
import ThemeSwitcher from "./ThemeSwitcher";
import type { Page } from "@/types/page";
import MobileNav from "./MobileNav";
import DesktopNav from "./DesktopNav";

export function DashboardHeader() {
  const pages: Page[] = ["timer", "analytics"];

  return (
    <header className="fixed z-50 flex h-16 w-full items-center bg-gray-200 px-4 shadow-md transition-colors duration-300 md:px-8 dark:bg-gray-900">
      <div className="relative flex grow items-center">
        <MobileNav pages={pages} />
        <DesktopNav pages={pages} />
        <div className="ml-auto flex gap-4">
          <ThemeSwitcher />
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
