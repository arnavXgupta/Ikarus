import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = "https://ikarus-ltrs.onrender.com";

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/analytics`);
        const data = response.data;

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

  // Loading State - Dark theme
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-neutral-900 to-gray-950 flex items-center justify-center p-6">
        <div className="relative">
          {/* Subtle glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-600/20 via-neutral-500/20 to-slate-600/20 blur-3xl opacity-40 animate-pulse"></div>

          {/* Loading card */}
          <div className="relative px-12 py-8 bg-neutral-900/60 backdrop-blur-xl rounded-2xl border border-neutral-800/50 shadow-2xl">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 border-4 border-neutral-700/30 border-t-neutral-400 rounded-full animate-spin"></div>
              <p className="text-neutral-300 text-lg font-light tracking-wide">Loading Analytics</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State - Dark theme
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-neutral-900 to-gray-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-neutral-900/60 backdrop-blur-xl rounded-2xl border border-red-900/30 shadow-2xl p-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-950/50 rounded-full flex items-center justify-center border border-red-900/50">
              <span className="text-2xl text-red-400">⚠</span>
            </div>
            <h2 className="text-xl font-light text-red-300">Error</h2>
          </div>
          <p className="text-neutral-400 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  // Custom Tooltip Component - Dark theme
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-900/95 backdrop-blur-sm px-4 py-3 rounded-lg border border-neutral-700/50 shadow-xl">
          <p className="text-neutral-200 font-medium mb-1">{label}</p>
          <p className="text-neutral-400 text-sm">Count: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  // Main Analytics Display - Dark theme
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-650 via-neutral-900 to-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="text-center space-y-3 py-8">
          <h1 className="text-4xl font-bold text-neutral-100 tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-neutral-400 text-lg font-light">
            Insights into top-performing brands and materials
          </p>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Total Data Points Card */}
          <div className="group bg-neutral-950/40 backdrop-blur-sm rounded-2xl border border-neutral-800/50 p-6 hover:border-neutral-700/60 transition-all duration-300 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-light text-neutral-400 uppercase tracking-wider">Total Data Points</h3>
              <div className="w-10 h-10 bg-neutral-800/50 rounded-full flex items-center justify-center">
                <span className="text-neutral-400 text-lg">📊</span>
              </div>
            </div>
            <p className="text-4xl font-light text-neutral-100 tracking-tight">
              {analytics.brandData.reduce((acc, item) => acc + item.count, 0) + 
               analytics.materialData.reduce((acc, item) => acc + item.count, 0)}
            </p>
          </div>

          {/* Categories Card */}
          <div className="group bg-neutral-950/40 backdrop-blur-sm rounded-2xl border border-neutral-800/50 p-6 hover:border-neutral-700/60 transition-all duration-300 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-light text-neutral-400 uppercase tracking-wider">Categories</h3>
              <div className="w-10 h-10 bg-neutral-800/50 rounded-full flex items-center justify-center">
                <span className="text-neutral-400 text-lg">📁</span>
              </div>
            </div>
            <p className="text-4xl font-light text-neutral-100 tracking-tight">2</p>
          </div>

          {/* Top Item Count Card */}
          <div className="group bg-neutral-950/40 backdrop-blur-sm rounded-2xl border border-neutral-800/50 p-6 hover:border-neutral-700/60 transition-all duration-300 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-light text-neutral-400 uppercase tracking-wider">Top Item Count</h3>
              <div className="w-10 h-10 bg-neutral-800/50 rounded-full flex items-center justify-center">
                <span className="text-neutral-400 text-lg">⭐</span>
              </div>
            </div>
            <p className="text-4xl font-light text-neutral-100 tracking-tight">
              {Math.max(
                ...analytics.brandData.map(item => item.count),
                ...analytics.materialData.map(item => item.count)
              )}
            </p>
          </div>
        </div>

        {/* Charts Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Brands Chart */}
          <div className="bg-neutral-950/40 backdrop-blur-sm rounded-2xl border border-neutral-800/50 p-8 shadow-lg hover:border-neutral-700/60 transition-all duration-300">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-neutral-100 mb-2">Brand Distribution</h2>
              <p className="text-sm text-neutral-400 font-light">Most popular brand names</p>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart 
                data={analytics.brandData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#a3a3a3', fontSize: 12, fontWeight: 300 }}
                  axisLine={{ stroke: '#525252' }}
                  tickLine={{ stroke: '#525252' }}
                />
                <YAxis 
                  tick={{ fill: '#a3a3a3', fontSize: 12, fontWeight: 300 }}
                  axisLine={{ stroke: '#525252' }}
                  tickLine={{ stroke: '#525252' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#262626' }} />
                <Legend 
                  wrapperStyle={{ color: '#a3a3a3', fontSize: '14px', fontWeight: 300 }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#737373" 
                  radius={[8, 8, 0, 0]}
                  name="Brand Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Materials Chart */}
          <div className="bg-neutral-950/40 backdrop-blur-sm rounded-2xl border border-neutral-800/50 p-8 shadow-lg hover:border-neutral-700/60 transition-all duration-300">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-neutral-100 mb-2">Material Distribution</h2>
              <p className="text-sm text-neutral-400 font-light">Most used materials</p>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart 
                data={analytics.materialData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#a3a3a3', fontSize: 12, fontWeight: 300 }}
                  axisLine={{ stroke: '#525252' }}
                  tickLine={{ stroke: '#525252' }}
                />
                <YAxis 
                  tick={{ fill: '#a3a3a3', fontSize: 12, fontWeight: 300 }}
                  axisLine={{ stroke: '#525252' }}
                  tickLine={{ stroke: '#525252' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#262626' }} />
                <Legend 
                  wrapperStyle={{ color: '#a3a3a3', fontSize: '14px', fontWeight: 300 }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#8c8c8c" 
                  radius={[8, 8, 0, 0]}
                  name="Material Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AnalyticsPage;