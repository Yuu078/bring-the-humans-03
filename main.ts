// bring-the-humans-03 entry program (Node 22, standard library only).
//
// The entry is the TikTok video itself: VIDEO.json at the repository root
// names it, and the house reads the video's views from TikTok. This program
// has one job: put VIDEO.json in /output, where the gate reads it. Before
// copying, it validates the file it was handed: VIDEO.json must be a JSON
// object whose "url" is a full TikTok video address,
// https://www.tiktok.com/@<handle>/video/<digits>. A placeholder or a short
// link fails loudly here instead of scoring 0 at the gate.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const VIDEO_URL_SHAPE = /^https:\/\/(www\.|m\.)?tiktok\.com\/(@[^/]+\/video\/\d+|v\/\d+\.html)$/;

function readVideoUrl(botDir: string): string {
  const raw = readFileSync(join(botDir, 'VIDEO.json'), 'utf8');
  const parsed: unknown = JSON.parse(raw);
  if (typeof parsed !== 'object' || parsed === null || !('url' in parsed)) {
    throw new Error('VIDEO.json is not a JSON object with a "url" field');
  }
  const url = (parsed as { url: unknown }).url;
  if (typeof url !== 'string' || !VIDEO_URL_SHAPE.test(url)) {
    throw new Error(`VIDEO.json url is not a full TikTok video address: ${String(url)}`);
  }
  return url;
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  const url = readVideoUrl(BOT_DIR);
  copyFileSync(join(BOT_DIR, 'VIDEO.json'), join(OUTPUT_DIR, 'VIDEO.json'));
  console.log(`VIDEO.json OK (${url})`);
} catch (err) {
  console.error(`entry program failed: ${(err as Error).message}`);
  process.exit(1);
}
