import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await expect(page).toHaveTitle(/Focusnow/);
});

test("RWD test", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 360, height: 640 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const page = await context.newPage();

  await page.goto("http://localhost:5173/");

  const navMenu = page.locator('//*[@id="root"]/header/div/div[1]/button[1]');
  await expect(navMenu).toBeVisible();
});

test("Login test", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.locator(".absolute > .inline-flex").click();
  await page.getByRole("banner").getByRole("button").nth(4).click();

  const loginButton = page.getByRole("heading", { name: "登入" });
  await expect(loginButton).toBeVisible();

  await page.getByRole("button", { name: "logo 使用訪客帳號登入" }).click();
  await page.getByRole("button", { name: "訪客帳號" }).click();

  const logoutButton = page.getByRole("banner").getByRole("button").nth(4);
  await expect(logoutButton).toBeVisible();
});
