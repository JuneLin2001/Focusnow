import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LoginButton from "./LoginButton";
import WebsiteLogo from "../../assets/icons/logo.png";

interface DashboardHeaderProps {
  pages: string[];
  setPage: (newPage: "timer" | "analytics" | "game" | null) => void;
  setTargetPosition: (position: [number, number, number]) => void;
  setLookAtPosition: (position: [number, number, number]) => void;
}

export function DashboardHeader({
  pages,
  setPage,
  setTargetPosition,
  setLookAtPosition,
}: DashboardHeaderProps) {
  return (
    <header className="fixed w-full bg-gray-200 z-50 flex items-center h-24 border-b px-4 md:px-6">
      <div className="relative flex-grow flex items-center justify-between">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-6 text-lg font-medium">
                {pages.map((page) => (
                  <Button
                    variant="ghost"
                    key={page}
                    onClick={() => {
                      if (page === "Timer") {
                        setTargetPosition([-50, 12, -150]);
                        setLookAtPosition([0, 0, 0]);
                        setPage("timer");
                      } else if (page === "Analytics") {
                        setTargetPosition([-75, 25, 100]);
                        setPage("analytics");
                      } else if (page === "Game") {
                        setPage(null);
                        setTargetPosition([5, 60, 10]);
                        setLookAtPosition([0, 0, 0]);
                      }
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {page}
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo Container */}
        <div className="flex flex-1 justify-center md:justify-start">
          <Button
            variant={"link"}
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

        <nav className="hidden md:flex md:gap-5 text-lg font-medium flex-1 justify-center">
          {pages.map((page) => (
            <Button
              variant="ghost"
              key={page}
              onClick={() => {
                if (page === "Timer") {
                  setTargetPosition([-50, 12, -150]);
                  setLookAtPosition([0, 0, 0]);
                  setPage("timer");
                } else if (page === "Analytics") {
                  setTargetPosition([-105, 25, 100]);
                  setLookAtPosition([250, 0, 0]);
                  setPage("analytics");
                } else if (page === "Game") {
                  setPage(null);
                  setTargetPosition([5, 60, 10]);
                  setLookAtPosition([0, 0, 0]);
                }
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              {page}
            </Button>
          ))}
        </nav>

        {/* Login Button */}
        <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
