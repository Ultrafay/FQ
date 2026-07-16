import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');
const path = require('path');
const { createCanvas, Image, ImageData, Path2D } = require('canvas');
global.Image = Image;
global.ImageData = ImageData;
global.Path2D = Path2D;
const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

const [, , pdfPath, outDir, scaleArg] = process.argv;
const scale = scaleArg ? parseFloat(scaleArg) : 2;

class NodeCanvasFactory {
  create(width, height) {
    const canvas = createCanvas(width, height);
    return { canvas, context: canvas.getContext('2d') };
  }
  reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }
  destroy(canvasAndContext) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

const canvasFactory = new NodeCanvasFactory();
const data = new Uint8Array(fs.readFileSync(pdfPath));
const doc = await pdfjsLib.getDocument({ data, canvasFactory }).promise;
console.log('numPages:', doc.numPages);

fs.mkdirSync(outDir, { recursive: true });

for (let i = 1; i <= doc.numPages; i++) {
  const page = await doc.getPage(i);
  const viewport = page.getViewport({ scale });
  const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
  await page.render({ canvasContext: canvasAndContext.context, viewport, canvasFactory }).promise;
  const outPath = path.join(outDir, `page-${i}.png`);
  fs.writeFileSync(outPath, canvasAndContext.canvas.toBuffer('image/png'));
  console.log('saved', outPath, viewport.width, 'x', viewport.height);
  canvasFactory.destroy(canvasAndContext);
}
