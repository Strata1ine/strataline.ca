import type { APIRoute } from 'astro';
import sharp from 'sharp';
import ico from 'sharp-ico';
import path from 'node:path'
const favicon = path.resolve('src/icons/favicon.png')

export const GET: APIRoute = async () => {
  const buffer = await sharp(favicon).resize(32, 32).toBuffer();
  return new Response(Buffer.from(ico.encode([buffer])), {
    headers: { 'Content-Type': 'image/x-icon' },
  });
};
