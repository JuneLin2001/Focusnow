import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LoginButton from "./LoginButton";

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
    <header className="fixed w-full bg-gray-200 z-50 flex items-center h-16 border-b px-4 md:px-6">
      <div className="flex-grow flex items-center justify-between">
        {/* Mobile Menu Button */}
        <div className="md:hidden">
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:gap-5 text-lg font-medium">
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

        <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
