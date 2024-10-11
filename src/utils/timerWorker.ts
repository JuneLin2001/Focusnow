import { WorkerMessage, WorkerResponse } from "../types/type";

let timerId: number | null = null;

self.onmessage = function (e: MessageEvent<WorkerMessage>) {
  if (e.data.action === "start") {
    const { startTime, endTime } = e.data;
    if (startTime !== undefined && endTime !== undefined) {
      updateTimer(startTime, endTime);
    }
  } else if (e.data.action === "stop") {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
  }
};

function updateTimer(startTime: number, endTime: number): void {
  const now = Date.now();
  const elapsedSeconds = Math.floor((now - startTime) / 1000);
  const totalSeconds = Math.floor((endTime - startTime) / 1000);
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

  if (remainingSeconds === 0) {
    const response: WorkerResponse = { type: "timerComplete" };
    self.postMessage(response);
  } else {
    const response: WorkerResponse = {
      type: "tick",
      secondsLeft: remainingSeconds,
    };
    self.postMessage(response);
    timerId = self.setTimeout(() => updateTimer(startTime, endTime), 1000);
  }
}
