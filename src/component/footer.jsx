"use client";

export default function Footer() {
  return (
    <footer className="bg-[var(--footer-bg)] text-[var(--footer-text)] py-8 px-4 text-center text-xs font-[family-name:var(--font-hind)] ">
      <div className="max-w-xl mx-auto flex flex-col items-center gap-3">
        
        {/* লোগো সেকশন */}
        <div className="flex items-center gap-2 text-foreground">
          <span className="text-xl font-bold text-[var(--primary)]">ع</span>
          <span className="font-bold text-base tracking-wide">ঈদের নামাজ</span>
        </div>

        {/* ডেসক্রিপশন */}
        <p className="opacity-80">সারা বাংলাদেশের ঈদগাহ ও মসজিদের সময়সূচি</p>
        
        {/* কপিরাইট ও ক্রেডিট */}
        <div className="flex flex-col gap-1 mt-2">
          <p className="opacity-60">© ২০২৬ — সবার জন্য বিনামূল্যে</p>
          <p className="opacity-60">
            তৈরি করেছেন{" "}
            <a
              href="https://mahfuzahmedony.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] font-medium hover:brightness-110 transition-all underline underline-offset-4"
            >
              Mahfuz Ahmed
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}