#!/usr/bin/env bash
set -euo pipefail

SITE_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
EXPECTED_REMOTE="https://github.com/snayan06/for-krimu.git"
EXPECTED_PAGE="https://snayan06.github.io/for-krimu/"

usage() {
  cat <<'EOF'
Usage: ./deploy.sh [--execute]

With no option, validates the site and prints the planned Git commands.
Use --execute only after creating the empty public GitHub repository:
  https://github.com/snayan06/for-krimu

Options:
  --execute  Initialize the local repository, commit the site, and push main.
  -h, --help Show this help.
EOF
}

mode="preview"
case "${1:-}" in
  "") ;;
  --execute) mode="execute" ;;
  -h|--help) usage; exit 0 ;;
  *) usage >&2; exit 2 ;;
esac

if (( $# > 1 )); then
  usage >&2
  exit 2
fi

required_files=(index.html style.css script.js .nojekyll)
for file in "${required_files[@]}"; do
  if [[ ! -f "$SITE_DIR/$file" ]]; then
    printf 'Error: required file is missing: %s\n' "$file" >&2
    exit 1
  fi
done

if [[ ! -d "$SITE_DIR/images" ]]; then
  printf 'Error: required images directory is missing.\n' >&2
  exit 1
fi

image_count="$(find "$SITE_DIR/images" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' -o -iname '*.gif' \) | wc -l | tr -d '[:space:]')"
if [[ "$image_count" -eq 0 ]]; then
  printf 'Error: images/ does not contain a supported image.\n' >&2
  exit 1
fi

printf 'Site validation passed (%s images).\n' "$image_count"

if [[ "$mode" == "preview" ]]; then
  cat <<EOF

Dry run only; no Git changes were made.

After creating the empty public repository, run:
  ./deploy.sh --execute

The execute mode will use:
  git init -b main
  git remote add origin $EXPECTED_REMOTE
  git add .
  git commit -m "Create Girlfriend's Day site for Krimu"
  git branch -M main
  git push -u origin main

Expected GitHub Pages URL after enabling Pages:
  $EXPECTED_PAGE
EOF
  exit 0
fi

command -v git >/dev/null 2>&1 || {
  printf 'Error: git is not installed or is not on PATH.\n' >&2
  exit 1
}

cd "$SITE_DIR"

if [[ ! -d .git ]]; then
  git init -b main
fi

repo_root="$(git rev-parse --show-toplevel)"
if [[ "$repo_root" != "$SITE_DIR" ]]; then
  printf 'Error: Git repository root is %s, expected %s.\n' "$repo_root" "$SITE_DIR" >&2
  exit 1
fi

if git remote get-url origin >/dev/null 2>&1; then
  current_remote="$(git remote get-url origin)"
  if [[ "$current_remote" != "$EXPECTED_REMOTE" && "$current_remote" != "git@github.com:snayan06/for-krimu.git" ]]; then
    printf 'Error: origin points to an unexpected repository: %s\n' "$current_remote" >&2
    printf 'Expected: %s\n' "$EXPECTED_REMOTE" >&2
    exit 1
  fi
else
  git remote add origin "$EXPECTED_REMOTE"
fi

git add .
if git diff --cached --quiet; then
  printf 'No new site changes to commit.\n'
else
  git commit -m "Create Girlfriend's Day site for Krimu"
fi

git branch -M main
git push -u origin main

cat <<EOF

Push complete. Enable GitHub Pages from main / (root), then visit:
  $EXPECTED_PAGE
EOF
