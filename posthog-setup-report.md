# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Mesio platform. The following changes were made:

- **`instrumentation-client.ts`** (new) — initializes PostHog on every client-side page load using the Next.js 15.3+ convention; configures the reverse proxy host (`/ingest`), disables autocapture and automatic pageviews (intentional manual tracking), and enables error tracking via `capture_exceptions: true`.
- **`next.config.ts`** — added reverse proxy rewrites (`/ingest/*`) to route PostHog traffic through the app, reducing ad-blocker interference. Also set `skipTrailingSlashRedirect: true` as required by PostHog.
- **`src/lib/analytics/posthog-client.ts`** — removed the lazy `posthog.init()` call (now handled by `instrumentation-client.ts`); added `identifyUser()` and `resetUser()` helpers.
- **`src/lib/analytics/events.ts`** — added three new event constants: `USER_LOGGED_IN`, `INVITE_ACCEPTED`, `USER_LOGGED_OUT`. Made `tenant_id`/`slug` optional on `AnalyticsEventProperties` to support admin-panel events.
- **`src/lib/analytics/posthog-node-capture.ts`** (new) — lightweight server-side capture client using `posthog-node` (flushAt=1, flushInterval=0 for serverless compatibility).
- **`src/app/auth/login/login-form.tsx`** — calls `posthog.identify()` with the user's Firebase UID on successful login, then captures `user_logged_in` with `role` and `tenant_id`.
- **`src/hooks/use-auth.ts`** — captures `user_logged_out` and calls `posthog.reset()` before signing out, unlinking the session from the user.
- **`src/features/auth/invite-accept-client.tsx`** — identifies the user and captures `invite_accepted` in both the new-account and existing-session acceptance paths.
- **`src/app/api/auth/session/route.ts`** — server-side capture of `user_logged_in` (using the Firebase UID as distinct ID) via `posthog-node` on every successful session creation.
- **`src/app/api/invites/[token]/accept/route.ts`** — server-side capture of `invite_accepted` (with `tenant_id`) via `posthog-node` on every successful invite acceptance.
- **`.env.local`** — populated `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, and `POSTHOG_PROJECT_ID`.

| Event | Description | File |
|---|---|---|
| `page_view` | Public landing page viewed (already existed) | `src/components/public/public-analytics-provider.tsx` |
| `qr_visit` | Page visited via QR code (already existed) | `src/components/public/public-analytics-provider.tsx` |
| `product_open` | Product drawer opened (already existed) | `src/components/public/product-detail-context.tsx` |
| `whatsapp_click` | WhatsApp link clicked (already existed) | `src/components/public/public-analytics-provider.tsx` |
| `user_logged_in` | Admin successfully logged in | `src/app/auth/login/login-form.tsx` + `src/app/api/auth/session/route.ts` |
| `invite_accepted` | Restaurant admin accepted invite and activated account | `src/features/auth/invite-accept-client.tsx` + `src/app/api/invites/[token]/accept/route.ts` |
| `user_logged_out` | Admin logged out | `src/hooks/use-auth.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/489984/dashboard/1772170)
- [Public page views (30d)](https://us.posthog.com/project/489984/insights/7nhWpSUO)
- [WhatsApp clicks (30d)](https://us.posthog.com/project/489984/insights/ytnZol6V)
- [Visitor conversion funnel](https://us.posthog.com/project/489984/insights/2ZEScpKA)
- [Admin logins (30d)](https://us.posthog.com/project/489984/insights/j43q9c9H)
- [New restaurants onboarded (90d)](https://us.posthog.com/project/489984/insights/wDpGyEMO)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, and `POSTHOG_PROJECT_ID` to `.env.example` and any deployment environment configs (Vercel, etc.) so collaborators know what to set. The public key is safe to commit; the personal API key (`POSTHOG_PERSONAL_API_KEY`) is a secret.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify correctly for PostHog error tracking.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login. A user who is already logged in and returns in a new tab will be anonymous until they log in again. Consider calling `identify` in the `onAuthStateChanged` handler in `use-auth.ts` when a Firebase user is already present on mount.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
