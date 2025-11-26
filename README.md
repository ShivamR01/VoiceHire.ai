AI Voice Recruiter SaaS

This is a premium SaaS application built with Next.js 16, allowing users to practice mock interviews with a realistic AI Voice Recruiter, powered by the Google Gemini API. It features a dual-role system for Recruiters and Candidates, facilitating a complete interview lifecycle from template creation to voice-based assessment and AI feedback.

🚀 Features

For Recruiters 👔

AI-Powered Template Generation: Simply paste a Job Description (JD), and the AI generates a structured interview template with relevant technical and behavioral questions.

Interview Management: Create, publish, and delete interview templates.

Candidate Invitation: Invite specific candidates via email to take an interview.

Dashboard Analytics: Track active templates, total assigned candidates, and completion rates.

Detailed Reports: View detailed feedback reports and transcripts for every completed interview.

For Candidates 👨‍💻

Voice-First Interviews: Engage in a real-time spoken conversation with an AI interviewer. No typing required.

Realistic Interaction: The AI speaks the questions (TTS) and listens to your answers (STT).

Scheduled Interviews: Access interviews assigned to you by recruiters.

Self-Practice: Access public templates to practice on your own.

Instant Feedback: Receive a comprehensive AI-generated report immediately after the interview, including a score (0-100), strengths, areas for improvement, and detailed analysis.

🛠 Tech Stack

Framework: Next.js 16 (App Router, Server Actions)

Language: TypeScript

Database: MongoDB with Mongoose

Authentication: NextAuth.js (Credentials Provider, RBAC)

AI Engine: Google Gemini API

Text Generation: gemini-2.5-flash-preview-09-2025 (Questions & Feedback)

Speech-to-Text (STT): gemini-2.5-flash-preview-09-2025 (Multimodal)

Text-to-Speech (TTS): gemini-2.5-flash-preview-tts

Styling: Tailwind CSS + shadcn/ui components + Lucide React icons

📂 Folder Structure

/
├── app/
│   ├── (auth)/                 # Authentication Routes (Route Group)
│   │   ├── login/              # Login Page
│   │   └── signup/             # Signup Page (with Role Selection)
│   ├── actions/                # Server Actions (Backend Logic)
│   │   ├── auth.ts             # Signup & User Creation
│   │   ├── interview.ts        # Interview State Machine & AI Logic
│   │   └── recruiter.ts        # Template Management & Invitations
│   ├── api/                    # API Route Handlers
│   │   ├── auth/[...nextauth]/ # NextAuth Configuration
│   │   └── tts/                # Text-to-Speech Streaming Endpoint
│   ├── dashboard/              # Dashboard Routes (Protected)
│   │   ├── [userId]/           # Dynamic User Dashboard (Dispatcher)
│   │   ├── candidate/          # Candidate View Logic
│   │   └── recruiter/          # Recruiter View Logic & Sub-pages
│   │       ├── create/         # Create Template Page
│   │       ├── conduct/        # Invite Candidate Page
│   │       └── interview/      # Detailed Interview Analytics Page
│   ├── interview/              # Interview Environment
│   │   ├── setup/[templateId]/ # Microphone Check & Instructions
│   │   ├── live/[sessionId]/   # Live Voice Interview Room
│   │   └── feedback/[sessionId]/ # Final Feedback Report
│   ├── layout.tsx              # Root Layout
│   ├── page.tsx                # Landing Page
│   └── providers.tsx           # Session Provider Wrapper
├── components/                 # Reusable UI Components
│   ├── ui/                     # shadcn/ui primitives (Button, Card, Input, etc.)
│   ├── RecruiterTemplateCard.tsx
│   └── SignOutButton.tsx
├── lib/                        # Utilities & Libraries
│   ├── audioUtils.ts           # Audio conversion helpers (PCM to WAV)
│   ├── dbConnect.ts            # MongoDB connection singleton
│   ├── gemini.ts               # Gemini API Client Wrapper
│   └── utils.ts                # CN helper & JSON cleaning
├── models/                     # Mongoose Schemas
│   ├── UserModel.ts
│   ├── InterviewTemplateModel.ts
│   └── InterviewSessionModel.ts
├── middleware.ts               # Route Protection & Redirects
└── ...config files


🛣 Key Routes Description

Public

/: Landing page. Redirects logged-in users to their role-specific dashboard.

/login: Sign in to your account.

/signup: Create a new account as either a Candidate or Recruiter.

Recruiter Routes (Protected)

/recruiter: The Recruiter Dashboard. Shows active templates, aggregate stats, and quick actions.

/recruiter/create: Form to generate a new interview template from a Job Description using AI.

/recruiter/interview/[templateId]: Detailed view of a specific template, including questions and a list of all candidates (scheduled & completed).

/recruiter/conduct/[templateId]: Form to invite a specific candidate via email to take the interview.

Candidate Routes (Protected)

/candidate: The Candidate Dashboard. Shows "Scheduled Interviews" (assigned by recruiters), "Practice Templates" (public access), and interview history.

/interview/setup/[templateId]: Pre-interview check. Verifies microphone permissions before starting.

/interview/live/[sessionId]: The Live Room. Where the voice interaction happens.

/interview/feedback/[sessionId]: The final report card showing scores, transcripts, and AI analysis.

🔧 Setup & Installation

Clone the repository

git clone [https://github.com/your-username/ai-voice-recruiter.git](https://github.com/your-username/ai-voice-recruiter.git)
cd ai-voice-recruiter


Install Dependencies

npm install


Environment Variables
Create a .env.local file in the root directory and add the following:

# MongoDB Connection String
MONGO_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_SECRET=your_generated_secret_key
NEXTAUTH_URL=http://localhost:3000

# Google Gemini API Key
GEMINI_API_KEY=your_google_ai_studio_key


Run the Development Server

npm run dev


Open the App
Navigate to http://localhost:3000 in your browser.

🧠 How It Works

Template Creation: Recruiters input a job description. The system prompts Gemini to extract key requirements and generate 5 specific interview questions (JSON format).

Scheduling: Recruiters invite candidates by email. This creates an InterviewSession with status IN_PROGRESS.

The Interview Loop:

AI Speaks: The system converts the current question text to speech using Gemini TTS and plays it to the candidate.

Candidate Answers: The browser records the candidate's audio.

Processing: The audio is sent to the server, where Gemini transcribes it (STT).

Progression: The transcript is saved. If questions remain, the cycle repeats.

Feedback Generation: Once all questions are answered, the full transcript is sent to Gemini with a "Career Coach" system prompt to analyze the performance and generate a JSON feedback report.

Built with ❤️ using Next.js and Gemini