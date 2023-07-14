import {
    GET,
    BUN_FS_ROUTER_PLUGIN_RELATIVE_PATH,
    POST
} from "bun-fs-router-plugin";

const users: any[] = []

GET(() => new Response(JSON.stringify(users)), BUN_FS_ROUTER_PLUGIN_RELATIVE_PATH);

POST(async (req) => {
    const body = await req.json() as any; // TODO: actual typechecking/schema validation

    body.newUsers.forEach((newUser: any) => {
        if (users.includes(newUser)) {
            throw new Error("User already exists");
        }
    });

    users.push(...body.newUsers)

}, BUN_FS_ROUTER_PLUGIN_RELATIVE_PATH);