import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ঈদের নামাজ সময়সূচি ২০২৬ - সারা বাংলাদেশ | Eid Jamat Time",
  description: "বাংলাদেশের সকল জেলা, উপজেলা ও গ্রামের ঈদগাহ এবং মসজিদের ঈদের নামাজের সঠিক সময়সূচি ও জামাতের তথ্য এখন এক ক্লিকেই। আপনার এলাকার ঈদের জামাত খুঁজে নিন সহজেই।",
  keywords: [
    "ঈদের নামাজ সময়সূচি",
    "Eid Namaz Time Bangladesh",
    "Eid Jamat Time 2026",
    "ঈদের নামাজের সময়",
    "বাংলাদেশের ঈদগাহ সময়সূচি",
    "গ্রামের ঈদের নামাজ",
    "Eid-ul-Fitr Prayer Time",
  ],
  authors: [{ name: "আপনার নাম" }], // এখানে আপনার নাম দিতে পারেন
  icons: {
    icon: "/favicon.ico", // আপনার যদি কোনো আইকন থাকে
  },
};

// app/layout.tsx

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning> 
      <body 
        className="..." // আপনার যা ক্লাস আছে তা থাকবে
        suppressHydrationWarning={true} // এই লাইনটি যোগ করুন
      >
        {children}
      </body>
    </html>
  );
}