import plugin from "bun-fs-router-plugin";

console.info("Building...");

const output = await Bun.build({
  entrypoints: ["./src/main.ts"],
  outdir: "./out",
  plugins: [plugin()],
  target: "bun",
  format: "esm",
  splitting: true,
  sourcemap: "external",
  // minify: true,
});
if (!output.success) {
  console.error(output.logs);
} else {
  console.info("Done!");
}
