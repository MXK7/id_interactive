const enum FilterMode {
	Alpha = 1 << 0,
	Numeric = 1 << 1,
	Space = 1 << 2,
}

function filterString(input: string, mode: FilterMode, maxLength?: number): string {
	let allowed = '';

	if (mode & FilterMode.Alpha) {
		allowed += 'a-zA-Z';
	}
	if (mode & FilterMode.Numeric) {
		allowed += '0-9';
	}
	if (mode & FilterMode.Space) {
		allowed += ' ';
	}

	const regex = new RegExp(`[^${allowed}]`, 'g');

	let result = input.replace(regex, '');

	if (maxLength !== undefined) {
		result = result.slice(0, maxLength);
	}

	return result;
}

/**
 * Filter for date of birth in DD/MM/YYYY format
 * Allows only numbers and forward slashes, with automatic formatting
 * Validates that the date is not in the future and respects min/max date constraints
 */
function filterDateOfBirth(input: string, minDate?: Date, maxDate?: Date): string {
	const cleaned = input.replace(/[^0-9/]/g, '');

	let result = '';
	let slashCount = 0;

	for (let i = 0; i < cleaned.length && result.length < 10; i++) {
		const char = cleaned[i];

		if (char === '/') {
			if ((result.length === 2 || result.length === 5) && slashCount < 2) {
				result += char;
				slashCount++;
			}
		} else {
			result += char;
			if (result.length === 2 || result.length === 5) {
				if (i + 1 < cleaned.length && cleaned[i + 1] !== '/') {
					result += '/';
					slashCount++;
				}
			}
		}
	}

	const formatDateToDDMMYYYY = (date: Date): string => {
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear().toString();
		return `${day}/${month}/${year}`;
	};

	if (result.length === 10) {
		let [day, month, year] = result.split('/').map(Number);

		day = Math.max(1, Math.min(31, day));
		month = Math.max(1, Math.min(12, month));
		year = Math.max(1900, year);

		let inputDate = new Date(year, month - 1, day);

		if (inputDate.getDate() !== day || inputDate.getMonth() !== month - 1) {
			const lastDayOfMonth = new Date(year, month, 0).getDate();
			day = Math.min(day, lastDayOfMonth);
			inputDate = new Date(year, month - 1, day);
		}

		const today = new Date();
		today.setHours(23, 59, 59, 999);

		const effectiveMaxDate = maxDate || today;

		if (inputDate > effectiveMaxDate) {
			return formatDateToDDMMYYYY(effectiveMaxDate);
		}

		if (minDate && inputDate < minDate) {
			return formatDateToDDMMYYYY(minDate);
		}

		const originalValues = result.split('/').map(Number);
		if (day !== originalValues[0] || month !== originalValues[1] || year !== originalValues[2]) {
			return formatDateToDDMMYYYY(inputDate);
		}
	}

	return result;
}

/**
 * Filter for email addresses with automatic suffix
 * Allows alphanumeric characters, dots, hyphens, underscores, and @ symbol
 * Automatically adds suffix when @ is typed and limits identifier to 20 characters
 * Limits domain/suffix part to 14 characters
 */
function filterEmail(input: string, suffix?: string): string {
	let result = input.replace(/[^a-zA-Z0-9@._-]/g, '');

	const atIndex = result.indexOf('@');

	if (atIndex !== -1) {
		let beforeAt = result.substring(0, atIndex);

		if (beforeAt.length > 20) {
			beforeAt = beforeAt.slice(0, 20);
		}

		if (suffix) {
			const limitedSuffix = suffix.length > 14 ? suffix.slice(0, 14) : suffix;
			result = beforeAt + '@' + limitedSuffix;
		} else {
			let afterAt = result.substring(atIndex + 1).replace(/@/g, '');

			if (afterAt.length > 14) {
				afterAt = afterAt.slice(0, 14);
			}

			result = beforeAt + '@' + afterAt;
		}
	} else {
		if (result.length > 20) {
			result = result.slice(0, 20);
		}
	}

	return result;
}

/**
 * Filter for phone numbers in XXX-XXXXX format
 * Allows only numbers and hyphens, with automatic formatting
 * Format: 555-12345
 */
function filterPhoneNumber(input: string): string {
	// Remove all non-numeric characters except hyphens
	const cleaned = input.replace(/[^0-9-]/g, '');

	let result = '';
	let hyphenCount = 0;

	for (let i = 0; i < cleaned.length && result.length < 9; i++) {
		const char = cleaned[i];

		if (char === '-') {
			// Only allow hyphen at position 3 (after the first 3 digits)
			if (result.length === 3 && hyphenCount === 0) {
				result += char;
				hyphenCount++;
			}
		} else {
			// Add the digit
			result += char;
			// Auto-add hyphen after 3rd digit if not already present
			if (result.length === 3 && hyphenCount === 0) {
				if (i + 1 < cleaned.length && cleaned[i + 1] !== '-') {
					result += '-';
					hyphenCount++;
				}
			}
		}
	}

	return result;
}

export { FilterMode, filterString, filterDateOfBirth, filterEmail, filterPhoneNumber };
