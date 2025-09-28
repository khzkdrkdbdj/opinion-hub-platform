import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(timestamp: number): string {
  return format(new Date(timestamp * 1000), "PPpp");
}

export function formatTimeRemaining(endTimestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  if (endTimestamp <= now) {
    return "Expired";
  }
  
  return formatDistanceToNow(new Date(endTimestamp * 1000), { addSuffix: true });
}

export function truncateAddress(address: string, startChars = 6, endChars = 4): string {
  if (address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

export function getSurveyStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "text-green-600 bg-green-50 border-green-200";
    case "closed":
      return "text-gray-600 bg-gray-50 border-gray-200";
    case "upcoming":
      return "text-blue-600 bg-blue-50 border-blue-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function generateGradient(index: number): string {
  const gradients = [
    "from-research-400 to-research-600",
    "from-insight-400 to-insight-600", 
    "from-analysis-400 to-analysis-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
    "from-indigo-400 to-indigo-600",
  ];
  return gradients[index % gradients.length];
}

