/**
 * Preloads a list of image URLs and returns a Promise that resolves when all are loaded
 */
export async function preloadAssets(urls: string[]): Promise<void> {
	const promises = urls.map(
		(url) =>
			new Promise<void>((resolve) => {
				const ext = url.split('.').pop()?.toLowerCase();

				if (ext === 'svg') {
					// Preload SVG by fetching it into cache
					fetch(url)
						.then((res) => {
							if (!res.ok) {
								throw new Error(`Failed to fetch ${url}`);
							}
							return res.text();
						})
						.then(() => resolve())
						.catch((err) => {
							console.warn('Failed to preload SVG:', url, err);
							resolve();
						});
				} else {
					// Preload normal image (png/jpg/webp...)
					const img = new Image();
					img.src = url;
					img.onload = () => resolve();
					img.onerror = () => {
						console.warn('Failed to load image:', url);
						resolve();
					};
				}
			})
	);

	return Promise.all(promises).then(() => undefined);
}
