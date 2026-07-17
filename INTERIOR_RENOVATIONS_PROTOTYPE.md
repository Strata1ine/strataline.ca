# Interior Renovations Prototype

## Route

`/interior-renovations`

## Component Architecture

The prototype is isolated from the current Strataline site shell.

- `src/layouts/PrototypeLayout.astro` owns prototype metadata, fonts, Open Graph tags and structured data.
- `src/pages/interior-renovations.astro` composes the page sections and contains lightweight native JavaScript for the mobile menu, header scroll state, reveal effects and active subnavigation.
- `src/components/prototype/PrototypeHeader.astro` provides the new global prototype navigation.
- `src/components/prototype/PrototypeSubnav.astro` provides the sticky page-specific navigation.
- `src/components/prototype/EditorialHero.astro` provides the cinematic first viewport pattern.
- `src/components/prototype/StatementSection.astro` provides oversized editorial statements.
- `src/components/prototype/ProjectStory.astro` provides the large image-led project narrative pattern.
- `src/components/prototype/ProjectTypes.astro` provides stacked project-led panels.
- `src/components/prototype/CapabilityIndex.astro` provides capability grouping without a service-directory feel.
- `src/components/prototype/FeatureShowcase.astro` provides reusable image-and-copy service feature sections.
- `src/components/prototype/ProcessSequence.astro` provides the numbered renovation sequence.
- `src/components/prototype/ProjectGallery.astro` provides reusable selected-work cards.
- `src/components/prototype/ConsultationCTA.astro` provides the closing consultation section.
- `src/components/prototype/PrototypeFooter.astro` provides a minimal prototype footer.
- `src/data/interiorRenovationsPrototype.ts` stores repeated content, project entries, capability groups, process stages and final image requirements.

## Design Tokens

Prototype tokens live in `src/styles/interior-renovations-prototype.css` under `:root`.

They cover:

- Page background
- Primary and secondary text
- Borders
- Accent colour
- Light and dark surfaces
- Maximum and narrow content widths
- Section spacing
- Header and subnav height
- Border radii
- Shadow levels
- Motion duration and easing

The palette is intentionally neutral: warm white backgrounds, charcoal text, soft grey surfaces and a restrained warm bronze accent.

## Navigation Approach

The page uses two independent navigation layers:

- A prototype global header with Strataline branding, future top-level routes and a consultation action.
- A sticky section subnavigation for the interior-renovations page.

The mobile header uses an accessible button with `aria-controls` and `aria-expanded`. The page subnav remains compact and horizontally scrollable on smaller screens.

Temporary future-route links are intentionally explicit, such as `/renovations`, `/projects`, `/about` and `/contact`. No bare `#` links are used.

## Creating Another Prototype Page

To create another page using this system:

1. Create a new Astro route in `src/pages`.
2. Wrap it in `PrototypeLayout.astro`.
3. Reuse `PrototypeHeader`, `PrototypeSubnav`, `StatementSection`, `FeatureShowcase`, `ProcessSequence`, `ProjectGallery` and `ConsultationCTA` as needed.
4. Add page-specific content to a structured data file under `src/data`.
5. Add any route-specific CSS only if the existing prototype tokens and components cannot express the design.

## Isolation From Current Site

This prototype does not use the current `Root.astro`, global site header, global site footer or homepage section system.

It does not modify:

- Existing homepage content
- Existing service pages
- Existing navigation
- Existing footer
- Existing redirects
- Existing routes
- Existing metadata for current pages

The prototype stylesheet is imported only by `PrototypeLayout.astro`.

## Decisions Before Full-Site Conversion

Before converting the whole Strataline website to this direction, decide:

- Which final photography replaces each placeholder image.
- Whether the prototype navigation becomes the production navigation.
- Whether current service-page SEO templates remain separate or are redesigned around the prototype component system.
- Which pages become project-led versus service-led.
- How contact forms, photo estimates and phone actions should appear across desktop and mobile.
- Whether case studies become a formal content collection.
- Which animation and active-section behaviours should be retained for production.

