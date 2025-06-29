import type {
  ElementOrSelector,
  AnimationScope,
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

/**
 * Checks if an element contains only text content (no child elements)
 */
export function isTextOnlyElement(element: Element): boolean {
  return Array.from(element.childNodes).every(
    (node) => node.nodeType === Node.TEXT_NODE
  );
}

/**
 * Recursively finds all elements that contain text and should be split
 * @param container The container element to search within
 * @param filter Optional callback to filter elements (return true to include, false to exclude)
 * @returns Array of elements that should be split
 */
export function findTextElements(
  container: Element,
  filter?: (node: Element) => boolean
): Element[] {
  const textElements: Element[] = [];

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: Node) => {
      const element = node as Element;

      // Apply user filter first if provided
      if (filter && !filter(element)) {
        return NodeFilter.FILTER_REJECT;
      }

      // Check if element contains only text and has non-empty content
      if (isTextOnlyElement(element) && element.textContent?.trim()) {
        return NodeFilter.FILTER_ACCEPT;
      }

      // Skip this node but continue traversing its children
      return NodeFilter.FILTER_SKIP;
    },
  });

  let currentNode = walker.nextNode();

  while (currentNode) {
    textElements.push(currentNode as Element);
    currentNode = walker.nextNode();
  }

  return textElements;
}
