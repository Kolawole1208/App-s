export interface SkillScore {
  category: string;
  score: number; // 0 to 100
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
}

export interface SkillDimension {
  id: string;
  name: string;
  domain: 'DevOps' | 'AI';
  description: string;
  concepts: string[];
}

export interface MetricItem {
  id: string;
  title: string;
  metric: string; // The quantitative metric statement (e.g., "Implemented GitLab CI/CD pipelines reducing deployment times by 45%")
  domain: 'DevOps' | 'AI' | 'Hybrid';
  impactCategory: 'Speed & Efficiency' | 'Quality & Reliability' | 'Cost & Optimization' | 'Innovation & Value';
  context: string; // The original prompt or situation
  approved: boolean;
}

export interface AssessmentQuestion {
  id: string;
  dimensionId: string;
  question: string;
  domain: 'DevOps' | 'AI';
  options: {
    score: number;
    label: string;
    description: string;
  }[];
}
