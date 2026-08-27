// The SVG for many of these icons are from Lucide ( https://lucide.dev ), which are available
// under the ISC License. There are a number of custom icons as well. These are optimised through
// https://optimize.svgomg.net/

function wrap(paths: string) {
	return (
		'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
		paths +
		'</svg>'
	);
}

const icons = {
	// square-arrow-right-enter
	shareIn: wrap('<path d="m10 16 4-4-4-4"/><path d="M3 12h11"/><path d="M3 8V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3"/>'),

	// square-arrow-right-exit
	shareOut: wrap('<path d="M10 12h11"/><path d="m17 16 4-4-4-4"/><path d="M21 6.344V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1.344"/>'),

	// tick
	tick: wrap('<path d="M20 6 9 17l-5-5"/>'),
};

export default icons;
