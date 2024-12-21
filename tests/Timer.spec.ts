import { test, expect } from "@playwright/test";
import { devices } from "./devices";

async function navigateToTimerPage(page, device) {
  await page.goto("http://localhost:5173/");
  page.locator(".absolute > .inline-flex").click();

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
      test.setTimeout(120000);
      await navigateToTimerPage(page, device);
      await page.waitForTimeout(3000);

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

      await expect(TimerInstructions).not.toBeVisible();
    });

    test("Todo List", async ({ page }) => {
      test.setTimeout(120000);
      await navigateToTimerPage(page, device);
      await page.waitForTimeout(3000);
      await page.locator('[data-test-id="button-skip"]').click();

      const TodoInput = page.locator('input[placeholder="New Todo"]');
      await TodoInput.fill("123ABC一二三");

      const TodoAddButton = page.locator("#new-todo").getByRole("button");
      await TodoAddButton.click();

      const TodoBody = page.locator('//*[@id="todo-list"]/ul/li/input[2]');
      await TodoBody.waitFor({ state: "visible" });
      await expect(TodoBody).toHaveValue("123ABC一二三");

      await TodoBody.click();
      await TodoBody.fill("編輯測試edit test");
      await expect(TodoBody).toHaveValue("編輯測試edit test");

      const TodoCheckbox = page.locator('input[type="checkbox"]');
      await TodoCheckbox.click();

      const TodoItem = page.getByRole("listitem").getByRole("textbox");
      await expect(TodoItem).toHaveClass(/text-gray-500/);
      await expect(TodoItem).toHaveClass(/line-through/);

      const TodoDeleteButton = page.locator("li").getByRole("button");
      await TodoDeleteButton.click();
      await expect(TodoBody).not.toBeVisible();
    });
  });
});
