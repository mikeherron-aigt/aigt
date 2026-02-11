#!/usr/bin/env node
/**
 * Comprehensive test suite for Netlify image proxy debugging
 *
 * Tests both the /api/img endpoint and actual page rendering
 * to isolate where the image duplication bug occurs.
 *
 * Usage: node test-netlify-images.js <netlify-url>
 * Example: node test-netlify-images.js https://698c111b13331b0008ec9dbc--incredible-syrniki-79e377.netlify.app
 */

const crypto = require('crypto');
const { JSDOM } = require('jsdom');

const baseUrl = process.argv[2];

if (!baseUrl) {
  console.error('❌ Error: Please provide a Netlify URL');
  console.log('\nUsage: node test-netlify-images.js <netlify-url>');
  console.log('Example: node test-netlify-images.js https://preview.netlify.app');
  process.exit(1);
}

const testCases = {
  natasha: {
    name: 'Natasha',
    artworkId: '2024-JD-MM-0014',
    pageUrl: '/collections/a-miracle-in-the-making/natasha',
    imageUrl: 'https://image.artigt.com/JD/MM/2024-JD-MM-0014/2024-JD-MM-0014__full__v02.webp',
  },
  noOrdinaryLove: {
    name: 'No Ordinary Love',
    artworkId: '2024-JD-MM-0016',
    pageUrl: '/collections/a-miracle-in-the-making/no-ordinary-love',
    imageUrl: 'https://image.artigt.com/JD/MM/2024-JD-MM-0016/2024-JD-MM-0016__full__v02.webp',
  },
};

async function testApiEndpoint(testCase) {
  const apiUrl = `${baseUrl}/api/img?url=${encodeURIComponent(testCase.imageUrl)}&w=1200`;

  console.log(`\n  📡 Testing API endpoint: ${testCase.name}`);
  console.log(`     URL: ${apiUrl}`);

  try {
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });

    if (!response.ok) {
      console.log(`     ❌ HTTP ${response.status}: ${response.statusText}`);
      return null;
    }

    const buffer = await response.arrayBuffer();
    const hash = crypto.createHash('md5').update(Buffer.from(buffer)).digest('hex');
    const sha256 = crypto.createHash('sha256').update(Buffer.from(buffer)).digest('hex');

    const result = {
      name: testCase.name,
      artworkId: testCase.artworkId,
      size: buffer.byteLength,
      md5: hash,
      sha256: sha256.substring(0, 16),
      contentType: response.headers.get('content-type'),
      cacheControl: response.headers.get('cache-control'),
      age: response.headers.get('age'),
      xImageSize: response.headers.get('x-image-size'),
      xUpstreamUrl: response.headers.get('x-upstream-url'),
      netlifyVary: response.headers.get('netlify-vary'),
      firstBytes: Buffer.from(buffer.slice(0, 8)).toString('hex'),
    };

    console.log(`     ✅ Status: ${response.status}`);
    console.log(`     📦 Size: ${result.size.toLocaleString()} bytes`);
    console.log(`     🔑 MD5: ${result.md5}`);
    console.log(`     🔐 SHA256: ${result.sha256}...`);
    console.log(`     📋 Content-Type: ${result.contentType}`);
    console.log(`     ⏱️  Age: ${result.age || 'not cached'}`);
    console.log(`     🎯 First 8 bytes: ${result.firstBytes}`);
    if (result.xImageSize) {
      console.log(`     🔍 X-Image-Size: ${result.xImageSize}`);
    }
    if (result.xUpstreamUrl) {
      console.log(`     🌐 X-Upstream-Url: ${result.xUpstreamUrl}`);
    }

    return result;
  } catch (error) {
    console.log(`     ❌ Error: ${error.message}`);
    return null;
  }
}

