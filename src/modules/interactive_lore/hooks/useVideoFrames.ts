import { useEffect, useRef, useState, useCallback } from "react";

interface UseVideoFramesOptions {
	totalFrames?: number;
	onProgress?: (progress: number) => void;
}

interface UseVideoFramesReturn {
	videoRef: React.RefObject<HTMLVideoElement | null>;
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
	framesRef: React.MutableRefObject<ImageData[]>;
	isReady: boolean;
	isLoading: boolean;
	loadProgress: number;
	renderFrame: (frameIndex: number) => void;
}

export function useVideoFrames(
	options: UseVideoFramesOptions = {}
): UseVideoFramesReturn {
	const { totalFrames = 120, onProgress } = options;

	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const framesRef = useRef<ImageData[]>([]);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

	const [videoReady, setVideoReady] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isReady, setIsReady] = useState(false);
	const [loadProgress, setLoadProgress] = useState(0);

	// Extract frames from video
	useEffect(() => {
		const video = videoRef.current;
		const canvas = canvasRef.current;

		if (!video || !canvas || !videoReady || isReady || isLoading) return;

		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) return;

		ctxRef.current = ctx;
		setIsLoading(true);

		// Set canvas size to match video
		canvas.width = video.videoWidth || 1920;
		canvas.height = video.videoHeight || 1080;

		const frames: ImageData[] = [];
		const duration = video.duration;
		let currentFrame = 0;

		const extractFrame = () => {
			if (currentFrame >= totalFrames) {
				framesRef.current = frames;
				setIsReady(true);
				setIsLoading(false);
				setLoadProgress(100);
				return;
			}

			const time = (currentFrame / totalFrames) * duration;
			video.currentTime = time;
		};

		const handleSeeked = () => {
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			frames.push(imageData);

			currentFrame++;
			const progress = (currentFrame / totalFrames) * 100;
			setLoadProgress(progress);
			onProgress?.(progress);

			requestAnimationFrame(() => extractFrame());
		};

		video.addEventListener("seeked", handleSeeked);
		video.muted = true;
		extractFrame();

		return () => {
			video.removeEventListener("seeked", handleSeeked);
		};
	}, [videoReady, isReady, isLoading, totalFrames, onProgress]);

	// Handle video metadata loaded
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const handleLoadedMetadata = () => setVideoReady(true);

		if (video.readyState >= 1) {
			setVideoReady(true);
		} else {
			video.addEventListener("loadedmetadata", handleLoadedMetadata);
		}

		return () => {
			video.removeEventListener("loadedmetadata", handleLoadedMetadata);
		};
	}, []);

	// Render a specific frame
	const renderFrame = useCallback((frameIndex: number) => {
		const ctx = ctxRef.current;
		const frames = framesRef.current;

		if (!ctx || frames.length === 0) return;

		const clampedIndex = Math.max(0, Math.min(frames.length - 1, Math.round(frameIndex)));
		const frame = frames[clampedIndex];

		if (frame) {
			ctx.putImageData(frame, 0, 0);
		}
	}, []);

	return {
		videoRef,
		canvasRef,
		framesRef,
		isReady,
		isLoading,
		loadProgress,
		renderFrame,
	};
}
