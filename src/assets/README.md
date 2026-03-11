# Assets directory

## Required files
Place these files here before building:

- `cv/dalibor-aleksic-cv.pdf`  – Your CV PDF. Referenced by `PROFILE.cvUrl` in `profile.ts`.
- `images/headshot.jpg`        – Your headshot photo (recommend 480×600px min). Set in `PROFILE.headshot`.
- `images/og-image.jpg`        – Open Graph social preview image (1200×630px). Referenced in `index.html`.

## Project screenshots
Add project screenshots to `images/projects/` and update the `imageUrl` field for each project in `src/app/data/profile.ts`:

```ts
imageUrl: 'assets/images/projects/project-slug.jpg',
```

Recommended image sizes:
- Project card thumbnail: 1200×675px (16:9 ratio)
- Project detail hero: 1600×900px
- Format: WebP preferred, JPEG fallback
