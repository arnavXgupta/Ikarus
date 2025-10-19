import React, { useState } from "react";
import ProductDetailsModal from "./ProductDetailsModal";

// Helper: Safely parse images string & get first URL
const getFirstImageUrl = (imagesStr) => {
  try {
    const images = JSON.parse(imagesStr.replace(/'/g, '"'));
    if (Array.isArray(images) && images.length > 0) {
      return images[0].trim();
    }
  } catch (e) {
    console.error("Failed to parse images string:", e);
  }
  return "https://via.placeholder.com/150";
};

function ProductCard({ product }) {
  const imageUrl = getFirstImageUrl(product.images);
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpenModal(true)}
        className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.3))',
            }}
          />
        </div>

        {/* Content Container */}
        <div className="p-5">
          {/* Title */}
          <h3 
            className="font-semibold mb-2 truncate transition-colors duration-200 group-hover:text-pink-300"
            style={{ fontSize: '0.95rem', letterSpacing: '0.01em' }}
          >
            {product.name}
          </h3>

          {/* Description */}
          <p 
            className="text-gray-300 mb-4 line-clamp-2 leading-relaxed"
            style={{ fontSize: '0.8rem', opacity: 0.85 }}
          >
            {product.generated_description}
          </p>

          {/* Price & Button Container */}
          <div className="flex items-center justify-between">
            {/* Price Badge */}
            <div
              className="px-3 py-1.5 rounded-lg"
              style={{
                background: 'rgba(255, 192, 203, 0.08)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 192, 203, 0.15)',
              }}
            >
              <span 
                className="font-semibold text-pink-200"
                style={{ fontSize: '0.85rem', letterSpacing: '0.02em' }}
              >
                ${product.price}
              </span>
            </div>

            {/* View Details Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenModal(true);
              }}
              className="px-4 py-1.5 rounded-lg transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(255, 192, 203, 0.12)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 192, 203, 0.2)',
                fontSize: '0.8rem',
                fontWeight: '500',
                letterSpacing: '0.02em',
              }}
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ProductDetailsModal
        open={openModal}
        product={product}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}

export default ProductCard;
