const units: [Intl.RelativeTimeFormatUnit, number][] = [
	['year', 1000 * 60 * 60 * 24 * 365],
	['month', 1000 * 60 * 60 * 24 * 30],
	['week', 1000 * 60 * 60 * 24 * 7],
	['day', 1000 * 60 * 60 * 24],
	['hour', 1000 * 60 * 60],
	['minute', 1000 * 60],
	['second', 1000],
];

const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });

export function relativeTime(date: Date): string {
	const now = new Date();
	const diff = date.getTime() - now.getTime();
	const absDiff = Math.abs(diff);

	for (const [unit, ms] of units) {
		if (absDiff >= ms || unit === 'second') {
			const value = Math.round(diff / ms);
			return rtf.format(value, unit);
		}
	}

	return '';
}
