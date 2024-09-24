import { HeaderButton } from "../Button";
import ToggleBgm from "./ToggleBgm";
import HandleLogin from "./HandleLogin";

interface HeaderProps {
  setPage: (newPage: "timer" | "analytics" | "game" | null) => void; // 原始 setPage
  setPageWithDelay: (newPage: "timer" | "analytics" | "game" | null) => void; // 延遲版本
  setTargetPosition: (position: [number, number, number]) => void;
}

const Header: React.FC<HeaderProps> = ({
  setPage,
  setPageWithDelay,
  setTargetPosition,
}) => {
  return (
    <div className="fixed flex justify-center items-center w-full h-16 mb-5 py-10 z-50 bg-red-300">
      <HeaderButton
        onClick={() => {
          setPage(null);
          setTargetPosition([32, 20, -50]);
          setPageWithDelay("timer");
        }}
      >
        Timer Page
      </HeaderButton>
      <HeaderButton
        onClick={() => {
          setPage(null);
          setTargetPosition([-75, 25, 100]);
          setPageWithDelay("analytics");
        }}
      >
        Analytics Page
      </HeaderButton>
      <HeaderButton
        onClick={() => {
          setPage(null);
          setTargetPosition([5, 60, 10]);
        }}
      >
        Game Page
      </HeaderButton>
      <HandleLogin />
      <ToggleBgm />
    </div>
  );
};

export default Header;
