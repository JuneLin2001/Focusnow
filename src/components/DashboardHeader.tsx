import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
// import LoginButton from "../components/LoginButton";

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
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <header className="fixed w-full bg-gray-200 z-50 flex items-center h-16 border-b px-4 md:px-6">
      <div className="flex-grow flex items-center justify-between">
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-6 text-lg font-medium">
                {pages.map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      handleCloseNavMenu();
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
                      }
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {page}
                  </button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:gap-5 text-lg font-medium">
          {pages.map((page) => (
            <Button
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
                }
              }}
              variant="default"
              className="text-muted-foreground hover:text-foreground"
            >
              {page}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          {/* <LoginButton onLoginSuccess={() => console.log("Login Success")} /> */}
        </div>
      </div>
    </header>
  );
}
