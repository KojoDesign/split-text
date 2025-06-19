import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { splitText } from "./split-text";

describe("splitText - Integration Tests", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.style.width = "300px";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.fontSize = "14px";
    container.style.lineHeight = "1.4";
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe("real-world scenarios", () => {
    it("should handle typical paragraph text", () => {
      container.id = "paragraph-container";
      container.textContent =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

      const result = splitText("#paragraph-container");

      expect(result.words.length).toBeGreaterThan(10);
      expect(result.chars.length).toBeGreaterThan(50);
      expect(result.lines.length).toBeGreaterThan(0);

      // Verify all words are properly wrapped in spans
      result.words.forEach((word) => {
        expect(word.tagName).toBe("SPAN");
        expect(word.className).toBe("split-word");
      });
    });

    it("should handle text with punctuation", () => {
      container.id = "punctuation-container";
      container.textContent = "Hello, world! How are you? I'm fine, thanks.";

      const result = splitText("#punctuation-container");

      // Should split on spaces, keeping punctuation with words
      expect(result.words).toHaveLength(8);
      expect(result.words[0]?.textContent).toBe("Hello,");
      expect(result.words[1]?.textContent).toBe("world!");
      expect(result.words[5]?.textContent).toBe("I'm");
    });

    it("should handle mixed content with numbers and symbols", () => {
      container.id = "mixed-content-container";
      container.textContent = "Price: $29.99 (was $39.99) - Save 25%!";

      const result = splitText("#mixed-content-container");

      expect(result.words.length).toBeGreaterThan(5);
      expect(result.chars.length).toBeGreaterThan(20);
    });

    it("should work with different languages", () => {
      container.id = "languages-container";
      container.textContent = "Bonjour le monde! Hola mundo! こんにちは世界!";

      const result = splitText("#languages-container");

      expect(result.words.length).toBeGreaterThan(5);
      expect(result.chars.length).toBeGreaterThan(15);
    });
  });

  describe("CSS class application", () => {
    it("should apply classes consistently across all elements", () => {
      container.id = "classes-container";
      container.textContent = "Test multiple words here";

      const result = splitText("#classes-container", {
        wordClass: "word-element",
        charClass: "char-element",
        lineClass: "line-element",
      });

      // Check all words have the correct class
      result.words.forEach((word) => {
        expect(word.className).toBe("word-element");
      });

      // Check all chars have the correct class
      result.chars.forEach((char) => {
        expect(char.className).toBe("char-element");
      });

      // Check all lines have the correct class
      result.lines.forEach((line) => {
        expect(line.className).toBe("line-element");
      });
    });

    it("should handle class names with special characters", () => {
      container.id = "special-class-container";
      container.textContent = "Test";

      const result = splitText("#special-class-container", {
        wordClass: "word-class_with-special.chars",
        charClass: "char-class_with-special.chars",
        lineClass: "line-class_with-special.chars",
      });

      expect(result.words[0]?.className).toBe("word-class_with-special.chars");
      expect(result.chars[0]?.className).toBe("char-class_with-special.chars");
      expect(result.lines[0]?.className).toBe("line-class_with-special.chars");
    });
  });

  describe("DOM manipulation edge cases", () => {
    it("should work with elements that have existing styles", () => {
      container.id = "styled-container";
      container.style.color = "red";
      container.style.fontWeight = "bold";
      container.style.textAlign = "center";
      container.textContent = "Styled text";

      const result = splitText("#styled-container");

      expect(result.words).toHaveLength(2);
      expect(container.style.color).toBe("red"); // Original styles should be preserved
      expect(container.style.fontWeight).toBe("bold");
    });

    it("should work with nested elements in container", () => {
      container.id = "nested-container";
      container.innerHTML = "<strong>Bold</strong> and <em>italic</em> text";

      // The function should work with the text content, ignoring HTML tags
      const result = splitText("#nested-container");

      expect(result.words).toHaveLength(4); // "Bold", "and", "italic", "text"
    });

    it("should handle elements with existing aria-label", () => {
      container.id = "aria-label-container";
      container.setAttribute("aria-label", "Original label");
      container.textContent = "New text content";

      splitText("#aria-label-container");

      expect(container.getAttribute("aria-label")).toBe("New text content");
    });
  });

  describe("performance and memory", () => {
    it("should handle large text efficiently", () => {
      const largeText = "Lorem ipsum ".repeat(100) + "final word";
      container.id = "large-text-container";
      container.textContent = largeText;

      const startTime = performance.now();
      const result = splitText("#large-text-container");
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
      expect(result.words.length).toBeGreaterThan(200);
      expect(result.chars.length).toBeGreaterThan(1000);
    });

    it("should clean up properly without memory leaks", () => {
      container.id = "cleanup-container";
      container.textContent = "Test text for cleanup";

      const result = splitText("#cleanup-container");

      // All returned elements should be properly connected to the DOM
      result.words.forEach((word) => {
        expect(word.isConnected).toBe(true);
      });

      result.chars.forEach((char) => {
        expect(char.isConnected).toBe(true);
      });

      result.lines.forEach((line) => {
        expect(line.isConnected).toBe(true);
      });
    });
  });

  describe("accessibility features", () => {
    it("should maintain accessibility with proper aria-label", () => {
      const originalText = "Accessible text content for screen readers";
      container.id = "accessibility-container";
      container.textContent = originalText;

      splitText("#accessibility-container");

      expect(container.getAttribute("aria-label")).toBe(originalText);

      // The visual text should still be readable by screen readers
      const visualText = container.textContent;
      expect(visualText?.replace(/\s+/g, " ").trim()).toBe(originalText);
    });

    it("should preserve semantic meaning after splitting", () => {
      container.id = "semantic-container";
      container.textContent = "Important announcement!";

      const result = splitText("#semantic-container");

      // Each character should still be readable
      result.chars.forEach((char) => {
        expect(char.textContent).toBeTruthy();
        expect(char.textContent?.length).toBeGreaterThan(0);
      });
    });
  });

  describe("responsive behavior", () => {
    it("should adapt to container width changes", () => {
      container.id = "responsive-container";
      container.style.width = "100px";
      container.textContent = "This is a long text that will definitely wrap";

      const result1 = splitText("#responsive-container");
      const initialLineCount = result1.lines.length;

      // Change container width and re-split
      container.style.width = "500px";
      const result2 = splitText("#responsive-container");
      const newLineCount = result2.lines.length;

      // With wider container, we should have fewer or equal lines
      expect(newLineCount).toBeLessThanOrEqual(initialLineCount);
    });
  });

  describe("custom delimiter scenarios", () => {
    it("should handle complex delimiters", () => {
      container.id = "complex-delimiter-container";
      container.textContent = "item1::item2::item3::item4";

      const result = splitText("#complex-delimiter-container", {
        splitBy: "::",
      });

      expect(result.words).toHaveLength(4);
      expect(result.words[0]?.textContent).toBe("item1::");
      expect(result.words[3]?.textContent).toBe("item4");
    });

    it("should handle delimiter at start and end", () => {
      container.id = "edge-delimiter-container";
      container.textContent = ",start,middle,end,";

      const result = splitText("#edge-delimiter-container", { splitBy: "," });

      // Empty words from leading/trailing delimiters are filtered out
      expect(result.words.length).toBe(3);
    });

    it("should handle single character delimiter", () => {
      container.id = "single-char-delimiter-container";
      container.textContent = "a|b|c|d";

      const result = splitText("#single-char-delimiter-container", {
        splitBy: "|",
      });

      expect(result.words).toHaveLength(4);
      expect(result.words[0]?.textContent).toBe("a|");
      expect(result.words[1]?.textContent).toBe("b|");
    });
  });

  describe("data attributes and indexing", () => {
    it("should provide correct indexing for all elements", () => {
      container.id = "indexing-container";
      container.textContent = "First second third";

      const result = splitText("#indexing-container");

      // Check word indices
      expect(result.words[0]?.dataset.index).toBe("0");
      expect(result.words[1]?.dataset.index).toBe("1");
      expect(result.words[2]?.dataset.index).toBe("2");

      // Check that character indices reset for each word
      const firstWordChars = result.words[0]?.querySelectorAll(".split-char");
      expect(firstWordChars?.[0]?.getAttribute("data-index")).toBe("0");
      expect(firstWordChars?.[1]?.getAttribute("data-index")).toBe("1");
    });

    it("should handle data attributes for single character words", () => {
      container.id = "single-char-word-container";
      container.textContent = "I am a test";

      const result = splitText("#single-char-word-container");

      // Single character word "I" should have proper indexing
      expect(result.words[0]?.dataset.index).toBe("0");
      expect(
        result.words[0]
          ?.querySelector(".split-char")
          ?.getAttribute("data-index"),
      ).toBe("0");
    });
  });
});
