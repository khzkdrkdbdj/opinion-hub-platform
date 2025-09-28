"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "zh";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    "nav.home": "Research Hub",
    "nav.create": "Launch Survey",
    "nav.admin": "Analytics",
    "nav.connect": "Connect Wallet",
    
    // Common
    "common.loading": "Loading...",
    "common.close": "Close",
    "common.cancel": "Cancel",
    "common.submit": "Submit",
    "common.save": "Save",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.confirm": "Confirm",
    
    // Survey
    "survey.title": "OpinionHub",
    "survey.subtitle": "Advanced Public Opinion Research Platform",
    "survey.active": "Active",
    "survey.closed": "Closed", 
    "survey.upcoming": "Upcoming",
    "survey.participate": "Participate",
    "survey.insights": "View Insights",
    "survey.responses": "responses",
    "survey.by": "By",
    "survey.launches_at": "Launches at",
    "survey.time_left": "Time left",
    "survey.closed_at": "Closed at",
    "survey.open_access": "Open Access",
    "survey.restricted": "Restricted",
    "survey.create": "Launch New Survey",
    "survey.total_responses": "Total Responses",
    "survey.created_by": "Researcher",
    "survey.select_response": "Select your response",
    "survey.submit_response": "Submit Response",
    "survey.response_submitted": "Response submitted successfully!",
    
    // Form
    "form.topic": "Research Topic",
    "form.description": "Description",
    "form.choices": "Response Options",
    "form.launch_time": "Launch Time",
    "form.close_time": "Close Time",
    "form.access_type": "Access Type",
    "form.open_access": "Open Access",
    "form.restricted_access": "Restricted Access",
    "form.duration": "Duration (hours)",
    
    // Messages
    "msg.already_participated": "You have already participated in this survey",
    "msg.not_authorized": "You are not authorized to participate",
    "msg.survey_created": "Survey launched successfully!",
    "msg.response_submitted": "Response submitted successfully!",
    "msg.survey_closed": "Survey closed successfully!",
    "msg.insights_published": "Insights published successfully!",
    "msg.select_choice": "Please select a response option",
    "msg.privacy_protected": "Your response will be encrypted and anonymous",
    
    // Insights
    "insights.title": "Survey Insights",
    "insights.total_responses": "Total Responses",
    "insights.winning_choice": "Most Popular Choice",
    "insights.detailed_results": "Detailed Analysis",
    "insights.decrypt": "Decrypt Results",
    "insights.publish": "Publish Insights",
    "insights.percentage": "of responses",
    
    // Errors
    "error.wallet_not_connected": "Please connect your wallet",
    "error.survey_not_found": "Survey not found",
    "error.unauthorized": "Unauthorized access",
    "error.transaction_failed": "Transaction failed",
  },
  zh: {
    // Navigation
    "nav.home": "调研中心",
    "nav.create": "发起调研",
    "nav.admin": "数据分析",
    "nav.connect": "连接钱包",
    
    // Common
    "common.loading": "加载中...",
    "common.close": "关闭",
    "common.cancel": "取消",
    "common.submit": "提交",
    "common.save": "保存",
    "common.edit": "编辑",
    "common.delete": "删除",
    "common.confirm": "确认",
    
    // Survey
    "survey.title": "民意调研平台",
    "survey.subtitle": "先进的公众意见研究平台",
    "survey.active": "进行中",
    "survey.closed": "已结束",
    "survey.upcoming": "即将开始",
    "survey.participate": "参与调研",
    "survey.insights": "查看洞察",
    "survey.responses": "个回复",
    "survey.by": "研究员",
    "survey.launches_at": "开始时间",
    "survey.time_left": "剩余时间",
    "survey.closed_at": "结束时间",
    "survey.open_access": "公开调研",
    "survey.restricted": "限制访问",
    "survey.create": "发起新调研",
    "survey.total_responses": "总回复数",
    "survey.created_by": "研究员",
    "survey.select_response": "选择您的回复",
    "survey.submit_response": "提交回复",
    "survey.response_submitted": "回复提交成功！",
    
    // Form
    "form.topic": "调研主题",
    "form.description": "描述",
    "form.choices": "选项",
    "form.launch_time": "开始时间",
    "form.close_time": "结束时间",
    "form.access_type": "访问类型",
    "form.open_access": "公开访问",
    "form.restricted_access": "限制访问",
    "form.duration": "持续时间（小时）",
    
    // Messages
    "msg.already_participated": "您已经参与过此调研",
    "msg.not_authorized": "您无权参与此调研",
    "msg.survey_created": "调研发起成功！",
    "msg.response_submitted": "回复提交成功！",
    "msg.survey_closed": "调研关闭成功！",
    "msg.insights_published": "洞察发布成功！",
    "msg.select_choice": "请选择一个回复选项",
    "msg.privacy_protected": "您的回复将被加密并保持匿名",
    
    // Insights
    "insights.title": "调研洞察",
    "insights.total_responses": "总回复数",
    "insights.winning_choice": "最受欢迎选项",
    "insights.detailed_results": "详细分析",
    "insights.decrypt": "解密结果",
    "insights.publish": "发布洞察",
    "insights.percentage": "的回复",
    
    // Errors
    "error.wallet_not_connected": "请连接您的钱包",
    "error.survey_not_found": "未找到调研",
    "error.unauthorized": "未授权访问",
    "error.transaction_failed": "交易失败",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

