import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import LoginButton from "./LoginButton";
import WebsiteLogo from "../../assets/icons/globePenguin.svg";
import ThemeSwitcher from "./ThemeSwitcher";

interface DashboardHeaderProps {
  pages: string[];
  setPage: (newPage: "timer" | "analytics" | "Setting" | null) => void;
  setTargetPosition: (position: [number, number, number]) => void;
  setLookAtPosition: (position: [number, number, number]) => void;
  handleAnalyticsClick: () => void;
}

export function DashboardHeader({
  pages,
  setPage,
  setTargetPosition,
  setLookAtPosition,
  handleAnalyticsClick,
}: DashboardHeaderProps) {
  return (
    <header className="fixed w-full h-16 bg-gray-200 dark:bg-gray-900 shadow-md z-50 flex items-center px-4 md:px-8 transition-colors duration-300">
      <div className="relative flex-grow flex items-center ">
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="header"
                size="icon"
                className="shrink-0"
                onClick={() => setPage("Setting")}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white dark:bg-gray-900 p-6">
              <nav className="flex flex-col items-center gap-4 text-lg font-medium">
                <SheetTitle className="text-2xl font-bold ml-2">
                  Focusnow
                </SheetTitle>

                {pages.map((page) => (
                  <Button
                    variant="header"
                    key={page}
                    onClick={() => {
                      if (page === "Timer") {
                        setTargetPosition([-50, 12, -150]);
                        setLookAtPosition([0, 0, 0]);
                        setPage("timer");
                      } else if (page === "Analytics") {
                        handleAnalyticsClick();
                      } else if (page === "Game") {
                        setPage(null);
                        setTargetPosition([5, 60, 10]);
                        setLookAtPosition([0, 0, 0]);
                      }
                    }}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
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
              setPage(null);
              setTargetPosition([5, 60, 10]);
              setLookAtPosition([0, 0, 0]);
            }}
            className="cursor-pointer"
          >
            <img src={WebsiteLogo} alt="logo" className="h-10 w-auto" />
          </Button>
        </div>

        <div className="hidden md:flex md:items-center  md:justify-start">
          <Button
            variant="header"
            onClick={() => {
              setPage(null);
              setTargetPosition([5, 60, 10]);
              setLookAtPosition([0, 0, 0]);
            }}
            className="cursor-pointer"
          >
            <img src={WebsiteLogo} alt="logo" className="h-10 w-auto" />
            <p className="text-2xl font-bold ml-2">Focusnow</p>
          </Button>

          <nav className="flex gap-2 text-base font-semibold">
            {pages.map((page) => (
              <Button
                variant="header"
                key={page}
                onClick={() => {
                  if (page === "Timer") {
                    setTargetPosition([-50, 12, -150]);
                    setLookAtPosition([0, 0, 0]);
                    setPage("timer");
                  } else if (page === "Analytics") {
                    handleAnalyticsClick();
                  } else if (page === "Game") {
                    setPage(null);
                    setTargetPosition([5, 60, 10]);
                    setLookAtPosition([0, 0, 0]);
                  }
                }}
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors duration-200"
              >
                {page}
              </Button>
            ))}
          </nav>
        </div>
        <div className="flex gap-4 ml-auto">
          <ThemeSwitcher />
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
