import type { APIRoute } from 'astro';
import sharp from 'sharp';
import ico from 'sharp-ico';
import path from 'node:path'
const faviconSrc = path.resolve('src/icons/favicon.png')

export const GET: APIRoute = async () => {
  const buffer = await sharp(faviconSrc).resize(32, 32).toBuffer(); // PNG buffer
  const icoBuffer = ico.encode([buffer]); // Convert to ICO

  return new Response(icoBuffer, {
    headers: { 'Content-Type': 'image/x-icon' },
  });
};
