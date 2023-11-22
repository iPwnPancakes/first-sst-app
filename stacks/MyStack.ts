import { StackContext, Api, EventBus, Table } from "sst/constructs";

export function API({ stack }: StackContext) {
    const table = new Table(
        stack,
        'items',
        {
            fields: { userId: 'string' },
            primaryIndex: { partitionKey: 'userId' },
        }
    );

    const bus = new EventBus(stack, "bus", {
        defaults: {
            retries: 10,
        },
    });

    const api = new Api(stack, "api", {
        defaults: {
            function: {
                bind: [bus, table],
            },
        },
        routes: {
            "GET /": "packages/functions/src/lambda.handler",
            "GET /todo": "packages/functions/src/todo.list",
            "POST /todo": "packages/functions/src/todo.create",
            "GET /users": "packages/functions/src/users-api.all",
            "POST /users": "packages/functions/src/users-api.create",
        },
    });

    bus.subscribe("todo.created", {
        handler: "packages/functions/src/events/todo-created.handler",
    });

    stack.addOutputs({
        ApiEndpoint: api.url,
    });
}
