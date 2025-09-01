import {
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  ChevronsDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToggleTodoListProps {
  toggleSidebar: () => void;
  isSideBarOpen: boolean;
}

const ToggleTodoList: React.FC<ToggleTodoListProps> = ({
  toggleSidebar,
  isSideBarOpen,
}) => {
  return (
    <div className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-[15rem] transform lg:-translate-y-1/2 lg:translate-x-[12.5rem]">
      <Button
        id="toggle-sidebar"
        className="transition-transform"
        variant="timerGhost"
        size="icon"
        onClick={toggleSidebar}
      >
        {isSideBarOpen ? (
          <>
            <ChevronsLeft className="hidden lg:block" />
            <ChevronsUp className="block lg:hidden" />
          </>
        ) : (
          <>
            <ChevronsRight className="hidden lg:block" />
            <ChevronsDown className="block lg:hidden" />
          </>
        )}
      </Button>
    </div>
  );
};

export default ToggleTodoList;
