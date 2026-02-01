import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LoreChapter as LoreChapterType } from "../types";

gsap.registerPlugin(ScrollTrigger);

interface LoreChapterProps {
  chapter: LoreChapterType;
  index: number;
}

export function LoreChapter({ chapter, index }: LoreChapterProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const media = mediaRef.current;

    if (!section || !content) return;

    // Content animation
    gsap.fromTo(
      content.children,
      {
        opacity: 0,
        y: 80,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Media parallax effect
    if (media) {
      gsap.fromTo(
        media,
        { scale: 1.2, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }
  }, []);

  const renderMedia = () => {
    if (!chapter.media) return null;

    if (chapter.media.type === "video") {
      return (
        <video
          className="chapter-video"
          src={chapter.media.url}
          poster={chapter.media.poster}
          autoPlay
          muted
          loop
          playsInline
        />
      );
    }

    return (
      <img
        className="chapter-image"
        src={chapter.media.url}
        alt={chapter.media.alt || chapter.title}
        loading="lazy"
      />
    );
  };

  return (
    <section
      ref={sectionRef}
      className={`lore-chapter lore-chapter--${chapter.type}`}
      data-chapter={index}
    >
      {chapter.media && (
        <div ref={mediaRef} className="chapter-media">
          {renderMedia()}
          <div className="chapter-media-overlay" />
        </div>
      )}

      <div ref={contentRef} className="chapter-content">
        {chapter.subtitle && (
          <span className="chapter-subtitle">{chapter.subtitle}</span>
        )}
        <h2 className="chapter-title">{chapter.title}</h2>
        <p className="chapter-text">{chapter.content}</p>
      </div>
    </section>
  );
}
