import { useRef, useEffect, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/lore.css";

gsap.registerPlugin(ScrollTrigger);

// Cinematic scenes data
const SCENES = [
  {
    id: "landing",
    type: "landing",
    title: "SAN ANDREAS",
    subtitle: "2026",
    tagline: "LA VILLE OÙ TOUT EST À PRENDRE",
  },
  {
    id: "intro",
    type: "hero",
    title: "VI",
    subtitle: "",
    quote: '"THE ONLY THING THAT MATTERS IS WHO YOU KNOW AND WHAT YOU GOT."',
    background: "/Lucia_Caminos_Video_Clip.mp4",
    isVideo: true,
  },
  {
    id: "scene-1",
    type: "parallax",
    title: "LEONIDA",
    subtitle: "VICE CITY • 2026",
    text: "Une ville de néons et de mensonges. Où le soleil brûle aussi fort que les ambitions.",
    background: "/test1.png",
  },
  {
    id: "scene-2",
    type: "split",
    title: "LUCIA",
    subtitle: "THE SURVIVOR",
	text: "Proin eget laoreet magna. Curabitur fermentum accumsan dictum. Donec eleifend metus sit amet nisl ultricies, et pharetra turpis facilisis. Curabitur pulvinar malesuada accumsan. Nam condimentum urna et laoreet scelerisque. Aliquam feugiat accumsan erat, sit amet pulvinar sapien sodales eu. Nulla varius ac nunc vitae rutrum. Nam quis nunc porttitor, facilisis velit in, rutrum sem. Aliquam pulvinar purus tellus, sed pulvinar ante posuere eleifend. Nunc leo metus, rutrum eget ornare nec, sollicitudin et nibh. Aenean congue magna scelerisque magna tempus dapibus. Nam feugiat pulvinar imperdiet. Vestibulum arcu enim, sodales eu malesuada ut, volutpat in sapien. Fusce vitae purus et nibh faucibus imperdiet. Pellentesque interdum, ipsum et hendrerit convallis, urna libero blandit purus, in interdum odio mauris ullamcorper purus. Fusce ullamcorper justo vel lectus pretium, in imperdiet enim cursus.",
	side: "left",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80",
  },
  {
    id: "scene-3",
    type: "parallax",
    title: "THE STREETS",
    subtitle: "REMEMBER EVERYTHING",
    text: "Chaque corner a une histoire. Chaque deal a un prix.",
    background: "https://i.redd.it/h796v3fl7br21.png",
  },
  {
    id: "scene-4",
    type: "split",
    title: "POWER",
    subtitle: "COMES AT A COST",
	text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc lectus eros, suscipit non mauris non, blandit vulputate ligula. Quisque iaculis magna sed dui mollis, nec pellentesque enim laoreet. Ut et ultricies massa. Nunc feugiat nibh sit amet luctus vestibulum. Curabitur aliquet justo eget erat facilisis dignissim. Sed elit quam, vestibulum nec mi at, molestie tristique nisl. Vivamus rhoncus, quam consequat fermentum auctor, ipsum justo faucibus lacus, quis dapibus lectus purus vel arcu. Praesent accumsan velit et metus tristique, nec sollicitudin ex malesuada. Fusce consequat lacinia commodo. Donec congue maximus quam, et cursus leo lobortis eget. Sed id tellus vitae ipsum efficitur bibendum sed eu neque. Etiam sollicitudin volutpat magna ut mollis.",
	side: "right",
    image: "https://i.pinimg.com/1200x/65/17/60/6517605f120f04db1292c37da63b7460.jpg",
  },
  {
    id: "scene-5",
    type: "fullscreen-text",
    words: ["EVERY", "CHOICE", "HAS", "CONSEQUENCES"],
  },
  {
    id: "finale",
    type: "finale",
    title: "YOUR STORY",
    subtitle: "BEGINS NOW",
    text: "Bienvenue à Vice City.",
  },
];

export function InteractiveLore() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<ImageData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [frameLoadProgress, setFrameLoadProgress] = useState(0);
  const [videoVisible, setVideoVisible] = useState(false);

  // Total frames to extract (more = smoother but more memory)
  const TOTAL_FRAMES = 120;

  // Extract frames from video into canvas for ultra-smooth scrubbing
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !videoReady || framesLoaded) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;

    const frames: ImageData[] = [];
    const duration = video.duration;
    let currentFrame = 0;

    const extractFrame = () => {
      if (currentFrame >= TOTAL_FRAMES) {
        framesRef.current = frames;
        setFramesLoaded(true);
        setFrameLoadProgress(100);
        console.log(`Extracted ${frames.length} frames`);
        return;
      }

      const time = (currentFrame / TOTAL_FRAMES) * duration;
      video.currentTime = time;
    };

    const handleSeeked = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      frames.push(imageData);

      currentFrame++;
      setFrameLoadProgress((currentFrame / TOTAL_FRAMES) * 100);

      // Small delay to ensure frame is rendered
      requestAnimationFrame(() => {
        extractFrame();
      });
    };

    video.addEventListener('seeked', handleSeeked);

    // Start extraction
    video.muted = true;
    extractFrame();

    return () => {
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [videoReady, framesLoaded]);

  // Simulate loading
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => setIsLoaded(true), 500);
      }
      setLoadProgress(Math.min(progress, 100));
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // Canvas scroll control - ultra smooth 60fps
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const frames = framesRef.current;

    if (!canvas || !container || !isLoaded || !framesLoaded || frames.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let currentFrameIndex = 0;
    let targetFrameIndex = 0;
    let rafId: number | null = null;

    const renderFrame = () => {
      // Smooth interpolation towards target frame
      const lerp = 0.15;
      currentFrameIndex += (targetFrameIndex - currentFrameIndex) * lerp;

      // Get the frame to display
      const frameIndex = Math.round(currentFrameIndex);
      const clampedIndex = Math.max(0, Math.min(frames.length - 1, frameIndex));

      // Draw the frame
      if (frames[clampedIndex]) {
        ctx.putImageData(frames[clampedIndex], 0, 0);
      }

      rafId = requestAnimationFrame(renderFrame);
    };

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      // La vidéo commence après la landing page (100vh)
      const landingHeight = window.innerHeight;
      const videoStartScroll = scrollTop - landingHeight;
      const scrollRange = window.innerHeight * 2;

      // Activer la visibilité de la vidéo quand on scroll au-delà de la landing
      if (videoStartScroll > 0) {
        setVideoVisible(true);
      } else {
        setVideoVisible(false);
      }

      const scrollProgress = Math.max(0, Math.min(1, videoStartScroll / scrollRange));

      targetFrameIndex = scrollProgress * (frames.length - 1);
    };

    // Start render loop
    rafId = requestAnimationFrame(renderFrame);
    container.addEventListener("scroll", handleScroll, { passive: true });

    // Initial render
    handleScroll();
    if (frames[0]) {
      ctx.putImageData(frames[0], 0, 0);
    }

    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isLoaded, framesLoaded]);

  // Setup GSAP animations
  useGSAP(
    () => {
      if (!containerRef.current || !isLoaded) return;

      const container = containerRef.current;

      // Kill existing ScrollTriggers
      ScrollTrigger.getAll().forEach((st) => st.kill());

      // Set scroller
      ScrollTrigger.defaults({
        scroller: container,
      });

      // Progress bar animation
      gsap.to(".cinematic-progress-fill", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".scenes-wrapper",
          scroller: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });

      // Landing scene animations
      const landingScene = container.querySelector(".scene--landing");
      if (landingScene) {
        // Initial entrance animation
        const landingTl = gsap.timeline({ delay: 0.3 });
        landingTl
          .fromTo(".landing-title",
            { opacity: 0, y: 80, clipPath: "inset(100% 0% 0% 0%)" },
            { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power4.out" }
          )
          .fromTo(".landing-subtitle",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
            "-=0.8"
          )
          .fromTo(".landing-tagline",
            { opacity: 0, letterSpacing: "1em" },
            { opacity: 0.6, letterSpacing: "0.5em", duration: 1.2, ease: "power2.out" },
            "-=0.6"
          )
          .fromTo(".landing-scroll-indicator",
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
            "-=0.3"
          );

        // Parallax exit on scroll
        gsap.timeline({
          scrollTrigger: {
            trigger: landingScene,
            scroller: container,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        })
          .to(".landing-title", { y: -150, opacity: 0, ease: "power2.in" }, 0)
          .to(".landing-subtitle", { y: -80, opacity: 0, ease: "power2.in" }, 0)
          .to(".landing-tagline", { y: -50, opacity: 0, ease: "power2.in" }, 0)
          .to(".landing-scroll-indicator", { opacity: 0, ease: "power2.in" }, 0)
          .to(".landing-bg-gradient", { opacity: 0, ease: "power2.in" }, 0);
      }

      // Hero scene animations - NO PIN, use CSS sticky instead
      const heroScene = container.querySelector(".scene--hero");
      if (heroScene) {
        // Initial entrance animation
        const introTl = gsap.timeline({ delay: 0.3 });
        introTl
          .fromTo(".hero-title",
            { opacity: 0, scale: 0.8, y: 50 },
            { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: "power4.out" }
          )
          .fromTo(".hero-quote",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
            "-=0.8"
          )
          .fromTo(".scroll-indicator",
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
            "-=0.3"
          );

        // Scroll-based exit animation for text elements only (video handled separately)
        gsap.timeline({
          scrollTrigger: {
            trigger: ".video-scroll-section",
            scroller: container,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        })
          .to(".hero-title", { scale: 0.7, opacity: 0, y: -100, ease: "power2.in" }, 0)
          .to(".hero-quote", { opacity: 0, y: -50, ease: "power2.in" }, 0)
          .to(".hero-video-overlay", { opacity: 1, ease: "none" }, 0)
          .to(".scroll-indicator", { opacity: 0, ease: "power2.in" }, 0);
      }

      // Parallax scenes
      const parallaxScenes = container.querySelectorAll(".scene--parallax");
      parallaxScenes.forEach((scene) => {
        const bg = scene.querySelector(".parallax-bg");
        const content = scene.querySelector(".scene-content");

        // Background parallax movement
        if (bg) {
          gsap.fromTo(
            bg,
            { yPercent: -15, scale: 1.15 },
            {
              yPercent: 15,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: scene,
                scroller: container,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }

        // Content reveal
        if (content) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: scene,
              scroller: container,
              start: "top 60%",
              end: "top 20%",
              toggleActions: "play none none reverse",
            },
          });

          tl.fromTo(
            content.querySelector(".scene-subtitle"),
            { opacity: 0, y: 30, letterSpacing: "0.5em" },
            { opacity: 1, y: 0, letterSpacing: "0.3em", duration: 0.8, ease: "power3.out" }
          )
            .fromTo(
              content.querySelector(".scene-title"),
              { opacity: 0, y: 60, clipPath: "inset(100% 0% 0% 0%)" },
              { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power4.out" },
              "-=0.4"
            )
            .fromTo(
              content.querySelector(".scene-text"),
              { opacity: 0, y: 40 },
              { opacity: 0.8, y: 0, duration: 0.8, ease: "power3.out" },
              "-=0.6"
            );
        }
      });

      // Split scenes
      const splitScenes = container.querySelectorAll(".scene--split");
      splitScenes.forEach((scene) => {
        const image = scene.querySelector(".split-image-wrapper");
        const content = scene.querySelector(".scene-content");
        const isLeft = scene.classList.contains("scene--split-left");

        // Image reveal
        if (image) {
          gsap.fromTo(
            image,
            {
              xPercent: isLeft ? -100 : 100,
              opacity: 0,
            },
            {
              xPercent: 0,
              opacity: 1,
              ease: "power3.out",
              duration: 1.2,
              scrollTrigger: {
                trigger: scene,
                scroller: container,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
            }
          );

          // Parallax on image
          gsap.fromTo(
            image.querySelector(".split-image"),
            { scale: 1.2 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: scene,
                scroller: container,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }

        // Content reveal
        if (content) {
          gsap.fromTo(
            content.children,
            { x: isLeft ? 60 : -60, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              stagger: 0.15,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: scene,
                scroller: container,
                start: "top 50%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      // Fullscreen text scene
      const fullscreenText = container.querySelector(".scene--fullscreen-text");
      if (fullscreenText) {
        const words = fullscreenText.querySelectorAll(".word");

        words.forEach((word, index) => {
          gsap.fromTo(
            word,
            {
              opacity: 0,
              y: 120,
              rotateX: -90,
              scale: 0.8
            },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              scale: 1,
              duration: 1.2,
              ease: "power4.out",
              scrollTrigger: {
                trigger: fullscreenText,
                scroller: container,
                start: `top ${70 - index * 10}%`,
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }

      // Finale scene
      const finaleScene = container.querySelector(".scene--finale");
      if (finaleScene) {
        gsap.fromTo(
          finaleScene.querySelectorAll(".finale-content > *"),
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: finaleScene,
              scroller: container,
              start: "top 60%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      ScrollTrigger.refresh();
    },
    { scope: containerRef, dependencies: [isLoaded] }
  );

  // Scene renderer
  const renderScene = useCallback((scene: (typeof SCENES)[number]) => {
    switch (scene.type) {
      case "landing":
        return (
          <section key={scene.id} className="scene scene--landing">
            <div className="landing-bg">
              <div className="landing-bg-gradient" />
              <div className="landing-bg-noise" />
            </div>
            <div className="landing-content">
              <span className="landing-subtitle">{scene.subtitle}</span>
              <h1 className="landing-title">{scene.title}</h1>
              <p className="landing-tagline">{scene.tagline}</p>
            </div>
            <div className="landing-scroll-indicator">
              <span>DÉCOUVRIR</span>
              <div className="scroll-indicator-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4L12 20M12 20L5 13M12 20L19 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </section>
        );

      case "hero":
        return (
          <section key={scene.id} className="video-scroll-section">
            <div className="video-scroll-sticky">
              <div className={`scene scene--hero ${videoVisible ? 'scene--hero-visible' : ''}`}>
                <div className="hero-video-container">
                  {/* Hidden video for frame extraction */}
                  <video
                    ref={videoRef}
                    className="hero-video-source"
                    src={scene.background}
                    muted
                    playsInline
                    preload="auto"
                    onLoadedMetadata={() => setVideoReady(true)}
                    style={{ display: 'none' }}
                  />
                  {/* Canvas for ultra-smooth frame display */}
                  <canvas
                    ref={canvasRef}
                    className="hero-video-canvas"
                  />
                  {/* Loading overlay for frame extraction */}
                  {!framesLoaded && videoReady && (
                    <div className="frame-loading-overlay">
                      <div className="frame-loading-content">
                        <span className="frame-loading-text">Préparation de l'expérience...</span>
                        <div className="frame-loading-bar">
                          <div
                            className="frame-loading-fill"
                            style={{ transform: `scaleX(${frameLoadProgress / 100})` }}
                          />
                        </div>
                        <span className="frame-loading-percent">{Math.round(frameLoadProgress)}%</span>
                      </div>
                    </div>
                  )}
                  <div className="hero-video-overlay" />
                </div>
                <div className="hero-content">
                  <h1 className="hero-title">{scene.title}</h1>
                  <p className="hero-quote">{scene.quote}</p>
                </div>
                <div className="scroll-indicator">
                  <span>SCROLL</span>
                  <div className="scroll-indicator-line" />
                </div>
              </div>
            </div>
          </section>
        );

      case "parallax":
        return (
          <section key={scene.id} className="scene scene--parallax">
            <div className="parallax-layers">
              <div
                className="parallax-bg"
                style={{ backgroundImage: `url(${scene.background})` }}
              />
              <div className="parallax-overlay" />
            </div>
            <div className="scene-content">
              <span className="scene-subtitle">{scene.subtitle}</span>
              <h2 className="scene-title">{scene.title}</h2>
              <p className="scene-text">{scene.text}</p>
            </div>
          </section>
        );

      case "split":
        return (
          <section
            key={scene.id}
            className={`scene scene--split scene--split-${scene.side}`}
          >
            <div className="split-image-wrapper">
              <img className="split-image" src={scene.image} alt="" />
              <div className="split-image-overlay" />
            </div>
            <div className="scene-content">
              <span className="scene-subtitle">{scene.subtitle}</span>
              <h2 className="scene-title">{scene.title}</h2>
              <p className="scene-text">{scene.text}</p>
            </div>
          </section>
        );

      case "fullscreen-text":
        return (
          <section key={scene.id} className="scene scene--fullscreen-text">
            <div className="fullscreen-text-content">
              {scene.words?.map((word, i) => (
                <span
                  key={i}
                  className={`word ${i === scene.words!.length - 1 ? "word--accent" : ""}`}
                >
                  {word}
                </span>
              ))}
            </div>
          </section>
        );

      case "finale":
        return (
          <section key={scene.id} className="scene scene--finale">
            <div className="finale-bg" />
            <div className="finale-content">
              <span className="finale-subtitle">{scene.subtitle}</span>
              <h2 className="finale-title">{scene.title}</h2>
              <p className="finale-text">{scene.text}</p>
              <button className="finale-cta">
                <span>EXPLORER LA CARTE</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          </section>
        );

      default:
        return null;
    }
  }, [videoVisible, frameLoadProgress, framesLoaded, videoReady]);

  return (
    <>
      {/* Loading Screen */}
      <div className={`loading-screen ${isLoaded ? "loading-screen--hidden" : ""}`}>
        <div className="loading-content">
          <div className="loading-logo">VI</div>
          <div className="loading-bar">
            <div
              className="loading-bar-fill"
              style={{ transform: `scaleX(${loadProgress / 100})` }}
            />
          </div>
          <span className="loading-text">
            {loadProgress < 100 ? "CHARGEMENT..." : "PRÊT"}
          </span>
        </div>
      </div>

      {/* Film Grain Overlay */}
      <div className="film-grain" aria-hidden="true" />

      {/* Progress Bar */}
      <div className="cinematic-progress">
        <div className="cinematic-progress-fill" />
      </div>

      {/* Main Scroll Container */}
      <div
        ref={containerRef}
        className={`cinematic-container ${isLoaded ? "cinematic-container--loaded" : ""}`}
      >
        <div className="scenes-wrapper">
          {SCENES.map((scene) => renderScene(scene))}
        </div>
      </div>
    </>
  );
}
