export enum HTTPMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
}

export type Handler = (req: Request) => Response | Promise<Response> | void | Promise<void>;

/**
 * This equals the relative path after building with the bun-fs-router-plugin
 */
export const BUN_FS_ROUTER_PLUGIN_RELATIVE_PATH = "";