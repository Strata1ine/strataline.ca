# Project Story authoring system

Project Stories and media-rich Renovation Guides are visual editorial pages. Project photography is primary evidence, not decoration added after a text article. Every future media-rich story must use structured text-and-media sections and pass the repository validator before Astro builds the site.

## Classify the source set first

Set `mediaRich: true` when the source contains approximately eight or more useful photographs, or multiple logical folders such as before, after, process, result, flooring, ceiling or stairs. A media-rich story normally supports at least four editorial moments, useful before/process/result evidence, and three strong finished photographs.

Use the legacy case-study structure only when the source material genuinely cannot support this rhythm. Do not downgrade a rich source set to avoid media selection work.

## Audit all incoming media

Inspect every source file before writing and record the result:

```yaml
mediaAudit:
  discovered: 12
  used:
    - source: before stairs/B1.jpg
      asset: ./project-images/stairs-pair-01-before.jpg
  excluded:
    - source: after stairs/duplicate-02.jpg
      reason: Near-duplicate angle was weaker than the selected finished overview.
```

`discovered` must equal selected files plus all files represented by exclusions. Every selected asset must render in the hero or body. Media-rich stories should use a majority of the source set. Exclude only weak, private, redundant or unusable media, and state why. Never modify the incoming source folder.

## Permanent A/B naming rule

- `A<number>` is **after**.
- `B<number>` is **before**.
- Identical context and number form the pair.
- Match case-insensitively after removing the extension.
- Never rematch a complete manual pair by visual similarity.
- Never force an unmatched A or B into another pair.
- Keep the two files separate; never bake a composite.

Declare every complete pair in `manualPairs`. The build validator detects pairs represented in `mediaAudit.used`, verifies `B = before` and `A = after`, and checks that the exact mapping is rendered.

## Build with text-media sections

Each substantive section uses `type: text-media` and owns its heading, one or two concise paragraphs, optional list, and one media block. Keep each section below 180 words. Avoid long text-only runs, repeated dividers and small images surrounded by unused space. Move through condition, process, detail, comparison and result.

## Semantic media sizes

- `wide`: room, overall project or major process view; shared 1250px media rail.
- `pair`: two related photographs; equal desktop columns and a clean narrow-screen stack.
- `portrait`: one vertical photograph, centred at about 660px maximum width.
- `detail`: focused craft or transition view at about 920px maximum width.
- `slider`: verified before/after pair using the shared interactive comparison.
- `gallery`: editorial or finished-project collection.

Images retain natural composition with `height: auto` and `object-fit: contain`. Never impose a universal landscape crop on editorial media.

## Captions, gallery and related stories

Every section media item needs an informative caption describing what it proves. Avoid filler such as “Photo,” “Image,” or “Before and after.” Alt text describes visible content without inventing facts.

Close the story with a `gallery` block using `purpose: finished-project` and at least three result images, followed by a compact `related-stories` block with two or three relevant cards.

## Validation and overrides

Run `npm run validate:project-stories`. The production build runs it automatically. It checks source accounting, rendered assets, section rhythm and length, captions, finished gallery, related cards and exact manual A/B mappings.

A legitimate exception may use `visualValidationOverride` with a specific review note of at least 20 characters. This downgrades visual presentation findings only; source accounting and A/B mapping errors still fail.

## Required QA

Inspect the current story at 390, 430, 768, 1366, 1440 and 1920 pixels. Confirm prominent media, uncropped portraits, balanced pairs, usable sliders, attached captions and the approved shared lightbox. Audit one established Project Story and one Renovation Guide for shared-renderer regressions, then run the full production build.
