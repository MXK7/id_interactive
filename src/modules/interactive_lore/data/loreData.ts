import type { LoreEntry, LoreCategory, LoreFaction, LoreCharacter, TimelineEvent, LoreChapter } from "../types";

// Lore Chapters for cinematic scroll
export const LORE_CHAPTERS: LoreChapter[] = [
	{
		id: "chapter-intro",
		title: "Los Santos, 2024.",
		subtitle: "Là où tout commence",
		content: "Dans les rues baignées de néon de Los Santos, le pouvoir se mesure en influence, en territoire et en sang. Une ville où les ambitions se heurtent, où les alliances se forment et se brisent au gré des marées criminelles qui façonnent son destin.",
		type: "hero",
		media: {
			type: "video",
			url: "/videos/intro.mp4",
			poster: "/images/intro-poster.jpg"
		}
	},
	{
		id: "chapter-1",
		title: "Chapitre I",
		subtitle: "Les Origines",
		content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
		type: "text-left",
		media: {
			type: "image",
			url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200",
		}
	},
	{
		id: "chapter-2",
		title: "Chapitre II",
		subtitle: "L'Ascension",
		content: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
		type: "text-right",
		media: {
			type: "image",
			url: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=1200",
		}
	},
	{
		id: "chapter-3",
		title: "Chapitre III",
		subtitle: "Les Factions",
		content: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
		type: "fullscreen",
		media: {
			type: "image",
			url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920",
		}
	},
	{
		id: "chapter-4",
		title: "Chapitre IV",
		subtitle: "La Guerre des Territoires",
		content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
		type: "text-left",
		media: {
			type: "image",
			url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200",
		}
	},
	{
		id: "chapter-5",
		title: "Chapitre V",
		subtitle: "Les Alliances",
		content: "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.",
		type: "text-right",
		media: {
			type: "image",
			url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200",
		}
	},
	{
		id: "chapter-finale",
		title: "À suivre...",
		subtitle: "L'histoire continue",
		content: "Le destin de Los Santos reste à écrire. Chaque décision compte. Chaque alliance peut tout changer. Dans cette ville, seuls les plus audacieux survivent.",
		type: "hero",
	}
];

// Sample Lore Entries
export const LORE_ENTRIES: LoreEntry[] = [
	{
		id: "entry-001",
		title: "La Fondation de Los Santos",
		category: "history",
		content: "Los Santos, ville de tous les excès...",
		summary: "Les origines de la ville",
		tags: ["histoire", "ville", "origines"],
		relatedEntries: [],
	},
];

// Sample Factions
export const FACTIONS: LoreFaction[] = [
	{
		id: "faction-001",
		name: "Les Vagos",
		type: "gang",
		color: "#FFD700",
		description: "Gang hispanique dominant le quartier est.",
		territory: ["east-los-santos"],
		leader: "unknown",
	},
];

// Sample Characters
export const CHARACTERS: LoreCharacter[] = [
	{
		id: "char-001",
		name: "John Doe",
		alias: "Ghost",
		faction: "faction-001",
		role: "Membre",
		status: "alive",
		description: "Un membre influent...",
		relationships: [],
	},
];

// Sample Timeline Events
export const TIMELINE_EVENTS: TimelineEvent[] = [
	{
		id: "event-001",
		title: "Guerre des Gangs",
		date: "2024-01-15",
		description: "Le début des hostilités...",
		category: "event",
		importance: "major",
		relatedEntries: ["entry-001"],
	},
];

// Helper Functions
export function getEntryById(id: string): LoreEntry | undefined {
	return LORE_ENTRIES.find((entry) => entry.id === id);
}

export function getEntriesByCategory(category: LoreCategory): LoreEntry[] {
	return LORE_ENTRIES.filter((entry) => entry.category === category);
}

export function getFactionById(id: string): LoreFaction | undefined {
	return FACTIONS.find((faction) => faction.id === id);
}

export function getCharacterById(id: string): LoreCharacter | undefined {
	return CHARACTERS.find((char) => char.id === id);
}

export function searchEntries(query: string): LoreEntry[] {
	const lowerQuery = query.toLowerCase();
	return LORE_ENTRIES.filter(
		(entry) =>
			entry.title.toLowerCase().includes(lowerQuery) ||
			entry.content.toLowerCase().includes(lowerQuery) ||
			entry.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
	);
}

// Category Labels
export const CATEGORY_LABELS: Record<LoreCategory, string> = {
	history: "Histoire",
	faction: "Faction",
	character: "Personnage",
	location: "Lieu",
	event: "Événement",
	item: "Objet",
	concept: "Concept",
};

// Category Colors
export const CATEGORY_COLORS: Record<LoreCategory, string> = {
	history: "#8B5CF6",
	faction: "#EF4444",
	character: "#3B82F6",
	location: "#10B981",
	event: "#F59E0B",
	item: "#EC4899",
	concept: "#6366F1",
};
