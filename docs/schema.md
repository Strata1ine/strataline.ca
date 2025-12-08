# Content Schema Documentation

This document describes the YAML schema conventions for content files in the `/content` directory.

## Directory Structure

```
content/
├── index.yaml                    # Homepage content
├── business.json                 # Business information
├── socials.json                  # Social media links
├── privacy.md                    # Privacy policy
├── redirects.json                # URL redirects
└── services/
    └── [service-name]/
        ├── index.yaml            # Service page content
        ├── cover.jpg             # Service cover image (required)
        └── photos/               # Optional: Additional photos
            └── *.jpg, *.webp
```

## Service Page Schema (`/content/services/[name]/index.yaml`)

### Required Fields

- `title` (string): Service name displayed on the page
- `desc` (string): Short description (use `|-` for multi-line)
- `seo` (string): SEO meta description (use `|-` for multi-line)
- `image` (object): Cover image
  - `src` (string): Path to image relative to service directory (e.g., `./cover.jpg`)
  - `alt` (string): Alt text for accessibility (use `|-` for multi-line)

### Optional Fields

- `startPos` (string): Layout position - `"left"` or `"right"` (default: `"left"`)
- `draft` (boolean): Set to `true` to hide from production
- `sections` (array): Array of section objects (see Section Types below)

### Example

```yaml
title: Bathrooms
startPos: left
desc: |-
  Create your personal sanctuary, beautifully designed and customized to your exact preferences.
seo: |-
  Stylish bathroom remodels with bespoke vanities, premium stone tiles, and sleek fixtures.
image:
  src: ./cover.jpg
  alt: |-
    A modern bathroom featuring a sleek glass shower with marble tile.
sections:
  - type: Prices
    title: What's the cost?
    # ... section content
```

## Index Page Schema (`/content/index.yaml`)

### Required Fields

- `title` (string): Site title
- `desc` (string): Site description
- `popular` (array): Array of service slugs to feature (e.g., `["popcorn-removal", "stairs"]`)
- `sections` (array): Array of section objects

### Example

```yaml
title: Dust-Free Renovation
desc: Transform your home with dust-free, quality renovations.
popular:
  - popcorn-removal
  - stairs
sections:
  - type: Header
    # ... section content
```

## Section Types

All sections support an optional `id` field for anchor navigation. Most sections also support an optional `pos` field (`"left"` or `"right"`, default: `"left"`) for layout positioning.

**Available Section Types:**
- `Header` - Navigation menu
- `Hero` - Hero section with image slideshow
- `Popular` - Displays popular services
- `Services` - Grid of service cards
- `Prices` - Pricing tiers with materials
- `ZigZag` - Alternating image and text layout
- `TextCarousel` - Rotating text carousel
- `ImageCarousel` - Image carousel/gallery
- `Gallery` - Image gallery grid
- `ImagePanel` - Grid of images with titles
- `Benefits` - Grid of benefit cards
- `Faq` - Frequently asked questions
- `Reviews` - Customer testimonials
- `Cardshow` - Featured media cards

### Header

Navigation header with menu items.

**Required Fields:**
- `content` (array): Array of menu item objects
  - `id` (string): Anchor ID for navigation
  - `name` (string): Menu item label

```yaml
- type: Header
  content:
    - id: popular
      name: Popular
    - id: explore
      name: Explore
```

### Hero

Hero section with image slideshow.

**Required Fields:**
- `title` (string): Hero title
- `desc` (string): Hero description
- `content` (object): Content object
  - `images` (array): Array of image objects (see Image Schema)

**Optional Fields:**
- `id` (string): Anchor ID for navigation
- `content.speed` (number): Slideshow speed in seconds (default: 5.0)

```yaml
- type: Hero
  id: hero  # Optional
  title: |-
    Renovations designed to transform your space
  desc: |-
    We have been transforming spaces dust-free for decades.
  content:
    images:
      - src: ./photos/slideshow/kitchen.jpg
        alt: |-
          A large renovated kitchen showcasing a generous countertop.
    speed: 5.0  # Optional: default is 5.0
```

### Popular

Displays popular services (uses `popular` array from index.yaml).

**Required Fields:**
- `title` (string): Section title

**Optional Fields:**
- `id` (string): Anchor ID for navigation
- `pos` (string): Layout position - `"left"` or `"right"` (default: `"left"`)

