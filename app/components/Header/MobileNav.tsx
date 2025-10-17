"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import usePageNavigation from "@/hooks/usePageNavigation";
import type { Page } from "@/types/page";
import WebsiteLogo from "@/assets/icons/globePenguin.svg";
import Image from "next/image";

interface MobileNavProps {
  pages: Page[];
}
const MobileNav: React.FC<MobileNavProps> = ({ pages }) => {
  const { handleRootPageClick, handleTimerPageClick, handleAnalyticsClick } =
    usePageNavigation();

  return (
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
                className="capitalize transition-colors duration-200"
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
  );
};

export default MobileNav;
