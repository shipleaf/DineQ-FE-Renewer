import dotenv from "dotenv";
dotenv.config();

import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const runAllProjects = process.env.PLAYWRIGHT_ALL_PROJECTS === "true";
const shouldStartWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER !== "true";
const repeatEach = Number(process.env.PLAYWRIGHT_REPEAT_EACH ?? "1");

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  repeatEach,
  workers: 1,
  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: runAllProjects
    ? [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "mobile-safari", use: { ...devices["iPhone 13"] } },
        { name: "mobile-chrome", use: { ...devices["Pixel 5"] } },
      ]
    : [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  webServer: shouldStartWebServer
    ? {
        command: "pnpm dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
