import { test } from "@playwright/test";
import LandingPageTests from "./LandingPage.spec";
import TimerTests from "./Timer.spec";

test.describe("Landing Page Tests", () => {
  LandingPageTests();
});

test.describe("Timer Tests", () => {
  TimerTests();
});
