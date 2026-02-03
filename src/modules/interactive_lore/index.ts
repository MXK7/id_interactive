// Main exports
export { InteractiveLore } from "./InteractiveLore";
export { default as App } from "./LoreRoutes";

// Component exports
export * from "./components";

// Hooks exports
export * from "./hooks";

// Data exports
export {
	LORE_ENTRIES,
	LORE_CHAPTERS,
	FACTIONS,
	CHARACTERS,
	TIMELINE_EVENTS,
	CATEGORY_LABELS,
	CATEGORY_COLORS,
	getEntryById,
	getEntriesByCategory,
	getFactionById,
	getCharacterById,
	searchEntries,
} from "./data/loreData";

export { SCENES } from "./data/scenes";

// Type exports
export type {
	LoreEntry,
	LoreCategory,
	LoreCharacter,
	LoreFaction,
	TimelineEvent,
	CharacterRelationship,
	LoreFilter,
	LoreChapter,
	ChapterMedia,
	Scene,
	SceneType,
	LandingScene,
	HeroScene,
	ParallaxScene,
	SplitScene,
	FullscreenTextScene,
	FinaleScene,
} from "./types";
