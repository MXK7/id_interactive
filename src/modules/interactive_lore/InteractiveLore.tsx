import { useRef, useEffect, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Styles
import "./styles/animations.css";

// Data
import { SCENES } from "./data/scenes";

// Types
import type { Scene } from "./types";

// Components
import {
	LandingScene,
	HeroScene,
	ParallaxScene,
	SplitScene,
	FullscreenTextScene,
	FinaleScene,
	LoadingScreen,
	ProgressBar,
	FilmGrain,
} from "./components";

// Hooks
import { useVideoFrames } from "./hooks";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 120;

export function InteractiveLore() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [loadProgress, setLoadProgress] = useState(0);
	const [videoVisible, setVideoVisible] = useState(false);

	// Video frames hook
	const {
		videoRef,
		canvasRef,
		framesRef,
		isReady: framesLoaded,
		isLoading: framesLoading,
		loadProgress: frameLoadProgress,
		renderFrame,
	} = useVideoFrames({ totalFrames: TOTAL_FRAMES });

	// Loading animation for Logo
	useGSAP(() => {
		if (!isLoaded) {
			const parts = document.querySelectorAll(".logo-part");
			gsap.fromTo(
				parts,
				{ opacity: 0, y: 20, scale: 0.95 },
				{
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 1.2,
					stagger: 0.15,
					ease: "power3.out",
					delay: 0.2,
				}
			);
		}
	}, { dependencies: [isLoaded] });

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

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let currentFrameIndex = 0;
		let targetFrameIndex = 0;
		let rafId: number | null = null;

		const renderLoop = () => {
			// Smooth interpolation towards target frame
			const lerp = 0.15;
			currentFrameIndex += (targetFrameIndex - currentFrameIndex) * lerp;
			renderFrame(currentFrameIndex);
			rafId = requestAnimationFrame(renderLoop);
		};

		const handleScroll = () => {
			const scrollTop = container.scrollTop;
			const landingHeight = window.innerHeight;
			const videoStartScroll = scrollTop - landingHeight;
			const scrollRange = window.innerHeight * 2;

			setVideoVisible(videoStartScroll > 0);

			const scrollProgress = Math.max(0, Math.min(1, videoStartScroll / scrollRange));
			targetFrameIndex = scrollProgress * (frames.length - 1);
		};

		// Start render loop
		rafId = requestAnimationFrame(renderLoop);
		container.addEventListener("scroll", handleScroll, { passive: true });

		// Initial render
		handleScroll();
		renderFrame(0);

		return () => {
			container.removeEventListener("scroll", handleScroll);
			if (rafId) cancelAnimationFrame(rafId);
		};
	}, [isLoaded, framesLoaded, canvasRef, framesRef, renderFrame]);

	// Setup GSAP animations
	useGSAP(
		() => {
			if (!containerRef.current || !isLoaded) return;

			const container = containerRef.current;

			// Kill existing ScrollTriggers
			ScrollTrigger.getAll().forEach((st) => st.kill());

			// Set scroller
			ScrollTrigger.defaults({ scroller: container });

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
				const landingTl = gsap.timeline({ delay: 0.3 });
				landingTl
					.fromTo(
						".landing-title",
						{ opacity: 0, y: 80, clipPath: "inset(100% 0% 0% 0%)" },
						{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power4.out" }
					)
					.fromTo(
						".landing-subtitle",
						{ opacity: 0, y: 30 },
						{ opacity: 1, y: 0, duration: 1, ease: "power3.out" },
						"-=0.8"
					)
					.fromTo(
						".landing-tagline",
						{ opacity: 0, letterSpacing: "1em" },
						{ opacity: 0.6, letterSpacing: "0.5em", duration: 1.2, ease: "power2.out" },
						"-=0.6"
					)
					.fromTo(
						".landing-scroll-indicator",
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

			// Hero scene animations
			const heroScene = container.querySelector(".scene--hero");
			if (heroScene) {
				const introTl = gsap.timeline({ delay: 0.3 });
				introTl
					.fromTo(
						".hero-title",
						{ opacity: 0, scale: 0.8, y: 50 },
						{ opacity: 1, scale: 1, y: 0, duration: 1.5, ease: "power4.out" }
					)
					.fromTo(
						".hero-quote",
						{ opacity: 0, y: 30 },
						{ opacity: 1, y: 0, duration: 1, ease: "power3.out" },
						"-=0.8"
					)
					.fromTo(
						".scroll-indicator",
						{ opacity: 0, y: -20 },
						{ opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
						"-=0.3"
					);

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

				if (image) {
					gsap.fromTo(
						image,
						{ xPercent: isLeft ? -100 : 100, opacity: 0 },
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
						{ opacity: 0, y: 120, rotateX: -90, scale: 0.8 },
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
	const renderScene = useCallback(
		(scene: Scene) => {
			switch (scene.type) {
				case "landing":
					return <LandingScene key={scene.id} scene={scene} />;

				case "hero":
					return (
						<HeroScene
							key={scene.id}
							scene={scene}
							videoRef={videoRef}
							canvasRef={canvasRef}
							isVisible={videoVisible}
							isLoading={framesLoading}
							loadProgress={frameLoadProgress}
							onVideoReady={() => { }}
						/>
					);

				case "parallax":
					return <ParallaxScene key={scene.id} scene={scene} />;

				case "split":
					return <SplitScene key={scene.id} scene={scene} />;

				case "fullscreen-text":
					return <FullscreenTextScene key={scene.id} scene={scene} />;

				case "finale":
					return <FinaleScene key={scene.id} scene={scene} />;

				default:
					return null;
			}
		},
		[videoVisible, frameLoadProgress, framesLoading, videoRef, canvasRef]
	);

	return (
		<>
			{/* Loading Screen */}
			<LoadingScreen isLoaded={isLoaded} progress={loadProgress} />

			{/* Film Grain Overlay */}
			<FilmGrain />

			{/* Progress Bar */}
			<ProgressBar />

			{/* Main Scroll Container */}
			<div
				ref={containerRef}
				className={`fixed inset-0 bg-[var(--lore-black-soft)] text-white overflow-x-hidden overflow-y-auto lore-scrollbar transition-opacity duration-[800ms] ease-[var(--lore-ease-smooth)] ${isLoaded ? "opacity-100" : "opacity-0"
					}`}
			>
				<div className="scenes-wrapper relative">
					{SCENES.map((scene) => renderScene(scene))}
				</div>
			</div>
		</>
	);
}
