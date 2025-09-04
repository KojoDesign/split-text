export type ElementOrSelector =
  | Element
  | Element[]
  | NodeListOf<Element>
  | string;

export interface WithQuerySelectorAll {
  querySelectorAll: Element["querySelectorAll"];
}

export interface AnimationScope<
  T extends WithQuerySelectorAll = WithQuerySelectorAll
> {
  readonly current: T;
}

export interface SelectorCache {
  [key: string]: NodeListOf<Element>;
}

export interface ClassNames {
  word?: string;
  line?: string;
  char?: string;
}

export interface SplitTextOptions {
  splitBy?: string;
  classNames?: ClassNames;
  inline?: boolean;
}
