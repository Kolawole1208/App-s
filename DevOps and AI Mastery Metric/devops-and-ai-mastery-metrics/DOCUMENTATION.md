# DevOps & AI Mastery Metric Engine - Technical Documentation

Welcome to the full system documentation. This document covers the system architecture, mathematical score-mapping logic, Gemini AI prompting engineering schemas, and actionable tips on integrating these metrics into official corporate self-evaluations and performance reviews.

---

## 📖 Table of Contents
1. [System Architecture](#1-system-architecture)
2. [Diagnostic Score Mapping & Criteria](#2-diagnostic-score-mapping--criteria)
3. [Gemini Integration & Response Schemas](#3-gemini-integration--response-schemas)
4. [Deployment & Scaling Guidelines](#4-deployment--scaling-guidelines)
5. [The S.T.A.R. Metric Methodology (How to defend your claims)](#5-the-star-metric-methodology-how-to-defend-your-claims)

---

## 1. System Architecture

The application is structured as a full-stack, server-side-proxied application to safeguard sensitive API keys and ensure rapid response generation.

```text
       ┌────────────────────────┐
       │      React Client      │
       │  (Vite Dev on Port 3000)│
       └───────────┬────────────┘
                   │
         POST /api/generate-metrics
                   │
                   ▼
       ┌────────────────────────┐
       │     Express Server     │
       │  (Running via TSX/Node)│
       └───────────┬────────────┘
                   │
       Calls @google/genai SDK
                   │
                   ▼
       ┌────────────────────────┐
       │   Google Gemini API    │
       │  (gemini-3.5-flash)    │
       └────────────────────────┘
```

- **Frontend:** Single Page Application (SPA) driven by React (v19) and Vite (v6).
- **Backend Proxy:** Built with Express, providing a server-side proxy route `/api/generate-metrics`. This secures the `GEMINI_API_KEY` from client-side DevTools snooping.
- **Production Bundling:** The backend code is compiled using `esbuild` to produce a unified, standalone CommonJS module (`dist/server.cjs`), which optimizes Cold Start times and avoids relative import errors under strict ESM requirements.

---

## 2. Diagnostic Score Mapping & Criteria

The **Skill Profiler Questionnaire** grades proficiency along ten unique software engineering dimensions. Each question is scored on a scale from 25% to 100%:

### DevOps Dimensions
1. **CI/CD & Release Automation (`cicd`):** Grades capability in automated delivery, testing pipelines, GitOps, and zero-downtime releases (Canary, Blue-Green).
2. **Infrastructure as Code (`iac`):** Evaluates server configuration, declarative templates (Terraform), state management, and cloud automation.
3. **Cloud & Container Orchestration (`cloud`):** Evaluates knowledge of Docker containers, Kubernetes scheduling, autoscaling, and cluster topologies.
4. **Observability & SRE (`observability`):** Assesses proactive application metrics logging, telemetry, distributed tracing, and SLO/SLA management.
5. **SecOps & Compliance (`devsecops`):** Measures credential vaulting, shift-left pipeline scanning (Snyk/Trivy), and container signing.

### AI & Integration Dimensions
1. **GenAI & Prompt Engineering (`genai_llms`):** Focuses on prompt optimization, system instructions, temperature configurations, and context budget management.
2. **RAG & Vector Databases (`rag_vectors`):** Evaluates knowledge of embedding generation, chunking strategies, pgvector, and semantic retrieval indexing.
3. **Autonomous Agents & Tool Use (`agents`):** Assesses integration of model function calling, loop states, and automated system interactions.
4. **GenAI Integration & SDKs (`ai_app_dev`):** Evaluates full-stack AI model utilization, streaming responses, and secure API handshakes.
5. **MLOps & Model Lifecycle (`mlops`):** Assesses training orchestration, dataset drift, fine-tuning audits, and LLM evaluation metrics.

### Index Compilation Formulation:
For a given domain $D$ (where $D \in \{\text{DevOps}, \text{AI}\}$), the overall Domain Index score $S_D$ is computed as the arithmetic mean of the assessed dimension scores $s_i$:

$$S_D = \frac{1}{N} \sum_{i=1}^{N} s_i$$

Where:
- $N = 5$ (the number of questions per category).
- $s_i \in \{25, 50, 75, 100\}$ represents the selected option tier score.

### Proficiency Levels
- **0% – 25%:** Beginner
- **26% – 50%:** Intermediate
- **51% – 75%:** Advanced
- **76% – 100%:** Expert

---

## 3. Gemini Integration & Response Schemas

When the Gemini API key is configured, the `/api/generate-metrics` route passes the compiled questionnaire scores, target job title, seniority, and selected impact focus areas to the `gemini-3.5-flash` model.

### Prompt Enforcement Principles:
- **Strong Action Verbs:** The AI is strictly instructed to start achievements with high-impact verbs (e.g., *Engineered*, *Architected*, *Optimized*, *Spearheaded*).
- **Mathematical Integrity:** All metric outcomes must feature realistic percentages, durations, or resource optimizations relative to the user's selected seniority level.
- **Hybrid Domain Generation:** The engine guarantees the creation of at least one hybrid metric. Hybrid metrics bridge the gap between DevOps and AI—such as establishing **GitOps for prompt assets**, automated LLM pipelines, or **LLMOps telemetry** instrumentation.

### JSON Structured Output Schema:
To enforce type safety and seamless frontend rendering, the system specifies a strict JSON schema via the `@google/genai` model configuration:

```json
{
  "type": "OBJECT",
  "properties": {
    "metrics": {
      "type": "ARRAY",
      "items": {
        "type": "OBJECT",
        "properties": {
          "title": { "type": "STRING" },
          "metric": { "type": "STRING" },
          "domain": { "type": "STRING" },
          "impactCategory": { "type": "STRING" },
          "rationale": { "type": "STRING" }
        },
        "required": ["title", "metric", "domain", "impactCategory", "rationale"]
      }
    }
  },
  "required": ["metrics"]
}
```

---

## 4. Deployment & Scaling Guidelines

### Cloud Run Deployment
Because the application functions as a full-stack Node.js server, it runs seamlessly within containerized environments like **Google Cloud Run**. 

1. **Port Allocation:** The server is configured to bind explicitly to port `3000` and address `0.0.0.0` to respect Cloud Run ingress proxy requirements.
2. **Environment Variable Configuration:**
   - Define `GEMINI_API_KEY` within the GCP Secrets Manager and mount it to the container's environment variables.
   - Define `NODE_ENV="production"` during build time to enable optimized static asset routing and disable the Vite development server middleware.

---

## 5. The S.T.A.R. Metric Methodology
*(How to defend your claims in interviews & reviews)*

An achievement on paper is only useful if you can back it up in conversation. The tool generates a custom "Coaching Strategy" for each bullet point to prepare you for critical follow-up questions.

Use the **S.T.A.R.** method:

### 1. Situation
Establish the context.
> *"Our microservice deployment process was slow, completely manual, and prone to server configuration mismatches across our dev and production environments."*

### 2. Task
Define your specific responsibility.
> *"I was tasked with designing a unified pipeline that would fully automate deployments and standardize our server configuration as code."*

### 3. Action
Describe the exact technical steps you took (mentioning the tools from your metrics!).
> *"I modularized our VPC and server configuration into declarative Terraform templates. Then, I engineered a multi-environment GitHub Actions workflow that executes validation tests, builds Docker images, and deploys to our cluster dynamically."*

### 4. Result
Deliver the quantitative outcome produced by the tool.
> *"This eliminated configuration drift completely and reduced our deployment cycles by 60%, taking staging builds down from 2 hours to just 12 minutes."*
