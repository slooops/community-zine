'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Serve the worker locally from public/ — avoids CDN flakiness and version mismatches
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export default function MagazineViewer() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageWidth, setPageWidth] = useState(380);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);
  const swipeStartX = useRef<number | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isMobile = pageWidth < 640;

  useEffect(() => {
    fetch('/api/magazine-url')
      .then((r) => r.json())
      .then((d) => {
        if (d.url) setPdfUrl(d.url);
        else setError('Could not load magazine.');
      })
      .catch(() => setError('Could not load magazine.'));
  }, []);

  const updateWidth = useCallback(() => {
    const w = window.innerWidth;
    setPageWidth(Math.min(w < 640 ? w - 32 : Math.floor(w / 2) - 48, 520));
  }, []);

  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [updateWidth]);

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  // Navigate with a quick opacity fade — fade out, swap page, fade in
  const navigate = useCallback(
    (direction: 'prev' | 'next') => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
      setFading(true);
      fadeTimer.current = setTimeout(() => {
        setCurrentPage((p) => {
          if (direction === 'prev') return Math.max(1, isMobile ? p - 1 : p - 2);
          return Math.min(numPages, isMobile ? p + 1 : p + 2);
        });
        setFading(false);
      }, 110); // slightly longer than the 100ms CSS transition
    },
    [isMobile, numPages],
  );

  const prev = useCallback(() => navigate('prev'), [navigate]);
  const next = useCallback(() => navigate('next'), [navigate]);

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

  const pageHeight = pageWidth * 1.414;
  const pagesToShow = isMobile
    ? [currentPage]
    : [currentPage, currentPage + 1].filter((p) => p <= numPages);

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* Loading skeleton */}
      {loading && (
        <div
          className="bg-gray-800 animate-pulse"
          style={{ width: isMobile ? pageWidth : pageWidth * 2 + 8, height: pageHeight }}
        />
      )}

      {pdfUrl && (
        <Document
          file={pdfUrl}
          onLoadSuccess={onLoadSuccess}
          loading={null}
          className={loading ? 'hidden' : ''}
        >
          {/* Fade wrapper + swipe target */}
          <div
            className="flex gap-2 shadow-2xl cursor-grab active:cursor-grabbing"
            style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.1s ease' }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            {pagesToShow.map((pageNum) => (
              <div key={pageNum} className="bg-white">
                <Page
                  pageNumber={pageNum}
                  width={pageWidth}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  loading={
                    <div
                      className="bg-gray-800 animate-pulse"
                      style={{ width: pageWidth, height: pageHeight }}
                    />
                  }
                />
              </div>
            ))}
          </div>
        </Document>
      )}

      {/* Navigation controls */}
      {numPages > 0 && (
        <div className="flex items-center gap-6 mt-2">
          <button
            onClick={prev}
            disabled={currentPage <= 1}
            className="px-3 py-2 bg-[#D94550] text-white disabled:opacity-30 hover:bg-[#c23a46] transition flex items-center gap-1 text-sm font-semibold rounded-none"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} strokeWidth={2.5} /> Prev
          </button>
          <span className="text-sm text-gray-400 tabular-nums">
            {isMobile
              ? `${currentPage} / ${numPages}`
              : `${currentPage}–${Math.min(currentPage + 1, numPages)} / ${numPages}`}
          </span>
          <button
            onClick={next}
            disabled={currentPage >= numPages}
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
