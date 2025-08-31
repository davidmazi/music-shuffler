#!/usr/bin/env bun

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Simple SVG icon generator
function generateSVGIcon(size) {
  const padding = size * 0.1;
  const iconSize = size - (padding * 2);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#ec4899"/>
  <text x="${size/2}" y="${size/2}" font-family="Arial, sans-serif" font-size="${iconSize * 0.4}" fill="white" text-anchor="middle" dominant-baseline="middle">🎵</text>
</svg>`;
}

async function generateIcons() {
  try {
    // Create icons directory
    const iconsDir = join(process.cwd(), 'public', 'icons');
    mkdirSync(iconsDir, { recursive: true });

    console.log('🎨 Generating PWA icons...');

    for (const size of sizes) {
      const svgContent = generateSVGIcon(size);
      const filename = `icon-${size}x${size}.svg`;
      const filepath = join(iconsDir, filename);
      
      writeFileSync(filepath, svgContent);
      console.log(`✅ Generated ${filename}`);
    }

    console.log('🎉 All PWA icons generated successfully!');
    console.log('💡 Note: These are SVG icons. For better PWA support, consider converting to PNG using an online tool.');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

generateIcons();
