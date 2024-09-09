import { defineConfig } from "tsup";

export default defineConfig({
	format: ["cjs", "esm"],
	entry: ["./src/index.mts"],
	outDir: "./",
	minify: true,
	dts: true,
	shims: true,
	skipNodeModulesBundle: true
	// clean: true
});
