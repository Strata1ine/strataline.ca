# Publishing a project case study

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