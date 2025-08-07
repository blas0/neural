declare module 'react-dom' {
  export function createPortal(children: React.ReactNode, container: Element | null): React.ReactPortal | null;
  export * from 'react-dom/index';
}

declare module 'react-dom/client' {
  export interface Root {
    render(children: React.ReactChild | React.ReactFragment | React.ReactPortal | boolean | null | undefined): void;
    unmount(): void;
  }
  export function createRoot(container: Element | null): Root;
  export * from 'react-dom/client/index';
}