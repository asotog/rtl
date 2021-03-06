import axios from 'axios';
import {SHOWS_API_URL, SHOWS_CAST_API_URL} from "./config";
import ShowsStorage from "./storage";
import {CastPerson, Show} from "./types";

export default class ShowsApi {
    public list() {
        return axios.get<Show[]>(SHOWS_API_URL);
    }
    public getCast(showId: number) {
        console.log(`calling get cast api show id: ${showId}`);
        return axios.get<CastPerson[]>(SHOWS_CAST_API_URL(showId));
    }
    public getCastFromShows(shows: Show[]) {
        const showsStorage = new ShowsStorage();
        return axios.all(shows.map(show => this.getCast(show.id))).then(responses => {
            const storePromises: Promise<any>[] = [];
            responses.forEach((res, index) => {
                res.data.forEach(castPerson => {
                    storePromises.push(showsStorage.storeCast(shows[index].id, castPerson.person));
                })
            });
            return Promise.all(storePromises);
        }).catch(error => {
            console.log(error);
        });
    }
}
