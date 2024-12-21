import { test, expect } from "@playwright/test";
import { devices } from "./devices";

async function navigateToTimerPage(page, device) {
  await page.goto("http://localhost:5173/");
  page.locator(".absolute > .inline-flex").click();
  if (device.isMobile) {
    const navMenu = page.locator('//*[@id="root"]/header/div/div[1]/button[1]');
    await navMenu.click();
  }
  const timerButton = device.isMobile
    ? page.getByRole("button", { name: "Timer" })
    : page.getByRole("navigation").getByRole("button", { name: "Timer" });
  await timerButton.click();
}

devices.forEach((device) => {
  test.describe(`${device.name} tests`, () => {
    test.use({
      viewport: device.viewport,
      deviceScaleFactor: device.deviceScaleFactor,
      isMobile: device.isMobile,
    });

    test("Timer Instructions", async ({ page }) => {
      await navigateToTimerPage(page, device);

      const TimerInstructions = page.getByText(
        "點擊這裡以控制 Todo List 的開啟與關閉。",
      );
      await expect(TimerInstructions).toBeVisible();

      const NextStep = page.locator('[data-test-id="button-primary"]');
      const PreviousStep = page.locator('[data-test-id="button-back"]');
      const SkipStep = page.locator('[data-test-id="button-skip"]');

      await NextStep.click();
      await expect(PreviousStep && NextStep && SkipStep).toBeEnabled();
      await SkipStep.click();
    });
  });
});
