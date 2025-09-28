"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { calculatePercentage, generateGradient } from "@/lib/utils";
import { NeumorphicCard, NeumorphicCardContent, NeumorphicCardHeader, NeumorphicCardTitle } from "@/components/ui/NeumorphicCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TrendingUp, PieChart as PieChartIcon, BarChart3 } from "lucide-react";

interface InsightsChartProps {
  surveyTopic: string;
  choices: string[];
  results: number[];
  totalResponses: number;
  chartType?: "bar" | "pie";
}

export function InsightsChart({
  surveyTopic,
  choices,
  results,
  totalResponses,
  chartType = "bar"
}: InsightsChartProps) {
  const chartData = choices.map((choice, index) => ({
    name: choice,
    value: results[index] || 0,
    percentage: calculatePercentage(results[index] || 0, totalResponses),
    fill: `hsl(${200 + index * 40}, 70%, 60%)`, // Dynamic colors
  }));

  const maxValue = Math.max(...results);
  const winningChoice = choices[results.indexOf(maxValue)];

  const COLORS = [
    '#0ea5e9', // research-500
    '#eab308', // insight-500  
    '#8b5cf6', // analysis-500
    '#ef4444', // red-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NeumorphicCard className="overflow-hidden">
        <NeumorphicCardHeader>
          <div className="flex items-center justify-between">
            <NeumorphicCardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-research-500" />
              Survey Insights
            </NeumorphicCardTitle>
            <div className="flex gap-2">
              <StatusBadge variant="success" icon={<BarChart3 className="w-3 h-3" />}>
                {totalResponses} responses
              </StatusBadge>
              <StatusBadge variant="premium" icon={<PieChartIcon className="w-3 h-3" />}>
                {chartType} chart
              </StatusBadge>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{surveyTopic}</p>
        </NeumorphicCardHeader>

        <NeumorphicCardContent className="space-y-6">
          {/* Winning Choice */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-500 text-white">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-800">Most Popular Choice</h3>
                <p className="text-emerald-700">
                  <span className="font-bold">{winningChoice}</span> with {maxValue} responses 
                  ({calculatePercentage(maxValue, totalResponses)}%)
                </p>
              </div>
            </div>
          </motion.div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="h-80"
          >
            {chartType === "bar" ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value: number, name: string) => [
                      `${value} responses (${calculatePercentage(value, totalResponses)}%)`,
                      'Count'
                    ]}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value: number) => [
                      `${value} responses (${calculatePercentage(value, totalResponses)}%)`,
                      'Count'
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Detailed Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Detailed Breakdown
            </h4>
            <div className="space-y-2">
              {chartData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium text-gray-700">{item.name}</span>
                    {item.value === maxValue && (
                      <StatusBadge variant="success" size="sm">🏆 Winner</StatusBadge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">{item.value} responses</div>
                    <div className="text-sm text-gray-600">{item.percentage}% of total</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </NeumorphicCardContent>
      </NeumorphicCard>
    </motion.div>
  );
}