```yaml
  - type: Popular
  id: popular  # Optional: anchor ID
  pos: left    # Optional: default is "left"
  title: Popular services  # Note: Only first word capitalized
```

### Services

Grid of service cards.

**Required Fields:**
- `title` (string): Section title (default: "There's more to explore" if not provided)

**Optional Fields:**
- `id` (string): Anchor ID for navigation
- `pos` (string): Layout position - `"left"` or `"right"` (default: `"left"`)
- `exclude` (array): Array of service slugs to exclude from display
- `content` (object): Optional text carousel content (uses TextCarousel schema)
  - `text` (array): Array of text strings
  - `speed` (number): Carousel speed (optional, default: 0.1)
  - `id` (string): Optional ID

```yaml
- type: Services
  id: explore  # Optional: anchor ID
  pos: left    # Optional: default is "left"
  title: Explore our services  # Optional: defaults to "There's more to explore" (note: only first word capitalized)
  exclude:     # Optional: array of service slugs to exclude
    - kitchens
  content:     # Optional: text carousel content
    text:
      - Made with care
      - No mess
      - No dust
    speed: 0.1  # Optional: carousel speed
```

### Prices

Pricing tiers with materials list.

**Required Fields:**
- `title` (string): Section title
- `content` (array): Array of price tier objects
  - `title` (string): Tier name (e.g., "Basic", "Mid-range")
  - `min` (number): Minimum price (must be >= 0)
  - `max` (number): Maximum price (must be >= 0)
  - `materials` (array): Array of material strings
  - `desc` (string): Description of what's included

**Optional Fields:**
- `id` (string): Anchor ID for navigation
- `pos` (string): Layout position - `"left"` or `"right"` (default: `"left"`)

```yaml
- type: Prices
  id: pricing  # Optional: anchor ID
  pos: left    # Optional: default is "left"
  title: What's the cost?
  content:
    - title: Basic
      min: 5000
      max: 15000
      materials:
        - Basic tiles
        - Laminate countertops
        - Standard fixtures
      desc: |-
        Cosmetic updates like painting, new fixtures, and minor changes.
    - title: Mid-range
      min: 15000
      max: 30000
      materials:
        - Premium tiles
        - Granite or quartz countertops
      desc: |-
        Upgraded materials, replacing the bathtub, installing a new shower.
```

### ZigZag

Alternating image and text layout.

**Required Fields:**
- `title` (string): Section title
- `content` (array): Array of zigzag items
  - `title` (string): Item title
  - `desc` (string): Item description
  - `image` (object): Image object (see Image Schema)

**Optional Fields:**
- `id` (string): Anchor ID for navigation
- `pos` (string): Layout position - `"left"` or `"right"` (default: `"left"`)

```yaml
- type: ZigZag
  id: features  # Optional: anchor ID
  pos: left      # Optional: default is "left"
  title: No compromise solutions
  content:
    - title: Ample space
      image:
        src: ./space.jpg
        alt: A spacious, dust-free kitchen renovation.
      desc: |-
        Cabinets, pull-out drawers, and pantry space keep the kitchen organized.
    - title: Quality & low-maintenance
      image:
        src: ./quality.jpg
        alt: A modern kitchen featuring durable white countertops.
      desc: |-
        Durable countertops, sturdy cabinetry, and reliable appliances.
```

### TextCarousel

Rotating text carousel.

**Required Fields:**
- `text` (array): Array of text strings to display

**Optional Fields:**
- `id` (string): Anchor ID for navigation
- `speed` (number): Carousel rotation speed (default: 0.1)

```yaml
- type: TextCarousel
  id: taglines  # Optional: anchor ID
  speed: 0.1    # Optional: default is 0.1
  text:
    - Modern kitchen vibes await
    - Sizzle in style every day
    - Cook with flair and ease
    - Sleek style upgrades shine
```

### ImageCarousel

Image carousel/gallery.

**Required Fields:**
- `content` (array): Array of image objects (see Image Schema)

**Optional Fields:**
- `id` (string): Anchor ID for navigation

```yaml
- type: ImageCarousel
  id: gallery  # Optional: anchor ID
  content:
    - src: ./photos/10.jpg
      alt: A carpeted staircase with wooden handrails.
    - src: ./photos/00.jpg
      alt: A grand staircase with dark wood steps.
```

### Gallery

Image gallery grid.

**Required Fields:**
- `title` (string): Section title
- `content` (array): Array of image objects (see Image Schema)

