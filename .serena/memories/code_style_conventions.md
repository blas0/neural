# Code Style and Conventions

## TypeScript Conventions
- Use `.tsx` extension for React components
- Use `.ts` extension for utilities and types
- Define interfaces for all component props
- Use PascalCase for component names
- Use camelCase for variables and functions

## React Patterns
- Functional components with hooks
- Props interfaces defined above component
- Default props handled with destructuring defaults
- Export default at end of file

## Styling Conventions
- Tailwind CSS utility classes
- Responsive design with mobile-first approach
- Color scheme: stone/zinc palette (stone-50 background, zinc-800 text)
- Custom fonts loaded via Google Fonts (Cormorant Garamond, IBM Plex Mono)

## File Structure
- Components can be in root directory or `/src/components/`
- Type definitions in separate `.types.ts` files
- Utilities in `/src/utils/`
- Main app logic in `/src/`

## Naming Conventions
- Component files: PascalCase (e.g., `HeroSection.tsx`)
- Type files: PascalCase with `.types.ts` suffix
- Utility files: camelCase
- CSS classes: Tailwind utility classes

## UX Principles
- Follow Laws of UX (Fitts's Law, Visual Hierarchy, Miller's Rule, Jakob's Law)
- Accessibility-first approach
- Clean, professional aesthetic
- Performance-optimized implementations