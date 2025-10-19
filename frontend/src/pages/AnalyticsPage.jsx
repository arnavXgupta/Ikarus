import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = 'http://127.0.0.1:8000';

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/analytics`);
        const data = response.data;
        
        // Format data for Recharts
        const brandData = data.top_brands.brands.map((brand, index) => ({
          name: brand,
          count: data.top_brands.counts[index]
        }));

        const materialData = data.top_materials.materials.map((material, index) => ({
            name: material,
            count: data.top_materials.counts[index]
        }));

        setAnalytics({ brandData, materialData });
      } catch (err) {
        setError('Failed to fetch analytics data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <p className="text-white text-center">Loading analytics...</p>;
  if (error) return <div className="text-red-600 bg-red-100 p-3 rounded-md">{error}</div>;

  return (
    <div className="text-white px-2 sm:px-4">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-center">Product Analytics</h2>

      <div className="mb-8 sm:mb-12">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6">Top 10 Brands</h3>
        <div className="bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg overflow-x-auto">
          <ResponsiveContainer width="100%" height={300} className="min-w-[300px]">
            <BarChart data={analytics.brandData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={80} 
                stroke="#9CA3AF" 
                fontSize={10}
                tick={{ fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB',
                  fontSize: '12px'
                }} 
              />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Number of Products" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6">Top 10 Materials</h3>
        <div className="bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg overflow-x-auto">
          <ResponsiveContainer width="100%" height={300} className="min-w-[300px]">
            <BarChart data={analytics.materialData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={80} 
                stroke="#9CA3AF" 
                fontSize={10}
                tick={{ fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB',
                  fontSize: '12px'
                }} 
              />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" name="Number of Products" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;