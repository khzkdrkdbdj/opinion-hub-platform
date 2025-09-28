"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "./providers";
import { useMetaMask } from "@/hooks/useMetaMask";
import { useOpinionResearch, SurveyInfo } from "@/hooks/useOpinionResearch";
import { useFhevm } from "@/fhevm/useFhevm";
import { useInMemoryStorage } from "@/hooks/useInMemoryStorage";
import { ResearchCard } from "@/components/ResearchCard";
import { FeedbackSystem } from "@/components/FeedbackSystem";
import { LaunchSurveyForm } from "@/components/LaunchSurveyForm";
import { ParticipateModal } from "@/components/ParticipateModal";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { InsightsModal } from "@/components/InsightsModal";
import { AccessManagementModal } from "@/components/AccessManagementModal";
import { NeumorphicCard, NeumorphicCardContent, NeumorphicCardDescription, NeumorphicCardHeader, NeumorphicCardTitle } from "@/components/ui/NeumorphicCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GlowButton } from "@/components/ui/GlowButton";
import { 
  Wallet, 
  Plus, 
  BarChart3, 
  RefreshCw, 
  TrendingUp, 
  Brain,
  Sparkles,
  ChevronRight,
  Heart
} from "lucide-react";

export default function HomePage() {
  const { t, language, setLanguage } = useLanguage();
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  
  const {
    provider,
    chainId,
    accounts,
    isConnected,
    connect,
    disconnect,
    ethersSigner,
    ethersReadonlyProvider,
    status: walletStatus,
    error: walletError,
  } = useMetaMask();

  const {
    instance: fhevmInstance,
    status: fhevmStatus,
    error: fhevmError,
  } = useFhevm({
    provider: provider,
    chainId: chainId || undefined,
    initialMockChains: { 31337: "http://localhost:8545" },
    enabled: isConnected,
  });

  const {
    contractAddress,
    isDeployed,
    canInteract,
    surveys,
    surveyResults,
    isLoading,
    isCreating,
    isParticipating,
    message,
    refreshSurveys,
    launchSurvey,
    submitResponse,
    closeSurvey,
    decryptSurveyResults,
    hasParticipated,
    canParticipate,
    getSurveyStatus,
    grantAccess,
    revokeAccess,
  } = useOpinionResearch({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage,
    eip1193Provider: provider,
    chainId: chainId || 31337,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain: true,
    sameSigner: true,
  });

  const [activeTab, setActiveTab] = useState<"research" | "create" | "analytics">("research");
  const [surveyStates, setSurveyStates] = useState<Map<number, { hasParticipated: boolean; canParticipate: boolean }>>(new Map());
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [participateModalOpen, setParticipateModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyInfo | null>(null);
  const [insightsModalOpen, setInsightsModalOpen] = useState(false);
  const [selectedInsightsSurvey, setSelectedInsightsSurvey] = useState<SurveyInfo | null>(null);
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [selectedAccessSurvey, setSelectedAccessSurvey] = useState<SurveyInfo | null>(null);

  // Load survey states for current user
  useEffect(() => {
    if (!isConnected || !accounts?.[0] || !canInteract) return;

    const loadSurveyStates = async () => {
      const states = new Map();
      
      for (const survey of surveys) {
        try {
          const [userHasParticipated, userCanParticipate] = await Promise.all([
            hasParticipated(survey.id, accounts[0]),
            canParticipate(survey.id, accounts[0]),
          ]);
          
          states.set(survey.id, {
            hasParticipated: userHasParticipated,
            canParticipate: userCanParticipate,
          });
        } catch (error) {
          console.error(`Failed to load state for survey ${survey.id}:`, error);
        }
      }
      
      setSurveyStates(states);
    };

    loadSurveyStates();
  }, [surveys, accounts, isConnected, canInteract, hasParticipated, canParticipate]);

  const handleParticipate = async (surveyId: number) => {
    const survey = surveys.find(s => s.id === surveyId);
    if (survey) {
      setSelectedSurvey(survey);
      setParticipateModalOpen(true);
    }
  };

  const handleViewInsights = async (surveyId: number) => {
    const survey = surveys.find(s => s.id === surveyId);
    if (survey) {
      setSelectedInsightsSurvey(survey);
      setInsightsModalOpen(true);
    }
  };

  const handleManageAccess = async (surveyId: number) => {
    const survey = surveys.find(s => s.id === surveyId);
    if (survey) {
      setSelectedAccessSurvey(survey);
      setAccessModalOpen(true);
    }
  };

  const handleCloseSurvey = async (surveyId: number) => {
    try {
      await closeSurvey(surveyId);
    } catch (error) {
      console.error("Failed to close survey:", error);
    }
  };

  const handleLaunchSurvey = async (data: {
    topic: string;
    description: string;
    choices: string[];
    launchTime: number;
    closeTime: number;
    isOpenAccess: boolean;
  }) => {
    await launchSurvey(
      data.topic,
      data.description,
      data.choices,
      data.launchTime,
      data.closeTime,
      data.isOpenAccess
    );
    setActiveTab("research");
  };

  const handleSubmitResponse = async (surveyId: number, choiceIndex: number) => {
    try {
      await submitResponse(surveyId, choiceIndex);
      
      // Update local survey states
      if (accounts?.[0]) {
        const [userHasParticipated, userCanParticipate] = await Promise.all([
          hasParticipated(surveyId, accounts[0]),
          canParticipate(surveyId, accounts[0]),
        ]);
        
        setSurveyStates(prev => new Map(prev.set(surveyId, {
          hasParticipated: userHasParticipated,
          canParticipate: userCanParticipate,
        })));
      }
      
      setParticipateModalOpen(false);
      setSelectedSurvey(null);
    } catch (error) {
      console.error("Failed to submit response:", error);
      throw error;
    }
  };

  // 简化admin逻辑 - 在这个demo中，我们不需要复杂的admin权限
  // 只有平台所有者才是真正的admin，其他用户只能管理自己创建的调研
  const isAdmin = false; // 暂时禁用admin权限，只依赖isResearcher

  // Show wallet connection prompt only if trying to interact
  const showWalletPrompt = !isConnected && (activeTab === "create" || activeTab === "analytics");

  if (showWalletPrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <NeumorphicCard className="w-full max-w-md">
            <NeumorphicCardHeader className="text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-3 mb-4"
              >
                <div className="p-3 rounded-full bg-gradient-to-r from-research-500 to-analysis-500 text-white">
                  <Brain className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <NeumorphicCardTitle className="text-2xl">
                    {t("survey.title")}
                  </NeumorphicCardTitle>
                  <NeumorphicCardDescription>
                    {t("survey.subtitle")}
                  </NeumorphicCardDescription>
                </div>
              </motion.div>
            </NeumorphicCardHeader>
            <NeumorphicCardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlowButton
                  onClick={connect}
                  disabled={walletStatus === "connecting"}
                  className="w-full"
                  size="lg"
                  variant="primary"
                >
                  <Wallet className="w-5 h-5" />
                  {walletStatus === "connecting" ? t("common.loading") : t("nav.connect")}
                </GlowButton>
              </motion.div>
              
              {walletError && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl text-sm text-red-800"
                >
                  {walletError.message}
                </motion.div>
              )}

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex justify-center gap-2"
              >
                <GlowButton
                  variant="neumorphic"
                  size="sm"
                  onClick={() => setLanguage("en")}
                  className={language === "en" ? "ring-2 ring-research-400" : ""}
                >
                  English
                </GlowButton>
                <GlowButton
                  variant="neumorphic"
                  size="sm"
                  onClick={() => setLanguage("zh")}
                  className={language === "zh" ? "ring-2 ring-research-400" : ""}
                >
                  中文
                </GlowButton>
              </motion.div>
            </NeumorphicCardContent>
          </NeumorphicCard>
        </motion.div>
      </div>
    );
  }

  if (isDeployed === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <NeumorphicCard className="w-full max-w-md">
          <NeumorphicCardHeader className="text-center">
            <NeumorphicCardTitle className="text-red-600">Contract Not Deployed</NeumorphicCardTitle>
            <NeumorphicCardDescription>
              OpinionResearchPlatform contract not found for chain ID {chainId}
            </NeumorphicCardDescription>
          </NeumorphicCardHeader>
          <NeumorphicCardContent>
            <div className="text-sm text-gray-600 space-y-3">
              <p>Please deploy the contract first:</p>
              <ol className="list-decimal list-inside space-y-2 bg-gray-50 p-4 rounded-lg">
                <li>Start Hardhat node: <code className="bg-gray-200 px-2 py-1 rounded">npx hardhat node</code></li>
                <li>Deploy contract: <code className="bg-gray-200 px-2 py-1 rounded">npx hardhat --network localhost deploy --tags OpinionResearchPlatform</code></li>
                <li>Refresh this page</li>
              </ol>
            </div>
          </NeumorphicCardContent>
        </NeumorphicCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="p-2 rounded-xl bg-gradient-to-r from-research-500 to-analysis-500 text-white shadow-lg">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">{t("survey.title")}</h1>
                <p className="text-sm text-gray-600">{t("survey.subtitle")}</p>
              </div>
            </motion.div>

            <div className="flex items-center gap-4">
              {/* Language Toggle */}
              <div className="flex gap-1">
                <GlowButton
                  variant={language === "en" ? "primary" : "neumorphic"}
                  size="sm"
                  onClick={() => setLanguage("en")}
                >
                  EN
                </GlowButton>
                <GlowButton
                  variant={language === "zh" ? "primary" : "neumorphic"}
                  size="sm"
                  onClick={() => setLanguage("zh")}
                >
                  中文
                </GlowButton>
              </div>

              {/* Wallet Info */}
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <>
                    <StatusBadge variant="info" size="sm">
                      Chain: {chainId}
                    </StatusBadge>
                    <GlowButton
                      variant="outline"
                      onClick={disconnect}
                      size="sm"
                    >
                      {accounts?.[0]?.slice(0, 6)}...{accounts?.[0]?.slice(-4)}
                    </GlowButton>
                  </>
                ) : (
                  <GlowButton
                    onClick={connect}
                    disabled={walletStatus === "connecting"}
                    size="sm"
                    variant="primary"
                  >
                    <Wallet className="w-4 h-4" />
                    {walletStatus === "connecting" ? t("common.loading") : t("nav.connect")}
                  </GlowButton>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 mt-6"
          >
            <GlowButton
              variant={activeTab === "research" ? "primary" : "neumorphic"}
              onClick={() => setActiveTab("research")}
              size="sm"
            >
              <TrendingUp className="w-4 h-4" />
              {t("nav.home")}
            </GlowButton>
            <GlowButton
              variant={activeTab === "create" ? "primary" : "neumorphic"}
              onClick={() => setActiveTab("create")}
              size="sm"
              disabled={!isConnected}
            >
              <Plus className="w-4 h-4" />
              {t("nav.create")}
            </GlowButton>
            {isConnected && (
              <GlowButton
                variant={activeTab === "analytics" ? "primary" : "neumorphic"}
                onClick={() => setActiveTab("analytics")}
                size="sm"
              >
                <BarChart3 className="w-4 h-4" />
                {t("nav.admin")}
              </GlowButton>
            )}
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Status Messages */}
        {(fhevmStatus !== "ready" || message) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <NeumorphicCard>
              <NeumorphicCardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-research-500" />
                      <div>
                        <p className="text-sm font-medium">
                          <strong>FHEVM Status:</strong> {fhevmStatus}
                        </p>
                        {message && (
                          <p className="text-sm text-gray-600 mt-1">{message}</p>
                        )}
                      </div>
                    </div>
                    {fhevmError && (
                      <p className="text-sm text-red-600">
                        FHEVM Error: {fhevmError.message}
                      </p>
                    )}
                  </div>
                  <GlowButton
                    variant="neumorphic"
                    size="sm"
                    onClick={refreshSurveys}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </GlowButton>
                </div>
              </NeumorphicCardContent>
            </NeumorphicCard>
          </motion.div>
        )}

        {/* Tab Content */}
        {activeTab === "research" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold gradient-text mb-2">Research Hub</h2>
                <p className="text-gray-600">Discover and participate in confidential opinion research</p>
              </div>
              <StatusBadge variant="info" size="lg" icon={<BarChart3 className="w-4 h-4" />}>
                {surveys.length} {surveys.length === 1 ? "survey" : "surveys"}
              </StatusBadge>
            </div>

            {isLoading ? (
              <div className="text-center py-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="loading-spinner w-12 h-12 mx-auto mb-4"
                />
                <p className="text-gray-600">{t("common.loading")}</p>
              </div>
            ) : surveys.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <NeumorphicCard>
                  <NeumorphicCardContent className="text-center py-16">
                    <div className="p-4 rounded-full bg-gradient-to-r from-research-100 to-analysis-100 w-fit mx-auto mb-6">
                      <Brain className="w-16 h-16 text-research-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 gradient-text">No surveys yet</h3>
                    <p className="text-gray-600 mb-6">
                      Launch the first survey to start gathering insights
                    </p>
                    <GlowButton onClick={() => setActiveTab("create")} variant="primary">
                      <Plus className="w-4 h-4" />
                      {t("survey.create")}
                      <ChevronRight className="w-4 h-4" />
                    </GlowButton>
                  </NeumorphicCardContent>
                </NeumorphicCard>
              </motion.div>
            ) : (
              <div className="research-grid">
                {surveys.map((survey, index) => {
                  const status = getSurveyStatus(survey);
                  const state = surveyStates.get(survey.id);
                  const isResearcher = accounts?.[0]?.toLowerCase() === survey.researcher.toLowerCase();

                  return (
                    <ResearchCard
                      key={survey.id}
                      survey={survey}
                      status={status}
                      onParticipate={handleParticipate}
                      onViewInsights={handleViewInsights}
                      onCloseSurvey={handleCloseSurvey}
                      onManageAccess={handleManageAccess}
                      canParticipate={state?.canParticipate || false}
                      hasParticipated={state?.hasParticipated || false}
                      isResearcher={isResearcher}
                      isAdmin={isAdmin}
                      index={index}
                    />
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "create" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold gradient-text mb-2">{t("survey.create")}</h2>
              <p className="text-gray-600">
                Launch a new confidential survey with encrypted responses
              </p>
            </div>

            <LaunchSurveyForm
              onSubmit={handleLaunchSurvey}
              isLoading={isCreating}
            />
          </motion.div>
        )}

        {activeTab === "analytics" && isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AnalyticsDashboard
              surveys={surveys}
              surveyResults={surveyResults}
              onDecryptResults={decryptSurveyResults}
              onRefresh={refreshSurveys}
              isLoading={isLoading}
              userAddress={accounts?.[0]}
            />
          </motion.div>
        )}
      </main>

      {/* Floating Feedback Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed bottom-6 right-6 z-40"
      >
        <GlowButton
          onClick={() => setFeedbackOpen(true)}
          variant="secondary"
          size="lg"
          className="rounded-full shadow-2xl pulse-glow"
        >
          <Heart className="w-5 h-5" />
          Feedback
        </GlowButton>
      </motion.div>

      {/* Feedback System */}
      <FeedbackSystem
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />

      {/* Participate Modal */}
      {selectedSurvey && (
        <ParticipateModal
          survey={selectedSurvey}
          isOpen={participateModalOpen}
          onClose={() => {
            setParticipateModalOpen(false);
            setSelectedSurvey(null);
          }}
          onSubmit={handleSubmitResponse}
          isLoading={isParticipating}
        />
      )}

      {/* Insights Modal */}
      {selectedInsightsSurvey && (
        <InsightsModal
          survey={selectedInsightsSurvey}
          results={surveyResults.get(selectedInsightsSurvey.id)}
          isOpen={insightsModalOpen}
          onClose={() => {
            setInsightsModalOpen(false);
            setSelectedInsightsSurvey(null);
          }}
          onDecrypt={decryptSurveyResults}
          isDecrypting={isLoading}
          userAddress={accounts?.[0]}
        />
      )}

      {/* Access Management Modal */}
      {selectedAccessSurvey && (
        <AccessManagementModal
          survey={selectedAccessSurvey}
          isOpen={accessModalOpen}
          onClose={() => {
            setAccessModalOpen(false);
            setSelectedAccessSurvey(null);
          }}
          onGrantAccess={grantAccess}
          onRevokeAccess={revokeAccess}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