async function testPageRendering(testCase) {
  const pageUrl = `${baseUrl}${testCase.pageUrl}`;

  console.log(`\n  🌐 Testing page rendering: ${testCase.name}`);
  console.log(`     URL: ${pageUrl}`);

  try {
    const response = await fetch(pageUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (compatible; Test/1.0)',
      },
    });

    if (!response.ok) {
      console.log(`     ❌ HTTP ${response.status}: ${response.statusText}`);
      return null;
    }

    const html = await response.text();

    // Extract all /api/img URLs from the HTML
    const apiImgRegex = /\/api\/img\?url=([^"&]+)/g;
    const matches = [...html.matchAll(apiImgRegex)];

    if (matches.length === 0) {
      console.log(`     ⚠️  No /api/img URLs found in HTML`);
      return null;
    }

    const mainImageMatch = matches[0];
    const encodedUrl = mainImageMatch[1];
    const decodedUrl = decodeURIComponent(encodedUrl);

    // Extract artwork ID from URL
    const artworkIdMatch = decodedUrl.match(/\/(\d{4}-[A-Z]+-[A-Z]+-\d{4})\//);
    const foundArtworkId = artworkIdMatch ? artworkIdMatch[1] : 'unknown';

    const result = {
      name: testCase.name,
      expectedArtworkId: testCase.artworkId,
      foundArtworkId,
      decodedImageUrl: decodedUrl,
      totalApiImgUrls: matches.length,
      match: foundArtworkId === testCase.artworkId,
    };

    console.log(`     📄 Page loaded successfully`);
    console.log(`     🎯 Expected artwork: ${result.expectedArtworkId}`);
    console.log(`     🔍 Found artwork: ${result.foundArtworkId}`);
    console.log(`     ${result.match ? '✅' : '❌'} Match: ${result.match}`);
    console.log(`     📸 Total /api/img URLs: ${result.totalApiImgUrls}`);

    return result;
  } catch (error) {
    console.log(`     ❌ Error: ${error.message}`);
    return null;
  }
}

async function testDirectUpstream(testCase) {
  const upstreamUrl = `${testCase.imageUrl}?width=1200`;

  console.log(`\n  🌍 Testing direct upstream: ${testCase.name}`);
  console.log(`     URL: ${upstreamUrl}`);

  try {
    const response = await fetch(upstreamUrl, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AIGT-App/1.0)',
      },
    });

    if (!response.ok) {
      console.log(`     ❌ HTTP ${response.status}: ${response.statusText}`);
      return null;
    }

    const buffer = await response.arrayBuffer();
    const hash = crypto.createHash('md5').update(Buffer.from(buffer)).digest('hex');

    console.log(`     ✅ Status: ${response.status}`);
    console.log(`     📦 Size: ${buffer.byteLength.toLocaleString()} bytes`);
    console.log(`     🔑 MD5: ${hash}`);

    return {
      name: testCase.name,
      artworkId: testCase.artworkId,
      size: buffer.byteLength,
      md5: hash,
    };
  } catch (error) {
    console.log(`     ❌ Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🧪 Netlify Image Proxy Test Suite');
  console.log('=' .repeat(80));
  console.log(`\n🌐 Testing deployment: ${baseUrl}\n`);

  // Test 1: API Endpoint
  console.log('📋 TEST 1: API Endpoint Direct Calls');
  console.log('─'.repeat(80));

  const apiResults = [];
  for (const key of Object.keys(testCases)) {
    const result = await testApiEndpoint(testCases[key]);
    if (result) apiResults.push(result);
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Test 2: Page Rendering
  console.log('\n\n📋 TEST 2: Page HTML Rendering');
  console.log('─'.repeat(80));

  const pageResults = [];
  for (const key of Object.keys(testCases)) {
    const result = await testPageRendering(testCases[key]);
    if (result) pageResults.push(result);
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Test 3: Direct Upstream
  console.log('\n\n📋 TEST 3: Direct Upstream Server');
  console.log('─'.repeat(80));

  const upstreamResults = [];
  for (const key of Object.keys(testCases)) {
    const result = await testDirectUpstream(testCases[key]);
    if (result) upstreamResults.push(result);
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Analysis
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 ANALYSIS RESULTS');
  console.log('='.repeat(80));

  // Check API endpoint
  if (apiResults.length >= 2) {
    console.log('\n1️⃣  API Endpoint Test:');
    console.log(`   Image 1 (${apiResults[0].artworkId}): ${apiResults[0].md5}`);
    console.log(`   Image 2 (${apiResults[1].artworkId}): ${apiResults[1].md5}`);

    if (apiResults[0].md5 === apiResults[1].md5) {
      console.log('   🚨 BUG: API endpoint returns SAME image for different URLs');
      console.log('   Location: /app/api/img/route.ts');
    } else {
      console.log('   ✅ PASS: API endpoint returns different images');
    }
  }

  // Check page rendering
  if (pageResults.length >= 2) {
    console.log('\n2️⃣  Page Rendering Test:');
    pageResults.forEach(result => {
      console.log(`   ${result.name}: ${result.match ? '✅' : '❌'} ${result.foundArtworkId}`);
    });

    const allMatch = pageResults.every(r => r.match);
    if (!allMatch) {
      console.log('   🚨 BUG: HTML contains wrong artwork IDs');
      console.log('   Location: Server-side rendering or data fetching');
    } else {
      console.log('   ✅ PASS: HTML contains correct artwork IDs');
    }
  }

  // Check upstream
  if (upstreamResults.length >= 2) {
    console.log('\n3️⃣  Upstream Server Test:');
    console.log(`   Image 1 (${upstreamResults[0].artworkId}): ${upstreamResults[0].md5}`);
    console.log(`   Image 2 (${upstreamResults[1].artworkId}): ${upstreamResults[1].md5}`);

    if (upstreamResults[0].md5 === upstreamResults[1].md5) {
      console.log('   🚨 ISSUE: Upstream server returns SAME image');
      console.log('   Location: image.artigt.com server');
    } else {
      console.log('   ✅ PASS: Upstream server returns different images');
    }
  }

  // Final verdict
  console.log('\n' + '='.repeat(80));
  const hasApiBug = apiResults.length >= 2 && apiResults[0].md5 === apiResults[1].md5;
  const hasPageBug = pageResults.length >= 2 && !pageResults.every(r => r.match);
  const hasUpstreamBug = upstreamResults.length >= 2 && upstreamResults[0].md5 === upstreamResults[1].md5;

  if (hasUpstreamBug) {
    console.log('🎯 CONCLUSION: Issue is with the UPSTREAM image server');
    console.log('   The backend image.artigt.com is returning wrong images');
  } else if (hasApiBug && !hasPageBug) {
    console.log('🎯 CONCLUSION: Issue is in the /api/img PROXY route');
    console.log('   Check: app/api/img/route.ts');
    console.log('   Possible causes: caching, request handling, or Netlify config');
  } else if (hasPageBug) {
    console.log('🎯 CONCLUSION: Issue is in the PAGE DATA FETCHING');
    console.log('   Check: app/collections/[collection]/[artwork]/page.tsx');
    console.log('   Check: app/lib/artApiServer.ts');
  } else {
    console.log('✅ CONCLUSION: All tests passed! Images are working correctly.');
  }

  console.log('='.repeat(80) + '\n');

  process.exit(hasApiBug || hasPageBug || hasUpstreamBug ? 1 : 0);
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
