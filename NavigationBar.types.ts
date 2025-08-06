export interface NavigationBarProps {
  className?: string;
  onLogoClick?: () => void;
  onPricingClick?: () => void;
  onAboutClick?: () => void;
  onCTAClick?: () => void;
  onRoadmapClick?: () => void;
  logoText?: string;
  ctaText?: string;
  isFixed?: boolean;
  showMobileMenu?: boolean;
}

export interface NavigationItem {
  label: string;
  onClick: () => void;
  href?: string;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onPricingClick?: () => void;
  onAboutClick?: () => void;
  onCTAClick?: () => void;
  onRoadmapClick?: () => void;
}