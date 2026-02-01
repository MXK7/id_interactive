import { FilterMode, filterString } from '@/lib/stringFilters';

function getFirstAlphaCharacter(name: string) {
	return filterString(name, FilterMode.Alpha).charAt(0);
}

export function getInitials(firstName: string, lastName?: string) {
	return `${getFirstAlphaCharacter(firstName)}${getFirstAlphaCharacter(lastName || '')}`;
}
