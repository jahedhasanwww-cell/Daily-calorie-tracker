========================================================
খাবার ও ক্যালরি হিসাব (Daily Calorie Tracker) — Android Chrome PWA
========================================================

এই জিপ ফাইলের ভেতরে যা যা আছে:
1. index.html      — মূল অ্যাপ ফাইল (বাংলা + English + AI ক্যামেরা)
2. manifest.json   — Android Chrome-এ অ্যাপ ইনস্টল করার কনফিগ ফাইল
3. sw.js           — অফলাইন সাপোর্ট ও Chrome Install Prompt সার্ভিস ওয়ার্কার
4. icon-192.png    — অ্যাপ আইকন (192x192)
5. icon-512.png    — অ্যাপ আইকন (512x512)
6. icon.svg        — ভেক্টর আইকন

কিভাবে GitHub Pages-এ আপলোড করে Google Chrome থেকে ইনস্টল করবেন:
--------------------------------------------------------
ধাপ ১: এই ZIP ফাইলটি আনজিপ (Extract) করুন।
ধাপ ২: GitHub-এ নতুন একটি রিপোজিটরি (যেমন: calorie-tracker) তৈরি করুন এবং
        সব ফাইল (index.html, manifest.json, sw.js, icon-192.png, icon-512.png, icon.svg)
        একসাথে আপলোড (Commit) করুন।
ধাপ ৩: Repository Settings -> Pages -> Branch: main -> Save দিন।
        ১-২ মিনিট পর আপনার HTTPS লিংক তৈরি হয়ে যাবে।
ধাপ ৪: Android ফোনের Google Chrome-এ সেই লিংকটি খুলুন।
        উপরের ডানদিকে ⋮ (মেনু) -> "Install app" বা "Add to Home screen" ট্যাপ করুন,
        অথবা অ্যাপের ভেতরের "ইনস্টল" বাটনে ট্যাপ করুন।
ধাপ ৫: AI ক্যামেরা চালু করতে অ্যাপের সেটিংস -> AI ক্যামেরা সেটিংস-এ
        আপনার Google Gemini API Key বসিয়ে "সেভ" ও "টেস্ট" করুন।
