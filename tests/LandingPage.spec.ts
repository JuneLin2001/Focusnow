import { test, expect } from "@playwright/test";
import { devices } from "./devices";

devices.forEach((device) => {
  test.describe(`${device.name} tests`, () => {
    test.use({
      viewport: device.viewport,
      deviceScaleFactor: device.deviceScaleFactor,
      isMobile: device.isMobile,
    });

    test("Can navigate to the home page", async ({ page }) => {
      await page.goto("http://localhost:5173/");
      await expect(page).toHaveTitle(/Focusnow/);
    });
    if (device.isMobile) {
      test("RWD test", async ({ page }) => {
        await page.goto("http://localhost:5173/");
        const navMenu = page.locator(
          '//*[@id="root"]/header/div/div[1]/button[1]',
        );
        await expect(navMenu).toBeVisible();
      });
    }

    test("Login test", async ({ page }) => {
      await page.goto("http://localhost:5173/");
      await page.locator(".absolute > .inline-flex").click();
      await page
        .getByRole("banner")
        .getByRole("button")
        .nth(device.isMobile ? 3 : 4)
        .click();

      const loginTitle = page.getByRole("heading", { name: "登入" });
      await expect(loginTitle).toBeVisible();

      await page.getByRole("button", { name: "logo 使用訪客帳號登入" }).click();
      await page.getByRole("button", { name: "訪客帳號" }).click();

      const logoutTitle = page
        .getByRole("banner")
        .getByRole("button")
        .nth(device.isMobile ? 3 : 4);
      await expect(logoutTitle).toBeVisible();
    });

    test("Initial Instructions", async ({ page }) => {
      await page.goto("http://localhost:5173/");
      const InitialInstructions = page.getByText(
        "場景介紹歡迎來到Focusnow！這是一個結合番茄鐘 & 3D 場景 & 企鵝互動遊戲的網站。下一步",
      );
      await expect(InitialInstructions).toBeVisible();

      const NextStep = page.getByRole("button", { name: "下一步" });
      const PreviousStep = page.getByRole("button", { name: "上一步" });
      const SkipStep = page.locator(".absolute > .inline-flex");

      await NextStep.click();

      await expect(PreviousStep && NextStep && SkipStep).toBeEnabled();
    });
  });
});
