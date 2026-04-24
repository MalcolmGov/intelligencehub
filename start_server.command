#!/bin/bash
# Double-click this file in Finder to start the local dev server.
# Stops automatically when you close the Terminal window.

# Move to the directory this script lives in (the repo root).
cd "$(dirname "$0")"

PORT=8000

# If port 8000 is busy, walk up until we find a free one.
while lsof -i :$PORT >/dev/null 2>&1; do
  PORT=$((PORT + 1))
done

URL="http://localhost:$PORT/#sdlc20"

echo "============================================"
echo " Intelligence Hub — local dev server"
echo "============================================"
echo " Serving:  $(pwd)"
echo " URL:      $URL"
echo " Stop:     Ctrl+C  (or close this window)"
echo "============================================"
echo ""

# Open the browser after a short delay so the server is up.
( sleep 1 && open "$URL" ) &

# Start Python's built-in HTTP server (Python 3 ships with macOS).
python3 -m http.server $PORT
