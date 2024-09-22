import LoginButton from "../../components/LoginButton";
import useAuthStore from "../../store/authStore";
import { DefaultButton } from "../../components/Button";
import React, { useState } from "react";

interface HeaderProps {
  setPage: React.Dispatch<
    React.SetStateAction<"timer" | "analytics" | "game" | null>
  >;
  setTargetPosition: React.Dispatch<
    React.SetStateAction<[number, number, number] | null>
  >;
}

const Header: React.FC<HeaderProps> = ({ setPage, setTargetPosition }) => {
  const { user } = useAuthStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const handleLoginSuccess = () => {
    console.log("handleLoginSuccess");
  };

  const toggleBGM = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed flex justify-center items-center w-full h-16 mb-5 py-10 bg-[#D9D9D9] z-50">
      <DefaultButton
        onClick={() => {
          setTargetPosition([32, 20, -50]);
          setPage("timer");
        }}
      >
        Timer Page
      </DefaultButton>
      <DefaultButton
        onClick={() => {
          setPage("analytics");
          setTargetPosition([-75, 25, 100]);
        }}
      >
        Analytics Page
      </DefaultButton>
      <DefaultButton
        onClick={() => {
          setPage("game");
          setTargetPosition([5, 60, 10]);
        }}
      >
        Game Page
      </DefaultButton>
      {user ? (
        <div className="flex items-center mr-5">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="User Photo"
              className="w-12 h-12 rounded-full mr-4"
            />
          )}
          <div>
            <div className="text-xl font-semibold">{user.displayName}</div>
            <div className="text-gray-600">{user.email}</div>
          </div>
        </div>
      ) : (
        <div className="mb-4 text-gray-600">Not logged in</div>
      )}
      <LoginButton onLoginSuccess={handleLoginSuccess} />
      <button
        onClick={toggleBGM}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-36" // 使 BGM 按鈕靠右
      >
        {isPlaying ? "Stop BGM" : "Play BGM"}
      </button>

      <audio ref={audioRef} loop>
        <source
          src="Richard Clayderman - Les Premiers Sourires de Vanessa (Official Video) - Richard Clayderman Official (youtube).mp3"
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Header;
