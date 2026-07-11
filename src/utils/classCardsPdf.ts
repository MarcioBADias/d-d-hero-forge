import { jsPDF } from 'jspdf';
import { ClassCard } from '@/data/classCards';

async function loadImageDataUrl(url: string): Promise<{ dataUrl: string; w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('canvas ctx'));
      ctx.drawImage(img, 0, 0);
      resolve({ dataUrl: canvas.toDataURL('image/png'), w: img.naturalWidth, h: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = url;
  });
}

export async function printClassCardsToPdf(
  cards: ClassCard[],
  filename = 'class_cards.pdf',
  backUrl?: string | null,
) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageW = 210;
  const pageH = 297;
  const cols = 3;
  const rows = 3;
  const perPage = cols * rows;
  const marginX = 8;
  const marginY = 8;
  const gap = 3;
  const cellW = (pageW - marginX * 2 - gap * (cols - 1)) / cols;
  const cellH = (pageH - marginY * 2 - gap * (rows - 1)) / rows;

  // Preload back image once (if provided)
  let backImg: { dataUrl: string; w: number; h: number } | null = null;
  if (backUrl) {
    try {
      backImg = await loadImageDataUrl(backUrl);
    } catch (e) {
      console.warn('Could not load back image', backUrl, e);
    }
  }

  const totalPages = Math.ceil(cards.length / perPage);

  for (let p = 0; p < totalPages; p++) {
    if (p > 0) doc.addPage();

    const pageCards = cards.slice(p * perPage, p * perPage + perPage);

    // Front page
    for (let posInPage = 0; posInPage < pageCards.length; posInPage++) {
      const row = Math.floor(posInPage / cols);
      const col = posInPage % cols;
      const x = marginX + col * (cellW + gap);
      const y = marginY + row * (cellH + gap);

      try {
        const { dataUrl, w, h } = await loadImageDataUrl(pageCards[posInPage].url);
        const ratio = Math.min(cellW / w, cellH / h);
        const drawW = w * ratio;
        const drawH = h * ratio;
        const dx = x + (cellW - drawW) / 2;
        const dy = y + (cellH - drawH) / 2;
        doc.addImage(dataUrl, 'PNG', dx, dy, drawW, drawH);
      } catch (e) {
        doc.setFontSize(8);
        doc.text(pageCards[posInPage].label, x + 2, y + 5);
      }
    }

    // Back page (only if backImg is available)
    if (backImg) {
      doc.addPage();
      for (let posInPage = 0; posInPage < pageCards.length; posInPage++) {
        const row = Math.floor(posInPage / cols);
        const col = posInPage % cols;
        // Mirror horizontally so duplex (long-edge flip) aligns front/back
        const mirroredCol = cols - 1 - col;
        const x = marginX + mirroredCol * (cellW + gap);
        const y = marginY + row * (cellH + gap);

        const { dataUrl, w, h } = backImg;
        const ratio = Math.min(cellW / w, cellH / h);
        const drawW = w * ratio;
        const drawH = h * ratio;
        const dx = x + (cellW - drawW) / 2;
        const dy = y + (cellH - drawH) / 2;
        doc.addImage(dataUrl, 'PNG', dx, dy, drawW, drawH);
      }
    }
  }

  doc.save(filename);
}