"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeumorphicCard, NeumorphicCardContent, NeumorphicCardHeader, NeumorphicCardTitle } from "@/components/ui/NeumorphicCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useLanguage } from "@/app/providers";
import { SurveyInfo } from "@/hooks/useOpinionResearch";
import { 
  X, 
  Lock, 
  Plus, 
  Minus, 
  Users, 
  Shield,
  AlertCircle,
  CheckCircle,
  UserPlus,
  UserMinus
} from "lucide-react";

interface AccessManagementModalProps {
  survey: SurveyInfo;
  isOpen: boolean;
  onClose: () => void;
  onGrantAccess: (surveyId: number, addresses: string[]) => Promise<void>;
  onRevokeAccess: (surveyId: number, addresses: string[]) => Promise<void>;
  isLoading?: boolean;
}

export function AccessManagementModal({ 
  survey, 
  isOpen, 
  onClose, 
  onGrantAccess,
  onRevokeAccess,
  isLoading = false 
}: AccessManagementModalProps) {
  const { t } = useLanguage();
  const [newAddress, setNewAddress] = useState("");
  const [addressesToGrant, setAddressesToGrant] = useState<string[]>([]);
  const [addressesToRevoke, setAddressesToRevoke] = useState<string[]>([]);
  const [isGranting, setIsGranting] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [error, setError] = useState("");

  const validateAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const addAddressToGrant = () => {
    if (!newAddress.trim()) return;
    
    if (!validateAddress(newAddress)) {
      setError("Invalid Ethereum address format");
      return;
    }

    if (addressesToGrant.includes(newAddress)) {
      setError("Address already in the list");
      return;
    }

    setAddressesToGrant(prev => [...prev, newAddress]);
    setNewAddress("");
    setError("");
  };

  const removeAddressFromGrant = (address: string) => {
    setAddressesToGrant(prev => prev.filter(addr => addr !== address));
  };

  const addAddressToRevoke = () => {
    if (!newAddress.trim()) return;
    
    if (!validateAddress(newAddress)) {
      setError("Invalid Ethereum address format");
      return;
    }

    if (addressesToRevoke.includes(newAddress)) {
      setError("Address already in the list");
      return;
    }

    setAddressesToRevoke(prev => [...prev, newAddress]);
    setNewAddress("");
    setError("");
  };

  const removeAddressFromRevoke = (address: string) => {
    setAddressesToRevoke(prev => prev.filter(addr => addr !== address));
  };

  const handleGrantAccess = async () => {
    if (addressesToGrant.length === 0) return;

    setIsGranting(true);
    try {
      await onGrantAccess(survey.id, addressesToGrant);
      setAddressesToGrant([]);
    } catch (error) {
      console.error("Failed to grant access:", error);
    } finally {
      setIsGranting(false);
    }
  };

  const handleRevokeAccess = async () => {
    if (addressesToRevoke.length === 0) return;

    setIsRevoking(true);
    try {
      await onRevokeAccess(survey.id, addressesToRevoke);
      setAddressesToRevoke([]);
    } catch (error) {
      console.error("Failed to revoke access:", error);
    } finally {
      setIsRevoking(false);
    }
  };

  const handleClose = () => {
    if (!isGranting && !isRevoking) {
      onClose();
      setNewAddress("");
      setAddressesToGrant([]);
      setAddressesToRevoke([]);
      setError("");
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
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <NeumorphicCard className="overflow-hidden">
              <NeumorphicCardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gradient-to-r from-analysis-500 to-research-500 text-white">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <NeumorphicCardTitle className="text-lg">
                        Access Management
                      </NeumorphicCardTitle>
                      <p className="text-sm text-gray-600 mt-1">{survey.topic}</p>
                    </div>
                  </div>
                  <GlowButton
                    variant="neumorphic"
                    size="sm"
                    onClick={handleClose}
                    disabled={isGranting || isRevoking}
                  >
                    <X className="w-4 h-4" />
                  </GlowButton>
                </div>
              </NeumorphicCardHeader>

              <NeumorphicCardContent className="space-y-6">
                {/* Survey Info */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Restricted Access Survey</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    Only addresses in the access list can participate in this survey.
                  </p>
                </div>

                {/* Add Address Input */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Add Participant Address
                  </h4>
                  
                  <div className="flex gap-2">
                    <GlassInput
                      placeholder="0x1234567890123456789012345678901234567890"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      error={error}
                      className="flex-1"
                    />
                    <GlowButton
                      type="button"
                      variant="primary"
                      onClick={addAddressToGrant}
                      disabled={!newAddress.trim() || isGranting || isRevoking}
                    >
                      <Plus className="w-4 h-4" />
                    </GlowButton>
                  </div>
                </div>

                {/* Grant Access Section */}
                {addressesToGrant.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-700 flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Grant Access To ({addressesToGrant.length})
                    </h4>
                    
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {addressesToGrant.map((address, index) => (
                        <motion.div
                          key={address}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100 border border-green-200"
                        >
                          <span className="font-mono text-sm text-green-800">{address}</span>
                          <GlowButton
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeAddressFromGrant(address)}
                            disabled={isGranting || isRevoking}
                          >
                            <Minus className="w-3 h-3" />
                          </GlowButton>
                        </motion.div>
                      ))}
                    </div>

                    <GlowButton
                      variant="secondary"
                      onClick={handleGrantAccess}
                      disabled={isGranting || isRevoking}
                      className="w-full"
                    >
                      {isGranting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Grant Access to {addressesToGrant.length} Address{addressesToGrant.length > 1 ? 'es' : ''}
                        </>
                      )}
                    </GlowButton>
                  </div>
                )}

                {/* Revoke Access Section */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-red-700 flex items-center gap-2">
                    <UserMinus className="w-4 h-4" />
                    Revoke Access
                  </h4>
                  
                  <div className="flex gap-2">
                    <GlassInput
                      placeholder="Address to revoke access from"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="flex-1"
                    />
                    <GlowButton
                      type="button"
                      variant="destructive"
                      onClick={addAddressToRevoke}
                      disabled={!newAddress.trim() || isGranting || isRevoking}
                    >
                      <Minus className="w-4 h-4" />
                    </GlowButton>
                  </div>

                  {addressesToRevoke.length > 0 && (
                    <div className="space-y-2">
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {addressesToRevoke.map((address, index) => (
                          <motion.div
                            key={address}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-red-50 to-red-100 border border-red-200"
                          >
                            <span className="font-mono text-sm text-red-800">{address}</span>
                            <GlowButton
                              type="button"
                              variant="neumorphic"
                              size="sm"
                              onClick={() => removeAddressFromRevoke(address)}
                              disabled={isGranting || isRevoking}
                            >
                              <X className="w-3 h-3" />
                            </GlowButton>
                          </motion.div>
                        ))}
                      </div>

                      <GlowButton
                        variant="destructive"
                        onClick={handleRevokeAccess}
                        disabled={isGranting || isRevoking}
                        className="w-full"
                      >
                        {isRevoking ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <>
                            <UserMinus className="w-4 h-4" />
                            Revoke Access from {addressesToRevoke.length} Address{addressesToRevoke.length > 1 ? 'es' : ''}
                          </>
                        )}
                      </GlowButton>
                    </div>
                  )}
                </div>

                {/* Information */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-blue-500 text-white mt-0.5">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Access Control Information</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Only addresses in the access list can participate</li>
                        <li>• You can add or remove addresses at any time</li>
                        <li>• Changes take effect immediately</li>
                        <li>• Participants will see &quot;Not authorized&quot; if not in the list</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Survey Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="text-lg font-bold text-gray-800">{survey.totalResponses}</div>
                    <div className="text-xs text-gray-600">Current Responses</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100">
                    <StatusBadge variant="premium" size="sm">
                      Restricted Access
                    </StatusBadge>
                    <div className="text-xs text-purple-600 mt-1">Access Controlled</div>
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
