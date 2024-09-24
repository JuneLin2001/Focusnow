import { useState, useRef } from "react";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import MusicOffIcon from "@mui/icons-material/MusicOff";
import IconButton from "@mui/material/IconButton";

const ToggleBgm = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleBgm = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <IconButton onClick={toggleBgm} color="inherit">
        {isPlaying ? <MusicOffIcon /> : <MusicNoteIcon />}
      </IconButton>
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
