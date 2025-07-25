#!/usr/bin/env node

import fs from "fs";
import path from "path";

// Simple icon creation script for PWA
// Since we have a 1024x1024 PNG, we'll copy it and rename for different sizes
// In a real scenario, you'd want to properly resize these

const sourceIcon = "public/Expressersweepstakesadminlogo.png";
const iconSizes = [
  { size: "64x64", filename: "pwa-64x64.png" },
  { size: "192x192", filename: "pwa-192x192.png" },
  { size: "512x512", filename: "pwa-512x512.png" },
  { size: "180x180", filename: "apple-touch-icon-180x180.png" },
  { size: "180x180", filename: "apple-touch-icon.png" }, // iOS default
];

console.log("Creating PWA icons...");

if (!fs.existsSync(sourceIcon)) {
  console.error("Source icon not found:", sourceIcon);
  process.exit(1);
}

iconSizes.forEach(({ filename }) => {
  const targetPath = path.join("public", filename);
  fs.copyFileSync(sourceIcon, targetPath);
  console.log(`✓ Created ${filename}`);
});

console.log("\n✅ All PWA icons created successfully!");
console.log(
  "\n📱 For production, consider properly resizing these icons to their target dimensions."
);
console.log("   You can use online tools like:");
console.log("   - https://realfavicongenerator.net/");
console.log("   - https://www.pwabuilder.com/imageGenerator");
