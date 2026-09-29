import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API route to generate DevOps and AI mastery metrics using Gemini
app.post("/api/generate-metrics", async (req, res) => {
  const { role, seniority, scores, customProjects, focusAreas } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    console.warn("GEMINI_API_KEY is not configured or using placeholder. Returning high-quality fallback metrics.");
    // Fallback response for offline or non-API key situations
    const fallbackMetrics = [
      {
        title: "Automated Deployment Pipeline",
        metric: "Designed and implemented automated multi-stage CI/CD pipelines using GitHub Actions, reducing manual deployment efforts by 70% and accelerating production release frequency from bi-weekly to daily.",
        domain: "DevOps",
        impactCategory: "Speed & Efficiency",
        rationale: "Shows expertise in modern pipeline design and release acceleration, aligning with intermediate DevOps mastery."
      },
      {
        title: "Cloud Infrastructure as Code Migration",
        metric: "Migrated legacy bare-metal server configurations into reusable Terraform IaC modules on GCP/AWS, cutting down environment provisioning times from 3 days to under 15 minutes while maintaining 100% configuration consistency.",
        domain: "DevOps",
        impactCategory: "Cost & Optimization",
        rationale: "Demonstrates cloud-native architecture experience and direct efficiency improvements through infrastructure automation."
      },
      {
        title: "Intelligent Document Parsing Solution",
        metric: "Architected a Retrieval-Augmented Generation (RAG) system with a Node.js/TypeScript backend, utilizing pgvector and Gemini API to achieve 92% accuracy in automated document content search and summaries.",
        domain: "AI",
        impactCategory: "Innovation & Value",
        rationale: "Shows integration of modern LLMs, vector search, and API development for business intelligence."
      },
      {
        title: "Microservices Orchestration & Scaling",
        metric: "Containerized 12 legacy microservices with Docker and orchestrated them using Kubernetes (EKS), optimizing resource allocation to achieve 35% savings in monthly cloud compute spend.",
        domain: "DevOps",
        impactCategory: "Cost & Optimization",
        rationale: "Addresses cloud optimization and enterprise-grade microservice orchestration skills."
      },
      {
        title: "Agentic Triage Assistant Development",
        metric: "Developed an autonomous support-ticket routing agent using function calling/tools with the Gemini API, reducing average support response SLA times by 40% with zero human triage intervention.",
        domain: "AI",
        impactCategory: "Quality & Reliability",
        rationale: "Exhibits advanced developer competency in GenAI agents, tooling, and business process automation."
      }
    ];
    return res.json({ metrics: fallbackMetrics, isDemo: true });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const scoresString = scores
      ? Object.entries(scores)
          .map(([k, v]) => `- ${k}: ${v}% score`)
          .join("\n")
      : "Not provided";

    const prompt = `You are an elite DevOps and AI Specialist serving as a personal development coach. 
The user is tracking their skill mastery within DevOps and AI for personal development, performance reviews, or career advancement.
They currently do not have quantitative metrics to demonstrate their achievements and urgently need your help to draft highly professional, impressive, yet realistic and mathematically sound metrics.

User Context:
- Current Target Role: ${role || "Software Engineer / DevOps Engineer"}
- Seniority Level: ${seniority || "Mid-Level"}
- Domain Skill Mastery Scores (from their self-assessment questionnaire, 0-100%):
${scoresString}
- Specific Tools, Projects, or Tasks they mentioned: "${customProjects || "Continuous Integration, Cloud architecture, Docker, Git, REST APIs, and basic LLM prompt engineering"}"
- Focus Areas preferred: ${focusAreas ? focusAreas.join(", ") : "Speed & Efficiency, Cost & Optimization"}

Your Goal:
Generate 5-6 highly customized, impactful, and professional metrics that they can adopt. 
Each metric must feature a clear, quantitative outcome (percentages, times, dollars, or ratios) that perfectly aligns with their level of seniority and DevOps/AI skills. 
At least 2 must be heavily focused on DevOps, at least 2 heavily focused on AI, and 1 should be a Hybrid metric (AI-driven DevOps or DevOps for AI, e.g., LLM ops, GitOps for prompt engineering, server-side deployment of LLMs, automated testing of LLM pipelines).

Return a JSON array containing objects with these EXACT properties:
1. "title": A concise, action-oriented name of the achievement (e.g., "CI/CD Pipeline Optimization").
2. "metric": The professional quantitative bullet point statement itself. Start with strong action verbs (e.g., "Engineered", "Optimized", "Spearheaded", "Architected").
3. "domain": Must be either "DevOps", "AI", or "Hybrid".
4. "impactCategory": Must be one of: "Speed & Efficiency", "Quality & Reliability", "Cost & Optimization", "Innovation & Value".
5. "rationale": A brief 1-2 sentence explanation of why this metric fits their skillset and how they can justify it if asked.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            metrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  metric: { type: Type.STRING },
                  domain: { type: Type.STRING },
                  impactCategory: { type: Type.STRING },
                  rationale: { type: Type.STRING }
                },
                required: ["title", "metric", "domain", "impactCategory", "rationale"]
              }
            }
          },
          required: ["metrics"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No text returned from Gemini API");
    }

    const data = JSON.parse(responseText.trim());
    return res.json({ metrics: data.metrics, isDemo: false });

  } catch (error: any) {
    console.error("Error generating metrics via Gemini:", error);
    return res.status(500).json({ error: error.message || "Failed to generate metrics" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
