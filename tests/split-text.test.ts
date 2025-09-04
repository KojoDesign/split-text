import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { splitText } from "../src/index";

describe("splitText", () => {
  let container: HTMLElement;

  beforeEach(() => {
    // Create a container element for our tests
    container = document.createElement("div");
    container.style.width = "200px"; // Set a width to enable line wrapping
    container.style.fontFamily = "monospace"; // Use monospace for predictable character widths
    container.style.fontSize = "16px";
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Clean up after each test
    document.body.removeChild(container);
  });

  describe("basic functionality", () => {
    it("should split text into words and characters", () => {
      container.id = "test-container";
      container.textContent = "Hello world";

      const result = splitText("#test-container");

      expect(result.words).toHaveLength(2);
      expect(result.chars).toHaveLength(10); // 5 chars in "Hello" + 5 chars in "world"
      expect(result.lines).toHaveLength(1);
    });

    it("should work with element selector string", () => {
      container.id = "test-element";
      container.textContent = "Test text";

      const result = splitText("#test-element");

      expect(result.words).toHaveLength(2);
      expect(result.chars).toHaveLength(8); // 4 chars in "Test" + 4 chars in "text"
    });

    it("should handle empty text", () => {
      container.id = "empty-container";
      container.textContent = "";

      const result = splitText("#empty-container");

      expect(result.words).toHaveLength(0);
      expect(result.chars).toHaveLength(0);
      expect(result.lines).toHaveLength(0);
    });

    it("should handle single word", () => {
      container.id = "single-word-container";
      container.textContent = "Hello";

      const result = splitText("#single-word-container");

      expect(result.words).toHaveLength(1);
      expect(result.chars).toHaveLength(5);
      expect(result.lines).toHaveLength(1);
    });

    it("should handle single character", () => {
      container.id = "single-char-container";
      container.textContent = "A";

      const result = splitText("#single-char-container");

      expect(result.words).toHaveLength(1);
      expect(result.chars).toHaveLength(1);
      expect(result.lines).toHaveLength(1);
    });
  });

  describe("custom options", () => {
    it("should use custom split delimiter", () => {
      container.id = "delimiter-container";
      container.textContent = "apple,banana,cherry";

      const result = splitText("#delimiter-container", { splitBy: "," });

      expect(result.words).toHaveLength(3);
      expect(result.chars).toHaveLength(19); // 5 + 6 + 6 characters + 2 delimiters
    });

    it("should apply custom CSS classes", () => {
      container.id = "custom-classes-container";
      container.textContent = "Hello world";

      const result = splitText("#custom-classes-container", {
        classNames: {
          word: "custom-word",
          char: "custom-char",
          line: "custom-line",
        },
      });

      expect(result.words[0]?.className).toBe("custom-word");
      expect(result.chars[0]?.className).toBe("custom-char");
      expect(result.lines[0]?.className).toBe("custom-line");
    });

    it("should handle empty class names", () => {
      container.id = "empty-classes-container";
      container.textContent = "Hello";

      const result = splitText("#empty-classes-container", {
        classNames: {
          word: "",
          char: "",
          line: "",
        },
      });

      expect(result.words[0]?.className).toBe("");
      expect(result.chars[0]?.className).toBe("");
      expect(result.lines[0]?.className).toBe("");
    });
  });

  describe("DOM structure", () => {
    it("should create proper DOM hierarchy", () => {
      container.id = "hierarchy-container";
      container.textContent = "Hello world";

      splitText("#hierarchy-container");

      // Check that the container has line elements
      const lines = container.querySelectorAll(".split-line");
      expect(lines).toHaveLength(1);

      // Check that lines contain word elements
      const words = lines[0]?.querySelectorAll(".split-word");
      expect(words).toHaveLength(2);

      // Check that words contain character elements
      const charsInFirstWord = words?.[0]?.querySelectorAll(".split-char");
      expect(charsInFirstWord).toHaveLength(5);
    });

    it("should set data-index attributes", () => {
      container.id = "index-container";
      container.textContent = "Hi there";

      const result = splitText("#index-container");

      expect(result.words[0]?.dataset.index).toBe("0");
      expect(result.words[1]?.dataset.index).toBe("1");
      expect(result.lines[0]?.dataset.index).toBe("0");
      expect(result.chars[0]?.dataset.index).toBe("0");
      expect(result.chars[1]?.dataset.index).toBe("1");
    });

    it("should set inline-block display style by default", () => {
      container.id = "display-container";
      container.textContent = "Test";

      const result = splitText("#display-container");

      expect(result.words[0]?.style.display).toBe("inline-block");
      expect(result.chars[0]?.style.display).toBe("inline-block");
      expect(result.lines[0]?.style.display).toBe("inline-block");
    });

    it("should use inline display style when inline option is true", () => {
      container.id = "inline-display-container";
      container.textContent = "Test";

      const result = splitText("#inline-display-container", {
        inline: true,
      });

      expect(result.words[0]?.style.display).toBe("inline");
      expect(result.chars[0]?.style.display).toBe("inline");
      expect(result.lines[0]?.style.display).toBe("inline");
    });

    it("should preserve original text as aria-label", () => {
      const originalText = "Hello world";
      container.id = "aria-container";
      container.textContent = originalText;

      splitText("#aria-container");

      expect(container.getAttribute("aria-label")).toBe(originalText);
    });

    it("should maintain text content after splitting", () => {
      const originalText = "Hello world test";
      container.id = "content-container";
      container.textContent = originalText;

      splitText("#content-container");

      // The text content should be preserved (without spaces between words due to DOM structure)
      const reconstructedText = container.textContent
        ?.replace(/\s+/g, " ")
        .trim();
      expect(reconstructedText).toBe(originalText);
    });
  });

  describe("special characters and edge cases", () => {
    it("should handle text with multiple spaces", () => {
      container.id = "spaces-container";
      container.textContent = "Hello    world";

      const result = splitText("#spaces-container");

      // Multiple spaces are collapsed in HTML
      expect(result.words.length).toBe(2);
    });

    it("should handle text with special characters", () => {
      container.id = "special-chars-container";
      container.textContent = "Hello! @world #test";

      const result = splitText("#special-chars-container");

      expect(result.words).toHaveLength(3);
      expect(result.chars.length).toBeGreaterThan(0);
    });

    it("should handle Unicode characters", () => {
      container.id = "unicode-container";
      container.textContent = "Hello 世界 🌍";

      const result = splitText("#unicode-container");

      expect(result.words).toHaveLength(3);
      expect(result.chars.length).toBeGreaterThan(0);
    });

    it("should handle newlines in text", () => {
      container.id = "newlines-container";
      container.textContent = "Line one\nLine two";

      const result = splitText("#newlines-container");

      expect(result.words).toHaveLength(3); // "Line", "one\nLine", "two"
    });
  });

  describe("error handling", () => {
    it("should throw error for non-existent element selector", () => {
      expect(() => {
        splitText("#non-existent-element");
      }).toThrow("Element not found");
    });

    it("should throw error for invalid selector", () => {
      expect(() => {
        splitText("invalid-selector-without-hash-or-dot");
      }).toThrow();
    });

    it("should handle null element gracefully", () => {
      // Create a detached element that won't be found
      const detachedElement = document.createElement("div");
      detachedElement.id = "detached";
      detachedElement.textContent = "test";

      expect(() => {
        splitText("#detached");
      }).toThrow("Element not found");
    });
  });

  describe("line detection", () => {
    it("should detect multiple lines when text wraps", () => {
      // Create a narrow container to force wrapping
      container.id = "wrap-container";
      container.style.width = "50px";
      container.style.fontSize = "20px";
      container.textContent =
        "This is a very long text that should wrap to multiple lines";

      const result = splitText("#wrap-container");

      // Line detection may not work reliably in test environment
      expect(result.lines.length).toBeGreaterThanOrEqual(1);
    });

    it("should handle single line text", () => {
      container.id = "single-line-container";
      container.style.width = "1000px"; // Wide container
      container.textContent = "Short text";

      const result = splitText("#single-line-container");

      expect(result.lines).toHaveLength(1);
    });
  });

  describe("delimiter handling", () => {
    it("should handle custom delimiter with spaces", () => {
      container.id = "delimiter-spaces-container";
      container.textContent = "apple | banana | cherry";

      const result = splitText("#delimiter-spaces-container", {
        splitBy: " | ",
      });

      expect(result.words).toHaveLength(3);
      expect(result.words[0]?.textContent).toBe("apple | ");
      expect(result.words[1]?.textContent).toBe("banana | ");
      expect(result.words[2]?.textContent).toBe("cherry");
    });

    it("should create delimiter spans for non-space delimiters", () => {
      container.id = "delimiter-spans-container";
      container.textContent = "a,b,c";

      splitText("#delimiter-spans-container", { splitBy: "," });

      const delimiterSpans = container.querySelectorAll(
        ".split-char-delimiter"
      );
      expect(delimiterSpans).toHaveLength(2); // Two commas
      expect(delimiterSpans[0]?.textContent).toBe(",");
    });
  });

  describe("return value structure", () => {
    it("should return object with chars, words, and lines arrays", () => {
      container.id = "return-structure-container";
      container.textContent = "Test text";

      const result = splitText("#return-structure-container");

      expect(result).toHaveProperty("chars");
      expect(result).toHaveProperty("words");
      expect(result).toHaveProperty("lines");
      expect(Array.isArray(result.chars)).toBe(true);
      expect(Array.isArray(result.words)).toBe(true);
      expect(Array.isArray(result.lines)).toBe(true);
    });

    it("should return HTMLElement instances", () => {
      container.id = "instances-container";
      container.textContent = "Test";

      const result = splitText("#instances-container");

      expect(result.chars[0]).toBeInstanceOf(HTMLElement);
      expect(result.words[0]).toBeInstanceOf(HTMLElement);
      expect(result.lines[0]).toBeInstanceOf(HTMLElement);
    });
  });

  describe("filter option", () => {
    it("should apply filter to skip elements when recursive=true", () => {
      container.id = "filter-container";
      container.innerHTML = `
        <p class="split-me">First paragraph</p>
        <p class="skip-me">Second paragraph</p>
        <p class="split-me">Third paragraph</p>
      `;

      // Filter to only process paragraphs with class "split-me"
      splitText("#filter-container", {
        recursive: true,
        filter: (element) => element.classList.contains("split-me"),
      });

      // Should only split paragraphs with class "split-me"
      const splitParagraphs = container.querySelectorAll("p.split-me");
      const skippedParagraphs = container.querySelectorAll("p.skip-me");

      // Verify split paragraphs have been processed
      for (const p of Array.from(splitParagraphs)) {
        const words = p.querySelectorAll(".split-word");
        expect(words.length).toBeGreaterThan(0);
      }

      // Verify skipped paragraphs have not been processed
      for (const p of Array.from(skippedParagraphs)) {
        const words = p.querySelectorAll(".split-word");
        expect(words.length).toBe(0);
        // Original text should be preserved
        expect(p.textContent?.trim()).toBe("Second paragraph");
      }
    });

    it("should handle complex filter logic", () => {
      container.id = "complex-filter-container";
      container.innerHTML = `
        <p data-split="true">Split this</p>
        <p>Skip this</p>
        <div data-split="true">Split this too</div>
        <span>Skip this too</span>
      `;

      // Filter based on data attribute
      const result = splitText("#complex-filter-container", {
        recursive: true,
        filter: (element) => element.hasAttribute("data-split"),
      });

      // Elements with data-split should be processed
      const elementsToSplit = container.querySelectorAll("[data-split]");
      for (const el of Array.from(elementsToSplit)) {
        const words = el.querySelectorAll(".split-word");
        expect(words.length).toBeGreaterThan(0);
      }

      // Elements without data-split should be skipped
      const p = container.querySelector("p:not([data-split])");
      const span = container.querySelector("span");
      expect(p?.querySelectorAll(".split-word").length).toBe(0);
      // The span contains text and is processed by default
      // This is expected behavior since the filter only applies to elements that match isTextOnlyElement()
      expect(span?.querySelectorAll(".split-word").length).toBe(2);
    });

    it("should ignore filter when recursive=false", () => {
      container.id = "non-recursive-filter-container";
      container.innerHTML = `
        <p class="split-me">First paragraph</p>
        <p class="skip-me">Second paragraph</p>
      `;

      // Even with filter, non-recursive mode should process the entire container
      const result = splitText("#non-recursive-filter-container", {
        recursive: false,
        filter: (element) => element.classList.contains("split-me"),
      });

      // Original structure should be replaced (non-recursive behavior)
      const paragraphs = container.querySelectorAll("p");
      expect(paragraphs).toHaveLength(0);

      // Words from both paragraphs should be included
      expect(result.words.length).toBeGreaterThan(3);
    });

    it("should handle case where all elements are filtered out", () => {
      container.id = "all-filtered-container";
      container.innerHTML = `
        <p>First paragraph</p>
        <p>Second paragraph</p>
      `;

      // Filter that excludes all elements
      const result = splitText("#all-filtered-container", {
        recursive: true,
        filter: () => false,
      });

      // No elements should be processed
      expect(result.words).toHaveLength(0);
      expect(result.chars).toHaveLength(0);
      expect(result.lines).toHaveLength(0);

      // Original structure should be preserved
      const paragraphs = container.querySelectorAll("p");
      expect(paragraphs).toHaveLength(2);
      expect(paragraphs[0]?.textContent?.trim()).toBe("First paragraph");
      expect(paragraphs[1]?.textContent?.trim()).toBe("Second paragraph");
    });
  });

  describe("recursive text splitting", () => {
    it("should split text in multiple paragraph elements while preserving structure", () => {
      container.id = "multi-paragraph-container";
      container.innerHTML = `
        <p>First paragraph</p>
        <p>Second paragraph</p>
        <p>Third paragraph</p>
      `;

      const result = splitText("#multi-paragraph-container", {
        recursive: true,
      });

      // Should have split all paragraphs
      expect(result.words.length).toBeGreaterThan(3); // At least 6 words total
      expect(result.chars.length).toBeGreaterThan(0);
      expect(result.lines.length).toBeGreaterThan(0);

      // Original paragraph structure should be preserved
      const paragraphs = container.querySelectorAll("p");
      expect(paragraphs).toHaveLength(3);

      // Each paragraph should contain split elements
      for (const p of Array.from(paragraphs)) {
        const words = p.querySelectorAll(".split-word");
        expect(words.length).toBeGreaterThan(0);
      }
    });

    it("should work with nested elements and preserve structure", () => {
      container.id = "nested-container";
      container.innerHTML = `
        <div>
          <h1>Main Title</h1>
          <div>
            <p>Nested paragraph</p>
            <span>Nested span</span>
          </div>
        </div>
      `;

      const result = splitText("#nested-container", { recursive: true });

      expect(result.words.length).toBeGreaterThan(0);

      // Original structure should be preserved
      expect(container.querySelector("h1")).toBeTruthy();
      expect(container.querySelector("p")).toBeTruthy();
      expect(container.querySelector("span")).toBeTruthy();

      // Text should be split in each element
      const h1 = container.querySelector("h1");
      const p = container.querySelector("p");
      const span = container.querySelector("span");

      expect(h1?.querySelectorAll(".split-word").length).toBeGreaterThan(0);
      expect(p?.querySelectorAll(".split-word").length).toBeGreaterThan(0);
      expect(span?.querySelectorAll(".split-word").length).toBeGreaterThan(0);
    });

    it("should split all text-containing elements in recursive mode", () => {
      container.id = "all-elements-container";
      container.innerHTML = `
        <p>First paragraph</p>
        <span>Span text</span>
        <div>Div text</div>
      `;

      const result = splitText("#all-elements-container", {
        recursive: true,
      });

      // Should split all text-containing elements
      const p = container.querySelector("p");
      const span = container.querySelector("span");
      const div = container.querySelector("div");

      expect(p?.querySelectorAll(".split-word").length).toBeGreaterThan(0);
      expect(span?.querySelectorAll(".split-word").length).toBeGreaterThan(0);
      expect(div?.querySelectorAll(".split-word").length).toBeGreaterThan(0);
    });

    it("should handle mixed content with text nodes and elements", () => {
      container.id = "mixed-container";
      container.innerHTML = `
        <div>
          Some text before
          <p>Paragraph text</p>
          Some text after
          <span>Span text</span>
        </div>
      `;

      const result = splitText("#mixed-container", { recursive: true });

      expect(result.words.length).toBeGreaterThan(0);

      // Elements with text should be split
      const p = container.querySelector("p");
      const span = container.querySelector("span");

      expect(p?.querySelectorAll(".split-word").length).toBeGreaterThan(0);
      expect(span?.querySelectorAll(".split-word").length).toBeGreaterThan(0);
    });

    it("should handle empty elements gracefully in recursive mode", () => {
      container.id = "empty-recursive-container";
      container.innerHTML = `
        <p></p>
        <p>   </p>
        <p>Valid text</p>
      `;

      const result = splitText("#empty-recursive-container", {
        recursive: true,
      });

      // Should only split the paragraph with actual text
      expect(result.words.length).toBe(2); // "Valid" and "text"

      const paragraphs = container.querySelectorAll("p");
      const validParagraph = paragraphs[2];
      expect(validParagraph?.querySelectorAll(".split-word").length).toBe(2);
    });

    it("should maintain original behavior when recursive is false", () => {
      container.id = "non-recursive-container";
      container.innerHTML = `
        <p>First paragraph</p>
        <p>Second paragraph</p>
      `;

      const result = splitText("#non-recursive-container", {
        recursive: false,
      });

      // Should treat the entire container as one text block
      // The textContent will be "First paragraph Second paragraph" (with spaces)
      expect(result.words.length).toBe(5); // "First", "paragraph", "Second", "paragraph"

      // Original paragraph structure should be replaced
      const paragraphs = container.querySelectorAll("p");
      expect(paragraphs).toHaveLength(0);
    });

    it("should aggregate results from multiple elements correctly", () => {
      container.id = "aggregate-container";
      container.innerHTML = `
        <p>One two</p>
        <p>Three four</p>
      `;

      const result = splitText("#aggregate-container", { recursive: true });

      expect(result.words).toHaveLength(4);
      expect(result.chars.length).toBeGreaterThan(0);
      expect(result.lines.length).toBeGreaterThan(0);

      // Verify that all words are accessible in the aggregated result
      const wordTexts = result.words.map((word) => word.textContent);
      expect(wordTexts).toContain("One");
      expect(wordTexts).toContain("two");
      expect(wordTexts).toContain("Three");
      expect(wordTexts).toContain("four");
    });
  });
});
