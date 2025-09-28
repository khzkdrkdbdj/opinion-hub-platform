"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeumorphicCard, NeumorphicCardContent, NeumorphicCardHeader, NeumorphicCardTitle } from "@/components/ui/NeumorphicCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useLanguage } from "@/app/providers";
import { 
  MessageSquare, 
  Star, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb,
  Heart,
  ThumbsUp,
  X
} from "lucide-react";

interface FeedbackSystemProps {
  isOpen: boolean;
  onClose: () => void;
  surveyId?: number;
  surveyTopic?: string;
}

type FeedbackType = "general" | "bug" | "feature" | "improvement";
type Rating = 1 | 2 | 3 | 4 | 5;

export function FeedbackSystem({ isOpen, onClose, surveyId, surveyTopic }: FeedbackSystemProps) {
  const { t } = useLanguage();
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("general");
  const [rating, setRating] = useState<Rating | null>(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const feedbackTypes = [
    { type: "general" as FeedbackType, label: "General Feedback", icon: MessageSquare, color: "research" },
    { type: "bug" as FeedbackType, label: "Bug Report", icon: AlertCircle, color: "error" },
    { type: "feature" as FeedbackType, label: "Feature Request", icon: Lightbulb, color: "insight" },
    { type: "improvement" as FeedbackType, label: "Improvement", icon: ThumbsUp, color: "analysis" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Feedback submitted:", {
      type: feedbackType,
      rating,
      message,
      email,
      surveyId,
      surveyTopic,
      timestamp: new Date().toISOString(),
    });

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Auto close after success
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setMessage("");
      setEmail("");
      setRating(null);
      setFeedbackType("general");
    }, 2000);
  };

  const isFormValid = message.trim().length > 0 && rating !== null;

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
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <NeumorphicCard className="overflow-hidden">
              <NeumorphicCardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gradient-to-r from-research-500 to-analysis-500 text-white">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <NeumorphicCardTitle className="text-lg">Share Your Feedback</NeumorphicCardTitle>
                      {surveyTopic && (
                        <p className="text-sm text-gray-600 mt-1">About: {surveyTopic}</p>
                      )}
                    </div>
                  </div>
                  <GlowButton
                    variant="neumorphic"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </GlowButton>
                </div>
              </NeumorphicCardHeader>

              <NeumorphicCardContent className="space-y-6">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="p-4 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-200 w-fit mx-auto mb-4"
                    >
                      <CheckCircle className="w-12 h-12 text-emerald-600" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-emerald-800 mb-2">Thank You!</h3>
                    <p className="text-gray-600">Your feedback has been submitted successfully.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Feedback Type Selection */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700">Feedback Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        {feedbackTypes.map(({ type, label, icon: Icon, color }) => (
                          <motion.button
                            key={type}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setFeedbackType(type)}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 text-sm font-medium ${
                              feedbackType === type
                                ? `border-${color}-400 bg-${color}-50 text-${color}-700`
                                : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {label}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700">Overall Rating</label>
                      <div className="flex gap-2 justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setRating(star as Rating)}
                            className="p-1"
                          >
                            <Star
                              className={`w-8 h-8 transition-colors duration-200 ${
                                rating && star <= rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300 hover:text-yellow-300"
                              }`}
                            />
                          </motion.button>
                        ))}
                      </div>
                      {rating && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center"
                        >
                          <StatusBadge variant="info" size="sm">
                            {rating === 5 ? "Excellent!" : 
                             rating === 4 ? "Good!" :
                             rating === 3 ? "Okay" :
                             rating === 2 ? "Could be better" : "Needs improvement"}
                          </StatusBadge>
                        </motion.div>
                      )}
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Your Message</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us what you think..."
                        rows={4}
                        className="w-full p-3 rounded-xl border-0 bg-white/70 backdrop-blur-sm shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)] ring-1 ring-gray-200/50 transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-research-400/50 resize-none"
                        required
                      />
                    </div>

                    {/* Email (Optional) */}
                    <GlassInput
                      type="email"
                      label="Email (Optional)"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={<MessageSquare className="w-4 h-4" />}
                    />

                    {/* Submit Button */}
                    <div className="flex gap-3">
                      <GlowButton
                        type="button"
                        variant="neumorphic"
                        onClick={onClose}
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </GlowButton>
                      <GlowButton
                        type="submit"
                        variant="primary"
                        className="flex-1"
                        disabled={!isFormValid || isSubmitting}
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
                            Submit Feedback
                          </>
                        )}
                      </GlowButton>
                    </div>
                  </form>
                )}
              </NeumorphicCardContent>
            </NeumorphicCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

