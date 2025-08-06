export interface OverviewOfServicesProps {
  className?: string;
  sectionTitle?: string;
  onLearnMore?: () => void;
}

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
}

export interface OverviewOfServicesContent {
  sectionTitle: string;
  serviceCards: ServiceCard[];
}