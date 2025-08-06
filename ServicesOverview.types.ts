export interface ServicesOverviewProps {
  className?: string;
  sectionTitle?: string;
  onServiceCTA?: (serviceId: string) => void;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  ctaText: string;
  icon: string;
  features: string[];
}

export interface ServicesOverviewContent {
  sectionTitle: string;
  services: Service[];
}