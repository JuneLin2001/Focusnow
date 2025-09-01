"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import LoginButton from "./LoginButton";
import WebsiteLogo from "@/assets/icons/globePenguin.svg";
import ThemeSwitcher from "./ThemeSwitcher";
import Image from "next/image";
import usePageNavigation from "@/hooks/usePageNavigation";
import type { Page } from "@/types/page";

export function DashboardHeader() {
  const { handleRootPageClick, handleTimerPageClick, handleAnalyticsClick } =
    usePageNavigation();

  const pages: Page[] = ["timer", "analytics"];

  return (
    <header className="fixed z-50 flex h-16 w-full items-center bg-gray-200 px-4 shadow-md transition-colors duration-300 md:px-8 dark:bg-gray-900">
      <div className="relative flex grow items-center">
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="header" size="icon" className="shrink-0">
                <Menu className="size-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white p-6 dark:bg-gray-900">
              <nav className="flex flex-col items-center gap-4 text-lg font-medium">
                <SheetTitle className="ml-2 text-2xl font-bold">
                  Focusnow
                </SheetTitle>
                {pages.map((page) => (
                  <Button
                    variant="header"
                    key={page}
                    onClick={() => {
                      if (page === "timer") {
                        handleTimerPageClick();
                      } else if (page === "analytics") {
                        handleAnalyticsClick();
                      }
                    }}
                    className="transition-colors duration-200"
                  >
                    {page}
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Button
            variant="header"
            onClick={() => {
              handleRootPageClick();
            }}
            className="cursor-pointer"
          >
            <Image
              width={40}
              height={40}
              src={WebsiteLogo}
              alt="logo"
              className="h-10 w-auto"
            />
          </Button>
        </div>

        <div className="hidden md:flex md:items-center md:justify-start">
          <Button
            variant="header"
            onClick={() => {
              handleRootPageClick();
            }}
            className="cursor-pointer"
          >
            <Image
              width={40}
              height={40}
              src={WebsiteLogo}
              alt="logo"
              className="h-10 w-auto"
            />
            <p className="ml-2 text-2xl font-bold">Focusnow</p>
          </Button>

          <nav className="flex gap-2 text-base font-semibold">
            {pages.map((page) => (
              <Button
                variant="header"
                key={page}
                onClick={() => {
                  if (page === "timer") {
                    handleTimerPageClick();
                  } else if (page === "analytics") {
                    handleAnalyticsClick();
                  }
                }}
                className="text-gray-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-white"
              >
                {page}
              </Button>
            ))}
          </nav>
        </div>
        <div className="ml-auto flex gap-4">
          <ThemeSwitcher />
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
