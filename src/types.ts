export type ElementOrSelector =
  | Element
  | Element[]
  | NodeListOf<Element>
  | string;

export interface WithQuerySelectorAll {
  querySelectorAll: Element["querySelectorAll"];
}

export interface AnimationScope<T = any> {
  readonly current: T;
}

export interface SelectorCache {
  [key: string]: NodeListOf<Element>;
}

export interface SplitTextOptions {
  splitBy?: string;
  charClass?: string;
  wordClass?: string;
  lineClass?: string;
}
