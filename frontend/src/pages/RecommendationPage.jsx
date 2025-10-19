import React, { useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
// const API_URL = "http://127.0.0.1:8000"; //  FastAPI backend URL
const API_URL = "https://ikarus-ltrs.onrender.com"; //  deployed FastAPI backend URL

function RecommendationPage() {
  const [prompt, setPrompt] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError("");
    setRecommendations([]);

    try {
      const response = await axios.post(`${API_URL}/recommend`, { prompt });
      setRecommendations(response.data);
    } catch (err) {
      setError("Failed to fetch recommendations. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-grow">
      <div className="flex flex-col justify-center min-h-screen transition-all duration-500">
        <div className="px-2 sm:px-4 py-3 sm:py-5 flex-1 flex justify-center items-center">
          <div className="flex flex-col w-full max-w-4xl">
            <div className="flex flex-col gap-4 sm:gap-6 items-center justify-center text-center transition-all duration-500">
              <div className="flex flex-col gap-2">
                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                  AI-Powered Interior Design
                </h1>
                <h2 className="text-gray-400 text-sm sm:text-base md:text-lg font-normal leading-normal px-4">
                  Ikarus Digital Atelier helps you find the perfect furniture
                  for your space.
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6 w-full max-w-2xl">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your prompt here..."
                  className="flex-grow px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-primary text-bg-dark border-none rounded-md cursor-pointer font-medium hover:bg-blue-300 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isLoading ? "Thinking..." : "Get Recommendations"}
                </button>
              </form>
              {error && (
                <div className="text-red-600 bg-red-100 p-3 rounded-md mb-6 max-w-2xl w-full">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
                {recommendations.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RecommendationPage;
