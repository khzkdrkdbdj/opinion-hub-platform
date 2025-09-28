"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeumorphicCard, NeumorphicCardContent, NeumorphicCardHeader, NeumorphicCardTitle } from "@/components/ui/NeumorphicCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { InsightsChart } from "@/components/InsightsChart";
import { useLanguage } from "@/app/providers";
import { SurveyInfo, SurveyResults } from "@/hooks/useOpinionResearch";
import { formatTimestamp, calculatePercentage } from "@/lib/utils";
import { 
  X, 
  BarChart3, 
  PieChart, 
  Download, 
  Share2,
  Eye,
  Lock,
  Unlock,
  TrendingUp,
  Users,
  Clock,
  Award
} from "lucide-react";

interface InsightsModalProps {
  survey: SurveyInfo;
  results?: SurveyResults;
  isOpen: boolean;
  onClose: () => void;
  onDecrypt: (surveyId: number) => Promise<SurveyResults | void>;
  onPublishInsights?: (surveyId: number) => Promise<void>;
  isDecrypting?: boolean;
  userAddress?: string;
}

export function InsightsModal({ 
  survey, 
  results, 
  isOpen, 
  onClose, 
  onDecrypt,
  onPublishInsights,
  isDecrypting = false,
  userAddress
}: InsightsModalProps) {
  const { t } = useLanguage();
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const [isPublishing, setIsPublishing] = useState(false);

  const isResearcher = userAddress?.toLowerCase() === survey.researcher.toLowerCase();
  const hasResults = results && results.isDecrypted;
  const totalResponses = hasResults ? results.results.reduce((sum, count) => sum + count, 0) : survey.totalResponses;

  const handlePublishInsights = async () => {
    if (!onPublishInsights) return;
    
    setIsPublishing(true);
    try {
      await onPublishInsights(survey.id);
    } catch (error) {
      console.error("Failed to publish insights:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleExport = () => {
    if (!hasResults) return;
    
    const exportData = {
      survey: {
        topic: survey.topic,
        description: survey.description,
        choices: survey.choices,
        launchTime: survey.launchTime,
        closeTime: survey.closeTime,
      },
      results: results.results,
      totalResponses,
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `survey-${survey.id}-insights.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <NeumorphicCard className="overflow-hidden">
              <NeumorphicCardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gradient-to-r from-research-500 to-analysis-500 text-white">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <NeumorphicCardTitle className="text-xl">
                        {t("insights.title")}
                      </NeumorphicCardTitle>
                      <p className="text-sm text-gray-600 mt-1">{survey.topic}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasResults && (
                      <>
                        <GlowButton
                          variant="neumorphic"
                          size="sm"
                          onClick={() => setChartType(chartType === "bar" ? "pie" : "bar")}
                        >
                          {chartType === "bar" ? <PieChart className="w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
                        </GlowButton>
                        <GlowButton
                          variant="neumorphic"
                          size="sm"
                          onClick={handleExport}
                        >
                          <Download className="w-4 h-4" />
                        </GlowButton>
                      </>
                    )}
                    <GlowButton
                      variant="neumorphic"
                      size="sm"
                      onClick={onClose}
                    >
                      <X className="w-4 h-4" />
                    </GlowButton>
                  </div>
                </div>
              </NeumorphicCardHeader>

              <NeumorphicCardContent className="space-y-6">
                {/* Survey Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Total Responses</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">{totalResponses}</div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Status</span>
                    </div>
                    <StatusBadge variant={survey.isActive ? "active" : "closed"}>
                      {survey.isActive ? "Active" : "Closed"}
                    </StatusBadge>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">Access Type</span>
                    </div>
                    <StatusBadge variant={survey.isOpenAccess ? "info" : "premium"}>
                      {survey.isOpenAccess ? "Open Access" : "Restricted"}
                    </StatusBadge>
                  </div>
                </div>

                {/* Survey Description */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-2">Survey Description</h4>
                  <p className="text-gray-600 text-sm">{survey.description}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                    <span>Launched: {formatTimestamp(survey.launchTime)}</span>
                    <span>•</span>
                    <span>Closes: {formatTimestamp(survey.closeTime)}</span>
                  </div>
                </div>

                {/* Results Section */}
                {hasResults ? (
                  <div className="space-y-6">
                    <InsightsChart
                      surveyTopic={survey.topic}
                      choices={survey.choices}
                      results={results.results}
                      totalResponses={totalResponses}
                      chartType={chartType}
                    />
                    
                    {/* Additional Analytics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Response Rate Analysis */}
                      <NeumorphicCard>
                        <NeumorphicCardHeader>
                          <NeumorphicCardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-insight-500" />
                            Response Analysis
                          </NeumorphicCardTitle>
                        </NeumorphicCardHeader>
                        <NeumorphicCardContent>
                          <div className="space-y-3">
                            {results.results.map((count, index) => {
                              const percentage = calculatePercentage(count, totalResponses);
                              return (
                                <div key={index} className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="font-medium">{survey.choices[index]}</span>
                                    <span className="text-gray-600">{count} ({percentage}%)</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${percentage}%` }}
                                      transition={{ delay: index * 0.1, duration: 0.8 }}
                                      className="bg-gradient-to-r from-research-400 to-analysis-400 h-2 rounded-full"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </NeumorphicCardContent>
                      </NeumorphicCard>

                      {/* Key Insights */}
                      <NeumorphicCard>
                        <NeumorphicCardHeader>
                          <NeumorphicCardTitle className="text-lg flex items-center gap-2">
                            <Award className="w-5 h-5 text-analysis-500" />
                            Key Insights
                          </NeumorphicCardTitle>
                        </NeumorphicCardHeader>
                        <NeumorphicCardContent>
                          <div className="space-y-4">
                            {/* Most Popular Choice */}
                            {(() => {
                              const maxIndex = results.results.indexOf(Math.max(...results.results));
                              const maxCount = results.results[maxIndex];
                              const maxPercentage = calculatePercentage(maxCount, totalResponses);
                              
                              return (
                                <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Award className="w-4 h-4 text-emerald-600" />
                                    <span className="text-sm font-medium text-emerald-800">Most Popular</span>
                                  </div>
                                  <p className="font-semibold text-emerald-900">{survey.choices[maxIndex]}</p>
                                  <p className="text-xs text-emerald-700">{maxCount} responses ({maxPercentage}%)</p>
                                </div>
                              );
                            })()}

                            {/* Participation Rate */}
                            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                              <div className="flex items-center gap-2 mb-1">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">Engagement</span>
                              </div>
                              <p className="font-semibold text-blue-900">{totalResponses} total responses</p>
                              <p className="text-xs text-blue-700">
                                {survey.choices.length} choices available
                              </p>
                            </div>

                            {/* Survey Duration */}
                            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
                              <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-800">Duration</span>
                              </div>
                              <p className="font-semibold text-purple-900">
                                {Math.round((survey.closeTime - survey.launchTime) / 3600)} hours
                              </p>
                              <p className="text-xs text-purple-700">
                                {survey.isActive ? "Still running" : "Completed"}
                              </p>
                            </div>
                          </div>
                        </NeumorphicCardContent>
                      </NeumorphicCard>
                    </div>
                  </div>
                ) : (
                  /* Decrypt Results Section */
                  <div className="text-center py-12">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 max-w-md mx-auto">
                        <div className="p-3 rounded-full bg-amber-500 text-white w-fit mx-auto mb-4">
                          <Lock className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-amber-800 mb-2">Results Encrypted</h3>
                        <p className="text-sm text-amber-700 mb-4">
                          Survey results are encrypted and need to be decrypted to view insights.
                        </p>
                        
                        {isResearcher ? (
                          <GlowButton
                            variant="secondary"
                            onClick={() => onDecrypt(survey.id)}
                            disabled={isDecrypting}
                            className="w-full"
                          >
                            {isDecrypting ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                              />
                            ) : (
                              <>
                                <Unlock className="w-4 h-4" />
                                Decrypt Results
                              </>
                            )}
                          </GlowButton>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-xs text-amber-600">
                              Only the researcher can decrypt results
                            </p>
                            <StatusBadge variant="warning" size="sm">
                              Access Restricted
                            </StatusBadge>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <GlowButton
                    variant="neumorphic"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Close
                  </GlowButton>
                  
                  {hasResults && isResearcher && onPublishInsights && (
                    <GlowButton
                      variant="accent"
                      onClick={handlePublishInsights}
                      disabled={isPublishing}
                      className="flex-1"
                    >
                      {isPublishing ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" />
                          Publish Insights
                        </>
                      )}
                    </GlowButton>
                  )}
                </div>
              </NeumorphicCardContent>
            </NeumorphicCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
