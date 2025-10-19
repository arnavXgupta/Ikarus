// import React from 'react';

// // Helper to safely parse images string and get the first URL
// const getFirstImageUrl = (imagesStr) => {
//   try {
//     const images = JSON.parse(imagesStr.replace(/'/g, '"'));
//     if (Array.isArray(images) && images.length > 0) {
//       return images[0].trim();
//     }
//   } catch (e) {
//     console.error("Failed to parse images string:", e);
//   }
//   return 'https://via.placeholder.com/150'; // Fallback image
// };

// function ProductCard({ product }) {
//   const imageUrl = getFirstImageUrl(product.images);
  
//   return (
//     <div className="bg-gradient-to-b from-gray-900/90 via-gray-900/80 to-gray-800/80 border border-gray-700 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-blue-600/40 transition-shadow duration-200 group flex flex-col h-full">
//       <div className="overflow-hidden rounded-t-xl sm:rounded-t-2xl">
//         <img
//           src={imageUrl}
//           alt={product.title}
//           className="w-full h-40 sm:h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300"
//           loading="lazy"
//         />
//       </div>
//       <div className="flex flex-col p-3 sm:p-4 flex-1">
//         <h3 className="m-0 text-base sm:text-lg md:text-xl font-semibold text-white truncate">{product.title}</h3>
//         <p className="text-xs sm:text-sm text-blue-300 italic mb-1">by {product.brand}</p>
//         <p className="font-bold text-green-400 text-lg sm:text-xl md:text-2xl mb-2">${product.price.toFixed(2)}</p>
//         <hr className="border-gray-700 mb-2" />
//         <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3 sm:line-clamp-4">{product.generated_description}</p>
//       </div>
//     </div>
//   );
// }

// export default ProductCard;
import React from 'react';

// Helper to safely parse images string and get the first URL
const getFirstImageUrl = (imagesStr) => {
  try {
    const images = JSON.parse(imagesStr.replace(/'/g, '"'));
    if (Array.isArray(images) && images.length > 0) {
      return images[0].trim();
    }
  } catch (e) {
    console.error("Failed to parse images string:", e);
  }
  return 'https://via.placeholder.com/150';
};

function ProductCard({ product }) {
  const imageUrl = getFirstImageUrl(product.images);
  
  return (
    <div className="group relative w-full max-w-sm perspective-1000">
      {/* Main Card Container with 3D transforms */}
      <div className="relative h-[480px] rounded-2xl bg-gradient-to-br from-white/90 via-white/70 to-white/50 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-500 ease-out hover:shadow-pink-200/50 hover:-translate-y-3 hover:scale-[1.02] transform-gpu overflow-hidden">
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-transparent to-purple-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
        
        {/* Image Container with 3D depth */}
        <div className="relative h-64 overflow-hidden rounded-t-2xl bg-gradient-to-br from-pink-50/50 to-purple-50/50">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
          <img
            src={imageUrl}
            alt={product.name}
            className="relative w-full h-full object-contain p-6 transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-2 transform-gpu drop-shadow-2xl"
          />
          
          {/* Floating badge */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-pink-200/50 shadow-lg">
            <span className="text-xs font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Premium
            </span>
          </div>
        </div>
        
        {/* Content Section with glassmorphism */}
        <div className="relative p-6 space-y-3">
          {/* Brand tag */}
          <div className="flex items-center space-x-2">
            <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-pulse"></div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {product.brand}
            </span>
          </div>
          
          {/* Product Name */}
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
            {product.name}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {product.generated_description}
          </p>
          
          {/* Price and Button Container */}
          <div className="flex items-center justify-between pt-4">
            {/* Price with 3D effect */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative px-4 py-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>
            
            {/* Floating Action Button */}
            <button className="relative px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-sm shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:-translate-y-1 hover:scale-105 transform-gpu active:scale-95 overflow-hidden group/btn">
              <span className="relative z-10">View</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      
      {/* 3D Shadow effect */}
      <div className="absolute -bottom-2 left-4 right-4 h-4 bg-gradient-to-r from-pink-200/40 via-purple-200/40 to-pink-200/40 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10"></div>
    </div>
  );
}

export default ProductCard;
