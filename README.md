# Hero Section Component

A professional, responsive React hero section component built with TypeScript and Tailwind CSS, featuring Google's Cormorant Garamond font.

## Features

- **Typography**: Google Fonts integration with Cormorant Garamond (Bold 700 italic for headers, Medium 500 for subtitles)
- **Design**: Clean off-white/cream background with dark charcoal text
- **Responsive**: Mobile-first design with optimized breakpoints
- **Accessibility**: Proper ARIA labels, keyboard navigation, and focus states
- **UX Principles**: Follows Laws of UX for optimal user experience
- **Customizable**: Flexible props for content and behavior customization

## UX Design Rationale

This component applies several Laws of UX:

1. **Fitts's Law**: Large, easily clickable CTA button with proper touch targets
2. **Visual Hierarchy**: Clear size relationships between header, subtitle, and CTA
3. **Miller's Rule**: Simple, focused content structure (3 main elements)
4. **Jakob's Law**: Familiar button styling and hover states users expect

## Installation

```bash
npm install react react-dom
npm install -D @types/react @types/react-dom tailwindcss autoprefixer postcss
```

## Usage

### Basic Implementation

```tsx
import HeroSection from './HeroSection';

function App() {
  return (
    <div>
      <HeroSection />
    </div>
  );
}
```

### Advanced Usage with Custom Content

```tsx
import HeroSection from './HeroSection';

function App() {
  const handleBookCall = () => {
    // Your booking logic here
    window.open('https://calendly.com/your-link', '_blank');
  };

  return (
    <div>
      <HeroSection
        customHeader="Your Custom Headline Here"
        customSubtitle="Your custom subtitle message."
        customCTAText="Get Started"
        onCTAClick={handleBookCall}
        className="custom-hero-styles"
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional CSS classes |
| `onCTAClick` | `() => void` | `undefined` | Custom click handler for CTA button |
| `customHeader` | `string` | `"Websites designed to capture leads"` | Custom header text |
| `customSubtitle` | `string` | `"For teams and businesses..."` | Custom subtitle text |
| `customCTAText` | `string` | `"Book a Call"` | Custom CTA button text |

## Styling

The component uses Tailwind CSS with the following color scheme:
- Background: `bg-stone-50` (off-white/cream)
- Primary text: `text-zinc-800` (dark charcoal)
- Secondary text: `text-zinc-600` (medium gray)
- CTA button: `bg-zinc-800` with hover states

## Font Loading

The component includes Google Fonts loading. For better performance, add this to your HTML head:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
```

## Responsive Breakpoints

- Mobile: Base styles
- Small (640px+): Increased text sizes
- Medium (768px+): Larger text and spacing
- Large (1024px+): Maximum text sizes and optimal spacing

## Performance Considerations

- Minimal DOM structure for fast rendering
- CSS transitions use transform properties for GPU acceleration
- Font loading optimized with `display=swap`
- Lazy hover effects to reduce initial bundle size

## Browser Support

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Mobile browsers (iOS Safari 14+, Chrome Mobile 90+)
- Graceful degradation for older browsers