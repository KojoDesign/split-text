import { splitter } from "./splitter";
import type { SplitTextOptions } from "./types";
import { resolveElements } from "./utils";

/**
 * Splits text content of an element into characters, words, and lines.
 *
 * @param elementOrSelector - The element or selector of the element to split. If multiple elements are found, only the first will be split.
 * @param options - Options.
 * @param options.splitBy - The string to split by. Default is space.
 * @param options.classNames - Object containing class names for different elements.
 * @param options.classNames.word - The class to apply to word elements. Default is "split-word".
 * @param options.classNames.line - The class to apply to line elements. Default is "split-line".
 * @param options.classNames.char - The class to apply to character elements. Default is "split-char".
 * @param options.inline - Whether to use 'inline' instead of 'inline-block' for display style. Default is false.
 * @returns An object with the chars, words, and lines DOM nodes as lists.
 */
export function splitText(
  elementOrSelector: HTMLElement | string,
  { splitBy = " ", classNames = {}, inline }: SplitTextOptions = {}
) {
  const [element] = resolveElements(elementOrSelector);

  if (!element) {
    throw new Error("Element not found");
  }

  return splitter(element, { splitBy, classNames, inline });
}
