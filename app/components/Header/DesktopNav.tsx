import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import type { Page } from "@/types/page";
import usePageNavigation from "@/hooks/usePageNavigation";
import WebsiteLogo from "@/assets/icons/globePenguin.svg";

interface DesktopNavProps {
  pages: Page[];
}

const DesktopNav: React.FC<DesktopNavProps> = ({ pages }) => {
  const { handleRootPageClick, handleTimerPageClick, handleAnalyticsClick } =
    usePageNavigation();

  return (
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
            className="text-gray-600 capitalize transition-colors duration-200 dark:text-gray-300 dark:hover:text-white"
          >
            {page}
          </Button>
        ))}
      </nav>
    </div>
  );
};

export default DesktopNav;
