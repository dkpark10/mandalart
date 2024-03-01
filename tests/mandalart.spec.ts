import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("서브 타이틀 싱크 테스트", () => {
  test("서브 타이틀 입력 테스트", async ({ page }) => {
    const arr = [
      [0, 4],
      [1, 4],
      [2, 4],
      [3, 4],
      [5, 4],
      [6, 4],
      [7, 4],
      [8, 4],
    ];

    for (let i = 0; i < arr.length; i += 1) {
      const [row, col] = arr[i];
      const inputValue = `${row}-${col}키 서브 타이틀 입력`;
      await page.getByTestId(`edit-${row}-${col}`).focus();
      await page.keyboard.type(inputValue);

      const textContent = await page.evaluate(
        ({ row, col }) => {
          const el = document.querySelector(
            `[data-testid="edit-${row}-${col}"]`
          );
          return el?.textContent;
        },
        { row, col }
      );

      expect(textContent).toEqual(inputValue);
    }
  });

  test("가운데에서 서브 타이틀 입력 테스트", async ({ page }) => {
    const arr = [
      [4, 0],
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 5],
      [4, 6],
      [4, 7],
      [4, 8],
    ];

    for (let i = 0; i < arr.length; i += 1) {
      const [row, col] = arr[i];
      const inputValue = `${row}-${col}키 서브 타이틀 입력`;
      await page.getByTestId(`edit-${row}-${col}`).focus();
      await page.keyboard.type(inputValue);

      const textContent = await page.evaluate(
        ({ row, col }) => {
          const el = document.querySelector(
            `[data-testid="edit-${row}-${col}"]`
          );
          return el?.textContent;
        },
        { row, col }
      );

      expect(textContent).toEqual(inputValue);
    }
  });
});
