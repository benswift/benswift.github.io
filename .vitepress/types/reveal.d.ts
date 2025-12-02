declare module "reveal.js" {
  interface RevealOptions {
    width?: number;
    height?: number;
    margin?: number;
    center?: boolean;
    controls?: boolean;
    transition?: string;
    history?: boolean;
    slideNumber?: boolean;
    plugins?: unknown[];
    math?: {
      mathjax?: string;
      config?: string;
    };
  }

  interface Api {
    initialize(): Promise<void>;
    destroy(): void;
    slide(h: number, v?: number, f?: number): void;
    getState(): { indexh: number; indexv: number };
  }

  export default class Reveal {
    constructor(element: HTMLElement, options?: RevealOptions);
    initialize(): Promise<void>;
    destroy(): void;
  }
}

declare module "reveal.js/plugin/math/math.esm.js" {
  const RevealMath: unknown;
  export default RevealMath;
}
