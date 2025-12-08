# Cursor Instructions for Strataline.ca

## Critical Restriction

**NEVER modify any code outside of the `/content` directory.**

You are ONLY allowed to:
- Create, modify, or delete files within `/content` and its subdirectories
- Work with YAML files (`.yaml`) and media files (images, videos) in the content directory

You are NOT allowed to:
- Modify any files in `/src`, `/public`, `/lib`, or any other directory outside of `/content`
- Change configuration files (`.config.js`, `.config.mjs`, `package.json`, etc.)
- Modify TypeScript/JavaScript/Astro component files
- Change build scripts or deployment configurations

## Content Structure

All content is managed through YAML files in the `/content` directory. Follow the conventions documented in `docs/schema.md` when creating or modifying content files.

## When Creating New Service Pages

1. Create a new directory under `/content/services/[service-name]/`
2. Create an `index.yaml` file following the service schema (see `docs/schema.md`)
3. Add a `cover.jpg` image in the service directory
4. Optionally add a `photos/` subdirectory for additional images
5. Reference the existing service files as examples:
   - `/content/services/bathrooms/index.yaml`
   - `/content/services/kitchens/index.yaml`
   - `/content/services/stairs/index.yaml`
   - `/content/services/popcorn-removal/index.yaml`

## When Modifying Existing Content

- Always maintain the YAML structure and schema
- Use the `|-` YAML literal block scalar for multi-line text fields
- Ensure all required fields are present
- Follow the existing naming conventions and formatting style

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

For more detailed formatting conventions and examples, see `docs/schema.md`.

## Schema Reference

See `docs/schema.md` for detailed documentation on:
- Service page structure
- Index page structure
- Available section types
- Image and media formats
- Field requirements and optional fields

