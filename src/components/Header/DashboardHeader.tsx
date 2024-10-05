import { Button } from "@/components/ui/button";
import LoginButton from "./LoginButton";
import WebsiteLogo from "../../assets/icons/logo.png";

interface DashboardHeaderProps {
  pages: string[];
  setPage: (newPage: "timer" | "analytics" | "game" | null) => void;
  setTargetPosition: (position: [number, number, number]) => void;
  setLookAtPosition: (position: [number, number, number]) => void;
}

export function DashboardHeader({
  setPage,
  setTargetPosition,
  setLookAtPosition,
}: DashboardHeaderProps) {
  return (
    <header className="fixed w-full bg-transparent border-transparent z-50 flex items-center h-24 border-b px-4 md:px-6">
      <div className="relative flex-grow flex items-center justify-between">
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

        <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
