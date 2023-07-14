import {ServeOptions} from "bun";
import {HTTPMethod, Handler} from "./types";

export const handlers = new Map<string, Map<HTTPMethod, Handler>>();

export function serve(options: Omit<ServeOptions, "fetch">) {
  Bun.serve({
    ...options,
    fetch(req) {
      const url = new URL(req.url);
      const handler = handlers.get(url.pathname)?.get(req.method as HTTPMethod);

      if (!handler) {
        return new Response(`Not found`, {status: 404});
      }

      return handler(req);
    },
  });
}
