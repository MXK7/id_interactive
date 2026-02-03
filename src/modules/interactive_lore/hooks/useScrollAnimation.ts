import { useEffect, useRef, useCallback } from "react";

interface UseScrollAnimationOptions {
	framesCount: number;
	scrollStart: number;
	scrollRange: number;
	lerp?: number;
	onVisibilityChange?: (visible: boolean) => void;
}

interface UseScrollAnimationReturn {
	containerRef: React.RefObject<HTMLDivElement | null>;
	startAnimation: (renderCallback: (frameIndex: number) => void) => void;
	stopAnimation: () => void;
}

export function useScrollAnimation(
	options: UseScrollAnimationOptions
): UseScrollAnimationReturn {
	const {
		framesCount,
		scrollStart,
		scrollRange,
		lerp = 0.15,
		onVisibilityChange,
	} = options;

	const containerRef = useRef<HTMLDivElement>(null);
	const rafIdRef = useRef<number | null>(null);
	const currentFrameRef = useRef(0);
	const targetFrameRef = useRef(0);
	const renderCallbackRef = useRef<((frameIndex: number) => void) | null>(null);

	const handleScroll = useCallback(() => {
		const container = containerRef.current;
		if (!container) return;

		const scrollTop = container.scrollTop;
		const videoStartScroll = scrollTop - scrollStart;

		// Handle visibility
		if (onVisibilityChange) {
			onVisibilityChange(videoStartScroll > 0);
		}

		const scrollProgress = Math.max(0, Math.min(1, videoStartScroll / scrollRange));
		targetFrameRef.current = scrollProgress * (framesCount - 1);
	}, [scrollStart, scrollRange, framesCount, onVisibilityChange]);

	const renderLoop = useCallback(() => {
		// Smooth interpolation towards target frame
		currentFrameRef.current +=
			(targetFrameRef.current - currentFrameRef.current) * lerp;

		if (renderCallbackRef.current) {
			renderCallbackRef.current(currentFrameRef.current);
		}

		rafIdRef.current = requestAnimationFrame(renderLoop);
	}, [lerp]);

	const startAnimation = useCallback(
		(renderCallback: (frameIndex: number) => void) => {
			const container = containerRef.current;
			if (!container) return;

			renderCallbackRef.current = renderCallback;

			// Start render loop
			rafIdRef.current = requestAnimationFrame(renderLoop);

			// Add scroll listener
			container.addEventListener("scroll", handleScroll, { passive: true });

			// Initial render
			handleScroll();
			renderCallback(0);
		},
		[renderLoop, handleScroll]
	);

	const stopAnimation = useCallback(() => {
		const container = containerRef.current;

		if (rafIdRef.current) {
			cancelAnimationFrame(rafIdRef.current);
			rafIdRef.current = null;
		}

		if (container) {
			container.removeEventListener("scroll", handleScroll);
		}

		renderCallbackRef.current = null;
	}, [handleScroll]);

	// Cleanup on unmount
	useEffect(() => {
		return () => stopAnimation();
	}, [stopAnimation]);

	return {
		containerRef,
		startAnimation,
		stopAnimation,
	};
}
