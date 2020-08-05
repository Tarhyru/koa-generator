import sqlHandle from "../database/sqliteHandle";
import { sqliteOptType } from "../type";
import { queryContext } from "../type/context/result";

function SingClient(signClass) {
    let instance;
    let handler = {
        construct(target, args) {
            if (!instance) {
                instance = new signClass(...args);
            }
            return instance;
        },
    };
    return new Proxy(signClass, handler);
}
const signSqlClient = SingClient(sqlHandle);

export async function getSqlite() {
    let client: sqlHandle = new signSqlClient();
    await client.conection();
    return client;
}
export async function closeSqliteLink() {
    let client = await getSqlite();
    await client.close();
}

export function getInsertOpt(opt: { tableName: string; range: any }): sqliteOptType {
    let { tableName, range } = opt;

    let keys = Object.keys(range);
    let valuesRange = [];
    var insertRange = {};
    for (let keyName of keys) {
        var rangeName = "$" + keyName;
        valuesRange.push(rangeName);
        insertRange[rangeName] = range[keyName];
    }
    let sqlString = `INSERT INTO ${tableName} (${keys}) VALUES (${valuesRange})`;

    return {
        sqlString,
        range: insertRange,
    };
}

export function getFindOpt({
    tableName,
    getValue,
    range,
}: {
    tableName: string;
    getValue: Array<string>;
    range: any;
}): sqliteOptType {
    let keys = Object.keys(range);
    var findRange = {};
    let valuesRange: string | Array<string> = null;
    if (typeof range === "object") {
        valuesRange = [];
        for (let keyName of keys) {
            var rangeName = "$" + keyName;
            valuesRange.push(`${keyName}=${rangeName}`);
            findRange[rangeName] = range[keyName];
        }
    } else if (typeof range === "string") {
        valuesRange = range;
    } else {
        throw "getFindOpt：错误的传入值";
    }

    let sqlString = `SELECT ${getValue} FROM ${tableName} WHERE ${valuesRange}`;

    return {
        sqlString,
        range: findRange,
    };
}

export function getDelOpt({ tableName, range }: { tableName: string; range: any }): sqliteOptType {
    let keys = Object.keys(range);
    var findRange = {};
    let valuesRange = [];
    for (let keyName of keys) {
        var rangeName = "$" + keyName;
        valuesRange.push(`${keyName}=${rangeName}`);
        findRange[rangeName] = range[keyName];
    }

    let sqlString = `DELETE FROM ${tableName} WHERE ${valuesRange}`;

    return {
        sqlString,
        range: findRange,
    };
}

export async function startTransaction(client: sqlHandle, queryOptList: Array<sqliteOptType>) {
    let result = new queryContext();
    try {
        await client.run("BEGIN TRANSACTION");
        for (let sqliteOpt of queryOptList) {
            await client.run(sqliteOpt);
        }
        await client.run("COMMIT TRANSACTION");
        result.retState = 1;
        result.result = true;
    } catch (error) {
        result.retState = -1;
        result.result = false;
    }
    return result;
}
