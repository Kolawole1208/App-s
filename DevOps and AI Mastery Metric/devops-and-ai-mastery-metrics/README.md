# DevOps & AI Mastery Metric Engine 🚀

An interactive, high-fidelity assessment tool and metric generator engineered to help software professionals draft, customize, and refine quantitative career achievements in the **DevOps** and **Artificial Intelligence (AI)** domains. 

This full-stack application provides developers, SREs, and engineers with instant professional metrics to excel in career performance reviews, job searches, and self-assessments.

---

## 🌟 Core Features

1. **Skill Profiler Questionnaire**
   - Assess your competency across **10 distinct skill dimensions** (5 for DevOps, 5 for Generative AI).
   - Real-time score compilation and profile mastery diagnostics.
   - Calculates custom indexes mapped directly to professional tiers (Beginner, Intermediate, Advanced, Expert).

2. **AI-Powered Metric Generation**
   - Integrated with the **Gemini 3.5 Flash** model via the official `@google/genai` server-side SDK.
   - Converts abstract skills, tools, and project lists into mathematically sound, highly customized metric bullet points.
   - Enforces specific business impact categories (e.g., *Speed & Efficiency*, *Quality & Reliability*, *Cost & Optimization*, *Innovation & Value*).

3. **Instant Blueprint Presets**
   - Urgent performance reviews? Copy-paste battle-tested accomplishments from 4 pre-configured career presets (Standard DevOps Specialist, Enterprise Cloud Architect, AI Solutions Integrator, Modern Hybrid DevSecOps/MLOps Lead).

4. **Interactive Metrics Workspace**
   - Review drafted metrics alongside an **interview coaching strategy** explaining exactly *how* to defend each quantitative claim during audits.
   - Copy accomplishments instantly as individual lines or full Markdown portfolios.
   - Inline metric editor allows you to scale numbers, tools, or contexts dynamically to ensure perfect authenticity.

5. **Integrated Career Guide**
   - Deep dive into the four core **DORA** delivery metrics and modern LLM orchestration guidelines.
   - Introduces the **Golden Accomplishment Formula**: `Action Verb + Technical Project/Tool + Measurable Quantitative Outcome`.

---

## 🛠️ Architecture & Technology Stack

- **Client-Side Framework:** React (v19) with TypeScript
- **Styling:** Tailwind CSS (v4) with custom premium theme palettes
- **Server:** Express (v4) Node.js server with active TSX execution
- **Bundler & Tooling:** Vite (v6), ESBuild, and TypeScript
- **AI Orchestration:** Official `@google/genai` TypeScript SDK
- **Icons:** `lucide-react` vectors

---

## 📦 Project File Structure

```text
├── /.env.example                     # Environment configuration blueprints
├── /metadata.json                    # Application capabilities & platform settings
├── /package.json                     # Dependency manifests & run scripts
├── /server.ts                        # Express API proxy and asset serving logic
├── /tsconfig.json                    # Strict TypeScript configurations
├── /vite.config.ts                   # Custom bundler configurations
├── /src
│   ├── /App.tsx                      # Primary visual workspace components & tabs
│   ├── /index.css                    # Tailwind CSS configuration and typographic imports
│   ├── /main.tsx                     # React rendering bootstrapper
│   ├── /types.ts                     # Strict TypeScript interface declarations
│   └── /data
│       └── /assessmentQuestions.ts   # Core questionnaire data, tiers, and criteria
```

---

## 🚀 Running the Application Locally

### Prerequisites
- Node.js (v18 or higher)
- NPM or Yarn
- A Gemini API Key (obtained from [Google AI Studio](https://aistudio.google.com/))

### Installation Steps

1. **Clone the project & install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env` file at the root of the project (copying `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and insert your Gemini API Key:
   ```env
   GEMINI_API_KEY="AI_STUDIO_KEY_HERE"
   ```

3. **Start the Development Server:**
   The development server runs Express with live Vite asset compiling on port `3000`:
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   To build both the frontend and backend bundle:
   ```bash
   npm run build
   ```

5. **Run the Production Server:**
   ```bash
   npm run start
   ```

---

## 💡 Coaching Philosophy

Quantitative bullet points are the standard for engineering resumes and evaluations. This tool helps remove the friction of translating daily engineering tasks into high-impact business outcomes.

Remember the **Golden Formula**:
> **Action Verb** (e.g., *Engineered*) + **Technical Project/Tool** (e.g., *Multi-environment GitHub Actions*) + **Quantitative Outcome** (e.g., *slashed release cycle time by 60%*).

*Note: Always customize the generated numbers slightly to fit the actual scale of your projects before submitting. Keep achievements authentic and auditable!*
