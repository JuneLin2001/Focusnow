export interface Device {
  name: string;
  viewport: { width: number; height: number };
  deviceScaleFactor: number;
  isMobile: boolean;
}

export const devices: Device[] = [
  {
    name: "Desktop",
    viewport: { width: 1920, height: 1080 },
    isMobile: false,
    deviceScaleFactor: 1,
  },
  {
    name: "Mobile",
    viewport: { width: 360, height: 640 },
    isMobile: true,
    deviceScaleFactor: 2,
  },
];
