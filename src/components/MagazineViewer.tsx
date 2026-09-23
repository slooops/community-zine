'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Serve the worker locally from public/ — avoids CDN flakiness and version mismatches
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// US Letter (8.5 × 11 in) aspect ratio
const LETTER_RATIO = 11 / 8.5;

// Book-style pagination: page 1 (the cover) stands alone, then facing pages
// pair up as 2-3, 4-5, 6-7, ... A trailing unpaired page (the back cover)
// also stands alone. On mobile every page stands alone.
function buildSpreads(numPages: number, isMobile: boolean): number[][] {
  if (numPages <= 0) return [];
  if (isMobile) return Array.from({ length: numPages }, (_, i) => [i + 1]);

  const spreads: number[][] = [[1]];
  for (let p = 2; p <= numPages; p += 2) {
    spreads.push(p + 1 <= numPages ? [p, p + 1] : [p]);
  }
  return spreads;
}

export default function MagazineViewer({ issueSlug }: { issueSlug: string }) {
  const [numPages, setNumPages] = useState(0);
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1024);
  const [pageWidth, setPageWidth] = useState(380);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const swipeStartX = useRef<number | null>(null);

  // Below the `sm` breakpoint: phones. At or above it: tablet/desktop, wide
  // enough to show facing pages side by side.
  const isMobile = viewportWidth < 640;

  const updateWidth = useCallback(() => {
    const w = window.innerWidth;
    setViewportWidth(w);
    setPageWidth(Math.min(w < 640 ? w - 32 : Math.floor(w / 2) - 48, 520));
  }, []);

  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [updateWidth]);

  // Reset viewer state when switching issues
  useEffect(() => {
    setNumPages(0);
    setSpreadIndex(0);
    setLoading(true);
    setError(null);
  }, [issueSlug]);

  const spreads = useMemo(() => buildSpreads(numPages, isMobile), [numPages, isMobile]);
  const pagesToShow = spreads[spreadIndex] ?? [];

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setSpreadIndex(0);
    setLoading(false);
  };

  const prev = useCallback(
    () => setSpreadIndex((i) => Math.max(0, i - 1)),
    [],
  );
  const next = useCallback(
    () => setSpreadIndex((i) => Math.min(spreads.length - 1, i + 1)),
    [spreads.length],
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  // Swipe / touch navigation
  const handlePointerDown = (e: React.PointerEvent) => {
    swipeStartX.current = e.clientX;
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    if (swipeStartX.current === null) return;
    const delta = swipeStartX.current - e.clientX;
    if (Math.abs(delta) > 40) {
      delta > 0 ? next() : prev();
    }
    swipeStartX.current = null;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  const pageHeight = Math.round(pageWidth * LETTER_RATIO);

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* Loading skeleton — the opening view is always a single page (the cover) */}
      {loading && (
        <div
          className="bg-gray-800 animate-pulse"
          style={{ width: pageWidth, height: pageHeight }}
        />
      )}

      <Document
          file={`/api/magazine-url?issue=${issueSlug}`}
          onLoadSuccess={onLoadSuccess}
          onLoadError={(err) => {
            console.error('PDF load error:', err);
            setError('Could not load magazine. Please try refreshing.');
            setLoading(false);
          }}
          loading={null}
          className={loading ? 'hidden' : ''}
        >
          {/* Swipe target */}
          <div
            className="flex gap-2 shadow-2xl cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            {pagesToShow.map((pageNum) => (
              <div
                key={pageNum}
                className="bg-white overflow-hidden"
                style={{ width: pageWidth, flexShrink: 0 }}
              >
                <Page
                  pageNumber={pageNum}
                  width={pageWidth}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  loading={null}
                />
              </div>
            ))}
          </div>
        </Document>

      {/* Navigation controls */}
      {numPages > 0 && (
        <div className="flex items-center gap-6 mt-2">
          <button
            onClick={prev}
            disabled={spreadIndex <= 0}
            className="px-3 py-2 bg-[#D94550] text-white disabled:opacity-30 hover:bg-[#c23a46] transition flex items-center gap-1 text-sm font-semibold rounded-none"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} strokeWidth={2.5} /> Prev
          </button>
          <span className="text-sm text-gray-400 tabular-nums">
            {pagesToShow.length === 2
              ? `${pagesToShow[0]}–${pagesToShow[1]}`
              : `${pagesToShow[0]}`} / {numPages}
          </span>
          <button
            onClick={next}
            disabled={spreadIndex >= spreads.length - 1}
            className="px-3 py-2 bg-[#D94550] text-white disabled:opacity-30 hover:bg-[#c23a46] transition flex items-center gap-1 text-sm font-semibold rounded-none"
            aria-label="Next page"
          >
            Next <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      )}

      <p className="text-xs text-gray-600 mt-1">
        {isMobile ? 'Swipe or use buttons to navigate' : 'Arrow keys or swipe to navigate'}
      </p>
    </div>
  );
}
