const useCopy = async <T extends string>(text: T) => {
	try {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			await navigator.clipboard.writeText(text);
			return true;
		}
	} catch (err) {
		// Fallback
	}
	try {
		const ta = document.createElement('textarea');
		ta.value = text;
		ta.setAttribute('readonly', '');
		ta.style.position = 'absolute';
		ta.style.left = '-9999px';
		document.body.appendChild(ta);

		const selection = document.getSelection();
		if (selection) selection.removeAllRanges();

		ta.select();
		ta.setSelectionRange(0, ta.value.length);

		const ok = document.execCommand('copy');
		document.body.removeChild(ta);

		if (ok) {
			return true;
		}
	} catch (err) {
		window.prompt('Copie manuelle', text);
	}
	return false;
};

export default useCopy;
