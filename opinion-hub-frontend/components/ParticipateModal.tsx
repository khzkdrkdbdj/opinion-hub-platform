"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeumorphicCard, NeumorphicCardContent, NeumorphicCardHeader, NeumorphicCardTitle } from "@/components/ui/NeumorphicCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useLanguage } from "@/app/providers";
import { SurveyInfo } from "@/hooks/useOpinionResearch";
import { 
  X, 
  BarChart3, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Send,
  Shield
} from "lucide-react";

interface ParticipateModalProps {
  survey: SurveyInfo;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (surveyId: number, choiceIndex: number) => Promise<void>;
  isLoading?: boolean;
}

export function ParticipateModal({ 
  survey, 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false 
}: ParticipateModalProps) {
  const { t } = useLanguage();
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");

  const handleSubmit = async () => {
    if (selectedChoice === null) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await onSubmit(survey.id, selectedChoice);
      onClose();
      setSelectedChoice(null);
    } catch (error) {
      console.error("Failed to submit response:", error);
      setSubmitError(error instanceof Error ? error.message : "Failed to submit response");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setSelectedChoice(null);
      setSubmitError("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-full max-w-lg"
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
                      <NeumorphicCardTitle className="text-lg">
                        {t("survey.participate")}
                      </NeumorphicCardTitle>
                      <p className="text-sm text-gray-600 mt-1">{survey.topic}</p>
                    </div>
                  </div>
                  <GlowButton
                    variant="neumorphic"
                    size="sm"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </GlowButton>
                </div>
              </NeumorphicCardHeader>

              <NeumorphicCardContent className="space-y-6">
                {/* Survey Description */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                  <p className="text-sm text-blue-800">{survey.description}</p>
                </div>

                {/* Choice Selection */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Select your response:
                  </h4>
                  
                  <div className="space-y-2">
                    {survey.choices.map((choice, index) => (
                      <motion.button
                        key={index}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedChoice(index)}
                        disabled={isSubmitting}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-center justify-between ${
                          selectedChoice === index
                            ? "border-research-400 bg-research-50 text-research-700"
                            : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                        } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-sm bg-white rounded-full w-6 h-6 flex items-center justify-center text-gray-600">
                            {index + 1}
                          </span>
                          <span className="font-medium">{choice}</span>
                        </div>
                        {selectedChoice === index && (
                          <CheckCircle className="w-5 h-5 text-research-600" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Privacy Notice */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-green-500 text-white mt-0.5">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div className="text-sm text-green-800">
                      <p className="font-medium mb-1">🔒 Privacy Protected</p>
                      <p>Your response will be encrypted using FHEVM technology, ensuring complete anonymity and privacy.</p>
                    </div>
                  </div>
                </motion.div>

                {/* Selected Choice Display */}
                {selectedChoice !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 rounded-xl bg-gradient-to-r from-research-50 to-research-100 border border-research-200"
                  >
                    <div className="flex items-center gap-2 text-research-700">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Selected: {survey.choices[selectedChoice]}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Error Message */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 rounded-xl bg-gradient-to-r from-red-50 to-red-100 border border-red-200"
                  >
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{submitError}</span>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <GlowButton
                    type="button"
                    variant="neumorphic"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancel
                  </GlowButton>
                  <GlowButton
                    type="button"
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={selectedChoice === null || isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Response
                      </>
                    )}
                  </GlowButton>
                </div>

                {/* Survey Stats */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Total responses: {survey.totalResponses}</span>
                    <StatusBadge variant="info" size="sm">
                      {survey.isOpenAccess ? "Open Access" : "Restricted"}
                    </StatusBadge>
                  </div>
                </div>
              </NeumorphicCardContent>
            </NeumorphicCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
