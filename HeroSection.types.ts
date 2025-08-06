export interface HeroSectionProps {
  className?: string;
  onCTAClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  customHeader?: string;
  customSubtitle?: string;
  customCTAText?: string;
}

export interface HeroSectionContent {
  header: string;
  subtitle: string;
  ctaText: string;
}