**Optional Fields:**
- `id` (string): Anchor ID for navigation
- `pos` (string): Layout position - `"left"` or `"right"` (default: `"left"`)

```yaml
- type: Gallery
  id: gallery  # Optional: anchor ID
  pos: left    # Optional: default is "left"
  title: View our work
  content:
    - src: ./photos/10.jpg
      alt: A carpeted staircase with wooden handrails.
    - src: ./photos/00.jpg
      alt: A grand staircase with dark wood steps.
```

### ImagePanel

Grid of images with titles.

**Required Fields:**
- `title` (string): Section title
- `content` (array): Array of panel items
  - `title` (string): Panel item title
  - `image` (object): Image object (see Image Schema)

**Optional Fields:**
- `id` (string): Anchor ID for navigation
- `pos` (string): Layout position - `"left"` or `"right"` (default: `"left"`)

```yaml
- type: ImagePanel
  id: process  # Optional: anchor ID
  pos: left    # Optional: default is "left"
  title: Our process
  content:
    - title: Inspection
      image:
        src: ./before.jpg
        alt: |-
          A living room with a textured popcorn ceiling.
    - title: Removal
      image:
        src: ./removal.jpg
        alt: |-
          A protected room prepared for ceiling refinishing.
```

### Benefits

Grid of benefit cards.

**Required Fields:**
- `title` (string): Section title
- `content` (array): Array of benefit items
  - `title` (string): Benefit title
  - `desc` (string): Benefit description

**Optional Fields:**
- `id` (string): Anchor ID for navigation
- `pos` (string): Layout position - `"left"` or `"right"` (default: `"left"`)

```yaml
- type: Benefits
  id: benefits  # Optional: anchor ID
  pos: left     # Optional: default is "left"
  title: Why remove popcorn ceilings?
  content:
    - title: Aesthetic upgrade
      desc: |-
        Modern homes have smooth ceilings, because it makes your room feel more spacious.
    - title: Increased home value
      desc: |-
        Updating your ceiling improves your home's marketability.
```

### Faq

Frequently asked questions.

**Required Fields:**
- `title` (string): Section title
- `content` (array): Array of FAQ items
  - `title` (string): Question text
  - `desc` (string): Answer text (supports markdown)

**Optional Fields:**
- `id` (string): Anchor ID for navigation
- `pos` (string): Layout position - `"left"` or `"right"` (default: `"left"`)

```yaml
- type: Faq
  id: faq      # Optional: anchor ID
  pos: left    # Optional: default is "left"
  title: Have any questions?
  content:
    - title: How long does bathroom renovation take?
      desc: |-
        Once all materials are delivered, the renovation may take from one week to two weeks.
    - title: Will my house remain clean during the renovation?
      desc: |-
        Yes! Throughout the entire project, we will ensure your home remains clean.
```

### Reviews

Customer testimonials.

**Required Fields:**
- `title` (string): Section title
- `content` (array): Array of review objects
  - `title` (string): Reviewer name
  - `location` (string): Reviewer location
  - `stars` (number): Star rating (typically 1-5)
  - `desc` (string): Review text (supports markdown)

**Optional Fields:**
- `id` (string): Anchor ID for navigation
- `pos` (string): Layout position - `"left"` or `"right"` (default: `"left"`)
- `content[].date` (date): Review date (coerced to date)
- `content[].url` (string): Link to full review
- `content[].id` (string): Optional ID for individual review

```yaml
- type: Reviews
  id: reviews  # Optional: anchor ID
  pos: left    # Optional: default is "left"
  title: What our customers have to say
  content:
    - title: Maggie and Scott
      location: Mississauga
      stars: 5
      date: 2024-01-15  # Optional: review date
      url: https://example.com/review  # Optional: link to review
      desc: |-
        My husband and I are unbelievably happy with the work that Max and his team did.
```

### Cardshow

Featured media cards (videos, articles, etc.).

**Required Fields:**
- `title` (string): Section title
- `content` (array): Array of card objects
  - `title` (string): Card title
  - `desc` (string): Card description
  - `media` (object): Media object (see Media Types below)

**Optional Fields:**
- `id` (string): Anchor ID for navigation
- `pos` (string): Layout position - `"left"` or `"right"` (default: `"left"`)
- `speed` (number): Carousel speed in seconds (default: 5.0)
- `content[].id` (string): Optional ID for individual card
- `content[].link` (object): Optional link object
  - `name` (string): Link text
  - `url` (string): Link URL

