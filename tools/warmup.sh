#!/usr/bin/env bash
# Wake the free Render backend before recording/presenting. Usage: tools/warmup.sh https://your-api.onrender.com
URL="${1:?Usage: warmup.sh <backend-url>}"
for i in 1 2 3 4 5; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$URL/api/health")
  echo "attempt $i -> HTTP $code"
  [ "$code" = "200" ] && echo "Backend is warm." && exit 0
  sleep 10
done
echo "Backend did not respond with 200." && exit 1
