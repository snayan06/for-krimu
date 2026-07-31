# Nayan & Krimu — Girlfriend's Day

A small, cutesy Girlfriend's Day surprise made for Krimu by Nayan. The site is designed as a reel-like experience with their own photos and is ready to be hosted separately on GitHub Pages.

**Live site:** <https://snayan06.github.io/girlfriends-day/>

## Preview locally

From this folder, run:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). Stop the preview with `Ctrl+C`.

Using a local server is recommended instead of double-clicking `index.html`, because browser behavior can differ for files opened directly from disk.

## Publish updates

The site is published from the `main` branch on GitHub Pages. To publish future approved changes:

1. In Terminal, open this folder.
2. Review the deployment plan without making Git or GitHub changes:

   ```bash
   ./deploy.sh
   ```

3. When ready to publish, explicitly run:

   ```bash
   ./deploy.sh --execute
   ```

After GitHub Pages finishes deploying, the address is:

<https://snayan06.github.io/girlfriends-day/>

If GitHub asks you to sign in during the push, use the `snayan06` account.

## Files expected by deployment

- `index.html`
- `style.css`
- `script.js`
- `images/` with at least one image
- `.nojekyll`

The deployment helper intentionally refuses to push to a differently named GitHub remote.