```yaml
- type: Cardshow
  id: accomplishments  # Optional: anchor ID
  pos: left            # Optional: default is "left"
  speed: 5.0           # Optional: default is 5.0
  title: Our accomplishments
  content:
    - title: Featured on CityTV
      desc: |-
        Strataline is invited to CityLine and Scott McGillivray reveals the best way.
      media:
        type: video
        uploadDate: Jan 1, 2020
        image:
          src: ./photos/awards/citytv.jpg
          alt: wasd
        url: /videos/cityline.mp4
    - title: Featured in The Star
      desc: |-
        The Star's sensational report on our Dust-Free approach.
      media:
        type: image
        image:
          src: ./photos/awards/star.jpg
          alt: |-
            A newspaper article featuring Strataline's dust-free process.
      link:
        name: Read the article
        url: |-
          https://www.thestar.com/life/home-and-garden/...
    - title: Featured on HGTV's Love It or List It
      desc: |-
        Mother-in-Law's 1980s house needs an overhaul.
      media:
        type: yt-video
        id: MqmEVTErkI0
      link:
        name: Tour the place
        url: |-
          https://my.matterport.com/show/?m=S9RBB2SkPRT
```

**Media Types:**
- `image`: Requires `image` object with `src` and `alt`
- `video`: Requires `image` object, `uploadDate` (date string, coerced to date), and `url` (string)
- `yt-video`: Requires `id` (string, YouTube video ID)

## Image Schema

Images can have optional positioning:

```yaml
image:
  src: ./cover.jpg
  alt: |-
    Description of the image.
  x: left    # Optional: "left" or "right"
  y: top     # Optional: "top" or "bottom"
```

## Formatting Conventions

### Directory and Folder Names

- **No capitalization or spaces** for folders used as subdirectories
- Use lowercase letters only
- Use hyphens (`-`) or underscores (`_`) to separate words
- Examples:
  - ✅ `bathrooms`, `kitchens`, `popcorn-removal`, `doors_and_windows`
  - ❌ `Bathrooms`, `Kitchens`, `Popcorn Removal`, `Doors And Windows`

### Title Formatting

- **Only the first word should be capitalized**, the rest should be lowercase
- This applies to all `title` fields in YAML files (service titles, section titles, content item titles, etc.)
- Examples:
  - ✅ `title: Popcorn ceiling removal`
  - ✅ `title: Doors & windows`
  - ✅ `title: What's the cost?`
  - ✅ `title: Ample space`
  - ✅ `title: Durable & optimized`
  - ❌ `title: Popcorn Ceiling Removal`
  - ❌ `title: Doors & Windows`
  - ❌ `title: What's The Cost?`
  - ❌ `title: Ample Space`

**Note:** Proper nouns (like "CityTV", "The Star", "House & Home") may retain their capitalization as they are brand names.

## Best Practices

1. **Multi-line Text**: Always use `|-` (literal block scalar) for multi-line text fields to preserve formatting
2. **Alt Text**: Always provide descriptive alt text for accessibility
3. **Image Paths**: Use relative paths starting with `./` for images in the same directory or subdirectories
4. **Draft Services**: Set `draft: true` for services that are not ready for production
5. **SEO Descriptions**: Write compelling, keyword-rich descriptions for SEO
6. **Consistency**: Follow the existing patterns in other service files for consistency
7. **Naming**: Follow the formatting conventions above for directory names and titles

## Common Patterns

### Service Page with Full Sections

```yaml
title: Service name
startPos: left
desc: |-
  Service description.
seo: |-
  SEO description with keywords.
image:
  src: ./cover.jpg
  alt: |-
    Alt text for cover image.
sections:
  - type: ZigZag
    title: Section title
    content:
      - title: Feature 1
        image:
          src: ./feature1.jpg
          alt: Description
        desc: |-
          Feature description.
  - type: TextCarousel
    text:
      - Tagline 1
      - Tagline 2
  - type: Prices
    title: What's the cost?
    content:
      - title: Basic
        min: 5000
        max: 15000
        materials:
          - Material 1
        desc: |-
          Description.
  - type: Faq
    title: Have any questions?
    content:
      - title: Question?
        desc: |-
          Answer.
  - type: Services
    exclude:
      - current-service-slug
```

