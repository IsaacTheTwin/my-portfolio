import { compile } from "/opt/oai-docgen/node_modules/tailwindcss/dist/lib.mjs";
import fs from "fs";

const html = fs.readFileSync("./index.html", "utf8");
const js = fs.readFileSync("./script.js", "utf8");

let classSet = new Set();
const classRegex = /class(?:Name)?=["']([^"']+)["']/g;
let match;
while ((match = classRegex.exec(html))) {
  match[1].split(/\s+/).forEach(c => c && classSet.add(c));
}
while ((match = classRegex.exec(js))) {
  match[1].split(/\s+/).forEach(c => c && classSet.add(c));
}
console.log("Found", classSet.size, "candidate classes");

const tailwindIndexCss = fs.readFileSync("/opt/oai-docgen/node_modules/tailwindcss/index.css", "utf8");

const customTheme = `
@theme {
  --color-navy: #1E2A4A;
  --color-navy-dark: #0F1830;
  --color-navy-light: #2C3E6B;
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
}
`;

const inputCss = tailwindIndexCss + "\n" + customTheme;

const result = await compile(inputCss, {
  base: "/opt/oai-docgen/node_modules/tailwindcss",
  onDependency: () => {},
});

const candidates = Array.from(classSet);
const css = result.build(candidates);
fs.writeFileSync("./style.css", css);
console.log("CSS length:", css.length);
