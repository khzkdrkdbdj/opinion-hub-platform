"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { NeumorphicCard, NeumorphicCardContent, NeumorphicCardHeader, NeumorphicCardTitle } from "@/components/ui/NeumorphicCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GlowButton } from "@/components/ui/GlowButton";
import { InsightsChart } from "@/components/InsightsChart";
import { useLanguage } from "@/app/providers";
import { SurveyInfo, SurveyResults } from "@/hooks/useOpinionResearch";
import { formatTimestamp, calculatePercentage } from "@/lib/utils";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  Activity,
  PieChart,
  Calendar,
  Award,
  Zap,
  Eye,
  RefreshCw
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface AnalyticsDashboardProps {
  surveys: SurveyInfo[];
  surveyResults: Map<number, SurveyResults>;
  onDecryptResults: (surveyId: number) => Promise<SurveyResults | void>;
  onRefresh: () => Promise<void>;
  isLoading: boolean;
  userAddress?: string;
}

export function AnalyticsDashboard({
  surveys,
  surveyResults,
  onDecryptResults,
  onRefresh,
  isLoading,
  userAddress,
}: AnalyticsDashboardProps) {
  const { t } = useLanguage();
  const [selectedMetric, setSelectedMetric] = useState<"overview" | "trends" | "engagement">("overview");

  // Calculate platform statistics
  const platformStats = useMemo(() => {
    const totalSurveys = surveys.length;
    const activeSurveys = surveys.filter(s => s.isActive).length;
    const closedSurveys = surveys.filter(s => !s.isActive).length;
    const totalResponses = surveys.reduce((sum, s) => sum + s.totalResponses, 0);
    const avgResponsesPerSurvey = totalSurveys > 0 ? Math.round(totalResponses / totalSurveys) : 0;
    
    const openAccessSurveys = surveys.filter(s => s.isOpenAccess).length;
    const restrictedSurveys = surveys.filter(s => !s.isOpenAccess).length;
    
    const userCreatedSurveys = userAddress 
      ? surveys.filter(s => s.researcher.toLowerCase() === userAddress.toLowerCase()).length 
      : 0;

    return {
      totalSurveys,
      activeSurveys,
      closedSurveys,
      totalResponses,
      avgResponsesPerSurvey,
      openAccessSurveys,
      restrictedSurveys,
      userCreatedSurveys,
    };
  }, [surveys, userAddress]);

  // Generate trend data (mock data for demonstration)
  const trendData = useMemo(() => {
    const days = 7;
    const data = [];
    const baseDate = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString(),
        surveys: Math.floor(Math.random() * 5) + 1,
        responses: Math.floor(Math.random() * 50) + 10,
        participants: Math.floor(Math.random() * 30) + 5,
      });
    }
    
    return data;
  }, []);

  // Top performing surveys
  const topSurveys = useMemo(() => {
    return [...surveys]
      .sort((a, b) => b.totalResponses - a.totalResponses)
      .slice(0, 5);
  }, [surveys]);

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    color = "research",
    trend,
    delay = 0 
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: any;
    color?: string;
    trend?: "up" | "down" | "stable";
    delay?: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <NeumorphicCard className="h-full">
        <NeumorphicCardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                {trend && (
                  <span className={`${
                    trend === "up" ? "text-green-600" : 
                    trend === "down" ? "text-red-600" : "text-gray-600"
                  }`}>
                    {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
                  </span>
                )}
                {subtitle}
              </p>
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-r from-${color}-100 to-${color}-200`}>
              <Icon className={`w-6 h-6 text-${color}-600`} />
            </div>
          </div>
        </NeumorphicCardContent>
      </NeumorphicCard>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Analytics Dashboard</h2>
          <p className="text-gray-600">Comprehensive insights and platform metrics</p>
        </div>
        <GlowButton
          variant="neumorphic"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Data
        </GlowButton>
      </div>

      {/* Metric Selection */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2"
      >
        <GlowButton
          variant={selectedMetric === "overview" ? "primary" : "neumorphic"}
          size="sm"
          onClick={() => setSelectedMetric("overview")}
        >
          <BarChart3 className="w-4 h-4" />
          Overview
        </GlowButton>
        <GlowButton
          variant={selectedMetric === "trends" ? "primary" : "neumorphic"}
          size="sm"
          onClick={() => setSelectedMetric("trends")}
        >
          <TrendingUp className="w-4 h-4" />
          Trends
        </GlowButton>
        <GlowButton
          variant={selectedMetric === "engagement" ? "primary" : "neumorphic"}
          size="sm"
          onClick={() => setSelectedMetric("engagement")}
        >
          <Activity className="w-4 h-4" />
          Engagement
        </GlowButton>
      </motion.div>

      {/* Overview Tab */}
      {selectedMetric === "overview" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Surveys"
              value={platformStats.totalSurveys}
              subtitle="All time"
              icon={BarChart3}
              color="research"
              trend="up"
              delay={0}
            />
            <StatCard
              title="Active Surveys"
              value={platformStats.activeSurveys}
              subtitle="Currently running"
              icon={Activity}
              color="insight"
              trend="stable"
              delay={0.1}
            />
            <StatCard
              title="Total Responses"
              value={platformStats.totalResponses}
              subtitle="All surveys"
              icon={Users}
              color="analysis"
              trend="up"
              delay={0.2}
            />
            <StatCard
              title="Avg Responses"
              value={platformStats.avgResponsesPerSurvey}
              subtitle="Per survey"
              icon={Target}
              color="premium"
              trend="up"
              delay={0.3}
            />
          </div>

          {/* Survey Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NeumorphicCard>
              <NeumorphicCardHeader>
                <NeumorphicCardTitle className="text-lg flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-research-500" />
                  Survey Status Distribution
                </NeumorphicCardTitle>
              </NeumorphicCardHeader>
              <NeumorphicCardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">Active</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-700">{platformStats.activeSurveys}</div>
                      <div className="text-xs text-green-600">
                        {calculatePercentage(platformStats.activeSurveys, platformStats.totalSurveys)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                      <span className="text-sm font-medium">Closed</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-700">{platformStats.closedSurveys}</div>
                      <div className="text-xs text-gray-600">
                        {calculatePercentage(platformStats.closedSurveys, platformStats.totalSurveys)}%
                      </div>
                    </div>
                  </div>
                </div>
              </NeumorphicCardContent>
            </NeumorphicCard>

            <NeumorphicCard>
              <NeumorphicCardHeader>
                <NeumorphicCardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-analysis-500" />
                  Access Type Distribution
                </NeumorphicCardTitle>
              </NeumorphicCardHeader>
              <NeumorphicCardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium">Open Access</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-blue-700">{platformStats.openAccessSurveys}</div>
                      <div className="text-xs text-blue-600">
                        {calculatePercentage(platformStats.openAccessSurveys, platformStats.totalSurveys)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-sm font-medium">Restricted</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-purple-700">{platformStats.restrictedSurveys}</div>
                      <div className="text-xs text-purple-600">
                        {calculatePercentage(platformStats.restrictedSurveys, platformStats.totalSurveys)}%
                      </div>
                    </div>
                  </div>
                </div>
              </NeumorphicCardContent>
            </NeumorphicCard>
          </div>
        </motion.div>
      )}

      {/* Trends Tab */}
      {selectedMetric === "trends" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <NeumorphicCard>
            <NeumorphicCardHeader>
              <NeumorphicCardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-research-500" />
                Platform Activity Trends (Last 7 Days)
              </NeumorphicCardTitle>
            </NeumorphicCardHeader>
            <NeumorphicCardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="responses" 
                      stackId="1"
                      stroke="#0ea5e9" 
                      fill="url(#responseGradient)" 
                      name="Responses"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="participants" 
                      stackId="1"
                      stroke="#8b5cf6" 
                      fill="url(#participantGradient)" 
                      name="Participants"
                    />
                    <defs>
                      <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="participantGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </NeumorphicCardContent>
          </NeumorphicCard>
        </motion.div>
      )}

      {/* Engagement Tab */}
      {selectedMetric === "engagement" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Top Performing Surveys */}
          <NeumorphicCard>
            <NeumorphicCardHeader>
              <NeumorphicCardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-insight-500" />
                Top Performing Surveys
              </NeumorphicCardTitle>
            </NeumorphicCardHeader>
            <NeumorphicCardContent>
              <div className="space-y-3">
                {topSurveys.length > 0 ? topSurveys.map((survey, index) => (
                  <motion.div
                    key={survey.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-research-500 to-analysis-500 text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{survey.topic}</h4>
                        <p className="text-xs text-gray-600">
                          By {survey.researcher.slice(0, 6)}...{survey.researcher.slice(-4)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">{survey.totalResponses}</div>
                      <div className="text-xs text-gray-600">responses</div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    No surveys available for analysis
                  </div>
                )}
              </div>
            </NeumorphicCardContent>
          </NeumorphicCard>

          {/* User Statistics (if connected) */}
          {userAddress && (
            <NeumorphicCard>
              <NeumorphicCardHeader>
                <NeumorphicCardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-analysis-500" />
                  Your Research Activity
                </NeumorphicCardTitle>
              </NeumorphicCardHeader>
              <NeumorphicCardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-gradient-to-r from-research-50 to-research-100">
                    <div className="text-2xl font-bold text-research-700">{platformStats.userCreatedSurveys}</div>
                    <div className="text-sm text-research-600">Surveys Created</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-r from-insight-50 to-insight-100">
                    <div className="text-2xl font-bold text-insight-700">
                      {surveys.filter(s => s.researcher.toLowerCase() === userAddress.toLowerCase())
                        .reduce((sum, s) => sum + s.totalResponses, 0)}
                    </div>
                    <div className="text-sm text-insight-600">Total Responses Received</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-r from-analysis-50 to-analysis-100">
                    <div className="text-2xl font-bold text-analysis-700">
                      {platformStats.userCreatedSurveys > 0 
                        ? Math.round(surveys.filter(s => s.researcher.toLowerCase() === userAddress.toLowerCase())
                            .reduce((sum, s) => sum + s.totalResponses, 0) / platformStats.userCreatedSurveys)
                        : 0}
                    </div>
                    <div className="text-sm text-analysis-600">Avg Responses per Survey</div>
                  </div>
                </div>
              </NeumorphicCardContent>
            </NeumorphicCard>
          )}
        </motion.div>
      )}

      {/* Survey Results Analysis */}
      {surveyResults.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold gradient-text">Survey Results Analysis</h3>
            <StatusBadge variant="success" icon={<Eye className="w-3 h-3" />}>
              {surveyResults.size} decrypted
            </StatusBadge>
          </div>

          <div className="grid gap-6">
            {Array.from(surveyResults.entries()).map(([surveyId, results]) => {
              const survey = surveys.find(s => s.id === surveyId);
              if (!survey) return null;

              return (
                <InsightsChart
                  key={surveyId}
                  surveyTopic={survey.topic}
                  choices={survey.choices}
                  results={results.results}
                  totalResponses={survey.totalResponses}
                  chartType="bar"
                />
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Surveys Awaiting Decryption */}
      {surveys.filter(s => !s.isActive && !surveyResults.has(s.id)).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <NeumorphicCard>
            <NeumorphicCardHeader>
              <NeumorphicCardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-insight-500" />
                Surveys Awaiting Analysis
              </NeumorphicCardTitle>
            </NeumorphicCardHeader>
            <NeumorphicCardContent>
              <div className="space-y-3">
                {surveys
                  .filter(s => !s.isActive && !surveyResults.has(s.id))
                  .map((survey, index) => (
                    <motion.div
                      key={survey.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200"
                    >
                      <div>
                        <h4 className="font-medium text-amber-800">{survey.topic}</h4>
                        <p className="text-sm text-amber-700">
                          {survey.totalResponses} responses • Closed {formatTimestamp(survey.closeTime)}
                        </p>
                      </div>
                      <GlowButton
                        variant="secondary"
                        size="sm"
                        onClick={() => onDecryptResults(survey.id)}
                        disabled={isLoading}
                      >
                        <Eye className="w-4 h-4" />
                        Decrypt Results
                      </GlowButton>
                    </motion.div>
                  ))}
              </div>
            </NeumorphicCardContent>
          </NeumorphicCard>
        </motion.div>
      )}
    </div>
  );
}
