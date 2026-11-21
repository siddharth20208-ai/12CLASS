// usage: node tests/render.mjs <in.svg> <out.png> — rasterize an SVG so a diagram can be reviewed visually
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fontFile = path.join(__dirname, 'node_modules/katex/dist/fonts/KaTeX_SansSerif-Regular.ttf');
const svg = fs.readFileSync(process.argv[2], 'utf8');
const png = new Resvg(svg, {
  background: 'white',
  fitTo: { mode: 'width', value: 900 },
  font: {
    loadSystemFonts: false,
    fontFiles: [fontFile],
    defaultFontFamily: 'KaTeX_SansSerif',
    sansSerifFamily: 'KaTeX_SansSerif',
  },
}).render().asPng();
fs.writeFileSync(process.argv[3], png);
console.log('ok', process.argv[3], png.length, 'bytes');
