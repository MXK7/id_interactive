import { useState, useLayoutEffect, type RefObject } from 'react';

export function useHasScrollbar(ref: RefObject<HTMLElement | null>): boolean {
	const [hasScrollbar, setHasScrollbar] = useState<boolean>(false);

	useLayoutEffect(() => {
		const element = ref.current;
		if (!element) return;

		const checkScrollbar = () => {
			// Comparaison entre la hauteur totale du contenu et la hauteur affichée
			const isScrolling = element.scrollHeight > element.clientHeight;
			setHasScrollbar(isScrolling);
		};

		// ResizeObserver est idéal pour détecter les changements de contenu ou de fenêtre
		const resizeObserver = new ResizeObserver(() => {
			checkScrollbar();
		});

		resizeObserver.observe(element);

		// Vérification initiale
		checkScrollbar();

		return () => {
			resizeObserver.disconnect();
		};
	}, [ref]);

	return hasScrollbar;
}
