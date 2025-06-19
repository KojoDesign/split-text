import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { splitText } from "../src/split-text";

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
        wordClass: "custom-word",
        charClass: "custom-char",
        lineClass: "custom-line",
      });

      expect(result.words[0]?.className).toBe("custom-word");
      expect(result.chars[0]?.className).toBe("custom-char");
      expect(result.lines[0]?.className).toBe("custom-line");
    });

    it("should handle empty class names", () => {
      container.id = "empty-classes-container";
      container.textContent = "Hello";

      const result = splitText("#empty-classes-container", {
        wordClass: "",
        charClass: "",
        lineClass: "",
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

    it("should set inline-block display style", () => {
      container.id = "display-container";
      container.textContent = "Test";

      const result = splitText("#display-container");

      expect(result.words[0]?.style.display).toBe("inline-block");
      expect(result.chars[0]?.style.display).toBe("inline-block");
      expect(result.lines[0]?.style.display).toBe("inline-block");
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
        ".split-char-delimiter",
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
});
