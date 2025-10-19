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
      <div className="group relative w-full max-w-md mx-auto rounded-xl bg-neutral-950/70 border border-neutral-800/60 shadow-lg transition-all duration-500 ease-out hover:shadow-neutral-800/40 hover:-translate-y-1 hover:scale-103 transform-gpu overflow-hidden">
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/15 via-transparent to-neutral-700/15 opacity-0 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none" />
        {/* Soft shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-900 bg-gradient-to-r from-transparent via-neutral-800/10 to-transparent skew-x-6 pointer-events-none" />
        {/* Image */}
        <div className="relative w-full aspect-square overflow-hidden rounded-t-3xl bg-gradient-to-br from-neutral-800/50 to-neutral-900/60 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={product.name || product.title}
            className="w-full h-full object-contain p-5 transition-transform duration-700 ease-out group-hover:scale-101"
            style={{ filter: "brightness(0.94) saturate(0.92)" }}
          />
        </div>
        {/* Badge */}
        {/* <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-neutral-800/85 backdrop-blur border border-neutral-700/40 shadow-md">
          <span className="text-xs font-medium text-neutral-200 tracking-wider" style={{ letterSpacing: "0.07em" }}>
            Premium
          </span>
        </div> */}
        {/* Card Content */}
        <div className="relative px-5 py-4 md:px-7 md:py-6 space-y-3">
          {/* Brand */}
          <div className="flex items-center space-x-2 pb-1">
            <div className="h-1 w-1 rounded-full bg-neutral-500 opacity-60" />
            <span className="text-[13px] font-normal text-neutral-400 uppercase tracking-widest">
              {product.brand}
            </span>
          </div>
          {/* Name */}
          <h3
            className="text-lg md:text-xl font-normal text-neutral-100 line-clamp-2 transition-colors duration-300 tracking-tight group-hover:text-neutral-50"
            style={{ fontFamily: "Inter, 'Segoe UI', sans-serif" }}
          >
            {product.name || product.title}
          </h3>
          {/* Description */}
          <p className="text-[15px] md:text-base text-neutral-400 line-clamp-2 leading-relaxed font-normal">
            {product.generated_description}
          </p>
          {/* Price & Button */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-4 gap-3 md:gap-0">
            {/* Price */}
            <span className="px-4 py-1.5 bg-neutral-800/65 rounded-md border border-neutral-700/30 shadow-sm text-base md:text-lg font-medium text-neutral-100">
              ₹{product.price ? product.price.toFixed(2) : "N/A"}
            </span>
            {/* Button */}
            <button
              onClick={() => setOpenModal(true)}
              className="px-5 py-2 rounded-md bg-neutral-800/70 text-neutral-200 font-medium text-[15px] border border-neutral-700/40 shadow-md hover:shadow-neutral-600/15 hover:bg-neutral-700/80 hover:border-neutral-700/60 transition-all duration-300 hover:-translate-y-0.5 transform-gpu active:scale-98 focus:outline-none focus:ring-2 focus:ring-neutral-700/30 focus:ring-offset-2 focus:ring-offset-neutral-900 overflow-hidden"
            >
              <span className="relative z-10 tracking-wide">View Details</span>
            </button>
          </div>
        </div>
      </div>

      <ProductDetailsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        product={product}
      />
    </>
  );
}

export default ProductCard;
