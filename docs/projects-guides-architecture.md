# Projects & Guides architecture

## Canonical library

/blog is the only Projects & Guides archive. The visitor-facing navigation label is Projects & Guides and links to /blog. Technical collection names may continue to use blog.

The required hub order is the visual hero and accurate counts, featured Project Story, service discovery, problem discovery, latest stories, Renovation Guides, location discovery, archive selections, and CTA. All taxonomy and card links are server-rendered. Client search only filters the current rendered page. Pagination uses 18 entries and /blog/page/{number}.

The archive count of 160 means completed Strataline renovations in the source archive. It is never presented as 160 published articles. The published detailed-story count is calculated.

## Derived registry

src/data/projectsGuides.ts derives the registry from the Astro blog collection. No second database exists. Explicit frontmatter overrides inference.

Supported fields include contentType, qualityTier, primaryService, secondaryServices, city, neighbourhood, propertyType, problems, solutions, materials, specialConditions, archiveId, featured, hubProminence, relatedProjects, relatedGuides, relatedServices, reviewId, mediaFeature, indexable and social. Existing title, description, hero, article and media fields remain authoritative.

## Tiers

- Tier A: flagship, media-rich, indexable Project Story.
- Tier B: useful supporting Project Story or Guide with a strong destination.
- Tier C: archive record only. Use contentType: archive-project, qualityTier: C and indexable: false. It has no thin standalone URL and never auto-publishes.

## Hubs

Category hubs exist for stairs, ceilings, bathrooms, condos, interior renovations, doors/windows, flooring, painting, basements and planning/costs. Each has unique copy, real projects, relevant guides, service link, CTA, breadcrumb, canonical, CollectionPage schema and crawlable links. A category requires at least two relevant entries.

Location hubs use /blog/locations/{city} and require at least three published Project Stories. Toronto currently meets the threshold.

## Automatic connections

BlogConnections.astro is rendered by both shared article paths. Deterministic scoring prioritizes same primary service, category overlap, verified problem overlap, city, property type, then date and slug. Curated relatedProjects and relatedGuides take precedence.

Service pages use RealProjects.astro. Homepage work cards link to a genuine Project Story first and the commercial service second when a matching story exists.

## Media and indexing

The existing Project Story renderer, Finished Project gallery, shared lightbox and manual pair rule remain authoritative: A = AFTER, B = BEFORE, and matching number is a deliberate pair.

Astro assets preserve dimensions and descriptive alt text. Project heroes enter the image sitemap. Social has a separate rights layer and never publishes sliders or webpage screenshots.

The existing sitemap index is preserved. /projects-guides-sitemap-index.xml groups Project Stories, Guides, hubs and project images. Draft, Tier C and indexable:false entries are excluded. Extensionless URLs are canonical; internal .html links fail validation.

## Validation and social lifecycle

npm run validate:projects-guides checks slugs, Tier C state, Project Facts, routes, shared connections and internal URLs. An indexed article can remain socially unready. Social distribution requires explicit enabled and ready gates after production QA. See docs/social-publishing.md.
