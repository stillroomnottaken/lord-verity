import type { MediaItem } from "./model";

// The repository ships no photographs (only favicon.svg), so the library offers the
// project favicon plus clearly-labelled generated sample images (inline SVG data URIs).
const palette = [["#FAE45E", "#DD9C00"], ["#D3EA09", "#90C207"], ["#90C207", "#43592D"], ["#DD9C00", "#563D23"], ["#F2EBCB", "#90C207"], ["#563D23", "#2E2012"]];
function sample(i: number): MediaItem {
  const [a, b] = palette[i % palette.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='640' height='360' fill='url(#g)'/><circle cx='${120 + i * 70}' cy='${90 + (i % 3) * 60}' r='${46 + i * 6}' fill='rgba(255,255,255,.28)'/><path d='M0 300 C160 240 300 340 640 250 V360 H0Z' fill='rgba(46,32,18,.25)'/><text x='28' y='52' font-family='monospace' font-size='22' font-weight='700' fill='rgba(46,32,18,.8)'>SAMPLE IMAGE ${i + 1}</text></svg>`;
  return { id: `sample-${i + 1}`, name: `Sample image ${i + 1}`, src: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`, origin: "sample" };
}
export const INITIAL_MEDIA: MediaItem[] = [
  { id: "project-favicon", name: "favicon.svg (project)", src: "/favicon.svg", origin: "project" },
  ...[0, 1, 2, 3, 4, 5].map(sample),
];
