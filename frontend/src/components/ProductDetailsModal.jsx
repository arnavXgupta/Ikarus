import React, { useState, useEffect } from 'react';

const ProductDetailsModal = ({ open, onClose, product }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Parse image URLs
  let images = [];
  try {
    images = JSON.parse(product.images.replace(/'/g, '"'));
  } catch {
    images = [product.imageUrl || "https://via.placeholder.com/150"];
  }

  // Handle modal animation
  useEffect(() => {
    if (open) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  const nextImg = () => setCurrentIdx((currentIdx + 1) % images.length);
  const prevImg = () => setCurrentIdx((currentIdx - 1 + images.length) % images.length);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-all duration-300 ${
        isVisible ? 'bg-black/70 backdrop-blur-sm' : 'bg-transparent'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`relative w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto bg-gradient-to-br from-neutral-950/98 via-neutral-900/98 to-neutral-950/98 backdrop-blur-xl border border-neutral-800/60 rounded-t-3xl sm:rounded-xl lg:rounded-2xl shadow-2xl transition-all duration-500 transform ${
          isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
        style={{ 
          maxHeight: '90vh',
          minHeight: '60vh'
        }}
      >
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-12 h-1.5 bg-neutral-600/60 rounded-full mx-auto mt-3 mb-2"></div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-neutral-800/90 backdrop-blur-sm border border-neutral-700/50 flex items-center justify-center text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/90 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-neutral-600/50 touch-manipulation"
        >
          <svg className="w-5 h-5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Content */}
        <div className="flex flex-col lg:flex-row h-full overflow-y-auto overscroll-contain">
          {/* Image Section */}
          <div className="relative w-full lg:w-1/2 p-4 sm:p-4 md:p-6 lg:p-8 flex-shrink-0">
            <div className="relative w-full aspect-square max-w-xs sm:max-w-sm mx-auto lg:max-w-none bg-gradient-to-br from-neutral-800/50 to-neutral-900/60 rounded-xl sm:rounded-xl overflow-hidden border border-neutral-700/40">
              <img 
                src={images[currentIdx]} 
                alt={product.name || product.title}
                className="w-full h-full object-contain p-3 sm:p-3 md:p-4 transition-all duration-500"
                style={{ filter: "brightness(0.95) saturate(0.9)" }}
              />
              
              {/* Image Navigation - Touch Optimized */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    className="absolute left-2 sm:left-2 md:left-3 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-10 sm:h-10 md:w-10 md:h-10 rounded-full bg-neutral-800/95 backdrop-blur-sm border border-neutral-700/50 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-700/95 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-neutral-600/50 touch-manipulation active:scale-95"
                  >
                    <svg className="w-5 h-5 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImg}
                    className="absolute right-2 sm:right-2 md:right-3 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-10 sm:h-10 md:w-10 md:h-10 rounded-full bg-neutral-800/95 backdrop-blur-sm border border-neutral-700/50 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-700/95 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-neutral-600/50 touch-manipulation active:scale-95"
                  >
                    <svg className="w-5 h-5 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-3 sm:bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 sm:px-3 sm:py-1 rounded-full bg-neutral-800/95 backdrop-blur-sm border border-neutral-700/50">
                  <span className="text-xs font-medium text-neutral-300">
                    {currentIdx + 1} / {images.length}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-1/2 p-4 sm:p-4 md:p-6 lg:p-8 flex flex-col justify-between min-h-0 flex-1">
            <div className="space-y-4 sm:space-y-4 md:space-y-6">
              {/* Brand */}
              <div className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 sm:h-1.5 sm:w-1.5 rounded-full bg-neutral-500 opacity-70" />
                <span className="text-sm sm:text-sm font-medium text-neutral-400 uppercase tracking-widest">
                  {product.brand}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-light text-neutral-100 leading-tight" style={{ fontFamily: "Inter, 'Segoe UI', sans-serif" }}>
                {product.name || product.title}
              </h1>

              {/* Description */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-sm sm:text-sm font-medium text-neutral-400 uppercase tracking-wider">Description</h3>
                <p className="text-base sm:text-base text-neutral-300 leading-relaxed">
                  {product.generated_description || product.generateddescription || 'No description available.'}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <div className="px-4 py-2.5 sm:px-4 sm:py-2 bg-gradient-to-r from-neutral-800/60 to-neutral-700/60 rounded-lg border border-neutral-600/40">
                  <span className="text-xl sm:text-xl md:text-2xl font-medium text-neutral-100">
                    {product.price ? `₹${product.price.toFixed(2)}` : 'Price N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons - Mobile Optimized */}
            <div className="flex flex-col gap-3 sm:gap-3 pt-6 sm:pt-6 border-t border-neutral-800/60 mt-6 sm:mt-6 sticky bottom-0 bg-gradient-to-t from-neutral-950/98 to-transparent backdrop-blur-sm">
              <button className="w-full px-6 py-4 sm:px-6 sm:py-3 bg-gradient-to-r from-neutral-800/90 to-neutral-700/90 hover:from-neutral-700/95 hover:to-neutral-600/95 text-neutral-200 font-medium rounded-xl border border-neutral-600/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-neutral-600/50 text-base sm:text-base touch-manipulation active:scale-95">
                Add to Cart
              </button>
              <button className="w-full px-6 py-4 sm:px-6 sm:py-3 bg-gradient-to-r from-neutral-700/70 to-neutral-600/70 hover:from-neutral-600/90 hover:to-neutral-500/90 text-neutral-300 font-medium rounded-xl border border-neutral-600/40 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-neutral-600/50 text-base sm:text-base touch-manipulation active:scale-95">
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;