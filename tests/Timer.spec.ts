import { test, expect } from "@playwright/test";
import { devices } from "./devices";

devices.forEach((device) => {
  test.describe(`${device.name} tests`, () => {
    test.use({
      viewport: device.viewport,
      deviceScaleFactor: device.deviceScaleFactor,
      isMobile: device.isMobile,
    });

    test("Initial Instructions", async ({ page }) => {
      await page.goto("http://localhost:5173/");
      page.locator(".absolute > .inline-flex").click();

      let headerTimerButton;
      if (device.isMobile) {
        const navMenu = page.locator(
          '//*[@id="root"]/header/div/div[1]/button[1]',
        );
        await navMenu.click();
        headerTimerButton = page.getByRole("button", { name: "Timer" });
      } else {
        headerTimerButton = page
          .getByRole("navigation")
          .getByRole("button", { name: "Timer" });
      }
      await expect(headerTimerButton).toBeEnabled();
      if (device.isMobile) {
        page.getByRole("button", { name: "Close" }).click();
      }

      const UIButtonTimer = device.isMobile
        ? page.getByRole("button", { name: "Timer" })
        : page.getByRole("button", { name: "Timer" }).nth(1);

      expect(headerTimerButton).toBeEnabled();
      expect(UIButtonTimer).toBeEnabled();

      UIButtonTimer.click();
      const InitialInstructions = page.getByText(
        "點擊這裡以控制 Todo List 的開啟與關閉。",
      );
      await expect(InitialInstructions).toBeVisible();

      const NextStep = page.locator('[data-test-id="button-primary"]');
      const PreviousStep = page.locator('[data-test-id="button-back"]');
      const SkipStep = page.locator('[data-test-id="button-skip"]');

      await NextStep.click();

      await expect(PreviousStep && NextStep && SkipStep).toBeEnabled();

      await SkipStep.click();
    });
  });
});
