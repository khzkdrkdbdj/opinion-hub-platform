import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./providers";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "OpinionHub - Advanced Public Opinion Research Platform",
  description: "A privacy-preserving opinion research platform powered by FHEVM technology, enabling confidential surveys and encrypted data analysis.",
  keywords: ["opinion research", "surveys", "privacy", "FHEVM", "blockchain", "confidential computing"],
  authors: [{ name: "OpinionHub Research Team" }],
  openGraph: {
    title: "OpinionHub - Advanced Public Opinion Research Platform",
    description: "Conduct confidential opinion research with encrypted responses and advanced analytics.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpinionHub - Advanced Public Opinion Research Platform",
    description: "Privacy-preserving opinion research platform with FHEVM technology.",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <LanguageProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}

