import axios from 'axios';
import {SHOWS_API_URL} from "./config";

export default class ShowsApi {
    list() {
        return axios.get<Show[]>(SHOWS_API_URL);
    }
}
