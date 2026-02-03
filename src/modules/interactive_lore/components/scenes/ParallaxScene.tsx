import type { ParallaxScene as ParallaxSceneType } from "../../types";

interface ParallaxSceneProps {
	scene: ParallaxSceneType;
}

export function ParallaxScene({ scene }: ParallaxSceneProps) {
	return (
		<section className="scene scene--parallax relative min-h-screen flex items-center justify-center overflow-hidden">
			{/* Parallax Layers */}
			<div className="parallax-layers absolute inset-0 z-0">
				<div
					className="parallax-bg absolute -inset-[15%] bg-cover bg-center will-change-transform"
					style={{ backgroundImage: `url(${scene.background})` }}
				/>
				<div className="parallax-overlay absolute inset-0 lore-parallax-overlay" />
			</div>

			{/* Content */}
			<div className="scene-content relative z-10 max-w-[800px] px-8 py-16 text-center">
				<span className="scene-subtitle block font-[var(--lore-font-body)] text-[0.8rem] font-medium tracking-[0.3em] uppercase text-[var(--lore-primary)] mb-6 will-change-[transform,opacity]">
					{scene.subtitle}
				</span>
				<h2 className="scene-title font-[var(--lore-font-display)] text-[clamp(3rem,10vw,8rem)] font-normal tracking-tight leading-[0.95] text-white mb-8 will-change-[transform,opacity,clip-path]">
					{scene.title}
				</h2>
				<p className="scene-text font-[var(--lore-font-body)] text-[clamp(1rem,2vw,1.25rem)] font-light leading-relaxed text-[var(--lore-white-muted)] max-w-[600px] mx-auto will-change-[transform,opacity]">
					{scene.text}
				</p>
			</div>
		</section>
	);
}
