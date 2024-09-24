import { useState, useRef } from "react";

const ToggleBgm = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleBGM = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <button
        onClick={toggleBGM}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-36"
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
    </>
  );
};

export default ToggleBgm;
