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
