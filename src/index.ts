import { splitter } from "./splitter";
import type { SplitTextOptions } from "./types";
import { findTextElements, resolveElements } from "./utils";

/**
 * Splits text content of an element into characters, words, and lines.
 *
 * @param elementOrSelector - The element or selector of the element to split. If multiple elements are found, only the first will be split.
 * @param options - Options.
 * @returns An object with the chars, words, and lines DOM nodes as lists.
 */
export function splitText(
  elementOrSelector: HTMLElement | string,
  {
    splitBy = " ",
    wordClass = "split-word",
    lineClass = "split-line",
    charClass = "split-char",
    recursive = false,
  }: SplitTextOptions = {},
) {
  // Resolve the element
  const [element] = resolveElements(elementOrSelector);

  if (!element) {
    throw new Error("Element not found");
  }

  if (!recursive) {
    // Original behavior - split the entire element's text content
    return splitter(element, {
      splitBy,
      wordClass,
      lineClass,
      charClass,
    });
  }

  // Recursive behavior - find and split text-containing elements while preserving structure
  const textElements = findTextElements(element);

  // Aggregate results from all split elements
  const aggregatedResults = {
    chars: [] as HTMLElement[],
    words: [] as HTMLElement[],
    lines: [] as HTMLElement[],
  };

  for (const textElement of textElements) {
    const result = splitter(textElement, {
      splitBy,
      wordClass,
      lineClass,
      charClass,
    });

    aggregatedResults.chars.push(...result.chars);
    aggregatedResults.words.push(...result.words);
    aggregatedResults.lines.push(...result.lines);
  }

  return aggregatedResults;
}
