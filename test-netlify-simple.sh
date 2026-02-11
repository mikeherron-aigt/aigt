#!/bin/bash
# Simple shell-based test for Netlify deployments
# No dependencies required - uses only curl and built-in tools
#
# Usage: ./test-netlify-simple.sh <netlify-url>

set -e

NETLIFY_URL="${1}"

if [ -z "$NETLIFY_URL" ]; then
  echo "❌ Error: Please provide a Netlify URL"
  echo ""
  echo "Usage: ./test-netlify-simple.sh <netlify-url>"
  echo "Example: ./test-netlify-simple.sh https://preview.netlify.app"
  exit 1
fi

echo "🧪 Simple Netlify Image Test"
echo "======================================================================"
echo ""
echo "🌐 Testing: $NETLIFY_URL"
echo ""

# Test cases
NATASHA_IMAGE="https://image.artigt.com/JD/MM/2024-JD-MM-0014/2024-JD-MM-0014__full__v02.webp"
NO_ORDINARY_LOVE_IMAGE="https://image.artigt.com/JD/MM/2024-JD-MM-0016/2024-JD-MM-0016__full__v02.webp"

# URL encode function
urlencode() {
  echo "$1" | sed 's/:/%3A/g; s/\//%2F/g'
}

NATASHA_ENCODED=$(urlencode "$NATASHA_IMAGE")
NO_ORDINARY_LOVE_ENCODED=$(urlencode "$NO_ORDINARY_LOVE_IMAGE")

API_URL_1="${NETLIFY_URL}/api/img?url=${NATASHA_ENCODED}&w=1200"
API_URL_2="${NETLIFY_URL}/api/img?url=${NO_ORDINARY_LOVE_ENCODED}&w=1200"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 1: Fetch Natasha (2024-JD-MM-0014)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📡 URL: $API_URL_1"
echo ""

# Fetch first image
curl -s -H "Cache-Control: no-cache" -H "Pragma: no-cache" "$API_URL_1" > /tmp/natasha-test.webp
SIZE_1=$(wc -c < /tmp/natasha-test.webp | tr -d ' ')
MD5_1=$(md5 -q /tmp/natasha-test.webp 2>/dev/null || md5sum /tmp/natasha-test.webp | cut -d' ' -f1)
FIRST_BYTES_1=$(xxd -l 16 -p /tmp/natasha-test.webp | head -n1)

echo "✅ Downloaded successfully"
echo "📦 Size: $SIZE_1 bytes"
echo "🔑 MD5: $MD5_1"
echo "🎯 First 16 bytes: $FIRST_BYTES_1"
echo ""

sleep 1

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 2: Fetch No Ordinary Love (2024-JD-MM-0016)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📡 URL: $API_URL_2"
echo ""

# Fetch second image
curl -s -H "Cache-Control: no-cache" -H "Pragma: no-cache" "$API_URL_2" > /tmp/no-ordinary-love-test.webp
SIZE_2=$(wc -c < /tmp/no-ordinary-love-test.webp | tr -d ' ')
MD5_2=$(md5 -q /tmp/no-ordinary-love-test.webp 2>/dev/null || md5sum /tmp/no-ordinary-love-test.webp | cut -d' ' -f1)
FIRST_BYTES_2=$(xxd -l 16 -p /tmp/no-ordinary-love-test.webp | head -n1)

echo "✅ Downloaded successfully"
echo "📦 Size: $SIZE_2 bytes"
echo "🔑 MD5: $MD5_2"
echo "🎯 First 16 bytes: $FIRST_BYTES_2"
echo ""

echo "======================================================================"
echo "📊 COMPARISON"
echo "======================================================================"
echo ""
echo "Image 1 (Natasha):"
echo "  Size: $SIZE_1 bytes"
echo "  MD5:  $MD5_1"
echo ""
echo "Image 2 (No Ordinary Love):"
echo "  Size: $SIZE_2 bytes"
echo "  MD5:  $MD5_2"
echo ""

if [ "$MD5_1" = "$MD5_2" ]; then
  echo "🚨 BUG DETECTED: Both images have the SAME hash!"
  echo ""
  echo "This means /api/img is returning identical data for different URLs."
  echo "The issue is in the API proxy route or caching layer."
  echo ""
  echo "Debug: Check Netlify function logs for [/api/img] console output"
  exit 1
else
  echo "✅ SUCCESS: Images are different!"
  echo ""
  echo "The /api/img endpoint is correctly returning different images."
  exit 0
fi
