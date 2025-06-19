import type {
  ElementOrSelector,
  AnimationScope,
  SelectorCache,
  WithQuerySelectorAll,
} from "./types";

export function resolveElements(
  elementOrSelector: ElementOrSelector,
  scope?: AnimationScope,
  selectorCache?: SelectorCache,
): Element[] {
  if (elementOrSelector instanceof EventTarget) {
    return [elementOrSelector];
  }

  if (typeof elementOrSelector === "string") {
    let root: WithQuerySelectorAll = document;

    if (scope) {
      root = scope.current;
    }

    const elements =
      selectorCache?.[elementOrSelector] ??
      root.querySelectorAll(elementOrSelector);

    return elements ? Array.from(elements) : [];
  }

  return Array.from(elementOrSelector);
}
