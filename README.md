# Bun filesystem router plugin
This plugin allows you to use the filesystem to specify routes of your HTTP handlers. Its made for the [bun runtime](https://bun.sh).

## What does it look like?
See the [example directory](./example) for a more detailed example.

This get request will respond to incoming `GET` requests on `/admin/user`
```ts
// /routes/admin/user.ts
GET(() => new Response(JSON.stringify(users)), BUN_FS_ROUTER_PLUGIN_RELATIVE_PATH);
```

While this will respond to incoming `POST` requests on `/user/manage/profile`
```ts
// /routes/user/manage/profile.ts
POST((req) => ..., BUN_FS_ROUTER_PLUGIN_RELATIVE_PATH);
```

Or on a custom path in an arbitrary file
```ts
// /wherever/i/wan.ts
DELETE(() => ..., "/my/custom/route");
```

## How is this different from projects like [Oily.js](https://github.com/ariesclark/oily.js)?
This is a bundler plugin. While other projects use the filesystem at runtime to determine how to resolve routes, this plugin transfers this step to the build time. It's made for the `Bun.build` API and uses the `Bun.serve` webserver.
This allows for better bundling and optimizing, since the directory structure does not have to be preserved to runtime. There is no need for multiple entrypoints (and therefore multiple bundles) to your application which enables optimal tree-shaking and code reuse.

## How do I get started?
Install the [bun-fs-router-plugin](https://www.npmjs.com/package/bun-fs-router-plugin) to your project.
```ts
bun i bun-fs-router-plugin
```
Create a build script, typically a `build.ts` at your project root.
Configure the bundler to your needs and add the plugin:

```ts
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
  minify: true,
});
if (!output.success) {
  console.error(output.logs);
} else {
  console.info("Done!");
}

```

We chose to put the entrypoint into `src/main.ts` in our bundler config, but you are free to adjust this to your liking.

Next, we import the `serve` function into out main file:

```ts
import {serve} from "bun-fs-router-plugin";

console.log("Serving...");

serve({
    port: 3000,
});
```
Notice, how you can set every property from the [native serve function](https://bun.sh/docs/api/http#bun-serve), except the `fetch` callback, the plugin does this for you.

Now we need to create a `routes` directory, next to our chosen entrypoint. In our case this would be at `src/routes`.

Here we can add as many routes as we want. For example, if you want endpoints for user management, you can create the `src/routes/user.ts` and then create endpoints like this:
```ts
import { GET, BUN_FS_ROUTER_PLUGIN_RELATIVE_PATH } from "bun-fs-router-plugin";

const users: any[] = []

GET((req) => new Response(JSON.stringify(users)), BUN_FS_ROUTER_PLUGIN_RELATIVE_PATH);
```
All common HTTP methods are available as functions you can import and use. Notice how we pass two arguments to the `GET` call. The first parameter is the handler function. It receives the native request object and can optionally return a native response object. Handlers can be async. The second argument is the more ✨magical✨ one. It gets replace with the relative path depending on the file it is in at build time. If you want you can also provide a custom path like `"/my/custom/route"`.
