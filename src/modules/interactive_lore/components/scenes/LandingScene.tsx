import type { LandingScene as LandingSceneType } from "../../types";

interface LandingSceneProps {
	scene: LandingSceneType;
}

export function LandingScene({ scene }: LandingSceneProps) {
	return (
		<section className="scene scene--landing relative min-h-screen h-screen flex flex-col items-center justify-center overflow-hidden">
			{/* Background */}
			<div className="absolute inset-0 z-0">
				<div className="landing-bg-gradient absolute inset-0 lore-bg-radial-red will-change-[opacity]" />
				<div className="landing-bg-noise absolute inset-0 lore-noise-bg" />
			</div>

			{/* Content */}
			<div className="relative z-10 text-center px-8 flex flex-col items-center gap-4">
				<span className="landing-subtitle font-[var(--lore-font-body)] text-[clamp(0.8rem,1.5vw,1rem)] font-semibold tracking-[0.5em] text-[var(--lore-primary)] uppercase will-change-[transform,opacity]">
					{scene.subtitle}
				</span>
				<h1 className="landing-title font-[var(--lore-font-display)] text-[clamp(4rem,15vw,14rem)] font-normal tracking-tight leading-[0.9] text-white lore-text-glow-white will-change-[transform,opacity,clip-path]">
					{scene.title}
				</h1>
				<p className="landing-tagline font-[var(--lore-font-body)] text-[clamp(0.7rem,1.2vw,0.9rem)] font-normal tracking-[0.5em] text-[var(--lore-white-muted)] uppercase mt-6 will-change-[transform,opacity]">
					{scene.tagline}
				</p>
			</div>

			{/* Scroll Indicator */}
			<div className="landing-scroll-indicator absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 will-change-[opacity]">
				<span className="font-[var(--lore-font-body)] text-[0.7rem] font-medium tracking-[0.4em] text-[var(--lore-white-muted)]">
					DÉCOUVRIR
				</span>
				<div className="lore-scroll-arrow text-[var(--lore-primary)]">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path
							d="M12 4L12 20M12 20L5 13M12 20L19 13"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
			</div>
		</section>
	);
}
