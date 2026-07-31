# Nayan & Krimu — Girlfriend's Day

A small, cutesy Girlfriend's Day surprise made for Krimu by Nayan. The site is designed as a reel-like experience with their own photos and is ready to be hosted separately on GitHub Pages.

## Preview locally

From this folder, run:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). Stop the preview with `Ctrl+C`.

Using a local server is recommended instead of double-clicking `index.html`, because browser behavior can differ for files opened directly from disk.

## Publish on GitHub Pages

Nothing is published automatically. When the final photos and wording are approved:

1. On GitHub, create a new **public, empty** repository named `girlfriends-day` under the `snayan06` account. Do not add a README, `.gitignore`, or license during repository creation.
2. In Terminal, open this folder.
3. Review the deployment plan without making Git or GitHub changes:

   ```bash
   ./deploy.sh
   ```

4. When ready to publish, explicitly run:

   ```bash
   ./deploy.sh --execute
   ```

5. In the repository's **Settings → Pages**, choose **Deploy from a branch**, then select `main` and `/ (root)`.

After GitHub Pages finishes deploying, the expected address is:

<https://snayan06.github.io/girlfriends-day/>

If GitHub asks you to sign in during the push, use the account that owns `snayan06/girlfriends-day`.

## Files expected by deployment

- `index.html`
- `style.css`
- `script.js`
- `images/` with at least one image
- `.nojekyll`

The deployment helper intentionally refuses to push to a differently named GitHub remote.
