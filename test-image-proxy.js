#!/usr/bin/env node
/**
 * Test script to verify /api/img endpoint behavior
 *
 * Usage: node test-image-proxy.js [base-url]
 * Example: node test-image-proxy.js http://localhost:3002
 */

const crypto = require('crypto');

const baseUrl = process.argv[2] || 'http://localhost:3002';

const testImages = [
  {
    name: 'Natasha (2024-JD-MM-0014)',
    url: 'https://image.artigt.com/JD/MM/2024-JD-MM-0014/2024-JD-MM-0014__full__v02.webp',
  },
  {
    name: 'No Ordinary Love (2024-JD-MM-0016)',
    url: 'https://image.artigt.com/JD/MM/2024-JD-MM-0016/2024-JD-MM-0016__full__v02.webp',
  },
];

async function testImage(image) {
  const apiUrl = `${baseUrl}/api/img?url=${encodeURIComponent(image.url)}&w=1200`;

  console.log(`\n📸 Testing: ${image.name}`);
  console.log(`   API URL: ${apiUrl}`);

  try {
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      console.log(`   ❌ Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const buffer = await response.arrayBuffer();
    const hash = crypto.createHash('md5').update(Buffer.from(buffer)).digest('hex');

    console.log(`   ✅ Status: ${response.status}`);
    console.log(`   📦 Size: ${buffer.byteLength.toLocaleString()} bytes`);
    console.log(`   🔑 MD5: ${hash}`);
    console.log(`   📋 Content-Type: ${response.headers.get('content-type')}`);
    console.log(`   🔍 X-Image-Size: ${response.headers.get('x-image-size')}`);
    console.log(`   🌐 X-Upstream-Url: ${response.headers.get('x-upstream-url')}`);

    return {
      name: image.name,
      size: buffer.byteLength,
      hash,
    };
  } catch (error) {
    console.log(`   ❌ Fetch error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log(`🧪 Testing /api/img endpoint at: ${baseUrl}\n`);
  console.log('=' .repeat(80));

  const results = [];

  for (const image of testImages) {
    const result = await testImage(image);
    if (result) {
      results.push(result);
    }
    // Small delay between requests to avoid any rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 Results Summary:\n');

  if (results.length < 2) {
    console.log('❌ Could not fetch both images for comparison');
    process.exit(1);
  }

  console.log(`Image 1: ${results[0].name}`);
  console.log(`  Size: ${results[0].size.toLocaleString()} bytes`);
  console.log(`  MD5:  ${results[0].hash}`);
  console.log();
  console.log(`Image 2: ${results[1].name}`);
  console.log(`  Size: ${results[1].size.toLocaleString()} bytes`);
  console.log(`  MD5:  ${results[1].hash}`);
  console.log();

  if (results[0].hash === results[1].hash) {
    console.log('🚨 BUG CONFIRMED: Both images have the SAME hash!');
    console.log('   This means the API is returning identical data for different URLs.');
    process.exit(1);
  } else {
    console.log('✅ SUCCESS: Images have different hashes');
    console.log('   The API is correctly returning different images.');
    process.exit(0);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
