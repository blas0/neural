export interface ValuePropositionProps {
  className?: string;
  sectionTitle?: string;
  guaranteeText?: string;
  onLearnMore?: () => void;
}

export interface Differentiator {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface BeforeAfterMockup {
  beforeImage?: string;
  afterImage?: string;
  beforeTitle: string;
  afterTitle: string;
  improvementMetrics: {
    loadTime: string;
    conversionRate: string;
    mobileScore: string;
  };
}

export interface ValuePropositionContent {
  sectionTitle: string;
  differentiators: Differentiator[];
  beforeAfter: BeforeAfterMockup;
  guaranteeText: string;
}