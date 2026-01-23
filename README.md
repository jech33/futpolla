# Futpolla - World Cup Predictor 🏆

A mobile-first web application designed to manage soccer betting pools (pollas) for the World Cup. Users can create private groups, predict match scores, and track live rankings.

![Project Status](https://img.shields.io/badge/status-development-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend/Auth:** Firebase (Firestore, Auth)
- **Automation:** Vercel Cron Jobs (for match updates)

## ✨ Key Features

- **User Authentication:** Social login via Google/Firebase.
- **Match Predictions:** Users can input scores up to 5 minutes before kickoff.
- **Live Leaderboard:** Real-time ranking updates based on match results.
- **Mobile First:** Optimized UX/UI for mobile devices using Dark Mode.
- **Admin Dashboard:** Manual override for match scores and system management.

## 🛠️ Getting Started

1. Clone the repository:

   ```bash
   git clone [https://github.com/tu-usuario/world-cup-predictor.git](https://github.com/tu-usuario/world-cup-predictor.git)
   ```

2. Install dependencies:

   ```bash
   npm install
   Set up environment variables: Copy .env.example to .env.local and add your Firebase credentials.
   ```

3. Run the development server:

   ```bash
    npm run dev
   ```

## 🤝 Contributing

This is a personal project. Feel free to open issues if you find bugs.

## ✏️ Commits convention

This project follows the Conventional Commits specification. Please adhere to this format when making commits.

```text
<type>(<scope>): <description>

feat: add user authentication with Google
fix: resolve ranking calculation error on tie scores
ui: implement dark mode for match cards
chore: update dependencies and firebase config
docs: update README with setup instructions
```
