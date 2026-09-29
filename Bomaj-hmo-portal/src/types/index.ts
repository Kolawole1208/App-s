// Professional type definitions for healthcare data
export interface Benefit {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'preventive' | 'diagnostic' | 'therapeutic' | 'surgical' | 'wellness';
  coverageStatus: 'covered' | 'not-covered' | 'partial' | 'prior-auth';
  coverageDetails: {
    limit?: string;
    frequency?: string;
    copay?: number;
    requiresAuthorization: boolean;
  };
  lastUpdated: Date;
}

export interface Member {
  id: string;
  memberId: string;
  name: string;
  planType: 'individual' | 'family' | 'corporate';
  effectiveDate: Date;
  deductible: {
    individual: number;
    family: number;
    met: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  metadata: {
    timestamp: string;
    version: string;
    pagination?: {
      page: number;
      totalPages: number;
      totalItems: number;
    };
  };
}