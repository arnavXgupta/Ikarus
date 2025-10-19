import React, { useState, useEffect } from 'react';

const ProductDetailsModal = ({ open, onClose, product }) => {
  // Custom scrollbar styles
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 192, 203, 0.3);
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 192, 203, 0.5);
    }
    .custom-scrollbar-horizontal::-webkit-scrollbar {
      height: 6px;
    }
    .custom-scrollbar-horizontal::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 3px;
    }
    .custom-scrollbar-horizontal::-webkit-scrollbar-thumb {
      background: rgba(255, 192, 203, 0.3);
      border-radius: 3px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .custom-scrollbar-horizontal::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 192, 203, 0.5);
    }
    /* Firefox scrollbar styling */
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 192, 203, 0.3) rgba(255, 255, 255, 0.05);
    }
    .custom-scrollbar-horizontal {
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 192, 203, 0.3) rgba(255, 255, 255, 0.05);
    }
  `;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Parse image URLs
  let images = [];
  try {
    images = JSON.parse(product.images.replace(/'/g, '"'));
  } catch {
    images = [product.imageUrl || "https://via.placeholder.com/150"];
  }

  // Inject custom scrollbar styles
  useEffect(() => {
    const styleId = 'product-modal-scrollbar-styles';
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = scrollbarStyles;
      document.head.appendChild(styleElement);
    }
    
    return () => {
      // Clean up styles when component unmounts
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

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
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Modal Container */}
      <div
        className={`relative w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl transition-all duration-300 custom-scrollbar ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 12px 48px 0 rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-200 hover:scale-110"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 sm:p-6 md:p-8">
          {/* Image Section */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative rounded-xl overflow-hidden aspect-square sm:aspect-[4/3] md:aspect-square">
              <img
                src={images[currentIdx]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-200 hover:scale-110"
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={nextImg}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-200 hover:scale-110"
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div
                  className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg"
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                  }}
                >
                  <span className="text-white">
                    {currentIdx + 1} / {images.length}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 sm:mt-4 overflow-x-auto pb-2 custom-scrollbar-horizontal">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIdx(idx)}
                    className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                      idx === currentIdx ? 'ring-2 ring-pink-300' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      border: idx === currentIdx ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col space-y-4 sm:space-y-5">
            {/* Title and Product Info */}
            <div className="space-y-2">
              <h2
                className="font-semibold text-white leading-normal"
                style={{ fontSize: '1.25rem', letterSpacing: '0.01em' }}
              >
                {product.title}
              </h2>
              
              {/* Product ID/SKU */}
              {/* {(product.id || product.sku || product.productId) && (
                <div className="flex items-center gap-2">
                  <span
                    className="text-gray-400 text-xs font-medium"
                    style={{ letterSpacing: '0.02em' }}
                  >
                    {product.sku ? 'SKU' : 'ID'}:
                  </span>
                  <span
                    className="text-gray-300 text-xs font-mono bg-gray-800/50 px-2 py-1 rounded"
                    style={{ letterSpacing: '0.05em' }}
                  >
                    {product.sku || product.id || product.productId}
                  </span>
                </div>
              )} */}
            </div>

            {/* Price Badge */}
            <div
              className="inline-flex items-center self-start px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl"
              style={{
                background: 'rgba(255, 192, 203, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 192, 203, 0.2)',
              }}
            >
              <span
                className="font-semibold text-pink-200"
                style={{ fontSize: '1.1rem', letterSpacing: '0.02em' }}
              >
                ${product.price}
              </span>
            </div>

            {/* Description Section */}
            <div
              className="p-4 sm:p-5 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <h3
                className="font-medium text-gray-200 mb-2 sm:mb-3"
                style={{ fontSize: '0.85rem', letterSpacing: '0.03em', textTransform: 'uppercase' }}
              >
                Description
              </h3>
              <p
                className="text-gray-300 leading-relaxed"
                style={{ fontSize: '0.875rem', opacity: 0.9 }}
              >
                {product.generated_description || product.generateddescription || 'No description available.'}
              </p>
            </div>

            {/* Product Specifications */}
            <div
              className="p-4 sm:p-5 rounded-xl space-y-3 sm:space-y-4"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <h3
                className="font-medium text-gray-200 mb-4"
                style={{ fontSize: '0.85rem', letterSpacing: '0.03em', textTransform: 'uppercase' }}
              >
                Product Specifications
              </h3>
              
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {/* Category */}
                {/* {product.category && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-700/30">
                    <span
                      className="text-gray-400 font-medium"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Category
                    </span>
                    <span
                      className="text-gray-200 font-semibold"
                      style={{ fontSize: '0.85rem' }}
                    >
                      {product.category}
                    </span>
                  </div>
                )} */}

                {/* Dimensions */}
                {product.dimensions && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-700/30">
                    <span
                      className="text-gray-400 font-medium"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Dimensions
                    </span>
                    <span
                      className="text-gray-200 font-semibold"
                      style={{ fontSize: '0.85rem' }}
                    >
                      {product.dimensions}
                    </span>
                  </div>
                )}

                {/* Country of Origin */}
                {product.countryOfOrigin && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-700/30">
                    <span
                      className="text-gray-400 font-medium"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Country of Origin
                    </span>
                    <span
                      className="text-gray-200 font-semibold"
                      style={{ fontSize: '0.85rem' }}
                    >
                      {product.countryOfOrigin}
                    </span>
                  </div>
                )}

                {/* Material */}
                {product.material && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-700/30">
                    <span
                      className="text-gray-400 font-medium"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Material
                    </span>
                    <span
                      className="text-gray-200 font-semibold"
                      style={{ fontSize: '0.85rem' }}
                    >
                      {product.material}
                    </span>
                  </div>
                )}

                {/* Color */}
                {product.color && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-700/30">
                    <span
                      className="text-gray-400 font-medium"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Color
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-600"
                        style={{ backgroundColor: product.color.toLowerCase() }}
                      ></div>
                      <span
                        className="text-gray-200 font-semibold capitalize"
                        style={{ fontSize: '0.85rem' }}
                      >
                        {product.color}
                      </span>
                    </div>
                  </div>
                )}

                {/* Availability */}
                {/* {product.stock !== undefined && (
                  <div className="flex justify-between items-center py-2">
                    <span
                      className="text-gray-400 font-medium"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Availability
                    </span>
                    <span
                      className={`font-semibold ${product.stock > 0 ? 'text-green-300' : 'text-red-300'}`}
                      style={{ fontSize: '0.85rem' }}
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                )} */}
              </div>
            </div>

            {/* Shipping & Warranty Info */}
            <div
              className="p-4 sm:p-5 rounded-xl space-y-3"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <h3
                className="font-medium text-gray-200 mb-3"
                style={{ fontSize: '0.85rem', letterSpacing: '0.03em', textTransform: 'uppercase' }}
              >
                Shipping & Warranty
              </h3>
              
              <div className="space-y-2.5">
                {/* Shipping Info */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <span
                      className="text-gray-200 font-medium"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Free Shipping
                    </span>
                    <p
                      className="text-gray-400"
                      style={{ fontSize: '0.75rem' }}
                    >
                      On orders over ₹500
                    </p>
                  </div>
                </div>

                {/* Warranty Info */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <span
                      className="text-gray-200 font-medium"
                      style={{ fontSize: '0.8rem' }}
                    >
                      1 Year Warranty
                    </span>
                    <p
                      className="text-gray-400"
                      style={{ fontSize: '0.75rem' }}
                    >
                      Manufacturer warranty included
                    </p>
                  </div>
                </div>

                {/* Return Policy */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <span
                      className="text-gray-200 font-medium"
                      style={{ fontSize: '0.8rem' }}
                    >
                      30-Day Returns
                    </span>
                    <p
                      className="text-gray-400"
                      style={{ fontSize: '0.75rem' }}
                    >
                      Easy returns and exchanges
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2">
              <button
                className="flex-1 px-5 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: 'rgba(255, 192, 203, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 192, 203, 0.25)',
                  fontSize: '0.875rem',
                  letterSpacing: '0.02em',
                  color: 'rgb(251, 207, 232)',
                }}
              >
                Add to Cart
              </button>

              <button
                className="flex-1 px-5 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '0.875rem',
                  letterSpacing: '0.02em',
                  color: 'rgb(229, 231, 235)',
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
