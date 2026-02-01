import { FilterMode, filterString } from './stringFilters';

function formatCardNumber(cardNumber: string): string {
	return filterString(cardNumber, FilterMode.Numeric)
		.trim()
		.replace(/(.{4})/g, '$1 ');
}

function formatAmount(amount: number): string {
	return new Intl.NumberFormat('de-DE').format(amount);
}

function onlyNumerics(value: string): string {
	return value.replace(/[^0-9]/g, '');
}

function formatIBAN(value: string): string {
	return onlyNumerics(value)
		.trim()
		.slice(0, 15)
		.replace(/(\d{3})(?=\d)/g, '$1 ');
}

function formatShortDate(date: string): string {
	const dateSplit = date.split('-');
	return `${dateSplit[1]}/${dateSplit[0].slice(2)}`;
}

/**
 * Convertit une date du format US (MM/DD/YYYY) au format français (DD/MM/YYYY)
 * @param dateString - Date au format US ou ISO
 * @returns Date au format français ou la valeur par défaut
 */
const formatDateToFR = (dateString: string | null | undefined, defaultValue: string = '00/00/0000'): string => {
	if (!dateString) return defaultValue;

	try {
		// Si la date est au format ISO (YYYY-MM-DD)
		if (dateString.includes('-')) {
			const date = new Date(dateString);
			if (isNaN(date.getTime())) return defaultValue;

			const day = String(date.getDate()).padStart(2, '0');
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const year = date.getFullYear();

			return `${day}/${month}/${year}`;
		}

		// Si la date est au format US (MM/DD/YYYY)
		if (dateString.includes('/')) {
			const parts = dateString.split('/');
			if (parts.length !== 3) return defaultValue;

			const [month, day, year] = parts;

			// Vérifier que ce sont des nombres valides
			if (isNaN(Number(month)) || isNaN(Number(day)) || isNaN(Number(year))) {
				return defaultValue;
			}

			// Convertir au format français
			return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
		}

		return defaultValue;
	} catch (error) {
		console.error('Error formatting date:', error);
		return defaultValue;
	}
};

/**
 * Convertit une date au format français lisible (ex: "15 janvier 2025")
 * @param dateString - Date au format US ou ISO
 * @returns Date au format français lisible
 */
const formatDateToFRLong = (dateString: string | null | undefined, defaultValue: string = 'Date inconnue'): string => {
	if (!dateString) return defaultValue;

	try {
		let date: Date;

		// Si la date est au format ISO (YYYY-MM-DD)
		if (dateString.includes('-')) {
			date = new Date(dateString);
		}
		// Si la date est au format US (MM/DD/YYYY)
		else if (dateString.includes('/')) {
			const parts = dateString.split('/');
			if (parts.length !== 3) return defaultValue;
			const [month, day, year] = parts;
			date = new Date(Number(year), Number(month) - 1, Number(day));
		} else {
			return defaultValue;
		}

		if (isNaN(date.getTime())) return defaultValue;

		return date.toLocaleDateString('fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		});
	} catch (error) {
		console.error('Error formatting date:', error);
		return defaultValue;
	}
};

export { formatCardNumber, formatAmount, formatIBAN, formatShortDate, formatDateToFR, formatDateToFRLong };
