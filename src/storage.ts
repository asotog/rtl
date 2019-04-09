import sqlite3 from 'sqlite3';
import {DATABASE_PATH} from "./config";

const db = new sqlite3.Database(DATABASE_PATH);

export default class ShowsStorage {

    constructor() {}

    createTables() {
        try {
            db.run("CREATE TABLE IF NOT EXISTS show (id NUM PRIMARY KEY, name TEXT)");
        } catch(e) {
            console.log('table exists');
        }
    }
    store(show: Show) {
        return this.run(
            `INSERT INTO show (id, name) VALUES (${show.id}, '${this.escapeString(show.name)}')`);
    }
    escapeString(text: string) {
        return text.replace(/\'/g,"''");
    }
    storeList(shows: Show[]) {
        shows.forEach(show => {
            this.store(show);
        });
    }
    list(start: number) {
        return this.queryList('SELECT * FROM show');
    }
    count() {
        return new Promise<number>((resolve: any, reject: any) => {
            this.run('SELECT COUNT(*) as count FROM show').then((result: any) => {
                resolve(result.count);
            });
        });
    }
    queryList(sql: string, params = []) {
        return new Promise<Show[]>((resolve: any, reject: any) => {
            db.all(sql, params, (err: any, result: any) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }
    run(sql: string, params = []) {
        return new Promise((resolve: any, reject: any) => {
            db.get(sql, params, (err: any, result: any) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }
}
