// news-image-20261123: writes the 23 November 2026 front page to /output/entry.png.
//
// The front page is a 1024x1024 JPEG kept in the repository as base64 text
// (entry.b64.txt) because the repository holds text only. This program reads
// that text, decodes it, and writes the exact bytes out. Node 22, standard
// library only, no network and no randomness, so both runs write identical
// bytes. Every path below is resolved from this file's own location.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const encoded = readFileSync(join(repoRoot, 'entry.b64.txt'), 'utf8').trim();
const image = Buffer.from(encoded, 'base64');

// The gate only accepts a whole JPEG under 1 MiB: check the SOI marker and
// the size before writing anything, so a bad asset fails loudly instead of
// producing an invalid entry.
const MAX_BYTES = 1048576;
if (image[0] !== 0xff || image[1] !== 0xd8 || image.length > MAX_BYTES) {
  throw new Error('entry image is not a JPEG under 1 MiB');
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, 'entry.png'), image);
