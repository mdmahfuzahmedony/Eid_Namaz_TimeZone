# 🌙 Eidgah BD - বাংলাদেশের ঈদের নামাজের সময়সূচি পোর্টাল

**Eidgah BD** একটি আধুনিক ও শক্তিশালী ওয়েব অ্যাপ্লিকেশন, যা সারা বাংলাদেশের গ্রাম এবং শহর এলাকার ঈদের নামাজের সময়সূচি এবং ঈদগাহের তথ্য খুঁজে পেতে সাহায্য করে। এটি Next.js, Prisma এবং Tailwind CSS ব্যবহার করে তৈরি করা একটি পূর্ণাঙ্গ প্ল্যাটফর্ম।

![Project Banner](https://i.ibb.co.com/BVKCh1Dw/screencapture-eid-namaz-time-zone-vercel-app-2026-04-13-20-42-17.png)

---

## ✨ প্রধান ফিচারসমূহ (Key Features)

- 🔍 **স্মার্ট সার্চ সিস্টেম:** বিভাগ, জেলা, উপজেলা এবং ইউনিয়ন/পৌরসভা অনুযায়ী নিখুঁত সার্চ করার সুবিধা।
- 🏙️ **গ্রাম ও শহর মোড:** বাংলাদেশের প্রশাসনিক কাঠামো অনুযায়ী ইউনিয়ন (গ্রাম) এবং পৌরসভা/সিটি কর্পোরেশন (শহর) আলাদাভাবে হ্যান্ডেল করার সুবিধা।
- 🕒 **কাউন্টডাউন টাইমার:** পরবর্তী পবিত্র ঈদুল আযহার জন্য লাইভ কাউন্টডাউন।
- 🖼️ **ডাইনামিক থিম গ্যালারি:** ইউজার চাইলে সাইটের ব্যাকগ্রাউন্ড ইমেজ পরিবর্তন করতে পারে এবং নিজস্ব ফটো আপলোড করে ২৪ ঘণ্টার জন্য সেভ রাখতে পারে।
- 👤 **ইউজার ড্যাশবোর্ড:** ইউজাররা রেজিস্ট্রেশন করে নিজেদের এলাকার মসজিদ বা ঈদগাহের তথ্য যোগ, এডিট বা ডিলিট করতে পারেন।
- 📱 **সম্পূর্ণ রেসপন্সিভ:** মোবাইল, ট্যাবলেট এবং ডেস্কটপ—সব ডিভাইসেই চমৎকার ইউজার ইন্টারফেস।
- 🛡️ **নিরাপদ অথেন্টিকেশন:** Next-Auth ব্যবহার করে নিরাপদ লগইন এবং প্রোফাইল ম্যানেজমেন্ট।

---

## 🛠️ টেকনোলজি স্ট্যাক (Tech Stack)

- **Frontend:** [Next.js 15](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- **Database:**[Prisma ORM](https://www.prisma.io/)
- **Authentication:** [Next-Auth.js](https://next-auth.js.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Notifications:** [React Toastify](https://fkhadra.github.io/react-toastify/)

---

## 🚀 লোকাল সেটআপ (Installation Guide)

আপনার লোকাল মেশিনে প্রজেক্টটি চালানোর জন্য নিচের ধাপগুলো অনুসরণ করুন:

1. **রিপোজিটরি ক্লোন করুন:**
   ```bash
   git clone https://github.com/your-username/eidgah-bd.git
   cd eidgah-bd
1:ডিপেন্ডেন্সি ইনস্টল করুন:
  npm install

2:এনভায়রনমেন্ট ভেরিয়েবল সেটআপ করুন:
প্রজেক্টের রুট ফোল্ডারে একটি .env ফাইল তৈরি করুন এবং নিচের কী-গুলো যুক্ত করুন:

DATABASE_URL="আপনার_সুপাবেস_ইউআরএল"
NEXTAUTH_SECRET="আপনার_সিক্রেট_কী"
NEXTAUTH_URL="http://localhost:3000"

3:প্রিজমা জেনারেট করুন
npx prisma generate

4:প্রজেক্ট রান করুন
npm run dev

এখন ব্রাউজারে http://localhost:3000 ওপেন করুন
 
স্ক্রিনশটসমূহ (Screenshots)
হোম পেজ ও সার্চ বার
![Home page](https://i.ibb.co.com/BVKCh1Dw/screencapture-eid-namaz-time-zone-vercel-app-2026-04-13-20-42-17.png)
ড্যাশবোর্ড 
![Dashboard](https://i.ibb.co.com/svQ2rR58/screencapture-eid-namaz-time-zone-vercel-app-profile-2026-04-13-20-51-05.png)
ড্যাশবোর্ড (মসজিদ যোগ করার ফর্ম)
![Dashboard](https://i.ibb.co.com/rKJB9Hvb/screencapture-eid-namaz-time-zone-vercel-app-profile-2026-04-13-20-53-10.png)

থিম মেনু ও প্রোফাইল সেটিংস
![Profile](https://i.ibb.co.com/yFwnXLmW/screencapture-eid-namaz-time-zone-vercel-app-profile-2026-04-13-20-53-58.png)


📂 ফোল্ডার স্ট্রাকচার (Folder Structure)

├── app/                # Next.js App Router (Pages, Actions, APIs)
├── component/          # Reusable UI Components
├── data/               # JSON data (Divisions, Districts, etc.)
├── lib/                # Database connection & configurations
├── public/             # Static assets (Images, Logo)
└── prisma/             # Database Schema

🤝 অবদান রাখুন (Contributing)
আপনি যদি এই প্রজেক্টে অবদান রাখতে চান:
প্রজেক্টটি Fork করুন।
নতুন ফিচার বা ফিক্সের জন্য একটি Branch তৈরি করুন।
আপনার পরিবর্তনগুলো Commit করুন।
একটি Pull Request পাঠান।


👨‍💻 ডেভেলপার (Developer)
Mahfuz Ahmed
একজন প্যাশনেট ফুল-স্ট্যাক ডেভেলপার, যিনি আধুনিক ওয়েব টেকনোলজি নিয়ে কাজ করতে পছন্দ করেন।
📧 Email: [mdmahfuzahmedony@gmail.com]
🌐 Portfolio: [https://mahfuzahmedony.vercel.app/]
🔗 LinkedIn: [https://www.linkedin.com/in/mahfuzahmedony/]

   
