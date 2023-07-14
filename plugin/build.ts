import {copyFile, readFile, writeFile} from "fs/promises";
import {join} from "path";
import {createProgram, getPreEmitDiagnostics, formatDiagnosticsWithColorAndContext, sys, ModuleKind, ScriptTarget, ModuleDetectionKind, JsxEmit, ModuleResolutionKind} from 'typescript';

const outdir = "./out"
const entrypoint = "./src/index.ts"

console.info("Bundling...");

let output = await Bun.build({
    entrypoints: [entrypoint],
    outdir,
    target: "bun",
    format: "esm",
    splitting: true,
    sourcemap: "external",
    minify: true,
    root: "."
});

if (!output.success) {
    console.error(output.logs);
    throw new Error("Bundling failed!");
}

output = await Bun.build({
    entrypoints: ["./src/macros/index.ts"],
    outdir: join(outdir, "macros"),
    target: "bun",
    format: "esm",
    splitting: true,
    sourcemap: "external",
    minify: true,
    root: "."
});

if (!output.success) {
    console.error(output.logs);
    throw new Error("Bundling failed!");
}

console.info("Generate types...");

const program = createProgram({
    rootNames: [entrypoint],
    options: {
        lib: ["EsNext"],
        module: ModuleKind.ESNext,
        target: ScriptTarget.ESNext,
        moduleResolution: ModuleResolutionKind.Bundler,
        moduleDetection: ModuleDetectionKind.Force,
        allowImportingTsExtensions: true,
        strict: true,
        downlevelIteration: true,
        skipLibCheck: true,
        jsx: JsxEmit.Preserve,
        allowSyntheticDefaultImports: true,
        forceConsistentCasingInFileNames: true,
        allowJs: true,
        types: ["bun-types"],
        declaration: true,
        declarationDir: "./out",
        emitDeclarationOnly: true,
    },
});

const emitResult = program.emit();
const diagnostics = getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

if (diagnostics.length > 0) {
    console.error(formatDiagnosticsWithColorAndContext(diagnostics, {
        getCurrentDirectory: sys.getCurrentDirectory,
        getNewLine: () => sys.newLine,
        getCanonicalFileName: sys.useCaseSensitiveFileNames ? (fileName: string) => fileName : (fileName: string) => fileName.toLowerCase(),
    }));
}

// if there is a github action ref name set, adjust the version in the package json
if (process.env.REF_NAME) {
    console.info("Adjust package.json version...");
    const outPackageJsonPath = join(outdir, "package.json");
    await copyFile("package.json", outPackageJsonPath);

    const outPackageJsonContent = JSON.parse(await readFile(outPackageJsonPath, {encoding: "utf-8"}));
    outPackageJsonContent.version = process.env.REF_NAME;
    await writeFile(outPackageJsonPath, outPackageJsonContent);
}

console.info("Done!");