#!/usr/bin/env node
/**
 * Silk Road Wonders - Performance Monitoring Script
 * 
 * Usage:
 *   npm run performance:check
 * 
 * Requires:
 *   npm install -g lighthouse
 * 
 * This script runs Lighthouse audits on key pages and reports performance scores.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://silkroadwondertours.com';
const PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/tours.html', name: 'Tours Listing' },
  { path: '/destinations.html', name: 'Destinations' },
  { path: '/about.html', name: 'About' },
  { path: '/contact.html', name: 'Contact' },
  { path: '/blog/', name: 'Blog' },
];

const RESULTS_DIR = path.join(__dirname, '..', 'performance-reports');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function runLighthouse(url, outputPath) {
  try {
    const cmd = `lighthouse "${url}" --output=json --output-path="${outputPath}" --chrome-flags="--headless --no-sandbox" --quiet`;
    console.log(`  Running Lighthouse on ${url}...`);
    execSync(cmd, { stdio: 'pipe', timeout: 120000 });
    return true;
  } catch (error) {
    console.error(`  Error: ${error.message}`);
    return false;
  }
}

function parseResults(outputPath) {
  try {
    const data = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    return {
      performance: Math.round(data.categories.performance.score * 100),
      accessibility: Math.round(data.categories.accessibility.score * 100),
      bestPractices: Math.round(data.categories['best-practices'].score * 100),
      seo: Math.round(data.categories.seo.score * 100),
      firstContentfulPaint: data.audits['first-contentful-paint'].displayValue,
      largestContentfulPaint: data.audits['largest-contentful-paint'].displayValue,
      cumulativeLayoutShift: data.audits['cumulative-layout-shift'].displayValue,
      speedIndex: data.audits['speed-index'].displayValue,
      totalBlockingTime: data.audits['total-blocking-time'].displayValue,
    };
  } catch (error) {
    return null;
  }
}

function printResults(results) {
  console.log('\n' + '='.repeat(70));
  console.log('PERFORMANCE REPORT - Silk Road Wonders');
  console.log('='.repeat(70));
  
  console.log('\nPage'.padEnd(20) + 'Perf'.padStart(6) + 'A11y'.padStart(6) + 'Best'.padStart(6) + 'SEO'.padStart(6));
  console.log('-'.repeat(50));
  
  for (const result of results) {
    if (result.scores) {
      console.log(
        result.name.padEnd(20) +
        String(result.scores.performance).padStart(6) +
        String(result.scores.accessibility).padStart(6) +
        String(result.scores.bestPractices).padStart(6) +
        String(result.scores.seo).padStart(6)
      );
    } else {
      console.log(result.name.padEnd(20) + 'FAILED'.padStart(24));
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('CORE WEB VITALS (Homepage)');
  console.log('='.repeat(70));
  
  const home = results.find(r => r.name === 'Homepage');
  if (home && home.scores) {
    console.log(`  First Contentful Paint: ${home.scores.firstContentfulPaint}`);
    console.log(`  Largest Contentful Paint: ${home.scores.largestContentfulPaint}`);
    console.log(`  Cumulative Layout Shift: ${home.scores.cumulativeLayoutShift}`);
    console.log(`  Speed Index: ${home.scores.speedIndex}`);
    console.log(`  Total Blocking Time: ${home.scores.totalBlockingTime}`);
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('PERFORMANCE BUDGET TARGETS');
  console.log('='.repeat(70));
  console.log('  Performance: >= 90');
  console.log('  Accessibility: >= 95');
  console.log('  Best Practices: >= 95');
  console.log('  SEO: >= 95');
  console.log('  LCP: < 2.5s');
  console.log('  CLS: < 0.1');
  console.log('  TBT: < 200ms');
}

async function main() {
  console.log('Silk Road Wonders - Performance Check');
  console.log(`Site: ${SITE_URL}`);
  console.log(`Pages to audit: ${PAGES.length}`);
  console.log('');
  
  ensureDir(RESULTS_DIR);
  
  const results = [];
  
  for (const page of PAGES) {
    const url = SITE_URL + page.path;
    const outputPath = path.join(RESULTS_DIR, `${page.name.toLowerCase().replace(/\s+/g, '-')}.json`);
    
    console.log(`\n[${results.length + 1}/${PAGES.length}] ${page.name}`);
    
    const success = runLighthouse(url, outputPath);
    const scores = success ? parseResults(outputPath) : null;
    
    results.push({ name: page.name, url, scores });
  }
  
  printResults(results);
  
  // Save summary
  const summaryPath = path.join(RESULTS_DIR, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2));
  console.log(`\nFull reports saved to: ${RESULTS_DIR}`);
}

main().catch(console.error);
