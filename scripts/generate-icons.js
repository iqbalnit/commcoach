/**
 * Generates PWA icons for SpeakSharp.
 * Run once: node scripts/generate-icons.js
 * Requires: sharp (devDependency)
 */

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const outDir = path.join(__dirname, "../public/icons");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// SVG icon: dark navy background + indigo-purple gradient Zap bolt
function makeSvg(size) {
  const pad = Math.round(size * 0.18);
  const inner = size - pad * 2;
  // Zap bolt path, scaled to inner area
  const s = inner / 24; // SVG viewBox is 24x24
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1"/>
      <stop offset="100%" style="stop-color:#8b5cf6"/>
    </linearGradient>
    <radialGradient id="bg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" style="stop-color:#0d1426"/>
      <stop offset="100%" style="stop-color:#0a0f1e"/>
    </radialGradient>
  </defs>
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="url(#bg)"/>
  <!-- Zap bolt, centred -->
  <g transform="translate(${pad}, ${pad}) scale(${s})">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill="url(#g)"/>
  </g>
</svg>`;
}

async function generate() {
  const sizes = [
    { name: "icon-192.png", size: 192 },
    { name: "icon-512.png", size: 512 },
    { name: "apple-touch-icon.png", size: 180 },
  ];

  for (const { name, size } of sizes) {
    const svg = Buffer.from(makeSvg(size));
    const outPath = path.join(outDir, name);
    await sharp(svg).resize(size, size).png().toFile(outPath);
    console.log(`✅ Generated ${name} (${size}×${size})`);
  }

  // favicon.ico — generate a 32×32 PNG (browsers accept PNG for favicon too)
  const faviconSvg = Buffer.from(makeSvg(32));
  const faviconPath = path.join(outDir, "favicon.png");
  await sharp(faviconSvg).resize(32, 32).png().toFile(faviconPath);
  console.log("✅ Generated favicon.png (32×32)");

  console.log("\nAll icons generated in public/icons/");
}

generate().catch((err) => {
  console.error("Icon generation failed:", err);
  process.exit(1);
});
