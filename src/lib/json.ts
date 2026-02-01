import { useEffect, useState } from 'react';

/**
 * Custom hook to load and parse a JSON file.
 * @param filePath - The path to the JSON file. (All after /data/json/)
 */
export function useJsonFile(filePath: string) {
	const [data, setData] = useState<unknown | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		async function loadData() {
			setLoading(true);
			setError(null);

			try {
				let rawData: any;

				const response = await fetch(`/data/json/${filePath}`);
				if (!response.ok) {
					throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);
				}

				rawData = await response.json();

				if (!cancelled) setData(rawData);
			} catch (err: any) {
				if (!cancelled) setError(err.message || 'Unknown error');
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		loadData();

		return () => {
			cancelled = true;
		};
	}, [filePath]);

	return { data, loading, error };
}

export function mapReplacer(_: string, value: any): any {
	if (value instanceof Map) {
		return Object.fromEntries(Array.from(value, ([k, v]) => [k, v instanceof Map ? mapReplacer(k, v) : v]));
	}
	return value;
}
