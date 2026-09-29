import { AssessmentQuestion, SkillDimension } from "../types";

export const skillDimensions: SkillDimension[] = [
  // DevOps Dimensions
  {
    id: "cicd",
    name: "CI/CD & Release Automation",
    domain: "DevOps",
    description: "Pipeline architecture, automated testing integration, and modern delivery strategies (GitOps, Canary, Blue-Green).",
    concepts: ["GitHub Actions", "GitLab CI", "ArgoCD", "Automated Testing", "Semantic Versioning"]
  },
  {
    id: "iac",
    name: "Infrastructure as Code (IaC)",
    domain: "DevOps",
    description: "Declarative infrastructure, configuration management, state drift detection, and modular architecture.",
    concepts: ["Terraform", "OpenTofu", "Ansible", "Pulumi", "State Management", "Drift Remediation"]
  },
  {
    id: "cloud",
    name: "Cloud & Container Orchestration",
    domain: "DevOps",
    description: "Designing scalable, containerized solutions, microservice orchestration, and serverless compute platforms.",
    concepts: ["Docker", "Kubernetes", "AWS EKS / GCP GKE", "Service Meshes", "Horizontal Pod Autoscaling"]
  },
  {
    id: "observability",
    name: "Observability & Site Reliability (SRE)",
    domain: "DevOps",
    description: "Proactive log aggregation, metric instrumentation, alerts tuning, and distributed tracing.",
    concepts: ["Prometheus", "Grafana", "ELK Stack", "OpenTelemetry", "SLAs / SLOs / SLIs"]
  },
  {
    id: "devsecops",
    name: "SecOps & Supply Chain Security",
    domain: "DevOps",
    description: "Shift-left vulnerability scanning, IAM least-privilege, automated secrets rotation, and compliance auditing.",
    concepts: ["Trivy", "Snyk", "HashiCorp Vault", "IAM Policies", "Container Image Signing"]
  },

  // AI Dimensions
  {
    id: "genai_llms",
    name: "GenAI & Prompt Engineering",
    domain: "AI",
    description: "Advanced model tuning, parameter optimization (temp, top_p, seeds), prompt design pattern mastery.",
    concepts: ["Gemini 3.5", "System Instructions", "Structured Outputs", "Context Window Management"]
  },
  {
    id: "rag_vectors",
    name: "RAG & Vector Databases",
    domain: "AI",
    description: "Context retrieval augmentation, multi-modal embeddings generation, vector search index construction.",
    concepts: ["Pinecone", "ChromaDB", "pgvector", "Embedding Models", "Semantic Retrieval"]
  },
  {
    id: "agents",
    name: "Autonomous Agents & Tool Use",
    domain: "AI",
    description: "Designing loops, agent state machines, tool function calling, and self-correction patterns.",
    concepts: ["Function Calling", "Multi-Agent Systems", "Stateful Workflow Engines", "AI Orchestrators"]
  },
  {
    id: "ai_app_dev",
    name: "GenAI Integration & SDKs",
    domain: "AI",
    description: "Integrating modern AI SDKs (such as @google/genai) securely in full-stack setups, managing API limits.",
    concepts: ["@google/genai SDK", "Server-Side Proxies", "Streaming / SSE", "JSON Schema Enforcement"]
  },
  {
    id: "mlops",
    name: "MLOps & Model Lifecycle",
    domain: "AI",
    description: "Orchestrating model serving pipelines, dataset validation, fine-tuning scripts, and metric evaluations.",
    concepts: ["Model Deployment", "Kubeflow / MLflow", "Data Version Control", "Fine-tuning", "LLM Evaluation"]
  }
];

