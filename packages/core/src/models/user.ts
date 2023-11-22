import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";

export interface User {
    id: string;
    name: string;
    email: string;
    times: {
        created: Date;
        deleted?: Date;
    }
}

let users: User[] = [];

const dynamoDb = new DynamoDB.DocumentClient();

export async function createUser(user: User) {
    console.log('inserting user', user);

    const params = {
        TableName: Table.items.tableName,
        Item: {
            userId: user.id,
            name: user.name,
            email: user.email,
            times: user.times,
        },
    };

    await dynamoDb.put(params).promise();
}

export function getById(id: string): User {
    const possibleUser = users.find((user: User) => user.id === id);

    if (!possibleUser) {
        throw new Error('Could not find user with id');
    }

    return possibleUser;
}

export async function allUsers(): Promise<User[]> {
    const params = {
        TableName: Table.items.tableName,
    }

    const result = await dynamoDb.scan(params).promise();

    console.log(result);

    return [];
}
