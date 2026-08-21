# Publishing a project case study

For the required visual architecture, media audit, semantic media sizes and build validation used by new media-rich stories, follow [Project Story authoring system](./project-story-authoring.md). This file remains the source-folder and publishing checklist.

Strataline project stories use the same blog collection as guides. Set `type: case-study` in frontmatter and provide the structured project fields; the shared template supplies the comparison, gallery, video, review, author, related-service and CTA presentation.

## Recommended source folder

Create a new folder under:

`C:\Work-blog-incoming\project-slug\`

Keep original media outside the repository until the article is approved. A practical folder contains:

- `notes.txt`
- `before-01.jpg`, `before-02.jpg`
- `after-01.jpg`, `after-02.jpg`
- `process-01.jpg`
- optional `process.mp4` and a poster image

## Manual A/B pair naming

Incoming projects may use a deliberate, case-insensitive `A<number>` / `B<number>` convention instead of descriptive before/after filenames:

- `A<number>` means **after**.
- `B<number>` means **before**.
- The same number identifies one manually matched camera/viewpoint pair: `A1` ↔ `B1`, `A2` ↔ `B2`, `A10` ↔ `B10`.
- Match only within the same logical folder context (for example `stairs`, `ceilings`, `rooms` or `exterior`) unless the project explicitly places the matching files in corresponding `before` and `after` folders.
- Manual number pairing is ground truth and overrides image-similarity or visual rematching.
- An unmatched file such as `A3` without `B3` remains an ordinary after image. Do not assign it to a different numbered file.

During ingestion, detect filenames with `^[Aa](\d+)$` and `^[Bb](\d+)$` after removing the file extension. Preserve the folder context, pair number and role when copying assets. Repository filenames should retain that identity, for example:

```text
stairs-pair-01-before-wide.jpg
stairs-pair-01-after-wide.jpg
ceiling-pair-04-before-texture.jpg
ceiling-pair-04-after-smooth.jpg
```

Before/after component input order is always `B = before`, then `A = after`. Keep the two files as separate assets; do not bake them into a composite image.

## Notes template

```text
Project working title:
Location (city/neighbourhood only):
Service:
What existed before:
The homeowner's goal:
Main technical challenge:
Work completed:
Methods/materials that are verified:
Finished result:
Approved public review (optional; paste exact wording and reviewer name):
Privacy exclusions (people, addresses, plates, personal documents):
Related Strataline services:
```

## Media and privacy checks

- Identify clear before/after pairs and preserve the original files.
- Exclude identifiable children and other people unless explicit publication consent exists.
- Remove or crop street numbers, documents, licence plates and private information.
- Write descriptive alt text that explains the visible work without inventing facts.
- Never infer ratings, reviews, materials, quantities, costs or locations from an image.

## Codex publishing instruction

Ask Codex to inspect the notes and media, prepare a `type: case-study` blog entry, import only approved media, run the production build, inspect the generated route/schema/sitemap and return a local preview for approval. Codex should not commit, push or deploy unless separately authorized.

## Required frontmatter

Use the reusable fields in `src/content.config.ts`: `challenge`, `scope`, `solution`, `result`, `beforeAfter`, `gallery`, optional `video`, optional genuine `review`, `relatedServices`, author and publication controls. Leave optional sections absent rather than creating empty or invented content.