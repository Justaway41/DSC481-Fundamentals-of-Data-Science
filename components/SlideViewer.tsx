import React, { useState, useEffect, useCallback } from "react";

interface SlideViewerProps {
  markdown: string;
  onExitPresentation?: () => void;
}

const SlideViewer: React.FC<SlideViewerProps> = ({
  markdown,
  onExitPresentation,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<string[]>([]);

  // Parse markdown into individual slides
  useEffect(() => {
    // Remove frontmatter
    let content = markdown.replace(/^---[\s\S]*?---\n*/m, "");

    // Split by slide separator (---)
    const slideArray = content
      .split(/\n---\n/)
      .map((slide) => slide.trim())
      .filter((slide) => slide.length > 0);

    setSlides(slideArray);
    setCurrentSlide(0);
  }, [markdown]);

  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  }, [slides.length]);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentSlide(Math.max(0, Math.min(index, slides.length - 1)));
    },
    [slides.length]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        goToNextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        goToPrevSlide();
      } else if (e.key === "Escape") {
        onExitPresentation?.();
      } else if (e.key === "Home") {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goToSlide(slides.length - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    goToNextSlide,
    goToPrevSlide,
    goToSlide,
    slides.length,
    onExitPresentation,
  ]);

  // Convert markdown slide to basic HTML
  const renderSlideContent = (slideMarkdown: string) => {
    // Remove HTML comments (speaker notes)
    let content = slideMarkdown.replace(/<!--[\s\S]*?-->/g, "");

    // Simple markdown to HTML conversion
    const lines = content.split("\n");
    const htmlLines = lines.map((line) => {
      // Headers
      if (line.startsWith("# ")) {
        return `<h1 class="slide-h1">${line.slice(2)}</h1>`;
      }
      if (line.startsWith("## ")) {
        return `<h2 class="slide-h2">${line.slice(3)}</h2>`;
      }
      if (line.startsWith("### ")) {
        return `<h3 class="slide-h3">${line.slice(4)}</h3>`;
      }
      // Bold
      line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      // Italic
      line = line.replace(/\*(.*?)\*/g, "<em>$1</em>");
      // Inline code
      line = line.replace(/`([^`]+)`/g, "<code>$1</code>");
      // List items
      if (line.startsWith("- ")) {
        return `<li class="slide-li">${line.slice(2)}</li>`;
      }
      if (/^\d+\.\s/.test(line)) {
        return `<li class="slide-li-numbered">${line.replace(
          /^\d+\.\s/,
          ""
        )}</li>`;
      }
      // Empty line
      if (line.trim() === "") {
        return "<br/>";
      }
      // Regular paragraph
      return `<p class="slide-p">${line}</p>`;
    });

    return htmlLines.join("\n");
  };

  if (slides.length === 0) {
    return <div className="slide-viewer-loading">Loading slides...</div>;
  }

  return (
    <div className="slide-viewer-container">
      {/* Exit button */}
      <button
        onClick={onExitPresentation}
        className="slide-exit-btn"
        title="Exit Presentation (Esc)"
      >
        ✕
      </button>

      {/* Slide content */}
      <div className="slide-content">
        <div
          className="slide-inner"
          dangerouslySetInnerHTML={{
            __html: renderSlideContent(slides[currentSlide]),
          }}
        />
      </div>

      {/* Navigation controls */}
      <div className="slide-controls">
        <button
          onClick={goToPrevSlide}
          disabled={currentSlide === 0}
          className="slide-nav-btn"
          title="Previous (←)"
        >
          ← Previous
        </button>

        <div className="slide-counter">
          <input
            type="number"
            min={1}
            max={slides.length}
            value={currentSlide + 1}
            onChange={(e) => goToSlide(parseInt(e.target.value, 10) - 1)}
            className="slide-input"
          />
          <span className="slide-total">/ {slides.length}</span>
        </div>

        <button
          onClick={goToNextSlide}
          disabled={currentSlide === slides.length - 1}
          className="slide-nav-btn"
          title="Next (→)"
        >
          Next →
        </button>
      </div>

      {/* Progress bar */}
      <div className="slide-progress-bar">
        <div
          className="slide-progress-fill"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Keyboard hints */}
      <div className="slide-hints">
        <span>← → Navigate</span>
        <span>Esc Exit</span>
      </div>
    </div>
  );
};

export default SlideViewer;
