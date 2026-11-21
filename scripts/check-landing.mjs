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
assert.match(html, /href="\/docs"/);
assert.match(html, /id="landing-title"/);
assert.match(html, /id="how-it-works"/);
assert.doesNotMatch(html, /Illustrative sample|Small words\. A visible pattern\.|First take · 60 seconds|60s take · silent 3× preview/);
assert.match(html, /aria-controls="preview-content"/);
assert.match(html, /href="\/app"/);
assert.doesNotMatch(html, /id="closing-title"/);
assert.doesNotMatch(html, /href="\/architecture"/);
assert.match(html, /viewBox="0 0 120 120"/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /repeating-linear-gradient/);
const navbar = html.match(/<header\b[^>]*>[\s\S]*?<\/header>/)?.[0];
assert.ok(navbar, "The landing page must include the site navbar");
for (const path of ["/demo", "/app"]) {
  assert.ok(navbar.includes(`href="${path}"`), `Navbar must link to ${path}`);
}
assert.doesNotMatch(html, /<audio\b/);
assert.match(html, /data-reveal/);
assert.doesNotMatch(html, /<details/);
assert.match(html, /<mark>Um<\/mark>/);
for (const path of ["/demo", "/app", "/docs"]) {
  const page = await fetch(new URL(path, base));
  assert.equal(page.status, 200, path);
  const markup = await page.text();
  assert.equal(markup.match(/<header\b[^>]*>[\s\S]*?<\/header>/)?.[0], navbar, `Shared navbar on ${path}`);
  assert.doesNotMatch(markup, /href="\/architecture"/, `Retired architecture link on ${path}`);
}
const retired = await fetch(new URL("/architecture", base), { redirect: "manual" });
assert.equal(retired.status, 404, "The architecture page has been removed");
const legacy = await fetch(new URL("/practice", base), { redirect: "manual" });
assert.equal(legacy.status, 307);
assert.equal(legacy.headers.get("location"), "/app#practice");
console.log("PASS: landing styles, artwork, demo, app, docs, practice redirect, and retired architecture route");
