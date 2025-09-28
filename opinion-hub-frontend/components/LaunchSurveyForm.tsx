"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { NeumorphicCard, NeumorphicCardContent, NeumorphicCardHeader, NeumorphicCardTitle } from "@/components/ui/NeumorphicCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useLanguage } from "@/app/providers";
import { 
  Plus, 
  Minus, 
  Clock, 
  Globe, 
  Lock, 
  Rocket,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface LaunchSurveyFormProps {
  onSubmit: (data: {
    topic: string;
    description: string;
    choices: string[];
    launchTime: number;
    closeTime: number;
    isOpenAccess: boolean;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function LaunchSurveyForm({ onSubmit, isLoading = false }: LaunchSurveyFormProps) {
  const { t } = useLanguage();
  
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [choices, setChoices] = useState(["", ""]);
  const [duration, setDuration] = useState(24); // hours
  const [isOpenAccess, setIsOpenAccess] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addChoice = () => {
    if (choices.length < 4) {
      setChoices([...choices, ""]);
    }
  };

  const removeChoice = (index: number) => {
    if (choices.length > 2) {
      setChoices(choices.filter((_, i) => i !== index));
    }
  };

  const updateChoice = (index: number, value: string) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!topic.trim()) {
      newErrors.topic = "Topic is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    const validChoices = choices.filter(choice => choice.trim());
    if (validChoices.length < 2) {
      newErrors.choices = "At least 2 choices are required";
    }

    if (duration < 1) {
      newErrors.duration = "Duration must be at least 1 hour";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const now = Math.floor(Date.now() / 1000);
    const launchTime = now;
    const closeTime = now + (duration * 3600); // Convert hours to seconds

    const validChoices = choices.filter(choice => choice.trim());

    try {
      await onSubmit({
        topic: topic.trim(),
        description: description.trim(),
        choices: validChoices,
        launchTime,
        closeTime,
        isOpenAccess,
      });

      // Reset form on success
      setTopic("");
      setDescription("");
      setChoices(["", ""]);
      setDuration(24);
      setIsOpenAccess(true);
      setErrors({});
    } catch (error) {
      console.error("Failed to launch survey:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NeumorphicCard className="max-w-2xl mx-auto">
        <NeumorphicCardHeader>
          <NeumorphicCardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-research-500 to-analysis-500 text-white">
              <Rocket className="w-5 h-5" />
            </div>
            {t("survey.create")}
          </NeumorphicCardTitle>
          <p className="text-gray-600 mt-2">
            Create a new confidential survey with encrypted responses
          </p>
        </NeumorphicCardHeader>

        <NeumorphicCardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic */}
            <GlassInput
              label={t("form.topic")}
              placeholder="e.g., Favorite Programming Language"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              error={errors.topic}
              required
            />

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                {t("form.description")}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of your survey..."
                rows={3}
                className="w-full p-3 rounded-xl border-0 bg-white/70 backdrop-blur-sm shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)] ring-1 ring-gray-200/50 transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-research-400/50 resize-none"
                required
              />
              {errors.description && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Choices */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  {t("form.choices")} ({choices.filter(c => c.trim()).length}/4)
                </label>
                <div className="flex gap-2">
                  <GlowButton
                    type="button"
                    variant="neumorphic"
                    size="sm"
                    onClick={addChoice}
                    disabled={choices.length >= 4}
                  >
                    <Plus className="w-4 h-4" />
                  </GlowButton>
                </div>
              </div>
              
              <div className="space-y-2">
                {choices.map((choice, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-sm font-medium text-gray-500 w-6">
                      {index + 1}.
                    </span>
                    <GlassInput
                      placeholder={`Choice ${index + 1}`}
                      value={choice}
                      onChange={(e) => updateChoice(index, e.target.value)}
                      className="flex-1"
                    />
                    {choices.length > 2 && (
                      <GlowButton
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeChoice(index)}
                        className="h-10 w-10"
                      >
                        <Minus className="w-4 h-4" />
                      </GlowButton>
                    )}
                  </motion.div>
                ))}
              </div>
              
              {errors.choices && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.choices}
                </p>
              )}
            </div>

            {/* Duration */}
            <GlassInput
              type="number"
              label={t("form.duration")}
              placeholder="24"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              error={errors.duration}
              icon={<Clock className="w-4 h-4" />}
              min={1}
              max={168} // 1 week
              required
            />

            {/* Access Type */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 block">
                {t("form.access_type")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsOpenAccess(true)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                    isOpenAccess
                      ? "border-research-400 bg-research-50 text-research-700"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">{t("form.open_access")}</div>
                    <div className="text-xs opacity-75">Anyone can participate</div>
                  </div>
                  {isOpenAccess && <CheckCircle className="w-5 h-5 ml-auto" />}
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsOpenAccess(false)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                    !isOpenAccess
                      ? "border-analysis-400 bg-analysis-50 text-analysis-700"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <Lock className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">{t("form.restricted_access")}</div>
                    <div className="text-xs opacity-75">Invite only</div>
                  </div>
                  {!isOpenAccess && <CheckCircle className="w-5 h-5 ml-auto" />}
                </motion.button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <GlowButton
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    Launch Survey
                  </>
                )}
              </GlowButton>
            </div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200"
            >
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-blue-500 text-white mt-0.5">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Survey Privacy</p>
                  <p>All responses will be encrypted using FHEVM technology, ensuring complete participant privacy and anonymity.</p>
                </div>
              </div>
            </motion.div>
          </form>
        </NeumorphicCardContent>
      </NeumorphicCard>
    </motion.div>
  );
}
