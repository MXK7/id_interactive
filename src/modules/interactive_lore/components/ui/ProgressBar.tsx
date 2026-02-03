export function ProgressBar() {
	return (
		<div className="fixed top-0 left-0 right-0 h-[3px] bg-[var(--lore-white-subtle)] z-[100]">
			<div className="cinematic-progress-fill h-full lore-progress-gradient origin-left scale-x-0 will-change-transform" />
		</div>
	);
}
