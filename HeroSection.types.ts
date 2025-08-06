export interface HeroSectionProps {
  className?: string;
  onCTAClick?: () => void;
  customHeader?: string;
  customSubtitle?: string;
  customCTAText?: string;
}

export interface HeroSectionContent {
  header: string;
  subtitle: string;
  ctaText: string;
}