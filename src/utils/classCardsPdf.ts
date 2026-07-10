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

export async function printClassCardsToPdf(cards: ClassCard[], filename = 'class_cards.pdf') {
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

  for (let i = 0; i < cards.length; i++) {
    const pageIndex = Math.floor(i / perPage);
    const posInPage = i % perPage;
    if (posInPage === 0 && pageIndex > 0) doc.addPage();
    const row = Math.floor(posInPage / cols);
    const col = posInPage % cols;
    const x = marginX + col * (cellW + gap);
    const y = marginY + row * (cellH + gap);

    try {
      const { dataUrl, w, h } = await loadImageDataUrl(cards[i].url);
      // Fit preserving aspect ratio
      const ratio = Math.min(cellW / w, cellH / h);
      const drawW = w * ratio;
      const drawH = h * ratio;
      const dx = x + (cellW - drawW) / 2;
      const dy = y + (cellH - drawH) / 2;
      doc.addImage(dataUrl, 'PNG', dx, dy, drawW, drawH);
    } catch (e) {
      doc.setFontSize(8);
      doc.text(cards[i].label, x + 2, y + 5);
    }
  }

  doc.save(filename);
}