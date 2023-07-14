import {ServeOptions} from "bun";
import {HTTPMethod, Handler} from "./types";

const handlers = new Map<string, Map<HTTPMethod, Handler>>();

export function serve(options: Omit<ServeOptions, "fetch">) {
  return Bun.serve({
    ...options,
    fetch: async (req) => {
      const url = new URL(req.url);
      const handler = handlers.get(url.pathname)?.get(req.method as HTTPMethod);

      if (!handler) {
        return new Response(`Not found`, {status: 404});
      }

      let ret = await handler(req);

      if (!ret) {
        ret = new Response();
      }

      return ret;
    },
  });
}

/**
 * Registers a GET route.
 * @param handler The handler which should be called with incoming requests for this path/method
 * @param path The path this handler should respond to. You can use the `import { BUN_FS_ROUTER_PLUGIN_RELATIVE_PATH } from "bun-fs-router-plugin"` value to set this value automatically depending on the filesystem structure
 */
export const GET = populateHandler(HTTPMethod.GET)
/**
 * Registers a POST route.
 * @param handler The handler which should be called with incoming requests for this path/method
 * @param path The path this handler should respond to. You can use the `import { BUN_FS_ROUTER_PLUGIN_RELATIVE_PATH } from "bun-fs-router-plugin"` value to set this value automatically depending on the filesystem structure
 */
export const POST = populateHandler(HTTPMethod.POST)
/**
 * Registers a PUT route.
 * @param handler The handler which should be called with incoming requests for this path/method
 * @param path The path this handler should respond to. You can use the `import { BUN_FS_ROUTER_PLUGIN_RELATIVE_PATH } from "bun-fs-router-plugin"` value to set this value automatically depending on the filesystem structure
 */
export const PUT = populateHandler(HTTPMethod.PUT);
/**
 * Registers a DELETE route.
 * @param handler The handler which should be called with incoming requests for this path/method
 * @param path The path this handler should respond to. You can use the `import { BUN_FS_ROUTER_PLUGIN_RELATIVE_PATH } from "bun-fs-router-plugin"` value to set this value automatically depending on the filesystem structure
 */
export const DELETE = populateHandler(HTTPMethod.DELETE);
/**
 * Registers a PATCH route.
 * @param handler The handler which should be called with incoming requests for this path/method
 * @param path The path this handler should respond to. You can use the `import { BUN_FS_ROUTER_PLUGIN_RELATIVE_PATH } from "bun-fs-router-plugin"` value to set this value automatically depending on the filesystem structure
 */
export const PATCH = populateHandler(HTTPMethod.PATCH);

function populateHandler(method: HTTPMethod): (handler: Handler, path: string) => void {
  return ((handler: Handler, path: string) => {
    let map = handlers.get(path);
    if (!map) {
      map = new Map();
      handlers.set(path, map);
    }

    if (map.has(method)) {
      throw new Error(`Handler for GET at ${path} already registered!`);
    }

    map.set(method, handler);
  })
}