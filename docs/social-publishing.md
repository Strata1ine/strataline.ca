# Automatic social publishing

## Safety default

When unset, mode is preview, publishing is disabled and backfill is disabled. No social adapter runs during Astro build, local development, tests, Deploy Previews or branch deploys. This task does not enable auto mode.

## Lifecycle

1. Astro generates /social-manifest.json.
2. Only published, indexable entries with social.enabled:true and social.ready:true enter it.
3. The production-only hourly social-dispatch Scheduled Function fetches the deployed manifest.
4. After at least 30 minutes live, it staggers platforms and writes durable Netlify Blob queue/state records.
5. It invokes protected social-publish as a Background Function.
6. The publisher re-fetches the production manifest, validates slug/platform/version, verifies article/media HTTP responses, acquires an atomic lock and calls one official adapter.
7. A platform failure cannot fail the deployment or block other platforms.
8. Protected social-status is read-only. Protected social-retry can only select a current manifest entry.

No build module imports a publishing adapter.

## Content configuration

The social object supports enabled, ready, version, publishAt, campaign, per-platform booleans, hook, summary, callToAction, hashtags, media and overrides. Media selections contain image, alt, rights, socialApproved, peopleVisible, peopleApproved, thirdPartySocialUseApproved, socialFit, focalPoint and background. Platform overrides support the exact Google summary, Facebook copy, Instagram caption/media, LinkedIn commentary/media, and Pinterest title/description/media/board.

Defaults derive from verified article title, description, location, service, problems, solutions and special conditions. Overrides prevent repetitive copy; they cannot inject runtime URLs.

Set ready:true only after production-page QA, final canonical, approved media/captions/claims and privacy review.

## Eligibility

- Tier A: all configured destinations.
- Tier B: Google Business Profile, Facebook, Instagram and Pinterest. LinkedIn additionally needs linkedinEligible:true or a verified planning/logistics/technical angle.
- Tier C/archive-project: never automatic.
- Renovation Guide: allowed only with an indexable, useful destination.
- Draft/non-indexable content: never included.

## Idempotency and Blob model

The key is platform:slug:v{social.version}. Ordinary edits do not republish. Increment version only for an intentional new cycle.

Blob keys:

- posts/{platform}/{slug}/v{version}: sanitized state.
- locks/{platform}/{slug}/v{version}: atomic onlyIfNew lock.
- queue/{timestamp}/{platform}/{slug}/v{version}: durable job.

States are pending, scheduled, publishing, published, failed, skipped and not-configured. Records include payload hash, attempts, platform ID/URL, destination, times, sanitized error and retry. Secrets never enter Blobs. Transient retries use bounded exponential backoff with five attempts.

## Official adapters

- Google Business Profile Local Posts: owned image, concise local summary and LEARN_MORE.
- Facebook Page: configured Strataline Page through Meta Graph photo publishing only.
- Instagram professional: official Meta content publishing; single image or 4–7-image carousel.
- LinkedIn organization: Posts API with current 202607 header and official image upload.
- Pinterest business: API v5 Pin creation to the configured business board.

API versions and platform dimensions are centralized in src/lib/social/config.ts.

## Rights, privacy and media

Only explicit selections can publish. Every selected asset requires rights and socialApproved:true. Visible people require peopleApproved:true. Third-party media additionally requires thirdPartySocialUseApproved:true.

Exact addresses and client names require explicit article approval before readiness. Newspaper artwork is excluded by default. The Toronto Star preview selects only Strataline-owned project photographs. Before/after sources remain separate Instagram slides. Sliders and webpage screenshots are never used.

The safe default is contain, so portrait and important renovation details are not destructively cropped. Manifest assets include descriptive planned filenames and platform dimensions.

## Copy and tracking

Each platform has a distinct deterministic template. It may use only verified metadata and cannot invent prices, warranties, permits, addresses, client names or unsupported claims.

Destinations add utm_source for google_business_profile, facebook, instagram, linkedin or pinterest; utm_medium=social; utm_campaign=projects_guides; and utm_content={slug}. Article canonicals remain unchanged.

## Pacing and backfill

New content has a 30-minute minimum delay. Platforms are staggered 0, 8, 18, 32 and 46 minutes.

Backfill remains dry-run only: Tier A first, strong media, search-priority stairs/popcorn work, distinctive condo/bathroom work, service rotation, maximum one item/platform/day and three stories/week. Tier C is excluded.

## Commands

- npm run social:preview -- --slug=... : local deterministic preview, no API calls.
- npm run social:status : signed protected status request.
- npm run social:retry -- --slug=... --platform=... : signed retry of a validated manifest item.
- npm run social:backfill -- --dry-run : ranked plan only.

Status/retry require SOCIAL_DISPATCH_SECRET and never display platform tokens.

## Environment and approval checklist

Core:

- SOCIAL_PUBLISH_MODE=preview initially; production-only auto after approval.
- SOCIAL_PUBLISH_ENABLED=false initially; true only with production auto mode.
- SOCIAL_BACKFILL_ENABLED=false.
- SOCIAL_DISPATCH_SECRET: strong random secret.
- Optional SOCIAL_APPROVED_ASSET_ORIGIN and SOCIAL_OPERATOR_ORIGIN.
- Optional META_GRAPH_VERSION for centralized Meta migration.

Google Business Profile:

- Google Cloud project and Business Profile API approval.
- OAuth consent with business.manage scope and verified location access.
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN.
- GOOGLE_BUSINESS_ACCOUNT_ID, GOOGLE_BUSINESS_LOCATION_ID.

Facebook/Instagram:

- Meta app review and required Page/Instagram publishing permissions.
- Strataline Page connected to a professional Instagram account.
- META_APP_ID, META_APP_SECRET for OAuth setup.
- META_ACCESS_TOKEN, META_FACEBOOK_PAGE_ID, META_INSTAGRAM_ACCOUNT_ID.

LinkedIn:

- Organization posting product/approval and w_organization_social.
- Authenticated member has an allowed organization role.
- LINKEDIN_ACCESS_TOKEN, LINKEDIN_ORGANIZATION_URN.

Pinterest:

- Pinterest business API approval with boards:read, boards:write, pins:read, pins:write.
- Destination boards created and verified.
- PINTEREST_ACCESS_TOKEN, PINTEREST_BOARD_ID.
- Optional service-board IDs: PINTEREST_BOARD_STAIRS_ID, PINTEREST_BOARD_CEILINGS_ID, PINTEREST_BOARD_BATHROOMS_ID, PINTEREST_BOARD_DOORS_WINDOWS_ID and PINTEREST_BOARD_INTERIORS_ID. Entry-level `social.overrides.pinterest.board` takes precedence; PINTEREST_BOARD_ID is the final fallback.

After configuration, remain in preview, inspect all five requested story previews, run validation/tests, then enable auto only in the production Netlify environment.

## Failures and updates

Missing credentials mark only that adapter not-configured. Rate/server failures retry safely; permanent authentication/media/content failures await correction and manual retry.

Article edits, dateModified or media changes do not delete or repost. Unpublishing needs manual social review. Future route moves must preserve old social destinations with redirects.
