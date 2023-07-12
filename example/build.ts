import { bunFsRouterPlugin } from "../plugin";

console.log("Building...");

await Bun.build({
  entrypoints: ["./src/main.ts"],
  outdir: "./out",
  plugins: [bunFsRouterPlugin()],
  target: "bun",
  format: "esm",
  splitting: true,
  sourcemap: "external",
  // minify: true,
});
console.log("Done!");
