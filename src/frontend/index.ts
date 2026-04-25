if (window.location.hash) {
	const target = document.querySelector(window.location.hash);
	if (target) target.scrollIntoView();
	history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
}

window.addEventListener('hashchange', () => {
	history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
});

window.addEventListener('load', () => {
	document.documentElement.style.scrollBehavior = 'smooth';
});

let contactBarScrollTimer: number | undefined;

const syncLogoDockState = () => {
	const mainLogo = document.querySelector<HTMLElement>('.main-logo-sentinel');
	const contactBar = document.querySelector<HTMLElement>('.contact-bar');

	if (!mainLogo || !contactBar) {
		document.documentElement.toggleAttribute('data-logo-docked', window.scrollY > 120);
		return;
	}

	const contactBarBottom = contactBar.getBoundingClientRect().bottom;
	const mainLogoBottom = mainLogo.getBoundingClientRect().bottom;
	document.documentElement.toggleAttribute('data-logo-docked', mainLogoBottom <= contactBarBottom + 8);
};

syncLogoDockState();
window.addEventListener('load', syncLogoDockState);

window.addEventListener(
	'scroll',
	() => {
		syncLogoDockState();
		document.documentElement.dataset.contactBarState = 'scrolling';
		window.clearTimeout(contactBarScrollTimer);
		contactBarScrollTimer = window.setTimeout(() => {
			document.documentElement.dataset.contactBarState = 'settled';
		}, 260);
	},
	{ passive: true },
);
