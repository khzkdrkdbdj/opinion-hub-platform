"use client";

import { SurveyInfo, SurveyStatus } from "@/hooks/useOpinionResearch";
import { NeumorphicCard, NeumorphicCardContent, NeumorphicCardDescription, NeumorphicCardHeader, NeumorphicCardTitle } from "@/components/ui/NeumorphicCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GlowButton } from "@/components/ui/GlowButton";
import { formatTimestamp, formatTimeRemaining, truncateAddress, generateGradient } from "@/lib/utils";
import { useLanguage } from "@/app/providers";
import { Clock, Users, User, Lock, Globe, BarChart3, Eye, StopCircle, TrendingUp, Settings } from "lucide-react";
import { motion } from "framer-motion";

interface ResearchCardProps {
  survey: SurveyInfo;
  status: SurveyStatus;
  onParticipate?: (surveyId: number) => void;
  onViewInsights?: (surveyId: number) => void;
  onCloseSurvey?: (surveyId: number) => void;
  onManageAccess?: (surveyId: number) => void;
  canParticipate?: boolean;
  hasParticipated?: boolean;
  isResearcher?: boolean;
  isAdmin?: boolean;
  index?: number;
}

export function ResearchCard({
  survey,
  status,
  onParticipate,
  onViewInsights,
  onCloseSurvey,
  onManageAccess,
  canParticipate = false,
  hasParticipated = false,
  isResearcher = false,
  isAdmin = false,
  index = 0,
}: ResearchCardProps) {
  const { t } = useLanguage();

  const getStatusBadge = () => {
    let variant: "active" | "closed" | "upcoming" = "info";
    let icon = <BarChart3 className="w-3 h-3" />;
    
    switch (status) {
      case "active":
        variant = "active";
        icon = <TrendingUp className="w-3 h-3" />;
        break;
      case "closed":
        variant = "closed";
        icon = <StopCircle className="w-3 h-3" />;
        break;
      case "upcoming":
        variant = "upcoming";
        icon = <Clock className="w-3 h-3" />;
        break;
    }

    return (
      <StatusBadge variant={variant} icon={icon} pulse={status === "active"}>
        {t(`survey.${status}`)}
      </StatusBadge>
    );
  };

  const canShowParticipateButton = status === "active" && canParticipate && !hasParticipated;
  const canShowCloseButton = status === "active" && (isResearcher || isAdmin);
  const canShowInsights = (status === "closed" && (isResearcher || isAdmin)) || hasParticipated;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <NeumorphicCard className="research-card h-full flex flex-col hover:shadow-xl transition-all duration-300">
        <NeumorphicCardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <NeumorphicCardTitle className="text-lg leading-tight">
                {survey.topic}
              </NeumorphicCardTitle>
              <NeumorphicCardDescription className="text-sm">
                {survey.description}
              </NeumorphicCardDescription>
            </div>
            <div className="flex flex-col items-end gap-2 ml-4">
              {getStatusBadge()}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                {survey.isOpenAccess ? (
                  <>
                    <Globe className="w-3 h-3" />
                    <span>{t("survey.open_access")}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3" />
                    <span>{t("survey.restricted")}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </NeumorphicCardHeader>

        <NeumorphicCardContent className="flex-1 flex flex-col">
          <div className="space-y-4 flex-1">
            {/* Survey Choices */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-gray-700 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {t("form.choices")}:
              </h4>
              <div className="grid gap-2">
                {survey.choices.map((choice, choiceIndex) => (
                  <motion.div
                    key={choiceIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index * 0.1) + (choiceIndex * 0.05) }}
                    className="p-3 rounded-lg text-sm font-medium text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {choiceIndex + 1}. {choice}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Survey Statistics */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
                <Users className="w-4 h-4 text-research-600" />
                <span className="text-gray-700">
                  <span className="font-semibold">{survey.totalResponses}</span> {t("survey.responses")}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
                <User className="w-4 h-4 text-analysis-600" />
                <span className="text-gray-700 text-xs">
                  {t("survey.by")}: {truncateAddress(survey.researcher)}
                </span>
              </div>
            </div>

            {/* Time Information */}
            <div className="space-y-2 text-sm">
              {status === "upcoming" && (
                <motion.div 
                  className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Clock className="w-4 h-4" />
                  <span>{t("survey.launches_at")}: {formatTimestamp(survey.launchTime)}</span>
                </motion.div>
              )}
              
              {status === "active" && (
                <motion.div 
                  className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-green-50 to-green-100 text-green-700"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Clock className="w-4 h-4" />
                  <span>{t("survey.time_left")}: {formatTimeRemaining(survey.closeTime)}</span>
                </motion.div>
              )}
              
              {status === "closed" && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{t("survey.closed_at")}: {formatTimestamp(survey.closeTime)}</span>
                </div>
              )}
            </div>

            {/* Status Messages */}
            {hasParticipated && status === "active" && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg text-sm text-emerald-800 flex items-center gap-2"
              >
                <span className="text-emerald-600">✅</span>
                {t("msg.already_participated")}
              </motion.div>
            )}

            {!canParticipate && status === "active" && !hasParticipated && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-center gap-2"
              >
                <span className="text-amber-600">⚠️</span>
                {t("msg.not_authorized")}
              </motion.div>
            )}
          </div>

          {/* Action Buttons - 完全重写逻辑 */}
          {(() => {
            // 如果用户无权限且不是研究员/管理员，不显示任何按钮
            if (!canParticipate && !hasParticipated && !isResearcher && !isAdmin) {
              return null; // 完全不显示按钮区域
            }

            return (
              <div className="flex gap-2 pt-4 mt-auto">
                {/* Participate button */}
                {status === "active" && canParticipate && !hasParticipated && (
                  <GlowButton
                    onClick={() => onParticipate?.(survey.id)}
                    className="flex-1"
                    size="sm"
                    variant="primary"
                  >
                    <BarChart3 className="w-4 h-4" />
                    {t("survey.participate")}
                  </GlowButton>
                )}
                
                {/* Connect wallet button - only for open access surveys */}
                {status === "active" && !canParticipate && !hasParticipated && survey.isOpenAccess && (
                  <GlowButton
                    disabled
                    variant="outline"
                    className="flex-1"
                    size="sm"
                  >
                    Connect Wallet to Participate
                  </GlowButton>
                )}

                {/* Insights button */}
                {((status === "closed" && (isResearcher || isAdmin)) || hasParticipated) && (
                  <GlowButton
                    onClick={() => onViewInsights?.(survey.id)}
                    variant="secondary"
                    className="flex-1"
                    size="sm"
                  >
                    <Eye className="w-4 h-4" />
                    {t("survey.insights")}
                  </GlowButton>
                )}

                {/* Management buttons - ONLY for researchers/admins */}
                {(isResearcher || isAdmin) && (
                  <>
                    {status === "active" && (
                      <GlowButton
                        onClick={() => onCloseSurvey?.(survey.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <StopCircle className="w-4 h-4" />
                        {t("common.close")}
                      </GlowButton>
                    )}

                    {!survey.isOpenAccess && (
                      <GlowButton
                        onClick={() => onManageAccess?.(survey.id)}
                        variant="accent"
                        size="sm"
                      >
                        <Settings className="w-4 h-4" />
                        Manage Access
                      </GlowButton>
                    )}
                  </>
                )}
              </div>
            );
          })()}
        </NeumorphicCardContent>
      </NeumorphicCard>
    </motion.div>
  );
}

