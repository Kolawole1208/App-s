import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Cpu,
  Layers,
  Settings,
  ClipboardList,
  Wrench,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Brain,
  Network,
  GitBranch,
  Shield,
  Gauge,
  Terminal,
  BookOpen,
  Award,
  ArrowRight,
  Plus,
  Trash,
  CheckCircle2,
  Lock,
  Edit2
} from 'lucide-react';
import { skillDimensions, assessmentQuestions } from './data/assessmentQuestions';
import { SkillScore, MetricItem } from './types';

// Urgent template groups for instant use (User requested "very urgent" metrics)
const INSTANT_TEMPLATES = [
  {
    name: "Standard DevOps Specialist",
    role: "DevOps Engineer",
    seniority: "Mid-Level",
    focus: "AWS, Terraform, GitHub Actions, Docker, Prometheus",
    answers: { cicd: 75, iac: 75, cloud: 75, observability: 50, devsecops: 50 },
    metrics: [
      {
        title: "Automated Deployment Pipeline",
        metric: "Engineered robust multi-stage CI/CD pipelines in GitHub Actions, reducing overall production release cycle time by 60% and cutting manual hotfix interventions in half.",
        domain: "DevOps",
        impactCategory: "Speed & Efficiency",
        rationale: "Shows active pipeline optimization and tangible business velocity acceleration."
      },
      {
        title: "Infrastructure as Code Implementation",
        metric: "Migrated 100% of legacy cloud networking and instance provisioning to reusable Terraform modules, cutting new environment setup times from 2 days to under 10 minutes.",
        domain: "DevOps",
        impactCategory: "Speed & Efficiency",
        rationale: "Demonstrates standard compliance, reusable code patterns, and swift velocity."
      }
    ]
  },
  {
    name: "Enterprise Cloud & Infrastructure Lead",
    role: "Senior Cloud Infrastructure Architect",
    seniority: "Senior-Level",
    focus: "Kubernetes, ArgoCD, Multi-cloud AWS/GCP, SRE, HashiCorp Vault",
    answers: { cicd: 100, iac: 100, cloud: 100, observability: 75, devsecops: 75 },
    metrics: [
      {
        title: "Kubernetes Migration & Optimization",
        metric: "Orchestrated container migration of 35 core services onto enterprise Kubernetes (EKS), tuning Horizontal Pod Autoscaling (HPA) to secure a 42% decrease in monthly cloud resource spend.",
        domain: "DevOps",
        impactCategory: "Cost & Optimization",
        rationale: "Exhibits advanced scheduling, deep cost optimization awareness, and high scalability."
      },
      {
        title: "SRE Fault-Tolerance Enhancement",
        metric: "Instrumented distributed tracing with OpenTelemetry across distributed services, reducing Mean Time to Resolution (MTTR) by 55% via proactive log-metric correlations.",
        domain: "DevOps",
        impactCategory: "Quality & Reliability",
        rationale: "Highlights architectural SRE maturity and operational stability practices."
      }
    ]
  },
  {
    name: "AI Solutions Integrator",
    role: "AI Application Developer",
    seniority: "Mid-Level",
    focus: "Python, Node.js, @google/genai SDK, Pinecone, Prompt Engineering, RAG",
    answers: { genai_llms: 75, rag_vectors: 75, agents: 50, ai_app_dev: 75, mlops: 50 },
    metrics: [
      {
        title: "Semantic Document RAG System",
        metric: "Architected a high-accuracy Retrieval-Augmented Generation (RAG) system with Pinecone and Gemini, enabling instant document audits and improving support summary retrieval speed by 80%.",
        domain: "AI",
        impactCategory: "Innovation & Value",
        rationale: "Highlights actual full-stack AI development capability with vector indexes and enterprise models."
      },
      {
        title: "Intelligent Agent Automation",
        metric: "Designed and integrated an automated support triage agent using Gemini's structured output schemas, routing 70% of inbound issues to appropriate channels with zero human touch.",
        domain: "AI",
        impactCategory: "Quality & Reliability",
        rationale: "Shows capability in creating reliable AI automated agents that provide clear operational ROI."
      }
    ]
  },
  {
    name: "Modern Hybrid (DevSecOps + MLOps)",
    role: "Platform Engineer (AI & DevOps)",
    seniority: "Lead-Level",
    focus: "GitOps, Trivy, Docker, MLflow, LLM Evaluations, Prompt CI/CD",
    answers: { cicd: 100, iac: 75, cloud: 75, observability: 75, devsecops: 100, genai_llms: 75, rag_vectors: 75, agents: 75, ai_app_dev: 75, mlops: 75 },
    metrics: [
      {
        title: "Automated Prompt CI/CD Pipeline",
        metric: "Built a GitOps-based prompt testing and evaluation pipeline, executing automated prompt regression suites before production releases, ensuring 100% security guardrail adherence.",
        domain: "Hybrid",
        impactCategory: "Quality & Reliability",
        rationale: "A brilliant hybrid metric combining DevOps pipeline discipline with modern generative AI testing."
      },
      {
        title: "Zero-Trust DevSecOps Hardening",
        metric: "Integrated shift-left Trivy and Snyk vulnerability analysis directly into the deployment workflows, achieving a 95% reduction in production container security warning alerts.",
        domain: "DevOps",
        impactCategory: "Quality & Reliability",
        rationale: "Shows advanced platform hardening, supply-chain safety, and continuous posture evaluation."
      }
    ]
  }
];

