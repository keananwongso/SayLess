import assert from "node:assert/strict";

// Run against next dev or next start: a build alone did not catch missing
// CSS Module exports when the loader treated modules as global styles.
const base = process.argv[2] ?? "http://localhost:3000";
const response = await fetch(base);
assert.equal(response.status, 200);
const html = await response.text();
const paths = [...html.matchAll(/<link\b[^>]*>/g)]
  .map(([tag]) => tag)
  .filter((tag) => tag.includes('rel="stylesheet"'))
  .map((tag) => tag.match(/href="([^"]+)"/)?.[1]);
assert.ok(paths.length, "The landing page must load CSS");
const css = (await Promise.all(paths.map(async (path) => {
  const result = await fetch(new URL(path.replaceAll("&amp;", "&"), base));
  assert.equal(result.status, 200, `Stylesheet failed: ${path}`);
  return result.text();
}))).join("\n");
for (const element of ["header", "main", "section", "figure", "footer"]) {
  const name = html.match(new RegExp(`<${element} class="([^"]+)"`))?.[1];
  assert.ok(name, `${element} must have a CSS Module class`);
  assert.ok(css.includes(`.${name}`), `${element} class must exist in served CSS`);
}
assert.match(css, /grid-template-columns/);
assert.match(css, /700px/);
assert.match(html, /href="\/demo"/);
assert.match(html, /id="landing-title"/);
assert.match(html, /id="how-it-works"/);
assert.match(html, /Synthetic sample/);
assert.match(html, /aria-controls="preview-content"/);
assert.match(html, /href="\/practice#practice"/);
assert.match(html, /viewBox="0 0 120 120"/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /repeating-linear-gradient/);
for (const path of ["/demo", "/practice", "/landing/sayless-coaching-collage.png"]) {
  assert.equal((await fetch(new URL(path, base))).status, 200, path);
}
console.log("PASS: landing styles, responsive rules, artwork, demo, and practice routes");
