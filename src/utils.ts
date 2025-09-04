import type {
  AnimationScope,
  ElementOrSelector,
  SelectorCache,
  WithQuerySelectorAll,
} from "./types";

export function resolveElements(
  elementOrSelector: ElementOrSelector,
  scope?: AnimationScope,
  selectorCache?: SelectorCache
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

/**
 * Creates a span element with specified class and optional index attribute
 * @param className - The class name to apply to the span
 * @param index - Optional index to set as a data attribute
 * @param inline - Whether to use 'inline' instead of 'inline-block' for display style
 * @returns The created span element
 */
export function createSpan(
  className: string,
  index?: number,
  inline?: boolean
) {
  const span = document.createElement("span");
  if (className) span.className = className;
  if (index !== undefined) span.dataset.index = index.toString();
  span.style.display = inline ? "inline" : "inline-block";
  return span;
}