export const assessmentQuestions: AssessmentQuestion[] = [
  // DevOps Questions
  {
    id: "q_cicd",
    dimensionId: "cicd",
    domain: "DevOps",
    question: "How are software build, test, and deployment processes managed in your projects?",
    options: [
      {
        score: 25,
        label: "Manual or Ad-hoc Scripts",
        description: "Deployments are done manually (FTP, SSH) or using simple local shell scripts. Testing is manual or client-side only."
      },
      {
        score: 50,
        label: "Basic Automated Pipelines",
        description: "Pipelines run on commits (e.g. GitHub Actions) to run linter and basic tests. Production deployment is triggered manually."
      },
      {
        score: 75,
        label: "Advanced Continuous Delivery",
        description: "Fully automated builds and staging deployments. Runs extensive test suites, handles versioning, and deploys securely to production upon approval."
      },
      {
        score: 100,
        label: "GitOps & Zero-Downtime Delivery",
        description: "Full Continuous Deployment / GitOps flow with auto-promotions, canary/blue-green deployments, rollbacks, and policy compliance audits."
      }
    ]
  },
  {
    id: "q_iac",
    dimensionId: "iac",
    domain: "DevOps",
    question: "How do you manage server setups, cloud databases, and networking configurations?",
    options: [
      {
        score: 25,
        label: "Manual Cloud Console Configuration",
        description: "Resources are created manually via GCP or AWS console interface. Scaling or reproducing environments requires manual setup guides."
      },
      {
        score: 50,
        label: "Basic Scripted / Configuration Management",
        description: "Utilize shell scripts or basic configuration tools (e.g. Ansible) to set up servers, but infrastructure elements are still created manually."
      },
      {
        score: 75,
        label: "Infrastructure as Code (Declarative)",
        description: "Define all cloud infrastructure (network, databases, storage, VMs) in Terraform or CloudFormation. Track code in Git and plan updates first."
      },
      {
        score: 100,
        label: "Enterprise GitOps IaC & Drift Enforcement",
        description: "Modular IaC with automatic deployment pipelines, policy-as-code integration (e.g. OPA), and automated drift detection with self-healing."
      }
    ]
  },
  {
    id: "q_cloud",
    dimensionId: "cloud",
    domain: "DevOps",
    question: "What is your approach to application containerization and scaling infrastructure?",
    options: [
      {
        score: 25,
        label: "Single Virtual Machine (No Containers)",
        description: "Applications run directly on virtual machines (VPS) or PaaS with direct file hosting. Manual scaling is required."
      },
      {
        score: 50,
        label: "Basic Containerization (Docker)",
        description: "Applications are packaged as Docker images. Run containers on single machines or basic container services with manual scale controls."
      },
      {
        score: 75,
        label: "Orchestrated Containers (Kubernetes / ECS)",
        description: "Production containers run on Kubernetes or cloud-native cluster orchestrators with automated self-healing and service discovery."
      },
      {
        score: 100,
        label: "Highly Available Service Mesh & Serverless",
        description: "Multi-cluster orchestration, auto-scaling based on custom traffic metrics (HPA), and zero-scale serverless architectures with robust networking."
      }
    ]
  },
  {
    id: "q_observability",
    dimensionId: "observability",
    domain: "DevOps",
    question: "How do you detect, diagnose, and alert on application errors or infrastructure slowdowns?",
    options: [
      {
        score: 25,
        label: "Reactive / User-Reported",
        description: "Errors are noticed when customers report them or when developers check raw text logs on the server manually after a crash."
      },
      {
        score: 50,
        label: "Basic Log Aggregation & Dashboards",
        description: "Logs are aggregated in centralized cloud services. Basic server resource CPU/Memory monitoring graphs are available."
      },
      {
        score: 75,
        label: "Advanced Observability (Metrics + Logs + Traces)",
        description: "Structured logging, Prometheus/Grafana metrics monitoring, and distributed tracing. Alert rules are tuned to prevent spam."
      },
      {
        score: 100,
        label: "SRE Practice with Real-time SLA/SLO Alarms",
        description: "SLAs, SLOs, and error-budget burn rates calculated and visualised. Automated corrective playbooks run in response to specific system alerts."
      }
    ]
  },
  {
    id: "q_devsecops",
    dimensionId: "devsecops",
    domain: "DevOps",
    question: "What is your system for vulnerability detection, credential management, and compliance?",
    options: [
      {
        score: 25,
        label: "Hardcoded Credentials / Local Files",
        description: "Secrets or tokens are in code comments, local unencrypted config files, or raw environment variables. Audits are done manually."
      },
      {
        score: 50,
        label: "Basic Secret Management (dotenv)",
        description: "Secrets are kept out of Git repositories using separate .env files, but no central secrets manager, rotational controls, or pipeline scans are used."
      },
      {
        score: 75,
        label: "Shift-Left Security & Secrets Manager",
        description: "Central secret managers used (Vault, AWS Secrets Manager). Automatic vulnerability scanning on container builds and npm packages in the pipeline."
      },
      {
        score: 100,
        label: "Zero-Trust DevSecOps Integration",
        description: "Dynamic temporal secrets, signed container images, policy compliance validation, and continuous posture assessments in runtime environments."
      }
    ]
  },

  // AI Questions
  {
    id: "q_genai_llms",
    dimensionId: "genai_llms",
    domain: "AI",
    question: "How advanced is your capability in prompting and optimizing Large Language Models (LLMs)?",
    options: [
      {
        score: 25,
        label: "Casual Prompting",
        description: "Write basic interactive prompts ('Write a blog post about X'). Minimal knowledge of parameters (temperature, top_p, top_k)."
      },
      {
        score: 50,
        label: "Structured Prompts & Basic Parameters",
        description: "Write systematic prompts using role definition, markdown styling, few-shot examples, and basic tuning of parameters to avoid model drift."
      },
      {
        score: 75,
        label: "Advanced prompt design & Dynamic Context",
        description: "Design robust prompt templates, chain-of-thought protocols, custom delimiters, and enforce structured JSON outputs utilizing Gemini schemas."
      },
      {
        score: 100,
        label: "Enterprise Prompt Architecture & Multi-modal Optimization",
        description: "Implement highly optimized, programmatically controlled contexts, multi-modal alignment, token budget engineering, and evaluations metrics."
      }
    ]
  },
  {
    id: "q_rag_vectors",
    dimensionId: "rag_vectors",
    domain: "AI",
    question: "How do you provide specialized or proprietary documentation context to your AI tools?",
    options: [
      {
        score: 25,
        label: "Zero Context / Copy-Paste",
        description: "Rely solely on the model's pre-trained knowledge base or manually copy-paste documents into Chat boxes when querying."
      },
      {
        score: 50,
        label: "Basic Document Feeding (Large Context Window)",
        description: "Upload full text files or PDFs directly into prompt contexts. Undergo basic understanding of chunk sizes but no dedicated indexing."
      },
      {
        score: 75,
        label: "Retrieval-Augmented Generation (RAG)",
        description: "Built automated search pipeline converting documents to vector embeddings, stored in Pinecone/pgvector, retrieved dynamically to augment queries."
      },
      {
        score: 100,
        label: "Advanced Hybrid RAG & Re-ranking Engines",
        description: "Enterprise-grade pipeline with semantic chunking, keyword-vector hybrid search, Cross-Encoder re-ranking, and metadata filtering."
      }
    ]
  },
  {
    id: "q_agents",
    dimensionId: "agents",
    domain: "AI",
    question: "How do you enable AI systems to interact with databases, web services, or local server code?",
    options: [
      {
        score: 25,
        label: "Static Text Response Only",
        description: "AI model only produces strings of conversational text. Any actions on the server or client side are done manually by the developer."
      },
      {
        score: 50,
        label: "Basic API Calls / Script Triggers",
        description: "Write custom regex parsers or utilize simple JSON outputs from the LLM to trigger specific local hardcoded scripts or notifications."
      },
      {
        score: 75,
        label: "Function Calling & Dynamic Tool Integration",
        description: "Configure Gemini tools/function declarations. The model outputs precise parameters for external execution, returning results to the chat context."
      },
      {
        score: 100,
        label: "Multi-Agent Orchestration & Stateful Automation",
        description: "Architect complex systems with multiple collaborating agents, state-machine tracking, self-critique loops, and sandboxed tool environments."
      }
    ]
  },
  {
    id: "q_ai_app_dev",
    dimensionId: "ai_app_dev",
    domain: "AI",
    question: "What is your comfort level implementing full-stack applications with official AI SDKs?",
    options: [
      {
        score: 25,
        label: "No SDK Experience",
        description: "Interact with AI exclusively via third-party web chats (ChatGPT, Gemini advanced) with no custom software integration."
      },
      {
        score: 50,
        label: "Basic Client-Side Calls / Mock APIs",
        description: "Integrate basic client-side API calls, or use basic third-party SDK templates, with hardcoded API keys on the frontend."
      },
      {
        score: 75,
        label: "Secure Server-Side AI SDK Integrations",
        description: "Developed production API routes to proxy Gemini API calls using the modern @google/genai SDK, maintaining 100% key security and handling SSE streaming."
      },
      {
        score: 100,
        label: "High-Performance Full-Stack AI Ecosystems",
        description: "Highly optimized streaming buffers, asynchronous operation queues for video/image generation, and enterprise error-handling architectures."
      }
    ]
  },
  {
    id: "q_mlops",
    dimensionId: "mlops",
    domain: "AI",
    question: "How do you manage models, track datasets, and serve AI applications at scale?",
    options: [
      {
        score: 25,
        label: "Manual/Local Model Running",
        description: "Run scripts or local open-source models (Ollama) on a personal laptop with manual parameter configurations."
      },
      {
        score: 50,
        label: "Cloud Model Hosting & Pre-trained APIs",
        description: "Deploy basic model servers or connect to standard cloud inference endpoints. Basic API logging is configured."
      },
      {
        score: 75,
        label: "Durable ML Pipelines & Version Control",
        description: "Manage ML lifecycle with automated training pipelines, track datasets with versioning, and monitor prediction response performance."
      },
      {
        score: 100,
        label: "Enterprise MLOps & LLMOps Architectures",
        description: "Automated fine-tuning loops, continuous LLM evaluation metrics (RAGAS), automated latency/cost optimizations, and guardrails enforcement."
      }
    ]
  }
];
