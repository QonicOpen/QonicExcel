#!/usr/bin/env bash
# Superset worktree setup script for QonicExcel
set -euo pipefail

BRANCH_NAME="${1:-$(git rev-parse --abbrev-ref HEAD)}"

echo "Setting up QonicExcel worktree for branch: $BRANCH_NAME"

# Copy env files from the root repo if available
if [ -n "${SUPERSET_ROOT_PATH:-}" ]; then
  for envfile in .env .env.develop .env.rc; do
    if [ -f "$SUPERSET_ROOT_PATH/$envfile" ]; then
      cp "$SUPERSET_ROOT_PATH/$envfile" "./$envfile"
      echo "Copied $envfile from root"
    fi
  done
fi

# Install dependencies
echo "Installing dependencies..."
npm install

echo ""
echo "Setup complete for branch: $BRANCH_NAME"
echo "  - Dev server:  npm run dev-server   (https://localhost:3000)"
echo "  - Start:       npm start            (opens Excel with add-in)"
echo "  - Validate:    npm run validate     (check manifest.xml)"
