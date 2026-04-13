"use client";

export default function Footer({ language }) {
  // কনসোল লগ দিয়ে চেক করুন ল্যাঙ্গুয়েজ আসলে কী আসছে
  console.log("Footer language is:", language);

  const content = {
    description: language === "bn" 
      ? "সারা বাংলাদেশের ঈদের নামাজের সময়সূচি" 
      : "Prayer times for Eidgahs and Mosques across Bangladesh",
    copyright: language === "bn" 
      ? "© ২০২৬ — সবার জন্য বিনামূল্যে" 
      : "© 2026 — Free for everyone",
    credit: language === "bn" ? "তৈরি করেছেন" : "Developed by",
  };

  return (
    <footer className=" text-[var(--footer-text)] py-8 px-4 text-center text-xs">
      <div className="max-w-xl mx-auto flex flex-col items-center gap-3">
        <p className="opacity-80">{content.description}</p>
        <div className="flex flex-col gap-1">
          <p className="opacity-60">{content.copyright}</p>
          <p className="opacity-60">
            {content.credit} <span className="text-[var(--primary)]">Mahfuz Ahmed</span>
          </p>
        </div>
      </div>
    </footer>
  );
}