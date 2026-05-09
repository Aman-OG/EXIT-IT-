import React from 'react';
import { ZoomIn, ZoomOut, Download, Printer, Search, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

const PDFToolbar = ({ 
  zoom, 
  onZoomIn, 
  onZoomOut, 
  onDownload, 
  onPrint, 
  onSearch, 
  onFullscreen,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  isLoading 
}) => {
  return (
    <div className="bg-card border-b border-neutral-200 dark:border-neutral-800 p-3 flex items-center justify-between gap-2 flex-wrap shadow-sm">
      {/* Left: Page Navigation */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={onPrevPage}
          disabled={isLoading || currentPage <= 1}
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous page"
        >
          <ChevronLeft size={20} className="text-text/70" />
        </button>
        
        <div className="bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-lg text-sm font-medium text-text/70 min-w-24 text-center">
          {currentPage} / {totalPages || '?'}
        </div>
        
        <button 
          onClick={onNextPage}
          disabled={isLoading || currentPage >= totalPages}
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next page"
        >
          <ChevronRight size={20} className="text-text/70" />
        </button>
      </div>

      {/* Center: Zoom Controls */}
      <div className="flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
        <button 
          onClick={onZoomOut}
          disabled={isLoading || zoom <= 0.5}
          className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom out"
        >
          <ZoomOut size={18} className="text-text/70" />
        </button>
        
        <div className="px-2 text-sm font-semibold text-text/70 min-w-12 text-center">
          {Math.round(zoom * 100)}%
        </div>
        
        <button 
          onClick={onZoomIn}
          disabled={isLoading || zoom >= 2}
          className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom in"
        >
          <ZoomIn size={18} className="text-text/70" />
        </button>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center space-x-1">
        <button 
          onClick={onSearch}
          disabled={isLoading}
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Search in PDF"
        >
          <Search size={20} className="text-text/70" />
        </button>
        
        <button 
          onClick={onFullscreen}
          disabled={isLoading}
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Fullscreen"
        >
          <Maximize2 size={20} className="text-text/70" />
        </button>
        
        <button 
          onClick={onPrint}
          disabled={isLoading}
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Print"
        >
          <Printer size={20} className="text-text/70" />
        </button>
        
        <button 
          onClick={onDownload}
          disabled={isLoading}
          className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          title="Download PDF"
        >
          <Download size={20} />
        </button>
      </div>
    </div>
  );
};

export default PDFToolbar;
