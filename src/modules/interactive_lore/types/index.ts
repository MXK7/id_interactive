// Lore Entry Types
export interface LoreEntry {
	id: string;
	title: string;
	category: LoreCategory;
	content: string;
	summary?: string;
	tags: string[];
	relatedEntries?: string[];
}

export type LoreCategory =
	| "history"
	| "faction"
	| "character"
	| "location"
	| "event"
	| "item"
	| "concept";

// Timeline Types
export interface TimelineEvent {
	id: string;
	title: string;
	date: string;
	description: string;
	category: LoreCategory;
	importance: "major" | "minor" | "background";
	relatedEntries?: string[];
}

// Character Types
export interface LoreCharacter {
	id: string;
	name: string;
	alias?: string;
	faction?: string;
	role: string;
	status: "alive" | "dead" | "unknown" | "missing";
	description: string;
	relationships?: CharacterRelationship[];
}

export interface CharacterRelationship {
	characterId: string;
	type: "ally" | "enemy" | "neutral" | "family" | "business";
}

// Faction Types
export interface LoreFaction {
	id: string;
	name: string;
	type: "gang" | "corporation" | "government" | "underground" | "other";
	color: string;
	description: string;
	territory?: string[];
	leader?: string;
}

// Filter State
export interface LoreFilter {
	category?: LoreCategory;
	tags?: string[];
	searchQuery?: string;
}

// Chapter Types for cinematic scroll
export interface LoreChapter {
	id: string;
	title: string;
	subtitle?: string;
	content: string;
	type: "hero" | "text-left" | "text-right" | "fullscreen" | "gallery";
	media?: ChapterMedia;
}

export interface ChapterMedia {
	type: "image" | "video";
	url: string;
	poster?: string;
	alt?: string;
}

// Scene Types for Interactive Lore
export type SceneType =
	| "landing"
	| "hero"
	| "parallax"
	| "split"
	| "fullscreen-text"
	| "finale";

export interface BaseScene {
	id: string;
	type: SceneType;
	title?: string;
	subtitle?: string;
	text?: string;
}

export interface LandingScene extends BaseScene {
	type: "landing";
	title: string;
	subtitle: string;
	tagline: string;
}

export interface HeroScene extends BaseScene {
	type: "hero";
	title: string;
	quote?: string;
	background?: string;
	isVideo?: boolean;
}

export interface ParallaxScene extends BaseScene {
	type: "parallax";
	title: string;
	subtitle: string;
	text: string;
	background: string;
}

export interface SplitScene extends BaseScene {
	type: "split";
	title: string;
	subtitle: string;
	text: string;
	side: "left" | "right";
	image: string;
}

export interface FullscreenTextScene extends BaseScene {
	type: "fullscreen-text";
	words: string[];
}

export interface FinaleScene extends BaseScene {
	type: "finale";
	title: string;
	subtitle: string;
	text: string;
}

export type Scene =
	| LandingScene
	| HeroScene
	| ParallaxScene
	| SplitScene
	| FullscreenTextScene
	| FinaleScene;
