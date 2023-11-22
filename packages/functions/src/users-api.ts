import { allUsers, createUser } from "@cozy/core/models/user";
import { randomUUID } from "crypto";
import { ApiHandler } from "sst/node/api";

export const create = ApiHandler(async (_evt: { name: string, email: string }) => {
    createUser({
        id: randomUUID(),
        name: _evt.name,
        email: _evt.email,
        times: { created: new Date() }
    }); 

    return {
        statusCode: 200,
    };
});

export const all = ApiHandler(async (_evt) => {
    return {
        statusCode: 200,
        body: JSON.stringify({ users: allUsers() }),
    };
});
