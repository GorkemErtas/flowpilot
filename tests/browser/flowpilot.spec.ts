import { randomUUID } from "node:crypto";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PrismaClient } from "@prisma/client";
import { validPayload } from "../fixtures";

for (const width of [320, 390, 768, 1440]) {
  test(`responsive layout at ${width}px`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page).toHaveTitle(/FlowPilot/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "İşinize odaklanın.",
    );
    for (const reveal of await page.locator(".reveal").all()) {
      await expect(reveal).toHaveCSS("opacity", "1");
      await expect(reveal).toHaveCSS("transform", "none");
    }
    for (const heading of await page.locator("h1, h2, h3").all()) {
      expect(
        await heading.evaluate(
          (element) => element.scrollWidth <= element.clientWidth + 1,
        ),
      ).toBe(true);
    }
    await page.getByLabel("Ad soyad").scrollIntoViewIfNeeded();
    await expect(page.getByLabel("Ad soyad")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: testInfo.outputPath(`flowpilot-${width}.png`),
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });
}

test("mobile navigation works with keyboard and links", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Menüyü aç" });
  await toggle.click();
  await expect(
    page.getByRole("navigation", { name: "Mobil menü" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("navigation", { name: "Mobil menü" }),
  ).not.toBeVisible();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page
    .getByRole("navigation", { name: "Mobil menü" })
    .getByRole("link", { name: "Görüşme talep edin" })
    .click();
  await expect(page).toHaveURL(/#talep$/);
  await expect(
    page.getByRole("navigation", { name: "Mobil menü" }),
  ).not.toBeVisible();
});

for (const width of [390, 1440]) {
  test(`WCAG accessibility scan at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.getByLabel("Ad soyad").scrollIntoViewIfNeeded();
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
  });
}

test("browser submission returns a receipt backed by a committed PostgreSQL row", async ({
  page,
}) => {
  const db = new PrismaClient({
    datasources: { db: { url: process.env.TEST_DATABASE_URL } },
  });
  let insertedId: string | undefined;
  try {
    await page.goto("/#talep");
    const email = `browser-${randomUUID()}@example.com`;
    await page.getByLabel("Ad soyad").fill(validPayload.fullName);
    await page.getByLabel("E-posta adresi").fill(email);
    await page
      .getByLabel("İlgilendiğiniz hizmet")
      .selectOption("AI_INTEGRATION");
    await page
      .getByLabel("Hangi süreci iyileştirmek istiyorsunuz?")
      .fill(validPayload.description);
    const pending = page.waitForResponse(
      (response) =>
        response.url().endsWith("/api/requests") &&
        response.request().method() === "POST",
    );
    await page.getByRole("button", { name: "Talebinizi gönderin" }).click();
    const response = await pending;
    expect(response.status()).toBe(201);
    const receipt = await response.json();
    insertedId = receipt.data.id;
    await expect(
      page.getByRole("heading", { name: "Talebiniz kaydedildi." }),
    ).toBeVisible();
    await expect(page.getByRole("status")).toBeFocused();
    const record = await db.serviceRequest.findUniqueOrThrow({
      where: { id: insertedId },
    });
    expect(record.email).toBe(email);
    expect(record.service).toBe("AI_INTEGRATION");
    expect(record.createdAt.toISOString()).toBe(receipt.data.createdAt);
    console.info(
      `Browser → HTTP 201 → PostgreSQL readback verified: ${record.id}`,
    );
  } finally {
    if (insertedId)
      await db.serviceRequest.delete({ where: { id: insertedId } });
    await db.$disconnect();
  }
});
