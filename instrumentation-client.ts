import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  defaults: "2026-05-30",
  capture_pageview: false,
  capture_pageleave: false,
  autocapture: false,
  persistence: "localStorage+cookie",
  capture_exceptions: true,
  debug: process.env.NODE_ENV === "development",
});
