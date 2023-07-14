export enum HTTPMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
}

export type Handler = (req: Request) => Response;

export type _GET = (handler: Handler) => void;
export const GET: _GET = undefined as any; // these should not be actual values, since we replace them by their macro equivalent at build time