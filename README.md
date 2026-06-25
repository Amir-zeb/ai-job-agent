# AI Job Filtering & Rating Agent

An automated AI-powered job filtering system that fetches remote jobs, analyzes them using Gemini AI, and ranks them based on relevance to a predefined MERN stack developer profile.

This project demonstrates:

-   Background job processing
-   AI integration    
-   Rate limiting & quota management
-   Prompt optimization
-   Cron-based automation
-   Cost-aware system design

## Screenshots

![Screenshot 1](public/screenshot-1.png)
![Screenshot 2](public/screenshot-2.png)
![Screenshot 3](public/screenshot-3.png)
![Screenshot 4](public/screenshot-4.png)

## What This Project Does

### 1️⃣ Fetch Jobs Automatically

-   Fetches job listings from RemoteOK API
-   Runs every 15 minutes (cron job)
-   Stores jobs in MongoDB
    
### 2️⃣ AI-Based Job Rating

-   Uses Gemini AI (`gemini-2.5-flash`)
-   Scores each job from 0–100
-   Marks jobs as relevant if score ≥ 60
-   Strict JSON schema enforcement for stable responses
    
### 3️⃣ Smart AI Usage Control

-   Free-tier Gemini limit: 20 requests/day
-   Daily quota tracking in MongoDB
-   Only increments usage when AI is actually called
-   Skips irrelevant jobs before AI call (cost optimization)

### 4️⃣ Background Processing

-   Separate cron jobs:
    -   Job fetching
    -   AI rating (one job at a time)
-   Lightweight queue-like behavior without Redis

## Architecture Overview

RemoteOK API  
		↓  
Fetch Cron (15 min)  
		↓  
MongoDB (Jobs stored)  
		↓  
Rating Cron  
		↓  
Gemini AI  
		↓	  
Job Score + Relevance

## Tech Stack

-   Next.js (App Router)
-   TypeScript
-   MongoDB + Mongoose
-   Gemini AI (Google Generative AI SDK)
-   node-cron
-   REST APIs

## Job Rating Logic

Before calling AI:
-   Filters jobs without relevant JS stack keywords
-   Skips AI call if clearly irrelevant
-   Reduces token usage significantly
    
AI Prompt:
-   Strict scoring rules
-   Deterministic output (low temperature)
-   Enforced JSON schema
-   Short explanation (≤ 20 words)

## Installation & Setup

### 1️⃣ Clone the repository

    git clone https://github.com/your-username/your-repo-name.git  
    cd your-repo-name

### 2️⃣ Install dependencies

    npm install

### 3️⃣ Create `.env.local`

    MONGODB_URI=your_mongodb_connection_string  
    GEMINI_API_KEY=your_gemini_api_key  
    DOMAIN=http://localhost:3000

### 4️⃣ Run the project

    npm run dev

Server will run at:

    http://localhost:3000

## Cron Jobs

Two background cron tasks:

### 🔹 Job Fetch Cron

-   Runs every 15 minutes
-   Fetches jobs from RemoteOK
-   Saves or updates in MongoDB

### 🔹 Job Rating Cron

-   Runs every 15 seconds
-   Picks one unrated job
-   Checks daily AI quota
-   Sends to Gemini for scoring
-   Updates DB with results

## MongoDB Collections

### Jobs

-   title    
-   company
-   description
-   aiScore
-   isRelevant
-   aiReason
-   aiRated

### AiUsage

-   date (YYYY-MM-DD)
-   count (daily AI usage)

## AI Daily Limit Handling

-   Max 20 Gemini requests per day
-   Auto-resets by date
-   Only increments counter if request is actually sent
-   Returns 429 if limit reached

## Security Considerations

-   HTML stripped from job descriptions before AI processing
-   JSON schema enforced for AI responses
-   Environment variables required for API keys

## Learning Objectives

This project helped me practice:

-   AI integration in backend systems
-   Structured output using JSON schema
-   Cost-aware system design
-   Cron-based background processing
-   Prompt optimization
-   Real-world API handling

## Author

**Amir Zeb**  
Full Stack Developer  
Focused on building scalable, AI-integrated systems.
