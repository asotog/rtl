import sqlite3 from 'sqlite3';
import {DATABASE_PATH} from "./config";

const db = new sqlite3.Database(DATABASE_PATH);

export default class ShowsStorage {

    constructor() {}

    createTables() {
        db.run("CREATE TABLE IF NOT EXISTS show (id NUM PRIMARY KEY, name TEXT)");
        db.run("CREATE TABLE IF NOT EXISTS cast (showId NUM, id NUM, name TEXT, birthday DATE)");
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
    storeCast(showId: number, person: Person) {
        return this.run(
            `INSERT INTO cast (showId, id, name, birthday) VALUES (${showId}, ${person.id},
                  '${this.escapeString(person.name)}', '${person.birthday}')`);
    }
    list(offset: number = 1, pageSize: number) {
        return this.queryShowsList(`SELECT * FROM show LIMIT ${pageSize} OFFSET ${offset} `);
    }
    listCastByShowId(showId: number) {
        return this.queryShowCast(`SELECT * FROM cast WHERE showId = ${showId}`);
    }
    listCastsByShows(shows: Show[]) {
        return Promise.all(shows.map(show => this.listCastByShowId(show.id)));
    }
    count() {
        return new Promise<number>((resolve: any, reject: any) => {
            this.run('SELECT COUNT(*) as count FROM show').then((result: any) => {
                resolve(result.count);
            });
        });
    }
    queryShowsList(sql: string, params = []) {
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
    queryShowCast(sql: string, params = []) {
        return new Promise<Person[]>((resolve: any, reject: any) => {
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
