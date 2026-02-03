import type { SplitScene as SplitSceneType } from "../../types";

interface SplitSceneProps {
	scene: SplitSceneType;
}

export function SplitScene({ scene }: SplitSceneProps) {
	const isLeft = scene.side === "left";

	return (
		<section
			className={`scene scene--split scene--split-${scene.side} relative min-h-screen grid gap-0 ${isLeft ? "grid-cols-[1fr_1fr]" : "grid-cols-[1fr_1fr]"
				} max-lg:grid-cols-1 max-lg:grid-rows-[50vh_auto]`}
			style={{
				gridTemplateAreas: isLeft ? '"image content"' : '"content image"',
			}}
		>
			{/* Image */}
			<div
				className="split-image-wrapper relative overflow-hidden will-change-[transform,opacity] max-lg:order-1"
				style={{ gridArea: "image" }}
			>
				<img
					className="split-image w-full h-full object-cover will-change-transform"
					src={scene.image}
					alt=""
				/>
				<div
					className={`split-image-overlay absolute inset-0 ${isLeft ? "lore-split-overlay-left" : "lore-split-overlay-right"
						}`}
				/>
			</div>

			{/* Content */}
			<div
				className={`scene-content flex flex-col justify-center bg-[var(--lore-black-soft)] max-lg:order-2 max-lg:text-center ${isLeft
						? "pl-32 pr-24 py-16 max-lg:px-8"
						: "pr-32 pl-24 py-16 text-right max-lg:px-8 max-lg:text-center"
					}`}
				style={{ gridArea: "content" }}
			>
				<span className="scene-subtitle block font-[var(--lore-font-body)] text-[0.8rem] font-medium tracking-[0.3em] uppercase text-[var(--lore-primary)] mb-6 will-change-[transform,opacity]">
					{scene.subtitle}
				</span>
				<h2 className="scene-title font-[var(--lore-font-display)] text-[clamp(2.5rem,6vw,5rem)] font-normal tracking-tight leading-[0.95] text-white mb-8 will-change-[transform,opacity,clip-path]">
					{scene.title}
				</h2>
				<p className="scene-text font-[var(--lore-font-body)] text-[clamp(1rem,2vw,1.25rem)] font-light leading-relaxed text-[var(--lore-white-muted)] will-change-[transform,opacity]">
					{scene.text}
				</p>
			</div>
		</section>
	);
}