export default function App() {
  // Navigation / Mode
  const [activeTab, setActiveTab] = useState<'assess' | 'metrics' | 'templates' | 'docs'>('assess');
  
  // Custom user context parameters
  const [role, setRole] = useState<string>('Software Engineer');
  const [seniority, setSeniority] = useState<string>('Mid-Level');
  const [customProjects, setCustomProjects] = useState<string>('CI/CD pipelines, Docker containers, writing Terraform IaC, prompt engineering with Gemini API, building node server apps');
  const [selectedFocus, setSelectedFocus] = useState<string[]>([
    'Speed & Efficiency', 'Quality & Reliability', 'Cost & Optimization'
  ]);

  // Current assessment answers state
  // Initialized to neutral medium scores
  const [answers, setAnswers] = useState<Record<string, number>>({
    cicd: 50,
    iac: 50,
    cloud: 50,
    observability: 50,
    devsecops: 50,
    genai_llms: 50,
    rag_vectors: 50,
    agents: 50,
    ai_app_dev: 50,
    mlops: 50,
  });

  // Generated Metrics State
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Saved / Custom Metrics State (the workspace where they refine them)
  const [userMetrics, setUserMetrics] = useState<any[]>([]);
  const [editingMetricIndex, setEditingMetricIndex] = useState<number | null>(null);
  const [editBuffer, setEditBuffer] = useState<string>("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  
  // Selected metric rationales toggles
  const [expandedRationales, setExpandedRationales] = useState<Record<number, boolean>>({});

  // Auto-generate starting metrics using the default parameters on initial load
  useEffect(() => {
    // Inject fallback default state first so there is instantly useful data
    const defaults = [
      {
        title: "Automated CI/CD Pipeline",
        metric: `Engineered an automated multi-stage CI/CD pipeline using GitHub Actions, boosting release deployment frequency by 150% and reducing manual verification effort from 4 hours to 10 minutes.`,
        domain: "DevOps",
        impactCategory: "Speed & Efficiency",
        rationale: "Shows concrete automation and velocity enhancements."
      },
      {
        title: "Infrastructure as Code Transformation",
        metric: `Architected and deployed cloud environments natively through declarative Terraform modules, ensuring zero-drift consistency and slashing setup latency for new test beds by 85%.`,
        domain: "DevOps",
        impactCategory: "Cost & Optimization",
        rationale: "Strong evidence of modular planning, repeatable setups, and drift containment."
      },
      {
        title: "Intelligent AI Search Retrieval (RAG)",
        metric: `Implemented a production-grade Retrieval-Augmented Generation (RAG) agent using pgvector and the Gemini API to search corporate knowledge hubs, raising search precision to 94%.`,
        domain: "AI",
        impactCategory: "Innovation & Value",
        rationale: "Exhibits technical execution of modern embedding pipelines and vector retrieval algorithms."
      },
      {
        title: "Automated Prompt Validation Framework",
        metric: `Created a GitOps automated testing suit that executes defensive model evaluation tests against Gemini prompt updates, neutralizing prompt injection vulnerabilities by 99% before merges.`,
        domain: "Hybrid",
        impactCategory: "Quality & Reliability",
        rationale: "A stellar hybrid metric showing you apply DevOps quality guardrails to GenAI prompts."
      }
    ];
    setMetrics(defaults);
    setUserMetrics(defaults);
  }, []);

  const handleFocusToggle = (focus: string) => {
    if (selectedFocus.includes(focus)) {
      if (selectedFocus.length > 1) {
        setSelectedFocus(selectedFocus.filter(f => f !== focus));
      }
    } else {
      setSelectedFocus([...selectedFocus, focus]);
    }
  };

  const calculateDomainScore = (domain: 'DevOps' | 'AI') => {
    const dims = skillDimensions.filter(d => d.domain === domain);
    const sum = dims.reduce((acc, dim) => acc + (answers[dim.id] || 0), 0);
    return Math.round(sum / dims.length);
  };

  const getDimensionLevel = (score: number) => {
    if (score <= 25) return 'Beginner';
    if (score <= 50) return 'Intermediate';
    if (score <= 75) return 'Advanced';
    return 'Expert';
  };

  const handleSelectOption = (dimensionId: string, score: number) => {
    setAnswers(prev => ({
      ...prev,
      [dimensionId]: score
    }));
  };

  // Run the API call to generate metrics
  const triggerMetricsGeneration = async () => {
    setLoading(true);
    setGenerationError(null);
    try {
      const response = await fetch('/api/generate-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          seniority,
          scores: answers,
          customProjects,
          focusAreas: selectedFocus
        })
      });

      if (!response.ok) {
        throw new Error('Server returned an error status code ' + response.status);
      }

      const data = await response.json();
      if (data.metrics) {
        setMetrics(data.metrics);
        setUserMetrics(data.metrics);
        setIsDemo(data.isDemo || false);
        // Switch to the metrics tab to show results
        setActiveTab('metrics');
      } else {
        throw new Error('No metrics field found in response');
      }
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || 'An unexpected error occurred while communicating with the AI.');
    } finally {
      setLoading(false);
    }
  };

  // Load a preset template instantly
  const handleLoadTemplate = (tpl: typeof INSTANT_TEMPLATES[0]) => {
    setRole(tpl.role);
    setSeniority(tpl.seniority);
    setCustomProjects(tpl.focus);
    setAnswers(tpl.answers);
    setMetrics(tpl.metrics);
    setUserMetrics(tpl.metrics);
    setIsDemo(false);
    setActiveTab('metrics');
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAllMarkdown = () => {
    const text = userMetrics.map((m, i) => {
      return `### ${i+1}. ${m.title} (${m.domain} - ${m.impactCategory})\n**Metric Achievement:** ${m.metric}\n*Rationale:* ${m.rationale}\n`;
    }).join('\n');
    
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleStartEditing = (index: number, currentText: string) => {
    setEditingMetricIndex(index);
    setEditBuffer(currentText);
  };

  const handleSaveEdit = (index: number) => {
    if (editBuffer.trim() === "") return;
    const updated = [...userMetrics];
    updated[index].metric = editBuffer;
    setUserMetrics(updated);
    setEditingMetricIndex(null);
  };

  const handleAddCustomMetric = () => {
    const newMetric = {
      title: "Custom Achievement",
      metric: "Draft your quantitative metric statement here. Mention the tool, actions taken, and measurable business result.",
      domain: "Hybrid",
      impactCategory: "Speed & Efficiency",
      rationale: "Manually added and customized achievement."
    };
    setUserMetrics([...userMetrics, newMetric]);
    handleStartEditing(userMetrics.length, newMetric.metric);
  };

  const handleDeleteMetric = (index: number) => {
    setUserMetrics(userMetrics.filter((_, i) => i !== index));
  };

  const toggleRationale = (index: number) => {
    setExpandedRationales(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const devopsScore = calculateDomainScore('DevOps');
  const aiScore = calculateDomainScore('AI');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Professional Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4" id="app-header">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Award className="w-6 h-6 animate-pulse" id="header-icon" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                DevOps & AI Mastery <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Metric Engine</span>
              </h1>
              <p className="text-xs text-slate-400">Generate, assess, and customize high-impact, quantitative metrics for personal development</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800" id="nav-tabs">
            <button
              onClick={() => setActiveTab('assess')}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${activeTab === 'assess' ? 'bg-slate-800 text-emerald-400 font-semibold shadow-inner' : 'text-slate-400 hover:text-slate-200'}`}
              id="tab-assess"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              1. Skill Profiler
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-2 relative ${activeTab === 'metrics' ? 'bg-slate-800 text-emerald-400 font-semibold shadow-inner' : 'text-slate-400 hover:text-slate-200'}`}
              id="tab-metrics"
            >
              <Sparkles className="w-3.5 h-3.5" />
              2. Drafted Metrics
              {userMetrics.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 text-[10px] text-slate-950 rounded-full flex items-center justify-center font-bold">
                  {userMetrics.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${activeTab === 'templates' ? 'bg-slate-800 text-emerald-400 font-semibold shadow-inner' : 'text-slate-400 hover:text-slate-200'}`}
              id="tab-templates"
            >
              <Wrench className="w-3.5 h-3.5" />
              Instant Presets
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${activeTab === 'docs' ? 'bg-slate-800 text-emerald-400 font-semibold shadow-inner' : 'text-slate-400 hover:text-slate-200'}`}
              id="tab-docs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Guide
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8" id="main-content">
        
        {/* Banner Alert for Urgent Needs */}
        <div className="mb-8 p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4" id="urgent-tip-banner">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-300">Urgent Personal Metric Delivery</h3>
              <p className="text-xs text-slate-400 max-w-2xl mt-0.5">
                Don't have quantitative metrics prepared for your annual evaluation or self-review? We've preloaded top-tier DevOps & AI blueprints. Use the <strong>Skill Profiler</strong> below to generate highly personalized ones, or pick an <strong>Instant Preset</strong> for immediate copy-pasting.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('templates')}
            className="text-xs px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition flex items-center gap-1 shrink-0"
            id="quick-templates-btn"
          >
            Show Presets <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* TAB 1: SKILL ASSESSMENT & PROFILE CONFIGURATION */}
        {activeTab === 'assess' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="assess-view-grid">
            
            {/* Left Hand: Profile parameters & Configuration */}
            <div className="lg:col-span-1 space-y-6" id="profile-panel">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <Settings className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Career Framework</h2>
                </div>

                {/* Role and Seniority Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="role-input">Target / Current Role</label>
                    <input 
                      id="role-input"
                      type="text" 
                      value={role} 
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. DevOps Engineer, SRE, Tech Lead"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5" id="seniority-label">Seniority Tier</label>
                    <div className="grid grid-cols-3 gap-1.5" id="seniority-grid">
                      {['Junior', 'Mid-Level', 'Senior', 'Lead/Principal'].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setSeniority(lvl)}
                          className={`px-2 py-2 text-xs font-medium rounded-lg transition border ${seniority === lvl ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 font-semibold' : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'}`}
                          id={`seniority-btn-${lvl.toLowerCase().replace('/', '-')}`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="projects-input">Known Tools or Projects (AI models, pipelines, cloud hosts)</label>
                    <textarea 
                      id="projects-input"
                      rows={4}
                      value={customProjects}
                      onChange={(e) => setCustomProjects(e.target.value)}
                      placeholder="e.g. Jenkins pipelines, AWS cloud, terraform modular code, openai chat completions, docker compose local setup"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none font-mono text-xs"
                    />
                    <span className="text-[10px] text-slate-500">The generator uses this context to formulate specific tools and libraries in the bullet outputs.</span>
                  </div>

                  {/* Impact Focus categories */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5" id="impact-label">Preferred Key Metric Impact</label>
                    <div className="flex flex-wrap gap-1.5" id="impact-badges-container">
                      {['Speed & Efficiency', 'Quality & Reliability', 'Cost & Optimization', 'Innovation & Value'].map((focus) => (
                        <button
                          key={focus}
                          type="button"
                          onClick={() => handleFocusToggle(focus)}
                          className={`px-2.5 py-1.5 text-xs font-medium rounded-full transition-all border ${selectedFocus.includes(focus) ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'bg-slate-950 text-slate-500 border-slate-900 hover:border-slate-800'}`}
                          id={`focus-badge-${focus.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}`}
                        >
                          {focus}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-4">
                  {/* Score Diagnostics */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2" id="score-diagnostics">
                    <h4 className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                      Calculated Profile Mastery
                    </h4>
                    
                    <div className="space-y-2 pt-1">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-400">DevOps Domain Index</span>
                          <span className="font-bold text-slate-200">{devopsScore}% ({getDimensionLevel(devopsScore)})</span>
                        </div>
                        <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-300" 
                            style={{ width: `${devopsScore}%` }}
                            id="devops-progress-bar"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-400">AI Domain Index</span>
                          <span className="font-bold text-slate-200">{aiScore}% ({getDimensionLevel(aiScore)})</span>
                        </div>
                        <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300" 
                            style={{ width: `${aiScore}%` }}
                            id="ai-progress-bar"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={triggerMetricsGeneration}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all duration-200 shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    id="generate-metrics-button"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                        Engineering Custom Metrics...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Professional Metrics
                      </>
                    )}
                  </button>
                  {isDemo && (
                    <p className="text-[10px] text-amber-400 text-center bg-amber-400/5 py-1 px-2 rounded-lg border border-amber-400/10">
                      Using high-fidelity offline system templates.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Hand: Assessment Questionnaire (Tabular Dimensions) */}
            <div className="lg:col-span-2 space-y-6" id="assessment-panel">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-2">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-emerald-400" />
                      Mastery Diagnostics Questionnaire
                    </h2>
                    <p className="text-xs text-slate-400">Answer the questions to rate your capability levels. Your scores instantly calibrate the metric outcomes.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setAnswers({
                        cicd: 50, iac: 50, cloud: 50, observability: 50, devsecops: 50,
                        genai_llms: 50, rag_vectors: 50, agents: 50, ai_app_dev: 50, mlops: 50,
                      });
                    }}
                    className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 bg-slate-950 py-1 px-2.5 rounded-lg border border-slate-800 transition"
                    id="reset-survey-btn"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Answers
                  </button>
                </div>

                <div className="space-y-8" id="assessment-questions-list">
                  
                  {/* Category DevOps */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4 bg-sky-950/20 py-1.5 px-3 rounded-xl border border-sky-900/30">
                      <Network className="w-4 h-4 text-sky-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-300">Section A: DevOps & Delivery Infrastructure</span>
                    </div>

                    <div className="space-y-6">
                      {assessmentQuestions.filter(q => q.domain === 'DevOps').map((q) => {
                        const currentDim = skillDimensions.find(d => d.id === q.dimensionId);
                        const currentVal = answers[q.dimensionId] || 25;
                        return (
                          <div key={q.id} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-slate-700/80 transition-all duration-200" id={`question-card-${q.id}`}>
                            <div className="flex justify-between items-start gap-4 mb-2">
                              <div>
                                <h4 className="text-xs font-bold text-slate-200">{currentDim?.name}</h4>
                                <p className="text-[11px] text-slate-400 mt-0.5">{q.question}</p>
                              </div>
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                currentVal <= 25 ? 'bg-red-500/10 text-red-400' :
                                currentVal <= 50 ? 'bg-amber-500/10 text-amber-400' :
                                currentVal <= 75 ? 'bg-sky-500/10 text-sky-400' :
                                'bg-emerald-500/10 text-emerald-400'
                              }`}>
                                {currentVal}% - {getDimensionLevel(currentVal)}
                              </span>
                            </div>

                            {/* Multiple choice selection items */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3" id={`options-${q.id}`}>
                              {q.options.map((opt) => {
                                const isSelected = currentVal === opt.score;
                                return (
                                  <button
                                    key={opt.score}
                                    type="button"
                                    onClick={() => handleSelectOption(q.dimensionId, opt.score)}
                                    className={`text-left p-2.5 rounded-lg border text-xs transition duration-150 flex flex-col justify-between ${
                                      isSelected 
                                        ? 'bg-sky-950/30 border-sky-500 text-slate-100 shadow-sm' 
                                        : 'bg-slate-900/30 border-slate-800 text-slate-400 hover:bg-slate-900 hover:border-slate-700 hover:text-slate-200'
                                    }`}
                                    id={`opt-${q.id}-${opt.score}`}
                                  >
                                    <div className="flex items-center justify-between w-full mb-1">
                                      <span className="font-semibold text-slate-200 text-[11px]">{opt.label}</span>
                                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                                    </div>
                                    <p className="text-[10px] leading-relaxed text-slate-400">{opt.description}</p>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category AI */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4 bg-emerald-950/20 py-1.5 px-3 rounded-xl border border-emerald-900/30">
                      <Brain className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Section B: Generative AI & Integration</span>
                    </div>

                    <div className="space-y-6">
                      {assessmentQuestions.filter(q => q.domain === 'AI').map((q) => {
                        const currentDim = skillDimensions.find(d => d.id === q.dimensionId);
                        const currentVal = answers[q.dimensionId] || 25;
                        return (
                          <div key={q.id} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-slate-700/80 transition-all duration-200" id={`question-card-${q.id}`}>
                            <div className="flex justify-between items-start gap-4 mb-2">
                              <div>
                                <h4 className="text-xs font-bold text-slate-200">{currentDim?.name}</h4>
                                <p className="text-[11px] text-slate-400 mt-0.5">{q.question}</p>
                              </div>
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                currentVal <= 25 ? 'bg-red-500/10 text-red-400' :
                                currentVal <= 50 ? 'bg-amber-500/10 text-amber-400' :
                                currentVal <= 75 ? 'bg-teal-500/10 text-teal-400' :
                                'bg-emerald-500/10 text-emerald-400'
                              }`}>
                                {currentVal}% - {getDimensionLevel(currentVal)}
                              </span>
                            </div>

                            {/* Multiple choice selection items */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3" id={`options-${q.id}`}>
                              {q.options.map((opt) => {
                                const isSelected = currentVal === opt.score;
                                return (
                                  <button
                                    key={opt.score}
                                    type="button"
                                    onClick={() => handleSelectOption(q.dimensionId, opt.score)}
                                    className={`text-left p-2.5 rounded-lg border text-xs transition duration-150 flex flex-col justify-between ${
                                      isSelected 
                                        ? 'bg-emerald-950/30 border-emerald-500 text-slate-100 shadow-sm' 
                                        : 'bg-slate-900/30 border-slate-800 text-slate-400 hover:bg-slate-900 hover:border-slate-700 hover:text-slate-200'
                                    }`}
                                    id={`opt-${q.id}-${opt.score}`}
                                  >
                                    <div className="flex items-center justify-between w-full mb-1">
                                      <span className="font-semibold text-slate-200 text-[11px]">{opt.label}</span>
                                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                                    </div>
                                    <p className="text-[10px] leading-relaxed text-slate-400">{opt.description}</p>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Bottom triggering call to action */}
                <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={triggerMetricsGeneration}
                    disabled={loading}
                    className="py-3 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition duration-150 shadow-md flex items-center gap-2 cursor-pointer"
                    id="submit-profile-btn"
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                        Engineering Metrics...
                      </>
                    ) : (
                      <>
                        Generate Custom Metrics
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: GENERATED METRICS WORKSPACE */}
        {activeTab === 'metrics' && (
          <div className="space-y-6" id="metrics-view">
            
            {/* Action controls header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl gap-4" id="metrics-actions-bar">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Your Quantitative Accomplishments Draft
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Customize, edit context, or add manual accomplishments below before copying.</p>
              </div>

              <div className="flex items-center space-x-2 self-start sm:self-center" id="metrics-toolbox">
                <button
                  onClick={handleAddCustomMetric}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1"
                  id="add-custom-metric-btn"
                >
                  <Plus className="w-3.5 h-3.5" /> New Metric
                </button>
                
                <button
                  onClick={copyAllMarkdown}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  id="copy-all-markdown-btn"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy All (Markdown)
                </button>
              </div>
            </div>

            {/* Main Draft list */}
            {userMetrics.length === 0 ? (
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-12 text-center max-w-lg mx-auto" id="no-metrics-state">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-200">No Drafted Metrics</h3>
                <p className="text-xs text-slate-400 mt-2">
                  Run the <strong>Skill Profiler</strong> generator tool or add standard metrics to build your personal performance portfolio.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <button 
                    onClick={() => setActiveTab('assess')}
                    className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-semibold rounded-lg hover:bg-emerald-400 transition"
                  >
                    Go to Profiler
                  </button>
                  <button 
                    onClick={() => setUserMetrics([
                      {
                        title: "CI/CD Deployment Optimization",
                        metric: "Architected modern multi-environment release pipelines using GitHub Actions, enabling zero-downtime production deployments and improving cycle efficiency by 65%.",
                        domain: "DevOps",
                        impactCategory: "Speed & Efficiency",
                        rationale: "Shows expertise in automated integration and rapid release execution."
                      }
                    ])}
                    className="px-4 py-2 bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-750 border border-slate-700 transition"
                  >
                    Load Default Metric
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4" id="metrics-draft-cards">
                {userMetrics.map((item, idx) => {
                  const isEditing = editingMetricIndex === idx;
                  const isRationaleExpanded = expandedRationales[idx] || false;
                  
                  return (
                    <div 
                      key={idx} 
                      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-150"
                      id={`metric-draft-card-${idx}`}
                    >
                      <div className="p-5 flex flex-col md:flex-row items-start justify-between gap-4">
                        
                        {/* Bullet detail content */}
                        <div className="space-y-3 flex-1 w-full">
                          
                          {/* Badge headers */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                              Accomplishment #{idx + 1}
                            </span>
                            
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              item.domain === 'DevOps' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/10' :
                              item.domain === 'AI' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' :
                              'bg-indigo-500/10 text-indigo-400 border border-indigo-500/10'
                            }`}>
                              {item.domain}
                            </span>

                            <span className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800">
                              {item.impactCategory}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                              {item.title}
                            </h3>
                          </div>

                          {/* Editable Box */}
                          {isEditing ? (
                            <div className="space-y-2 mt-2">
                              <textarea
                                value={editBuffer}
                                onChange={(e) => setEditBuffer(e.target.value)}
                                rows={3}
                                className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono leading-relaxed focus:outline-none focus:border-emerald-500 transition-colors"
                              />
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => setEditingMetricIndex(null)}
                                  className="px-2.5 py-1 text-[10px] text-slate-400 hover:text-slate-200 transition"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveEdit(idx)}
                                  className="px-2.5 py-1 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-md transition"
                                >
                                  Save Change
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl relative group">
                              <p className="text-xs text-slate-200 leading-relaxed font-mono select-all">
                                {item.metric}
                              </p>
                              
                              <button
                                onClick={() => handleStartEditing(idx, item.metric)}
                                className="absolute right-2 bottom-2 p-1.5 bg-slate-900 border border-slate-800 rounded-md text-slate-400 hover:text-slate-100 opacity-0 group-hover:opacity-100 transition duration-150"
                                title="Edit this bullet"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          {/* How to defend coaching box */}
                          <div className="pt-2">
                            <button
                              onClick={() => toggleRationale(idx)}
                              className="text-[11px] text-slate-400 hover:text-emerald-400 font-medium flex items-center gap-1 transition"
                            >
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isRationaleExpanded ? 'rotate-185' : ''}`} />
                              {isRationaleExpanded ? "Hide interview strategy" : "Show coaching strategy (How to defend this in reviews)"}
                            </button>
                            
                            {isRationaleExpanded && (
                              <div className="mt-2 p-3 bg-slate-950 rounded-xl border border-slate-850 text-[11px] text-slate-300 leading-relaxed space-y-1 animate-fadeIn">
                                <span className="font-semibold text-emerald-400 text-[10px] block uppercase tracking-wider">Coach Interview Rationale:</span>
                                <p>{item.rationale || "Ensure you reference the repository context, explain how you determined the percentage improvements, and note down the test frameworks you set up."}</p>
                              </div>
                            )}
                          </div>

                        </div>

                        {/* Action buttons (Right) */}
                        <div className="flex sm:flex-col items-center gap-1.5 self-stretch justify-end shrink-0" id={`metric-item-actions-${idx}`}>
                          <button
                            onClick={() => copyToClipboard(item.metric, idx)}
                            className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition flex items-center gap-1.5 text-xs w-full justify-center"
                            title="Copy metric statement"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-[10px] text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="text-[10px]">Copy</span>
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleStartEditing(idx, item.metric)}
                            className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition flex items-center gap-1.5 text-xs w-full justify-center"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteMetric(idx)}
                            className="p-2 bg-slate-950 hover:bg-red-950/20 text-slate-500 hover:text-red-400 rounded-xl border border-slate-800 hover:border-red-500/20 transition flex items-center gap-1.5 text-xs w-full justify-center"
                            title="Remove accomplishment"
                          >
                            <Trash className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Remove</span>
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Coaching Note */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6" id="coaching-advisory">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">💡 Tips on adopting simulated metrics in performance reviews</h3>
              <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
                <li><strong className="text-slate-300">Scale proportionately</strong>: If your project didn't have 12 microservices, modify the text to "2 services" using the <strong className="text-slate-300">Edit</strong> button. Always maintain realistic bounds!</li>
                <li><strong className="text-slate-300">Explain the measurement method</strong>: When asked how you measured the percentages (e.g., 60% pipeline speedup), say you calculated the average deployment minutes on GitHub actions before and after your upgrades.</li>
                <li><strong className="text-slate-300">Use standard deviations</strong>: It is much more believable to say "45% reduction" than "100% reduction". Keep standard margins of error in mind.</li>
              </ul>
            </div>

          </div>
        )}

        {/* TAB 3: INSTANT TEMPLATE PRESETS */}
        {activeTab === 'templates' && (
          <div className="space-y-6" id="templates-view">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-emerald-400" />
                Urgent High-Fidelity Blueprint Presets
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                If you have zero metrics ready and need high-impact examples instantly, choose one of these pre-designed profiles. They correspond directly to actual industry accomplishments and roles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="templates-grid">
              {INSTANT_TEMPLATES.map((tpl, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between space-y-4" id={`template-card-${i}`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-950 text-emerald-400 border border-slate-800">
                        {tpl.role}
                      </span>
                      <span className="text-xs text-slate-500 font-mono font-medium">{tpl.seniority}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-100">{tpl.name}</h3>
                    
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-1">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Included Stack Focus</span>
                      <p className="text-xs text-slate-300 font-mono">{tpl.focus}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono font-bold">Preview accomplishments:</span>
                      {tpl.metrics.map((m, mIdx) => (
                        <div key={mIdx} className="text-xs bg-slate-950/30 p-2.5 rounded-lg border border-slate-850">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-slate-300 text-[11px]">{m.title}</span>
                            <span className="text-[9px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-400">{m.domain}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-mono">{m.metric}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleLoadTemplate(tpl)}
                    className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Adopt This Profile & Load Metrics <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CAREER DEVELOPMENT GUIDE */}
        {activeTab === 'docs' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6" id="guide-view">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                DevOps and AI Mastery Integration Guide
              </h2>
              <p className="text-xs text-slate-400">Understanding how DevOps metrics and Generative AI personal development intertwine for maximum career impact.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="guide-topics-grid">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-sky-400 flex items-center gap-1.5">
                  <Network className="w-4 h-4" /> The DevOps Hierarchy
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  DevOps is fundamentally about removing friction in the software supply chain. When crafting metrics, always structure them around the 4 core DORA metrics:
                </p>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <strong className="text-slate-300">Deployment Frequency</strong>
                    <span className="text-slate-400">How often you ship code</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <strong className="text-slate-300">Lead Time for Changes</strong>
                    <span className="text-slate-400">Commit to production duration</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <strong className="text-slate-300">Mean Time to Restore (MTTR)</strong>
                    <span className="text-slate-400">Duration to resolve a production outage</span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="text-slate-300">Change Failure Rate</strong>
                    <span className="text-slate-400">Percentage of deployments failing</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <Brain className="w-4 h-4" /> The GenAI Innovation Stack
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Adding AI mastery to your developer toolkit represents a major career multiplier. Metrics in AI shouldn't just be "used ChatGPT". High-impact AI metrics describe:
                </p>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-200 block">Structured Integrations (JSON Schema)</span>
                    <p className="text-[11px] text-slate-400">Enforcing strict schemas on Gemini outputs so the results don't break backend endpoints.</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200 block">Retrieval Augmentation (RAG)</span>
                    <p className="text-[11px] text-slate-400">Integrating local Vector Databases like pgvector to retrieve custom enterprise knowledge dynamically.</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200 block">Stateful Agents & Tool Execution</span>
                    <p className="text-[11px] text-slate-400">Allowing models to call custom registered functions (APIs, Database Queries) safely to solve tasks autonomously.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800" id="guide-formula-box">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">⭐ The Golden Accomplishment Formula</h3>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 flex flex-wrap justify-center items-center gap-3">
                <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300 font-bold">Action Verb</span>
                <span>+</span>
                <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300 font-bold">Technical Project / Tool</span>
                <span>+</span>
                <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-emerald-300 font-bold">Measurable Quantitative Outcome</span>
              </div>
              <p className="text-xs text-slate-400 mt-3 text-center">
                Example: "<strong>Optimized</strong> cloud server hosting with <strong>Terraform & Kubernetes</strong>, reducing compute spend by <strong>35%</strong> while boosting deployment velocity."
              </p>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 mt-12 text-center text-xs text-slate-500" id="app-footer">
        <div className="max-w-7xl mx-auto px-6 space-y-2">
          <p>© 2026 DevOps and AI Mastery Engine. Built using TypeScript, Express, and Gemini AI.</p>
          <p className="text-[11px]">Crafted with exceptional care to help developers secure promotions, excel in performance assessments, and master software delivery pipelines.</p>
        </div>
      </footer>

    </div>
  );
}
