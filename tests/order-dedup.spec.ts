import { expect, test, type Page, type Request } from "@playwright/test";

const ORDER_TOKEN = process.env.PLAYWRIGHT_ORDER_TOKEN;
const ORDER_TABLE_ID = process.env.PLAYWRIGHT_ORDER_TABLE_ID;
const CREATE_ORDER_API_PATH = "/api/v1/orders";
const CREATE_ORDER_REQUEST_DELAY_MS = Number(
  process.env.PLAYWRIGHT_CREATE_ORDER_DELAY_MS ?? "1500"
);
const CONFIRM_RECLICK_DELAY_MS = Number(
  process.env.PLAYWRIGHT_CONFIRM_RECLICK_DELAY_MS ?? "0"
);

const CART_LABEL = /\uC7A5\uBC14\uAD6C\uB2C8/;
const ADD_TO_CART_LABEL = /\uC7A5\uBC14\uAD6C\uB2C8 \uB2F4\uAE30/;
const ORDER_LABEL = /\uC8FC\uBB38\uD558\uAE30/;
const CONFIRM_LABEL = "\uD655\uC778";

function buildOrderUrl(): string {
  if (!ORDER_TOKEN || !ORDER_TABLE_ID) {
    throw new Error(
      "PLAYWRIGHT_ORDER_TOKEN and PLAYWRIGHT_ORDER_TABLE_ID must be set before running this spec."
    );
  }

  const searchParams = new URLSearchParams({
    token: ORDER_TOKEN,
    tableId: ORDER_TABLE_ID,
  });

  return `/order?${searchParams.toString()}`;
}

function isCreateOrderRequest(request: Request): boolean {
  if (request.method() !== "POST") {
    return false;
  }

  if (!request.url().includes(CREATE_ORDER_API_PATH)) {
    return false;
  }

  const rawBody = request.postData();
  if (!rawBody) {
    return false;
  }

  try {
    const body = JSON.parse(rawBody) as { orders?: unknown };
    return Array.isArray(body.orders);
  } catch {
    return false;
  }
}

async function attachCreateOrderTracker(page: Page, delayMs: number) {
  let createOrderRequestCount = 0;

  await page.route(`**${CREATE_ORDER_API_PATH}`, async (route) => {
    const request = route.request();

    if (!isCreateOrderRequest(request)) {
      await route.continue();
      return;
    }

    createOrderRequestCount += 1;
    await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    await route.continue();
  });

  return {
    getCount: () => createOrderRequestCount,
    waitForResponse: () =>
      page.waitForResponse((response) => isCreateOrderRequest(response.request()), {
        timeout: 30_000,
      }),
  };
}

async function addFirstMenuToCart(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle");

  const firstMenuCard = page.locator("[data-menu-id]").first();
  await expect(firstMenuCard).toBeVisible();

  const menuId = await firstMenuCard.getAttribute("data-menu-id");
  if (!menuId) {
    throw new Error("menuId not found");
  }

  await Promise.all([
    page.waitForURL(new RegExp(`/order/${menuId}\\?`), { timeout: 10_000 }),
    firstMenuCard.click(),
  ]);

  const addToCartButton = page.getByRole("button", { name: ADD_TO_CART_LABEL });
  await expect(addToCartButton).toBeVisible({ timeout: 10_000 });
  await addToCartButton.click();
  await expect(page).toHaveURL(/\/order\?/);
}

async function openOrderConfirmModal(page: Page): Promise<void> {
  const cartButton = page.getByRole("button", { name: CART_LABEL }).first();
  await expect(cartButton).toBeVisible({ timeout: 10_000 });
  await cartButton.click();

  const orderButton = page.getByRole("button", { name: ORDER_LABEL });
  await expect(orderButton).toBeVisible({ timeout: 10_000 });
  await orderButton.click();

  await expect(page.getByRole("button", { name: CONFIRM_LABEL })).toBeVisible({
    timeout: 10_000,
  });
}

async function doubleClickConfirmButton(page: Page, reclickDelayMs: number): Promise<void> {
  const confirmButton = page.getByRole("button", { name: CONFIRM_LABEL });
  await expect(confirmButton).toBeVisible({ timeout: 10_000 });
  await confirmButton.scrollIntoViewIfNeeded();

  const boundingBox = await confirmButton.boundingBox();
  if (!boundingBox) {
    throw new Error("Confirm button bounding box not found");
  }

  const clickX = boundingBox.x + boundingBox.width / 2;
  const clickY = boundingBox.y + boundingBox.height / 2;

  await page.mouse.move(clickX, clickY);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitForTimeout(reclickDelayMs);
  await page.mouse.down();
  await page.mouse.up();
}

async function expectSingleCreateOrderRequest(
  page: Page,
  submit: () => Promise<void>
): Promise<void> {
  const tracker = await attachCreateOrderTracker(page, CREATE_ORDER_REQUEST_DELAY_MS);

  await page.goto(buildOrderUrl(), { waitUntil: "domcontentloaded" });
  await addFirstMenuToCart(page);
  await openOrderConfirmModal(page);

  const createOrderResponsePromise = tracker.waitForResponse();
  await submit();

  const createOrderResponse = await createOrderResponsePromise;
  expect(createOrderResponse.ok()).toBeTruthy();
  expect(tracker.getCount()).toBe(1);
}

test.describe("live order flow", () => {
  test.skip(
    !ORDER_TOKEN || !ORDER_TABLE_ID,
    "Set PLAYWRIGHT_ORDER_TOKEN and PLAYWRIGHT_ORDER_TABLE_ID before running this spec."
  );

  test("dedupes two rapid real confirm clicks and sends one create-order request", async ({
    page,
  }) => {
    test.slow();
    await expectSingleCreateOrderRequest(page, () =>
      doubleClickConfirmButton(page, CONFIRM_RECLICK_DELAY_MS)
    );
  });
});
