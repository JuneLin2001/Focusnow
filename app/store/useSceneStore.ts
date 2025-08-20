import { create } from "zustand";

interface SceneState {
  targetPosition: [number, number, number];
  lookAtPosition: [number, number, number];
  setTargetPosition: (pos: [number, number, number]) => void;
  setLookAtPosition: (pos: [number, number, number]) => void;
}

const useSceneStore = create<SceneState>((set) => ({
  targetPosition: [-250, 60, 10],
  lookAtPosition: [0, 0, 0],
  setTargetPosition: (pos) => set({ targetPosition: pos }),
  setLookAtPosition: (pos) => set({ lookAtPosition: pos }),
}));

export default useSceneStore;
