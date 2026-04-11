import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/component/Providers"; 
import { ThemeProvider } from "@/context/ThemeContext"; 
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ঈদের নামাজ সময়সূচি ২০২৬ - সারা বাংলাদেশ | Eid Jamat Time",
  description: "বাংলাদেশের সকল জেলা, উপজেলা ও গ্রামের ঈদগাহ এবং মসজিদের সঠিক সময়সূচি ও জামাতের তথ্য এখন এক ক্লিকেই। আপনার এলাকার ঈদের জামাত খুঁজে নিন সহজেই।",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative overflow-x-hidden`} suppressHydrationWarning={true}>
        
        {/* ১. অ্যানিমেটেড ব্যাকগ্রাউন্ড লেয়ার (এটিই নড়াচড়া করবে) */}
        <div 
          id="bg-layer" 
          className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat transition-all duration-1000 animate-slow-zoom"
          style={{ backgroundImage: "url('/bg1.jpg')" }} // ডিফল্ট ইমেজ
        ></div>

        {/* ২. ডার্ক ওভারলে (ইমেজকে অন্ধকার করার জন্য) */}
        <div className="fixed inset-0 bg-black/70 -z-10 pointer-events-none"></div>

        <ThemeProvider>
          <Providers>
            <div className="relative z-10">
              {children}
            </div>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}