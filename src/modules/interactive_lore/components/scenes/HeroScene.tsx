import type { HeroScene as HeroSceneType } from "../../types";

interface HeroSceneProps {
	scene: HeroSceneType;
	videoRef: React.RefObject<HTMLVideoElement | null>;
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
	isVisible: boolean;
	isLoading: boolean;
	loadProgress: number;
	onVideoReady: () => void;
}

export function HeroScene({
	scene,
	videoRef,
	canvasRef,
	isVisible,
	isLoading,
	loadProgress,
	onVideoReady,
}: HeroSceneProps) {
	return (
		<section className="video-scroll-section relative h-[300vh] w-full">
			<div className="video-scroll-sticky sticky top-0 left-0 w-full h-screen overflow-hidden">
				<div
					className={`scene scene--hero min-h-screen h-screen flex flex-col items-center justify-center transition-opacity duration-[800ms] ease-[var(--lore-ease-smooth)] ${isVisible ? "opacity-100" : "opacity-0"
						}`}
				>
					{/* Video Container */}
					<div className="hero-video-container absolute inset-0 z-0">
						{/* Hidden video for frame extraction */}
						<video
							ref={videoRef}
							className="hidden"
							src={scene.background}
							muted
							playsInline
							preload="auto"
							onLoadedMetadata={onVideoReady}
						/>

						{/* Canvas for ultra-smooth frame display */}
						<canvas
							ref={canvasRef}
							className="w-full h-full object-cover block"
						/>

						{/* Loading overlay for frame extraction */}
						{isLoading && (
							<div className="absolute inset-0 bg-[var(--lore-black)] flex items-center justify-center z-[5]">
								<div className="flex flex-col items-center gap-4">
									<span className="font-[var(--lore-font-body)] text-[0.8rem] font-medium tracking-[0.2em] text-[var(--lore-white-muted)] uppercase">
										Préparation de l'expérience...
									</span>
									<div className="w-[200px] h-[3px] bg-[var(--lore-white-subtle)] rounded-sm overflow-hidden">
										<div
											className="h-full bg-[var(--lore-primary)] origin-left transition-transform duration-200 ease-out"
											style={{ transform: `scaleX(${loadProgress / 100})` }}
										/>
									</div>
									<span className="font-[var(--lore-font-body)] text-[0.75rem] text-[var(--lore-primary)] font-semibold">
										{Math.round(loadProgress)}%
									</span>
								</div>
							</div>
						)}

						{/* Video Overlay */}
						<div className="hero-video-overlay absolute inset-0 lore-video-overlay opacity-30 will-change-[opacity]" />
					</div>

					{/* Content */}
					<div className="hero-content relative z-10 text-center px-8">
						<h1 className="hero-title font-[var(--lore-font-display)] text-[clamp(8rem,25vw,20rem)] font-normal tracking-tight leading-[0.85] text-white lore-text-glow-white will-change-[transform,opacity]">
							{scene.title}
						</h1>
						{scene.quote && (
							<p className="hero-quote font-[var(--lore-font-display)] text-[clamp(0.9rem,2vw,1.4rem)] font-normal tracking-[0.15em] text-[var(--lore-primary)] mt-8 max-w-[800px] leading-relaxed will-change-[transform,opacity]">
								{scene.quote}
							</p>
						)}
					</div>

					{/* Scroll Indicator */}
					<div className="scroll-indicator absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 will-change-[opacity]">
						<span className="font-[var(--lore-font-body)] text-[0.7rem] font-medium tracking-[0.4em] text-[var(--lore-white-muted)]">
							SCROLL
						</span>
						<div className="lore-scroll-line w-px h-[60px] bg-gradient-to-b from-[var(--lore-white-muted)] to-transparent" />
					</div>
				</div>
			</div>
		</section>
	);
}
