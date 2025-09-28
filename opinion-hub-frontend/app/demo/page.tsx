"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../providers";
import { InsightsChart } from "@/components/InsightsChart";
import { FeedbackSystem } from "@/components/FeedbackSystem";
import { ResearchCard } from "@/components/ResearchCard";
import { NeumorphicCard, NeumorphicCardContent, NeumorphicCardHeader, NeumorphicCardTitle } from "@/components/ui/NeumorphicCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { 
  Brain, 
  BarChart3, 
  MessageSquare, 
  Sparkles, 
  TrendingUp,
  Eye,
  Heart,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  const { t, language, setLanguage } = useLanguage();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  // Mock survey data for demonstration
  const mockSurvey = {
    id: 0,
    topic: "Favorite Programming Language",
    description: "What is your preferred programming language for blockchain development?",
    choices: ["Solidity", "Rust", "JavaScript", "Python"],
    researcher: "0x1234567890123456789012345678901234567890",
    launchTime: Math.floor(Date.now() / 1000) - 3600,
    closeTime: Math.floor(Date.now() / 1000) + 7200,
    isActive: true,
    isOpenAccess: true,
    totalResponses: 156,
  };

  const mockResults = [45, 67, 28, 16]; // Mock response counts

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <Link href="/">
                <GlowButton variant="neumorphic" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </GlowButton>
              </Link>
              <div className="p-2 rounded-xl bg-gradient-to-r from-research-500 to-analysis-500 text-white shadow-lg">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">OpinionHub Demo</h1>
                <p className="text-sm text-gray-600">Showcase of new features and components</p>
              </div>
            </motion.div>

            <div className="flex items-center gap-2">
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Introduction */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h2 className="text-4xl font-bold gradient-text">Welcome to OpinionHub</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of privacy-preserving opinion research with our advanced platform 
            featuring neumorphic design, encrypted responses, and real-time analytics.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <StatusBadge variant="success" icon={<Brain className="w-3 h-3" />}>
              FHEVM Powered
            </StatusBadge>
            <StatusBadge variant="info" icon={<TrendingUp className="w-3 h-3" />}>
              Real-time Analytics
            </StatusBadge>
            <StatusBadge variant="premium" icon={<Heart className="w-3 h-3" />}>
              User Feedback
            </StatusBadge>
          </div>
        </motion.section>

        {/* Research Card Demo */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold gradient-text mb-2">Survey Card Component</h3>
            <p className="text-gray-600">Beautiful neumorphic design with smooth animations</p>
          </div>
          
          <div className="max-w-md mx-auto">
            <ResearchCard
              survey={mockSurvey}
              status="active"
              onParticipate={(id) => console.log("Participate in survey:", id)}
              onViewInsights={(id) => console.log("View insights for survey:", id)}
              onCloseSurvey={(id) => console.log("Close survey:", id)}
              canParticipate={true}
              hasParticipated={false}
              isResearcher={false}
              isAdmin={false}
              index={0}
            />
          </div>
        </motion.section>

        {/* Data Visualization Demo */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold gradient-text mb-2">Data Visualization</h3>
            <p className="text-gray-600">Interactive charts for survey insights</p>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <GlowButton
              variant={chartType === "bar" ? "primary" : "neumorphic"}
              onClick={() => setChartType("bar")}
              size="sm"
            >
              <BarChart3 className="w-4 h-4" />
              Bar Chart
            </GlowButton>
            <GlowButton
              variant={chartType === "pie" ? "primary" : "neumorphic"}
              onClick={() => setChartType("pie")}
              size="sm"
            >
              <Eye className="w-4 h-4" />
              Pie Chart
            </GlowButton>
          </div>

          <div className="max-w-4xl mx-auto">
            <InsightsChart
              surveyTopic={mockSurvey.topic}
              choices={mockSurvey.choices}
              results={mockResults}
              totalResponses={mockSurvey.totalResponses}
              chartType={chartType}
            />
          </div>
        </motion.section>

        {/* UI Components Showcase */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold gradient-text mb-2">UI Components</h3>
            <p className="text-gray-600">Modern neumorphic design system</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Buttons Demo */}
            <NeumorphicCard>
              <NeumorphicCardHeader>
                <NeumorphicCardTitle className="text-lg">Glow Buttons</NeumorphicCardTitle>
              </NeumorphicCardHeader>
              <NeumorphicCardContent className="space-y-3">
                <GlowButton variant="primary" className="w-full">
                  Primary Button
                </GlowButton>
                <GlowButton variant="secondary" className="w-full">
                  Secondary Button
                </GlowButton>
                <GlowButton variant="accent" className="w-full">
                  Accent Button
                </GlowButton>
                <GlowButton variant="neumorphic" className="w-full">
                  Neumorphic Button
                </GlowButton>
              </NeumorphicCardContent>
            </NeumorphicCard>

            {/* Status Badges Demo */}
            <NeumorphicCard>
              <NeumorphicCardHeader>
                <NeumorphicCardTitle className="text-lg">Status Badges</NeumorphicCardTitle>
              </NeumorphicCardHeader>
              <NeumorphicCardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <StatusBadge variant="active">Active</StatusBadge>
                  <StatusBadge variant="closed">Closed</StatusBadge>
                  <StatusBadge variant="upcoming">Upcoming</StatusBadge>
                  <StatusBadge variant="success">Success</StatusBadge>
                  <StatusBadge variant="warning">Warning</StatusBadge>
                  <StatusBadge variant="error">Error</StatusBadge>
                  <StatusBadge variant="info">Info</StatusBadge>
                  <StatusBadge variant="premium">Premium</StatusBadge>
                </div>
              </NeumorphicCardContent>
            </NeumorphicCard>

            {/* Feedback System Demo */}
            <NeumorphicCard>
              <NeumorphicCardHeader>
                <NeumorphicCardTitle className="text-lg">Feedback System</NeumorphicCardTitle>
              </NeumorphicCardHeader>
              <NeumorphicCardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Interactive feedback collection with ratings and categories
                </p>
                <GlowButton 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => setFeedbackOpen(true)}
                >
                  <MessageSquare className="w-4 h-4" />
                  Open Feedback
                </GlowButton>
              </NeumorphicCardContent>
            </NeumorphicCard>
          </div>
        </motion.section>

        {/* Features Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold gradient-text mb-2">Key Features</h3>
            <p className="text-gray-600">What makes OpinionHub special</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: "FHEVM Powered",
                description: "Fully homomorphic encryption for complete privacy",
                color: "research"
              },
              {
                icon: TrendingUp,
                title: "Real-time Analytics",
                description: "Live survey tracking and instant insights",
                color: "insight"
              },
              {
                icon: Heart,
                title: "User Feedback",
                description: "Built-in feedback system with ratings",
                color: "analysis"
              },
              {
                icon: Sparkles,
                title: "Modern Design",
                description: "Neumorphic UI with smooth animations",
                color: "premium"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <NeumorphicCard className="text-center h-full">
                  <NeumorphicCardContent className="p-6 space-y-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r from-${feature.color}-100 to-${feature.color}-200 w-fit mx-auto`}>
                      <feature.icon className={`w-8 h-8 text-${feature.color}-600`} />
                    </div>
                    <h4 className="font-semibold text-gray-800">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </NeumorphicCardContent>
                </NeumorphicCard>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Feedback System */}
      <FeedbackSystem
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        surveyId={mockSurvey.id}
        surveyTopic={mockSurvey.topic}
      />
    </div>
  );
}

